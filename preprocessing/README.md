# Preprocessing

Scripts for preprocessing raw FTIR spectral data into features for machine learning.

## Overview

This module handles:
- Loading raw FTIR spectral data
- Normalizing and standardizing features
- Interpolating to standard wavenumber grid
- Applying smoothing filters
- Exporting processed data for model training

## Project Structure

```
preprocessing/
└── preprocess.py            # Main preprocessing script
```

## Main Script: preprocess.py

### Purpose

Converts raw FTIR spectrum data into standardized features suitable for ML models.

### Process Flow

1. **Load Raw Data** - Read CSV from `data/raw/data.csv`
2. **Create Standard Grid** - Define target wavenumber range (600-4000 cm⁻¹)
3. **Interpolate Spectra** - Resample each spectrum to standard grid
4. **Apply Smoothing** - Remove noise while preserving peaks
5. **Normalize Values** - Scale features to 0-1 range
6. **Save Output** - Write processed features to CSV

### Configuration

Edit paths in `preprocess.py`:

```python
INPUT_FILE = "../../data/raw/data.csv"
OUTPUT_FILE = "../../data/processed/processed_ftir_10thJune.csv"
TARGET_X = np.arange(600, 4001, 2)  # 600-4000 cm⁻¹, step=2
```

### Input Format

Raw FTIR CSV expected:
- Columns: Sample ID, Polymer Type, Wavenumber Values
- Wavenumber columns may have irregular spacing
- Values: Absorbance or transmittance measurements

Example:
```csv
Sample_ID,Polymer,400,401,403,405,...,4000
S001,HDPE,0.5,0.48,0.52,...,0.3
S002,LDPE,0.6,0.59,0.61,...,0.35
```

### Output Format

Processed CSV with:
- **Columns:** `f_600`, `f_602`, `f_604`, ..., `f_4000`
- **Features:** 1700 features (2 cm⁻¹ resolution)
- **Values:** Normalized to [0, 1] range
- **Rows:** One spectrum per row

```csv
Sample_ID,Polymer,f_600,f_602,f_604,...,f_4000
S001,HDPE,0.5,0.48,0.52,...,0.3
```

## Key Functions

### preprocess_row()

Processes a single spectrum:
- Takes raw wavenumber-value pairs
- Interpolates to standard grid
- Returns feature vector

### Main Flow

```python
def preprocess_row(row):
    """
    Convert one FTIR spectrum row into
    interpolated features on TARGET_X.
    """
    # Extract wavenumber and value pairs
    # Interpolate to TARGET_X
    # Apply smoothing
    # Normalize values
    # Return feature vector
```

## Usage

### Running Preprocessing

```bash
cd preprocessing
python preprocess.py
```

This will:
1. Load `data/raw/data.csv`
2. Process all rows
3. Save to `data/processed/processed_ftir_10thJune.csv`

### Custom Preprocessing

To preprocess with custom parameters:

```python
from preprocess import preprocess_row
import pandas as pd

# Load data
df = pd.read_csv('../../data/raw/data.csv')

# Process custom row
processed = preprocess_row(df.iloc[0])
```

## Interpolation Methods

Available interpolation strategies:
- **Linear** - Fast, suitable for regular features
- **Cubic Spline** - Smoother curves, better for irregular grids
- **Step Function** - Preserves step-like features

## Smoothing

Smoothing techniques:
- **Savitzky-Golay Filter** - Preserves peaks and edges
- **Gaussian Filter** - Broad smoothing
- **Moving Average** - Simple and fast

## Normalization Strategies

Options for feature scaling:
- **Min-Max (0-1):** `(x - min) / (max - min)`
- **Standard Scaling:** `(x - mean) / std`
- **Log Transform:** For data with wide dynamic range

## Wavenumber Grid

Standard FTIR grid used:
```
Start: 600 cm⁻¹
Stop: 4000 cm⁻¹
Step: 2 cm⁻¹
Total Features: 1701
```

Adjustable in code:
```python
TARGET_X = np.arange(600, 4001, 2)
```

## Dependencies

- Pandas - Data loading and manipulation
- NumPy - Numerical operations
- SciPy - Interpolation and signal processing

## Error Handling

The script handles:
- Missing values (interpolation)
- Outlier spectra (normalization)
- Irregular wavenumber grids
- File I/O errors

## Performance

Typical processing times:
- **100 spectra:** < 1 second
- **1000 spectra:** 1-5 seconds
- **10000 spectra:** 10-30 seconds

Depends on:
- Interpolation method
- Smoothing window size
- Number of features

## Output Verification

After preprocessing:
1. Check shape: Should be (num_samples, 1700+)
2. Check values: Should be in [0, 1] range
3. Check NaN values: None should be present
4. Verify row count: Should match input

```python
import pandas as pd

df = pd.read_csv('processed/processed_ftir_10thJune.csv')
print(f"Shape: {df.shape}")
print(f"Value range: [{df.min().min():.3f}, {df.max().max():.3f}]")
print(f"NaN count: {df.isna().sum().sum()}")
```

## Next Steps

After preprocessing:
1. Load processed data
2. Split into train/validation/test sets
3. Train ML models (CNN, RandomForest, etc.)
4. Evaluate performance

## Notes

- Keep raw data for reproducibility
- Document any custom preprocessing changes
- Version processed files by date
- Consider data augmentation for small datasets
