"""
dashboard.py
============
Dashboard statistics and analytics endpoints.
"""

import logging
from datetime import datetime, timedelta

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from app.services.storage_service import (
    get_prediction_history,
    get_uploaded_files,
    get_reports,
)

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/stats", tags=["Dashboard"])
async def get_dashboard_stats():
    """
    Get aggregated dashboard statistics including:
    - Total samples analyzed
    - Total reports generated
    - Model usage breakdown
    - Recent activity
    - Polymer type distribution
    """
    try:
        history, total_predictions = get_prediction_history(limit=1000, offset=0)
        reports, total_reports = get_reports(limit=1000, offset=0)
        uploads = get_uploaded_files()

        polymer_counts = {}
        model_counts = {}
        high_confidence = 0
        total_confidence = 0.0

        for record in history:
            pred = record.get("prediction", {})
            if isinstance(pred, dict):
                polymer = pred.get("class", "Unknown")
            else:
                polymer = "Unknown"
            polymer_counts[polymer] = polymer_counts.get(polymer, 0) + 1

            model = record.get("model_used", "unknown")
            model_counts[model] = model_counts.get(model, 0) + 1

            if isinstance(pred, dict):
                conf = pred.get("confidence", 0)
            elif isinstance(pred, list) and pred:
                conf = pred[0].get("confidence", 0)
            else:
                conf = 0

            if conf >= 0.90:
                high_confidence += 1
            if conf > 0:
                total_confidence += conf

        avg_confidence = round(total_confidence / max(len(history), 1) * 100, 2)
        recent_activity = history[:10]

        stats = {
            "success": True,
            "data": {
                "total_samples_analyzed": total_predictions,
                "total_reports_generated": total_reports,
                "total_uploads": len(uploads),
                "average_confidence": avg_confidence,
                "high_confidence_predictions": high_confidence,
                "active_analyses": 0,
                "polymer_distribution": polymer_counts,
                "model_usage": model_counts,
                "recent_predictions": [
                    {
                        "id": r.get("id", ""),
                        "polymer": r.get("prediction", {}).get("class", "Unknown")
                               if isinstance(r.get("prediction"), dict)
                               else (r.get("prediction", [{}])[0].get("class", "Unknown")
                                     if isinstance(r.get("prediction"), list) and r.get("prediction")
                                     else "Unknown"),
                        "confidence": r.get("prediction", {}).get("confidence", 0)
                                      if isinstance(r.get("prediction"), dict)
                                      else (r.get("prediction", [{}])[0].get("confidence", 0)
                                            if isinstance(r.get("prediction"), list) and r.get("prediction")
                                            else 0),
                        "model": r.get("model_used", "unknown"),
                        "file": r.get("uploaded_file", "unknown"),
                        "timestamp": r.get("created_at", ""),
                    }
                    for r in recent_activity
                ],
            },
        }

        return JSONResponse(content=stats)

    except Exception as e:
        logger.error(f"Error generating dashboard stats: {e}")
        raise HTTPException(
            status_code=500,
            detail={"success": False, "error": f"Failed to generate dashboard stats: {str(e)}"},
        )


@router.get("/polymer-distribution", tags=["Dashboard"])
async def get_polymer_distribution():
    """
    Get the distribution of polymer types from all predictions.
    """
    try:
        history, _ = get_prediction_history(limit=1000, offset=0)

        distribution = {}
        for record in history:
            pred = record.get("prediction", {})
            if isinstance(pred, dict):
                polymer = pred.get("class", "Unknown")
            elif isinstance(pred, list) and pred:
                polymer = pred[0].get("class", "Unknown")
            else:
                polymer = "Unknown"
            distribution[polymer] = distribution.get(polymer, 0) + 1

        return JSONResponse(content={"success": True, "distribution": distribution})

    except Exception as e:
        logger.error(f"Error getting polymer distribution: {e}")
        raise HTTPException(
            status_code=500,
            detail={"success": False, "error": str(e)},
        )


@router.get("/model-usage", tags=["Dashboard"])
async def get_model_usage():
    """
    Get usage statistics for each model.
    """
    try:
        history, _ = get_prediction_history(limit=1000, offset=0)

        model_stats = {}
        for record in history:
            model = record.get("model_used", "unknown")
            if model not in model_stats:
                model_stats[model] = {"count": 0, "total_confidence": 0.0}
            model_stats[model]["count"] += 1

            pred = record.get("prediction", {})
            if isinstance(pred, dict):
                conf = pred.get("confidence", 0)
            elif isinstance(pred, list) and pred:
                conf = pred[0].get("confidence", 0)
            else:
                conf = 0
            model_stats[model]["total_confidence"] += conf

        for model in model_stats:
            stats = model_stats[model]
            stats["average_confidence"] = round(
                stats["total_confidence"] / max(stats["count"], 1) * 100, 2
            )
            del stats["total_confidence"]

        return JSONResponse(content={"success": True, "model_usage": model_stats})

    except Exception as e:
        logger.error(f"Error getting model usage: {e}")
        raise HTTPException(
            status_code=500,
            detail={"success": False, "error": str(e)},
        )