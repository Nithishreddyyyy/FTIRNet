"""
Configuration settings for the SpectraVision backend API.
"""

import os
from pathlib import Path
from datetime import datetime


class Settings:
    """Application settings loaded from environment variables."""

    # API Configuration
    API_TITLE = "SpectraVision API"
    API_VERSION = "1.0.0"
    API_PREFIX = "/api/v1"

    # Server Configuration
    HOST = "0.0.0.0"
    PORT = int(os.getenv("PORT", 8000))
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"

    # CORS Configuration
    ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

    # File Upload Configuration
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
    ALLOWED_EXTENSIONS = {".csv"}
    UPLOAD_DIR = "app/uploads"

    # Model Configuration
    MODELS_DIR = "app/models"

    # Data Storage
    DATA_DIR = "app/data"
    HISTORY_FILE = "app/data/prediction_history.json"
    REPORTS_DIR = "app/data/reports"

    # Chatbot Configuration
    CHATBOT_ENABLED = os.getenv("CHATBOT_ENABLED", "True").lower() == "true"

    # Inference
    INFERENCE_TIMEOUT = int(os.getenv("INFERENCE_TIMEOUT", 120))

    # Paths
    @property
    def BACKEND_ROOT(self) -> Path:
        return Path(__file__).resolve().parent.parent.parent

    @property
    def PROJECT_ROOT(self) -> Path:
        return self.BACKEND_ROOT.parent

    def ensure_directories(self):
        """Create necessary directories if they don't exist."""
        dirs = [
            self.UPLOAD_DIR,
            self.DATA_DIR,
            self.REPORTS_DIR,
            self.MODELS_DIR,
        ]
        for d in dirs:
            path = self.BACKEND_ROOT / d
            path.mkdir(parents=True, exist_ok=True)


settings = Settings()
settings.ensure_directories()