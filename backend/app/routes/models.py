"""
models.py
=========
Model management endpoints for listing and inspecting available models.
"""

import os
import json
import logging
from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from app.utils.file_handler import get_backend_root

logger = logging.getLogger(__name__)
router = APIRouter()


MODEL_REGISTRY = {
    "base_cnn": {
        "id": "base_cnn",
        "name": "Base CNN Model",
        "description": "CNN model trained on the public FTIR polymer dataset. General-purpose microplastic classification.",
        "filename": "base_cnn.pth",
        "version": "1.0.0",
        "type": "CNN",
        "classes": [
            "HDPE", "LDPE", "PET", "PP", "PS", "PVC", "PLA", "Nylon", "ABS", "PMMA"
        ],
        "accuracy": 98.4,
        "training_samples": 12500,
        "last_updated": "2026-04-29",
    },
    "pretrained_cnn": {
        "id": "pretrained_cnn",
        "name": "Fine-Tuned CNN Model",
        "description": "CNN model fine-tuned on real-world FTIR samples for improved accuracy on practical data.",
        "filename": "pretrained_cnn.pth",
        "version": "2.0.0",
        "type": "CNN (Fine-Tuned)",
        "classes": [
            "HDPE", "LDPE", "PET", "PP", "PS", "PVC", "PLA", "Nylon", "ABS", "PMMA"
        ],
        "accuracy": 99.1,
        "training_samples": 15200,
        "last_updated": "2026-05-02",
    },
}


@router.get("/", tags=["Models"])
async def list_models():
    """
    List all available models with metadata.
    """
    models = []
    backend_root = get_backend_root()

    for key, info in MODEL_REGISTRY.items():
        model_path = backend_root / info["filename"]
        file_size = 0
        if model_path.exists():
            file_size = model_path.stat().st_size

        models.append({
            "id": info["id"],
            "name": info["name"],
            "description": info["description"],
            "version": info["version"],
            "type": info["type"],
            "classes": info["classes"],
            "accuracy": info["accuracy"],
            "training_samples": info["training_samples"],
            "last_updated": info["last_updated"],
            "file_size_bytes": file_size,
            "file_available": model_path.exists(),
            "filename": info["filename"],
        })

    return JSONResponse(content={"success": True, "models": models, "count": len(models)})


@router.get("/{model_id}", tags=["Models"])
async def get_model_info(model_id: str):
    """
    Get detailed information about a specific model.
    """
    if model_id not in MODEL_REGISTRY:
        raise HTTPException(
            status_code=404,
            detail={
                "success": False,
                "error": f"Model '{model_id}' not found. Available models: {list(MODEL_REGISTRY.keys())}",
            },
        )

    info = MODEL_REGISTRY[model_id]
    backend_root = get_backend_root()
    model_path = backend_root / info["filename"]

    extra_info = {
        "file_available": model_path.exists(),
        "file_size_bytes": model_path.stat().st_size if model_path.exists() else 0,
    }

    return JSONResponse(
        content={"success": True, "model": {**info, **extra_info}}
    )


@router.get("/{model_id}/status", tags=["Models"])
async def check_model_status(model_id: str):
    """
    Check if a specific model file exists and is ready for inference.
    """
    if model_id not in MODEL_REGISTRY:
        raise HTTPException(
            status_code=404,
            detail={
                "success": False,
                "error": f"Model '{model_id}' not found.",
            },
        )

    info = MODEL_REGISTRY[model_id]
    backend_root = get_backend_root()
    model_path = backend_root / info["filename"]

    status = "ready" if model_path.exists() else "missing"
    return JSONResponse(
        content={
            "success": True,
            "model_id": model_id,
            "status": status,
            "file_path": str(model_path) if model_path.exists() else None,
        }
    )