# App

General application-level utilities, models, and data handling.

## Overview

This directory contains general application utilities and shared resources:
- Application models and data structures
- Shared configuration files
- Report generation and analytics
- Data handling utilities
- Upload management

## Project Structure

```
app/
├── data/                    # Data-related utilities
├── models/                  # Shared data models/schemas
├── uploads/                 # Uploaded file storage
└── reports/                 # Generated reports
```

## Subdirectories

### data/

Data handling utilities including:
- Data loaders
- Format converters
- Validation functions
- Cache management
- Data utilities and helpers

Functions:
- Load CSV spectral data
- Validate data format
- Handle missing values
- Normalize data

### models/

Shared data models and schemas:
- Pydantic models for request/response validation
- Spectral data models
- Prediction output models
- Report models

Example models:
```python
class SpectrumInput(BaseModel):
    sample_id: str
    polymer_type: str
    spectrum_data: List[float]

class PredictionOutput(BaseModel):
    sample_id: str
    predicted_class: str
    confidence: float
    probabilities: Dict[str, float]
```

### uploads/

Temporary storage for uploaded files:
- User-uploaded CSV files
- Processing temporary files
- Staging area for batch operations

**Note:** Files should be cleaned up periodically

### reports/

Generated reports and analysis results:
- Classification reports
- Summary statistics
- Visualizations
- Export formats (PDF, Excel, etc.)

## Usage

### Loading Application Models

```python
from app.models import SpectrumInput, PredictionOutput

# Create input
input_data = SpectrumInput(
    sample_id="SAMPLE001",
    polymer_type="HDPE",
    spectrum_data=[0.5, 0.48, 0.52, ...]
)

# Validate and use
prediction = model.predict(input_data)
output = PredictionOutput(**prediction)
```

### Data Utilities

```python
from app.data import load_spectrum_csv, normalize_spectrum

# Load CSV data
data = load_spectrum_csv('path/to/file.csv')

# Normalize spectrum
normalized = normalize_spectrum(data)
```

## Configuration

### Path Configuration

Path settings typically configured in:
- `app/config.py` - Backend application settings
- Environment variables - For deployment
- `.env` files - For development

### Upload Settings

Configure upload behavior:
```python
# Max file size
MAX_UPLOAD_SIZE = 50 * 1024 * 1024  # 50 MB

# Allowed file types
ALLOWED_EXTENSIONS = {'csv', 'xlsx'}

# Upload directory
UPLOAD_DIR = 'app/uploads/'

# Cleanup interval
CLEANUP_INTERVAL = 24  # hours
```

## Shared Models

Common data structures used across:
- **backend/app/** - Request/response handling
- **frontend/** - API communication
- **services/** - Data processing

## File Organization

Best practices for this directory:
- **Keep it organized** - Clear subdirectory structure
- **Document dependencies** - Note what imports what
- **Version models** - Track changes to data structures
- **Validate data** - Use Pydantic for validation
- **Clean up uploads** - Regular cleanup of old files

## Integration

Used by:
- **backend/routes/** - Request/response handling
- **backend/services/** - Business logic
- **API endpoints** - Data validation
- **Report generation** - Output formatting

## Common Operations

### Validate CSV Upload

```python
from app.data import validate_spectrum_file

is_valid = validate_spectrum_file('uploads/sample.csv')
if is_valid:
    # Process file
    pass
```

### Generate Report

```python
from app.reports import generate_report

report = generate_report(
    predictions=predictions,
    format='pdf'
)
report.save('app/reports/output.pdf')
```

### Manage Uploads

```python
import os
from pathlib import Path

# Clean old uploads (> 7 days)
upload_dir = Path('app/uploads/')
for file in upload_dir.glob('*'):
    if (time.time() - file.stat().st_mtime) > 7 * 24 * 3600:
        file.unlink()
```

## Data Models

### SpectrumInput
Represents incoming FTIR spectrum data:
- `sample_id`: Unique identifier
- `spectrum_data`: Array of absorbance values
- `metadata`: Optional additional info

### PredictionOutput
Represents model predictions:
- `sample_id`: Input identifier
- `predicted_class`: Predicted polymer type
- `confidence`: Confidence score (0-100%)
- `probabilities`: Dict of all class probabilities

## Validation Rules

Data validation includes:
- **Spectrum length** - Must be 1700 features
- **Value range** - Must be normalized [0, 1]
- **No NaN values** - All values must be numeric
- **Type checking** - Pydantic validation

## Performance Considerations

- **Lazy loading** - Load data only when needed
- **Caching** - Cache frequently accessed data
- **Cleanup** - Regular cleanup of old uploads
- **Memory management** - Stream large files

## Error Handling

Common errors and solutions:
- **Invalid CSV format** - Validate headers and structure
- **Missing columns** - Check required columns present
- **Out of range values** - Normalize data before use
- **File size exceeded** - Check file size limits

## Development

### Adding New Models

```python
from pydantic import BaseModel

class NewModel(BaseModel):
    field1: str
    field2: int
    
    class Config:
        schema_extra = {
            "example": {
                "field1": "value",
                "field2": 42
            }
        }
```

### Adding Data Utilities

```python
def new_utility(data: pd.DataFrame) -> pd.DataFrame:
    """Utility function description."""
    # Implementation
    return result
```

## Testing

Test data utilities:
```python
def test_load_spectrum_csv():
    data = load_spectrum_csv('test_data.csv')
    assert data.shape == (1, 1700)
    assert data.min() >= 0 and data.max() <= 1
```

## Notes

- Keep models lightweight
- Document all data structures
- Use type hints consistently
- Validate all external input
- Clean up temporary files regularly
- Consider thread safety for concurrent uploads
