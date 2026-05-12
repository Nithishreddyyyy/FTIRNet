"""
prediction.py
=============
Route handlers for the SpectraVision API prediction endpoints.

This module defines two dedicated endpoints:
    - POST /api/v1/base_model/prediction    → base_cnn model
    - POST /api/v1/finetuned_model/prediction → pretrained_cnn model

Both endpoints accept a CSV file upload and return classification predictions.
The model selection is implicit in the URL path, making the API self-documenting.

A shared internal handler (_run_prediction) avoids code duplication.
"""

import logging
from pathlib import Path

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

from app.utils.file_handler import (
    validate_and_save_upload,
    cleanup_file,
    resolve_model_path,
)
from app.services.inference_service import run_inference, InferenceError

# Setup logger for this module
logger = logging.getLogger(__name__)

# Create a router instance for this module
router = APIRouter()


# ---------------------------------------------------------------------------
# Health Check
# ---------------------------------------------------------------------------

@router.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint.

    Returns a simple JSON response indicating the API is running.
    Useful for load balancers, orchestrators, and monitoring tools.

    Response:
        {"status": "ok"}
    """
    return JSONResponse(content={"status": "ok"})


# ---------------------------------------------------------------------------
# Shared Prediction Handler
# ---------------------------------------------------------------------------

async def _run_prediction(
    file: UploadFile,
    model_name: str,
    model_label: str,
) -> JSONResponse:
    """
    Shared internal handler for running model inference.

    This function is called by both the base model and fine-tuned model
    endpoints. It handles the full lifecycle:
        1. Validate and save the uploaded CSV
        2. Resolve the model path
        3. Run inference via subprocess
        4. Parse results and return JSON response
        5. Clean up temporary files

    Args:
        file:         The uploaded CSV file from the request.
        model_name:   The internal model registry key (e.g., 'base_cnn').
        model_label:  Human-readable label for logging (e.g., 'Base CNN').

    Returns:
        JSONResponse with prediction results or error details.
    """
    uploaded_filename = file.filename
    temp_file_path = None

    logger.info(
        f"Prediction request [{model_label}]: file={uploaded_filename}"
    )

    # --- Step 1: Validate and save the uploaded file ---
    try:
        temp_file_path = await validate_and_save_upload(file)
        logger.info(f"Uploaded file saved to: {temp_file_path}")
    except HTTPException:
        raise  # Re-raise validation errors directly
    except Exception as e:
        logger.error(f"File upload failed: {e}")
        raise HTTPException(
            status_code=500,
            detail={"success": False, "error": f"File upload failed: {str(e)}"}
        )

    # --- Step 2: Resolve the model path ---
    try:
        model_path = resolve_model_path(model_name)
        logger.info(f"Model resolved [{model_label}]: {model_path}")
    except HTTPException:
        cleanup_file(temp_file_path)
        raise

    # --- Step 3: Run inference ---
    try:
        inference_result = run_inference(temp_file_path, model_path)
    except InferenceError as e:
        cleanup_file(temp_file_path)
        logger.error(f"Inference error [{model_label}]: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error": f"Inference failed: {str(e)}",
                "model_used": model_name,
                "uploaded_file": uploaded_filename,
            }
        )
    except Exception as e:
        cleanup_file(temp_file_path)
        logger.error(f"Unexpected error during inference [{model_label}]: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error": f"Unexpected error: {str(e)}",
                "model_used": model_name,
                "uploaded_file": uploaded_filename,
            }
        )
    finally:
        # --- Step 4: Clean up the temporary uploaded file ---
        cleanup_file(temp_file_path)

    # --- Step 5: Build and return the response ---
    predictions = inference_result.get("predictions", [])

    # If there's only one sample, return a flat prediction object.
    # If there are multiple samples, return a list.
    if len(predictions) == 1:
        pred = predictions[0]
        prediction_output = {
            "class": pred["predicted_polymer"],
            "confidence": pred["confidence"],
        }
    else:
        prediction_output = [
            {
                "class": p["predicted_polymer"],
                "confidence": p["confidence"],
                "sample_id": p["sample_id"],
            }
            for p in predictions
        ]

    response = {
        "success": True,
        "model_used": model_name,
        "uploaded_file": uploaded_filename,
        "prediction": prediction_output,
        "metadata": {
            "inference_time_sec": inference_result.get("elapsed_time_sec"),
            "samples_processed": len(predictions),
        },
    }

    logger.info(
        f"Prediction successful [{model_label}]: "
        f"samples={len(predictions)}, "
        f"time={inference_result.get('elapsed_time_sec')}s"
    )

    return JSONResponse(content=response)


# ---------------------------------------------------------------------------
# Base Model Endpoint
# ---------------------------------------------------------------------------

@router.post(
    "/base_model/prediction",
    tags=["Base Model"],
    summary="Predict using the base CNN model",
    description="Upload a CSV file to run inference with the **base CNN model** "
                "trained on the public dataset.",
)
async def base_model_prediction(
    file: UploadFile = File(
        ...,
        description="CSV file containing spectral data for base model inference",
    ),
):
    """
    Run inference using the **Base CNN** model.

    The base model is trained on the public FTIR dataset and provides
    general-purpose polymer classification.

    **Form Data:**

    * `file` — The CSV file to classify (multipart/form-data)

    **Returns:**
        JSON response with predicted polymer class, confidence scores,
        and inference metadata.
    """
    return await _run_prediction(file, model_name="base_cnn", model_label="Base CNN")


# ---------------------------------------------------------------------------
# Fine-Tuned Model Endpoint
# ---------------------------------------------------------------------------

@router.post(
    "/finetuned_model/prediction",
    tags=["Fine-Tuned Model"],
    summary="Predict using the fine-tuned CNN model",
    description="Upload a CSV file to run inference with the **fine-tuned CNN model** "
                "fine-tuned on real-world FTIR samples.",
)
async def finetuned_model_prediction(
    file: UploadFile = File(
        ...,
        description="CSV file containing spectral data for fine-tuned model inference",
    ),
):
    """
    Run inference using the **Fine-Tuned CNN** model.

    The fine-tuned model has been specialized on real-world FTIR samples
    and typically achieves higher accuracy on practical data.

    **Form Data:**

    * `file` — The CSV file to classify (multipart/form-data)

    **Returns:**
        JSON response with predicted polymer class, confidence scores,
        and inference metadata.
    """
    return await _run_prediction(
        file, model_name="pretrained_cnn", model_label="Fine-Tuned CNN"
    )