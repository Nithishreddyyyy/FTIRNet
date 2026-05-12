"""
reports.py
==========
Report management endpoints for creating, listing, and retrieving analysis reports.
"""

import json
import logging
from pathlib import Path
from datetime import datetime

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse

from app.services.storage_service import (
    get_reports,
    create_report,
    get_report_by_id,
    delete_report,
)

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/", tags=["Reports"])
async def get_reports_list(
    limit: int = Query(
        default=20, ge=1, le=100, description="Number of reports to return"
    ),
    offset: int = Query(default=0, ge=0, description="Offset for pagination"),
):
    """
    Retrieve a list of all generated reports with pagination.
    """
    try:
        reports, total = get_reports(limit=limit, offset=offset)
        return JSONResponse(
            content={
                "success": True,
                "data": reports,
                "pagination": {
                    "limit": limit,
                    "offset": offset,
                    "total": total,
                    "has_more": offset + limit < total,
                },
            }
        )
    except Exception as e:
        logger.error(f"Error fetching reports: {e}")
        raise HTTPException(
            status_code=500,
            detail={"success": False, "error": f"Failed to fetch reports: {str(e)}"},
        )


@router.get("/{report_id}", tags=["Reports"])
async def get_report(report_id: str):
    """
    Retrieve a single report by its ID.
    """
    try:
        report = get_report_by_id(report_id)
        if report is None:
            raise HTTPException(
                status_code=404,
                detail={"success": False, "error": f"Report '{report_id}' not found"},
            )
        return JSONResponse(content={"success": True, "data": report})
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching report {report_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail={"success": False, "error": str(e)},
        )


@router.post("/", tags=["Reports"])
async def create_new_report(report_data: dict):
    """
    Create a new report from prediction results.
    """
    try:
        required_fields = ["title", "predictions"]
        for field in required_fields:
            if field not in report_data:
                raise HTTPException(
                    status_code=400,
                    detail={
                        "success": False,
                        "error": f"Missing required field: '{field}'",
                    },
                )

        result = create_report(report_data)
        return JSONResponse(
            content={"success": True, "data": result},
            status_code=201,
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating report: {e}")
        raise HTTPException(
            status_code=500,
            detail={"success": False, "error": f"Failed to create report: {str(e)}"},
        )


@router.delete("/{report_id}", tags=["Reports"])
async def delete_report_by_id(report_id: str):
    """
    Delete a report by its ID.
    """
    try:
        success = delete_report(report_id)
        if not success:
            raise HTTPException(
                status_code=404,
                detail={"success": False, "error": f"Report '{report_id}' not found"},
            )
        return JSONResponse(
            content={"success": True, "message": f"Report '{report_id}' deleted"}
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting report {report_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail={"success": False, "error": str(e)},
        )


@router.get("/search", tags=["Reports"])
async def search_reports(
    query: str = Query(..., description="Search query string"),
    search_by: str = Query(
        default="all",
        description="Field to search by: 'title', 'sample_id', 'polymer', or 'all'",
    ),
):
    """
    Search reports by title, sample ID, polymer type, or content.
    """
    try:
        all_reports, _ = get_reports(limit=1000, offset=0)
        query_lower = query.lower()

        def matches(report: dict) -> bool:
            if search_by == "title":
                return query_lower in (report.get("title", "")).lower()
            elif search_by == "sample_id":
                return query_lower in (report.get("sample_id", "")).lower()
            elif search_by == "polymer":
                pred = report.get("predictions", {})
                if isinstance(pred, dict):
                    return query_lower in pred.get("class", "").lower()
                elif isinstance(pred, list) and pred:
                    return query_lower in pred[0].get("class", "").lower()
                return False
            else:
                report_str = json.dumps(report).lower()
                return query_lower in report_str

        filtered = [r for r in all_reports if matches(r)]

        return JSONResponse(
            content={
                "success": True,
                "data": filtered,
                "count": len(filtered),
                "query": query,
                "search_by": search_by,
            }
        )
    except Exception as e:
        logger.error(f"Error searching reports: {e}")
        raise HTTPException(
            status_code=500,
            detail={"success": False, "error": f"Search failed: {str(e)}"},
        )


@router.get("/filter", tags=["Reports"])
async def filter_reports(
    polymer: str = Query(None, description="Filter by polymer type"),
    status: str = Query(None, description="Filter by status"),
    min_confidence: float = Query(None, ge=0, le=100, description="Minimum confidence threshold"),
    max_confidence: float = Query(None, ge=0, le=100, description="Maximum confidence threshold"),
):
    """
    Filter reports by polymer type, status, and/or confidence range.
    """
    try:
        all_reports, _ = get_reports(limit=1000, offset=0)

        def matches(report: dict) -> bool:
            if polymer:
                pred = report.get("predictions", {})
                if isinstance(pred, dict):
                    report_polymer = pred.get("class", "")
                elif isinstance(pred, list) and pred:
                    report_polymer = pred[0].get("class", "")
                else:
                    report_polymer = ""
                if polymer.lower() != report_polymer.lower():
                    return False

            if status:
                if report.get("status", "").lower() != status.lower():
                    return False

            if min_confidence is not None:
                pred = report.get("predictions", {})
                if isinstance(pred, dict):
                    conf = pred.get("confidence", 1.0)
                elif isinstance(pred, list) and pred:
                    conf = pred[0].get("confidence", 1.0)
                else:
                    conf = 1.0
                if conf < min_confidence:
                    return False

            if max_confidence is not None:
                pred = report.get("predictions", {})
                if isinstance(pred, dict):
                    conf = pred.get("confidence", 0.0)
                elif isinstance(pred, list) and pred:
                    conf = pred[0].get("confidence", 0.0)
                else:
                    conf = 0.0
                if conf > max_confidence:
                    return False

            return True

        filtered = [r for r in all_reports if matches(r)]

        return JSONResponse(
            content={
                "success": True,
                "data": filtered,
                "count": len(filtered),
                "filters_applied": {
                    "polymer": polymer,
                    "status": status,
                    "min_confidence": min_confidence,
                    "max_confidence": max_confidence,
                },
            }
        )
    except Exception as e:
        logger.error(f"Error filtering reports: {e}")
        raise HTTPException(
            status_code=500,
            detail={"success": False, "error": f"Filter failed: {str(e)}"},
        )