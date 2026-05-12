"""
upload.py
=========
Batch upload and data management endpoints.
"""

import csv
import logging
from pathlib import Path

from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from fastapi.responses import JSONResponse

from app.utils.file_handler import (
    validate_and_save_upload,
    cleanup_file,
)
from app.services.storage_service import add_uploaded_file_record

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/", tags=["Upload"])
async def upload_csv_file(
    file: UploadFile = File(..., description="CSV file to upload"),
    description: str = Query(default="", description="Optional description for the upload"),
):
    """
    Upload a CSV file for analysis.
    """
    temp_file_path = None

    try:
        temp_file_path = await validate_and_save_upload(file)

        record = {
            "filename": file.filename,
            "description": description,
            "file_path": str(temp_file_path),
            "file_size": temp_file_path.stat().st_size if temp_file_path.exists() else 0,
        }
        add_uploaded_file_record(record)

        return JSONResponse(
            content={
                "success": True,
                "upload_id": record.get("upload_id"),
                "filename": file.filename,
                "description": description,
                "file_path": str(temp_file_path),
                "message": "File uploaded successfully. Ready for analysis.",
            },
            status_code=201,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload failed: {e}")
        cleanup_file(temp_file_path)
        raise HTTPException(
            status_code=500,
            detail={"success": False, "error": f"Upload failed: {str(e)}"},
        )


@router.get("/", tags=["Upload"])
async def list_uploads(
    limit: int = Query(default=50, ge=1, le=200, description="Number of uploads to return"),
    offset: int = Query(default=0, ge=0, description="Offset for pagination"),
):
    """
    Retrieve the list of previously uploaded files.
    """
    try:
        from app.services.storage_service import get_uploaded_files

        uploads = get_uploaded_files()
        total = len(uploads)
        uploads_page = uploads[offset:offset + limit]

        return JSONResponse(
            content={
                "success": True,
                "data": uploads_page,
                "pagination": {
                    "limit": limit,
                    "offset": offset,
                    "total": total,
                    "has_more": offset + limit < total,
                },
            }
        )
    except Exception as e:
        logger.error(f"Error listing uploads: {e}")
        raise HTTPException(
            status_code=500,
            detail={"success": False, "error": f"Failed to list uploads: {str(e)}"},
        )


@router.post("/batch", tags=["Upload"])
async def upload_batch_csv_files(
    files: list[UploadFile] = File(..., description="Multiple CSV files to upload"),
):
    """
    Upload multiple CSV files at once.
    """
    results = []
    errors = []

    for file in files:
        temp_file_path = None
        try:
            temp_file_path = await validate_and_save_upload(file)
            record = {
                "filename": file.filename,
                "description": "Batch upload",
                "file_path": str(temp_file_path),
                "file_size": temp_file_path.stat().st_size if temp_file_path.exists() else 0,
            }
            add_uploaded_file_record(record)
            results.append({"filename": file.filename, "status": "success", "upload_id": record.get("upload_id")})
        except HTTPException as e:
            errors.append({"filename": file.filename, "status": "error", "detail": e.detail})
        except Exception as e:
            cleanup_file(temp_file_path)
            errors.append({"filename": file.filename, "status": "error", "detail": str(e)})

    return JSONResponse(
        content={
            "success": True,
            "uploaded": results,
            "errors": errors,
            "summary": {
                "total": len(files),
                "successful": len(results),
                "failed": len(errors),
            },
        },
        status_code=201,
    )


@router.get("/validate", tags=["Upload"])
async def validate_upload_endpoint(
    file: UploadFile = File(..., description="CSV file to validate"),
):
    """
    Validate a CSV file without saving it permanently.
    """
    temp_file_path = None

    try:
        temp_file_path = await validate_and_save_upload(file)

        with open(temp_file_path, "r", newline="") as f:
            reader = csv.DictReader(f)
            headers = reader.fieldnames or []
            row_count = sum(1 for _ in reader)

        return JSONResponse(
            content={
                "success": True,
                "valid": True,
                "filename": file.filename,
                "columns": headers,
                "row_count": row_count,
                "has_sample_id": "Sample_ID" in headers,
                "has_polymer": "Polymer" in headers,
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail={"success": False, "error": f"Invalid CSV: {str(e)}"},
        )
    finally:
        cleanup_file(temp_file_path)