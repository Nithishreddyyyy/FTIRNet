import logging
import sys
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

LOG_FORMAT = "%(asctime)s | %(levelname)-8s | %(name)-25s | %(message)s"
LOG_DATE_FORMAT = "%Y-%m-%d %H:%M:%S"

logging.basicConfig(
    level=logging.INFO,
    format=LOG_FORMAT,
    datefmt=LOG_DATE_FORMAT,
    stream=sys.stdout,
)

logger = logging.getLogger("spectravision")
logger.setLevel(logging.INFO)

logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
logging.getLogger("multipart").setLevel(logging.WARNING)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("=" * 60)
    logger.info("SpectraVision API starting up...")
    logger.info("=" * 60)
    yield
    logger.info("SpectraVision API shutting down...")


app = FastAPI(
    title="SpectraVision API",
    description=(
        "Backend API for SpectraVision polymer classification system. "
        "Upload a CSV spectral data file, select a CNN model, and receive "
        "classification predictions with confidence scores."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from app.routes.prediction import router as prediction_router

app.include_router(
    prediction_router,
    prefix="/api/v1",
)

logger.info("Routes registered: /api/v1/model_prediction, /api/v1/health")


@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint. Redirects to API docs.
    """
    return {
        "status": "OK"
    }

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )