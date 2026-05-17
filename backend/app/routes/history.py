"""
history.py
==========
Prediction history endpoints for retrieving past analyses.
"""

import logging
from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse

from app.services.storage_service import (
    get_prediction_history,
    get_prediction_by_id,
    delete_prediction_record,
)

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/", tags=["History"])
async def get_history(
    limit: int = Query(
        default=20, ge=1, le=100, description="Number of records to return"
    ),
    offset: int = Query(default=0, ge=0, description="Offset for pagination"),
):
    """
    Retrieve prediction history with pagination.
    """
    try:
        records, total = get_prediction_history(limit=limit, offset=offset)
        return JSONResponse(
            content={
                "success": True,
                "data": records,
                "pagination": {
                    "limit": limit,
                    "offset": offset,
                    "total": total,
                    "has_more": offset + limit < total,
                },
            }
        )
    except Exception as e:
        logger.error(f"Error fetching history: {e}")
        raise HTTPException(
            status_code=500,
            detail={"success": False, "error": f"Failed to fetch history: {str(e)}"},
        )


@router.get("/{prediction_id}", tags=["History"])
async def get_history_item(prediction_id: str):
    """
    Retrieve a single prediction record by its ID.
    """
    try:
        record = get_prediction_by_id(prediction_id)
        if record is None:
            raise HTTPException(
                status_code=404,
                detail={
                    "success": False,
                    "error": f"Prediction with ID '{prediction_id}' not found",
                },
            )
        return JSONResponse(content={"success": True, "data": record})
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching prediction {prediction_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail={"success": False, "error": str(e)},
        )


@router.delete("/{prediction_id}", tags=["History"])
async def delete_history_item(prediction_id: str):
    """
    Delete a prediction record by its ID.
    """
    try:
        success = delete_prediction_record(prediction_id)
        if not success:
            raise HTTPException(
                status_code=404,
                detail={
                    "success": False,
                    "error": f"Prediction with ID '{prediction_id}' not found",
                },
            )
        return JSONResponse(
            content={"success": True, "message": f"Prediction '{prediction_id}' deleted"}
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting prediction {prediction_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail={"success": False, "error": str(e)},
        )