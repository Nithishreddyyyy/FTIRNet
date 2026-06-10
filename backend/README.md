# Backend API

FastAPI-based REST API for the SpectraVision polymer classification system.

## Overview

The backend provides endpoints for:
- Uploading and validating FTIR spectral data (CSV format)
- Running polymer classification predictions using trained CNN models
- Generating classification reports with confidence scores
- Managing model selection and configuration

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application setup
│   ├── config.py            # Configuration settings
│   ├── routes/              # API route handlers
│   │   ├── reports.py       # Report generation endpoints
│   │   └── ...
│   ├── models/              # Pydantic models for request/response
│   ├── services/            # Business logic services
│   ├── utils/               # Utility functions
│   ├── data/                # Data handling utilities
│   ├── uploads/             # Uploaded file storage
│   └── reports/             # Generated reports directory
├── run.py                   # Application entry point
└── requirements.txt         # Python dependencies
```

## Requirements

- Python 3.8+
- PyTorch
- FastAPI
- Uvicorn
- Pandas, NumPy, Scikit-learn

See `requirements.txt` for complete list.

## Installation

```bash
cd backend
pip install -r requirements.txt
```

## Running the Application

```bash
python run.py
```

Or with Uvicorn directly:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, access interactive API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Configuration

Edit `app/config.py` to configure:
- Model paths and versions
- Upload directory limits
- CORS settings
- API title and version
- Database connections (if applicable)

## Key Endpoints

- `POST /predict` - Submit spectral data for classification
- `POST /reports` - Generate classification reports
- `GET /models` - List available models
- `GET /health` - Health check

## Dependencies Directory Structure

- `app/routes/` - Request/response handling and routing
- `app/services/` - Model inference and data processing logic
- `app/utils/` - Helper functions and utilities
- `app/models/` - Pydantic schemas for validation

## Development

The application uses async/await patterns for high performance and includes:
- Comprehensive error handling
- Request validation with Pydantic
- CORS middleware for cross-origin requests
- Structured logging

## Notes

- Uploads are stored in `app/uploads/`
- Generated reports are saved to `app/reports/generated/`
- Ensure sufficient disk space for large CSV files
