"""
Storage utilities for prediction history and reports.
Uses JSON-based storage for simplicity (can be migrated to a database later).
"""

import json
import uuid
import logging
from pathlib import Path
from datetime import datetime
from typing import Optional

from app.config import settings

logger = logging.getLogger(__name__)


def _load_json_file(filepath: Path, default: list | dict = None) -> list | dict:
    """Load data from a JSON file, returning default if file doesn't exist."""
    if default is None:
        default = []
    if not filepath.exists():
        return default
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError) as e:
        logger.warning(f"Error loading {filepath}: {e}")
        return default


def _save_json_file(filepath: Path, data: list | dict) -> bool:
    """Save data to a JSON file."""
    try:
        filepath.parent.mkdir(parents=True, exist_ok=True)
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, default=str)
        return True
    except (IOError, TypeError) as e:
        logger.error(f"Error saving {filepath}: {e}")
        return False


# ============================================================
# Prediction History
# ============================================================

def get_prediction_history(limit: int = 50, offset: int = 0) -> list[dict]:
    """Retrieve prediction history with pagination."""
    history = _load_json_file(Path(settings.HISTORY_FILE))
    if not isinstance(history, list):
        history = []
    total = len(history)
    start = offset
    end = offset + limit
    return history[start:end], total


def add_prediction_record(record: dict) -> dict:
    """Add a new prediction record to history."""
    history = _load_json_file(Path(settings.HISTORY_FILE))
    if not isinstance(history, list):
        history = []

    record["id"] = str(uuid.uuid4())
    record["created_at"] = datetime.now().isoformat()
    history.insert(0, record)

    _save_json_file(Path(settings.HISTORY_FILE), history)
    logger.info(f"Prediction record saved: {record['id']}")
    return record


def get_prediction_by_id(prediction_id: str) -> Optional[dict]:
    """Retrieve a single prediction record by ID."""
    history = _load_json_file(Path(settings.HISTORY_FILE))
    if not isinstance(history, list):
        return None
    for record in history:
        if record.get("id") == prediction_id:
            return record
    return None


def delete_prediction_record(prediction_id: str) -> bool:
    """Delete a prediction record by ID."""
    history = _load_json_file(Path(settings.HISTORY_FILE))
    if not isinstance(history, list):
        return False

    original_length = len(history)
    history = [r for r in history if r.get("id") != prediction_id]

    if len(history) < original_length:
        _save_json_file(Path(settings.HISTORY_FILE), history)
        logger.info(f"Prediction record deleted: {prediction_id}")
        return True
    return False


# ============================================================
# Reports
# ============================================================

def get_reports(limit: int = 20, offset: int = 0) -> tuple[list[dict], int]:
    """Retrieve report list with pagination."""
    reports_file = Path(settings.REPORTS_DIR) / "reports.json"
    reports = _load_json_file(reports_file)
    if not isinstance(reports, list):
        reports = []
    total = len(reports)
    return reports[offset:offset + limit], total


def create_report(report_data: dict) -> dict:
    """Create a new report entry."""
    reports_file = Path(settings.REPORTS_DIR) / "reports.json"
    reports = _load_json_file(reports_file)
    if not isinstance(reports, list):
        reports = []

    report_data["id"] = str(uuid.uuid4())
    report_data["created_at"] = datetime.now().isoformat()
    reports.insert(0, report_data)

    _save_json_file(reports_file, reports)
    logger.info(f"Report created: {report_data['id']}")
    return report_data


def get_report_by_id(report_id: str) -> Optional[dict]:
    """Retrieve a single report by ID."""
    reports_file = Path(settings.REPORTS_DIR) / "reports.json"
    reports = _load_json_file(reports_file)
    if not isinstance(reports, list):
        return None
    for report in reports:
        if report.get("id") == report_id:
            return report
    return None


def delete_report(report_id: str) -> bool:
    """Delete a report by ID."""
    reports_file = Path(settings.REPORTS_DIR) / "reports.json"
    reports = _load_json_file(reports_file)
    if not isinstance(reports, list):
        return False

    original_length = len(reports)
    reports = [r for r in reports if r.get("id") != report_id]

    if len(reports) < original_length:
        _save_json_file(reports_file, reports)
        logger.info(f"Report deleted: {report_id}")
        return True
    return False


# ============================================================
# Upload Tracking
# ============================================================

def get_uploaded_files() -> list[dict]:
    """Get list of uploaded files metadata."""
    upload_log = Path(settings.DATA_DIR) / "upload_log.json"
    data = _load_json_file(upload_log)
    if not isinstance(data, list):
        data = []
    return data


def add_uploaded_file_record(record: dict) -> dict:
    """Add a file upload record."""
    upload_log = Path(settings.DATA_DIR) / "upload_log.json"
    records = _load_json_file(upload_log)
    if not isinstance(records, list):
        records = []

    record["upload_id"] = str(uuid.uuid4())
    record["uploaded_at"] = datetime.now().isoformat()
    records.insert(0, record)

    _save_json_file(upload_log, records)
    return record