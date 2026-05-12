import logging
import sys
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings

LOG_FORMAT = "%(asctime)s | %(levelname)-8s | %(name)-25s | %(message)s"
LOG_DATE_FORMAT = "%Y-%m-%d %H:%M:%S"

logging.basicConfig(
    level=logging.INFO,
    format=LOG_FORMAT,
    datefmt=LOG_DATE_FORMAT,
    stream=sys.stdout,
)

logger = logging.getLogger("spectravision")
logger.setLevel(logging.I   NFO)

logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
logging.getLogger("multipart").setLevel(logging.WARNING)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("=" * 60)
    logger.info("SpectraVision API starting up...")
    logger.info("=" * 60)
    settings.ensure_directories()
    yield
    logger.info("SpectraVision API shutting down...")


app = FastAPI(
    title=settings.API_TITLE,
    description=(
        "Backend API for SpectraVision polymer classification system. "
        "Upload a CSV spectral data file, select a CNN model, and receive "
        "classification predictions with confidence scores."
    ),
    version=settings.API_VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────────
# Import & Register All Route Routers
# ──────────────────────────────────────────────

from app.routes.prediction import router as prediction_router
from app.routes.dashboard import router as dashboard_router
from app.routes.history import router as history_router
from app.routes.models import router as models_router
from app.routes.reports import router as reports_router
from app.routes.chatbot import router as chatbot_router
from app.routes.upload import router as upload_router

all_routers = [
    (prediction_router, "/prediction"),
    (dashboard_router, "/dashboard"),
    (history_router, "/history"),
    (models_router, "/models"),
    (reports_router, "/reports"),
    (chatbot_router, "/chatbot"),
    (upload_router, "/upload"),
]

for router, prefix in all_routers:
    app.include_router(router, prefix=settings.API_PREFIX + prefix)

# ──────────────────────────────────────────────
# Health Check (root-level)
# ──────────────────────────────────────────────

@app.get("/", tags=["Root"])
async def root():
    return {
        "status": "ok",
        "api": settings.API_TITLE,
        "version": settings.API_VERSION,
        "endpoints": {
            "prediction": {
                "base_model": f"{settings.API_PREFIX}/prediction/base_model/prediction",
                "finetuned_model": f"{settings.API_PREFIX}/prediction/finetuned_model/prediction",
            },
            "dashboard": f"{settings.API_PREFIX}/dashboard/stats",
            "history": f"{settings.API_PREFIX}/history",
            "models": f"{settings.API_PREFIX}/models",
            "reports": f"{settings.API_PREFIX}/reports",
            "chatbot": f"{settings.API_PREFIX}/chatbot/chat",
            "upload": f"{settings.API_PREFIX}/upload",
        },
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
        log_level="info",
    )