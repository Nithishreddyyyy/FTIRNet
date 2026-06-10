# Data Processing

Raw and processed FTIR spectral data for polymer classification.

## Overview

This directory contains:
- **raw/** - Original FTIR spectrum data
- **processed/** - Preprocessed spectral features ready for ML models

## Directory Structure

```
data/
├── raw/
│   └── data.csv             # Original FTIR spectrum data
└── processed/
    ├── processed_ftir_*.csv # Various preprocessing versions
    ├── processed_ftir_10thJune.csv
    ├── processed_ftir_2ndMay.csv
    ├── processed_ftir_2ndMay_Pre.csv
    ├── out.csv              # Output data
    └── file.py              # Processing utility script
```

## Raw Data

**Location:** `raw/data.csv`

Contains original FTIR spectral measurements with:
- Sample identifiers
- Wavenumber values (typical range: 400-4000 cm⁻¹)
- Absorbance/transmittance values
- Polymer type labels (if labeled dataset)

### Format

CSV with columns:
```
Sample_ID, Polymer, wavenumber_400, wavenumber_402, ..., wavenumber_4000
```

## Processed Data

**Location:** `processed/`

Contains preprocessed FTIR data with features extracted at standard wavenumber intervals.

### Processing Steps

The preprocessing pipeline:
1. **Normalization** - Scale absorbance values (0-1 range)
2. **Interpolation** - Resample to standard wavenumber grid (600-4000 cm⁻¹, 2 cm⁻¹ intervals)
3. **Smoothing** - Remove noise while preserving spectral peaks
4. **Outlier Removal** - Remove anomalous spectra
5. **Feature Extraction** - Create feature vectors for ML models

### Output Format

Processed files contain:
- Standard 1700 features (600-4000 cm⁻¹ at 2 cm⁻¹ intervals)
- Column names: `f_600`, `f_602`, `f_604`, ..., `f_4000`
- Normalized absorbance values
- Sample ID and polymer type columns

### File Naming Convention

Processed files are named by preprocessing date:
- `processed_ftir_2ndMay.csv` - Processed on May 2nd
- `processed_ftir_10thJune.csv` - Processed on June 10th
- `processed_ftir_2ndMay_Pre.csv` - Preprocessed version (cleaned further)

## Usage

### Loading Data

```python
import pandas as pd

# Load processed data
df = pd.read_csv('processed/processed_ftir_2ndMay_Pre.csv')

# Extract features
features = [col for col in df.columns if col.startswith('f_')]
X = df[features].values
y = df['Polymer'].values
```

### Training Models

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
```

## Data Statistics

Typical dataset contains:
- **Samples:** Hundreds to thousands of FTIR spectra
- **Features:** 1700 (wavenumber range divided by 2 cm⁻¹ intervals)
- **Classes:** 6 polymer types (HDPE, LDPE, PET, PP, PS, PVC)
- **Format:** NumPy arrays (can be loaded to PyTorch tensors)

## Preprocessing Details

### Interpolation

Raw FTIR data may have irregular wavenumber sampling. Interpolation standardizes to:
- **Start:** 600 cm⁻¹
- **Stop:** 4000 cm⁻¹
- **Interval:** 2 cm⁻¹
- **Total Features:** (4000-600)/2 + 1 = 1701

Methods used:
- Linear interpolation
- Cubic spline (for smoother curves)

### Normalization

Values are typically normalized to:
- Min-Max scaling: `(x - min) / (max - min)`
- Or standard scaling: `(x - mean) / std`

## Data Quality Notes

- **Preprocessing Date:** Different preprocessing runs may use different parameters
- **Version Selection:** Choose the version that works best for your model
- **Original Raw Data:** Keep backup of raw data for reproducibility

## Integration Points

This data is used by:
- **CNN/** - Model training and evaluation
- **FTIRNet/** - Inference and prediction
- **preprocessing/preprocess.py** - Generate new processed versions

## Script: file.py

Utility script for data manipulation:
- Loading and saving data
- Feature extraction
- Data validation
- Preprocessing helper functions

## Reproducing Preprocessing

To regenerate processed files:

```bash
cd preprocessing
python preprocess.py
```

This reads `../data/raw/data.csv` and outputs to `../data/processed/`.

## Memory and Storage

Typical sizes:
- Raw data: 10-100 MB (depends on spectral resolution)
- Processed data: 5-50 MB (1700 features × samples)
- PyTorch datasets: 100 MB - 1 GB (after batching and loading)

Load in chunks if memory is limited:
```python
chunks = pd.read_csv('processed_ftir_2ndMay_Pre.csv', chunksize=1000)
```

## Notes

- Always use processed data for ML model training
- Keep raw data for reference and reproducibility
- Different preprocessing runs may have slightly different results
- Consider data augmentation for small datasets
