"""
file_handler.py
===============
Utility module for handling file uploads, validation, and cleanup
in the SpectraVision backend API.

Responsibilities:
    - Validate uploaded files (CSV format, size limits, safe filenames).
    - Save uploaded files to a temporary directory.
    - Clean up temporary files after inference completes.
    - Provide safe path resolution relative to the backend root.
"""

import os
import re
import uuid
import logging
from pathlib import Path
from datetime import datetime

from fastapi import UploadFile, HTTPException

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

# Allowed file extensions for upload
ALLOWED_EXTENSIONS = {".csv"}

# Maximum allowed file size in bytes (default: 10 MB)
MAX_FILE_SIZE = 10 * 1024 * 1024

# Directory (relative to backend root) where uploads are temporarily stored
UPLOAD_DIR = "app/uploads"

# Setup logger for this module
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def get_backend_root() -> Path:
    """
    Resolve the backend root directory.

    Traverses upward from this file's location to find the 'backend/'
    directory, ensuring all relative paths are resolved correctly
    regardless of where the application is launched from.

    Returns:
        Path: Absolute path to the backend root directory.
    """
    # This file is at: backend/app/utils/file_handler.py
    # Go up 3 levels: utils -> app -> backend
    return Path(__file__).resolve().parent.parent.parent


def get_upload_directory() -> Path:
    """
    Get (and create if necessary) the upload directory path.

    Returns:
        Path: Absolute path to the upload directory.
    """
    backend_root = get_backend_root()
    upload_path = backend_root / UPLOAD_DIR
    upload_path.mkdir(parents=True, exist_ok=True)
    return upload_path


def is_valid_filename(filename: str) -> bool:
    """
    Check if a filename is safe and does not contain path traversal attempts.

    Args:
        filename: The original filename from the upload.

    Returns:
        bool: True if the filename is safe, False otherwise.
    """
    if not filename:
        return False
    # Reject path traversal attempts
    if ".." in filename or filename.startswith("/"):
        return False
    # Only allow alphanumeric, dash, underscore, and single dot for extension
    base, ext = os.path.splitext(filename)
    if not re.match(r"^[\w\-. ]+$", filename):
        return False
    return True


def generate_unique_filename(original_filename: str) -> str:
    """
    Generate a unique filename to avoid collisions in the upload directory.

    Format: <uuid>_<timestamp>_<original_filename>

    Args:
        original_filename: The original filename from the upload.

    Returns:
        str: A unique filename string.
    """
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_id = uuid.uuid4().hex[:8]
    return f"{unique_id}_{timestamp}_{original_filename}"


# ---------------------------------------------------------------------------
# Core Functions
# ---------------------------------------------------------------------------


async def validate_and_save_upload(file: UploadFile) -> Path:
    """
    Validate an uploaded file and save it to the temporary upload directory.

    Performs the following checks:
        1. File extension must be .csv
        2. Filename must be safe (no path traversal)
        3. File size must not exceed MAX_FILE_SIZE

    Args:
        file: The uploaded file object from FastAPI.

    Returns:
        Path: The absolute path where the file was saved.

    Raises:
        HTTPException: If validation fails (400 Bad Request).
    """
    # --- Validate file extension ---
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "error": f"Invalid file type '{file_ext}'. Only .csv files are accepted."
            }
        )

    # --- Validate filename safety ---
    if not is_valid_filename(file.filename):
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "error": "Invalid filename. Filename contains disallowed characters."
            }
        )

    # --- Save file content with size check ---
    upload_dir = get_upload_directory()
    unique_name = generate_unique_filename(file.filename)
    save_path = upload_dir / unique_name

    try:
        content = await file.read()

        # Check file size after reading
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail={
                    "success": False,
                    "error": f"File too large. Maximum size is {MAX_FILE_SIZE // (1024 * 1024)} MB."
                }
            )

        # Write to disk
        with open(save_path, "wb") as f:
            f.write(content)

        logger.info(f"File uploaded and saved: {save_path} ({len(content)} bytes)")

    except Exception as e:
        # Clean up partial file if write failed
        if save_path.exists():
            save_path.unlink(missing_ok=True)
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error": f"Failed to save uploaded file: {str(e)}"
            }
        )

    return save_path


def cleanup_file(file_path: Path) -> bool:
    """
    Safely delete a temporary file after inference is complete.

    Args:
        file_path: Path to the file to delete.

    Returns:
        bool: True if deletion succeeded, False otherwise.
    """
    try:
        if file_path.exists() and file_path.is_file():
            file_path.unlink()
            logger.info(f"Temporary file cleaned up: {file_path}")
            return True
    except Exception as e:
        logger.warning(f"Failed to clean up file {file_path}: {e}")
    return False


def resolve_model_path(model_name: str) -> Path:
    """
    Resolve a model name to its absolute .pth file path within the backend.

    This acts as the model registry. To add new models, simply extend
    the MODEL_REGISTRY dictionary below.

    Args:
        model_name: One of 'base_cnn' or 'pretrained_cnn'.

    Returns:
        Path: Absolute path to the model's .pth file.

    Raises:
        HTTPException: If the model name is not recognized or file is missing.
    """
    # Model registry: maps API-friendly names to local file paths
    # Paths are relative to the backend root directory
    MODEL_REGISTRY = {
        "base_cnn": "app/models/base_cnn.pth",
        "pretrained_cnn": "app/models/pretrained_cnn.pth",
    }

    if model_name not in MODEL_REGISTRY:
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "error": f"Invalid model '{model_name}'. "
                         f"Available models: {list(MODEL_REGISTRY.keys())}"
            }
        )

    backend_root = get_backend_root()
    model_path = backend_root / MODEL_REGISTRY[model_name]

    if not model_path.exists():
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error": f"Model file not found at expected path: {model_path}"
            }
        )

    return model_path