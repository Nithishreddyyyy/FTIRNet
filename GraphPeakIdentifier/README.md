# Graph Peak Identifier

Spectral peak identification and functional group assignment utility for FTIR spectra.

## Overview

Analyzes FTIR spectra to identify and classify characteristic peaks and functional groups present in polymer samples.

## Project Structure

```
GraphPeakIdentifier/
├── peakftir.py              # Peak identification logic
├── functional_groups.py      # Functional group database
├── utils.py                 # Utility functions
└── new.csv                  # Sample processed data
```

## Purpose

This module:
- Identifies characteristic peaks in FTIR spectra
- Maps peaks to functional groups
- Generates feature vectors from peak information
- Supports spectral analysis and interpretation
- Assists in polymer identification

## Key Components

### peakftir.py

Main module for peak identification:
- Loads FTIR spectrum data from CSV
- Applies signal processing (Savitzky-Golay filtering)
- Uses `scipy.signal.find_peaks()` for peak detection
- Assigns peaks to functional groups
- Extracts peak heights, widths, and positions

### functional_groups.py

Database of polymer functional groups:
- Maps wavenumber ranges to functional groups
- Provides spectral signatures for polymers
- Defines characteristic absorption bands
- Includes functional group descriptions

### utils.py

Helper functions:
- Peak filtering and validation
- Feature extraction from peak data
- Data normalization and preprocessing

## Usage

Basic usage:
```python
from peakftir import identify_peaks
from utils import extract_features

# Load data
data = pd.read_csv("spectrum.csv")

# Identify peaks
peaks = identify_peaks(data)

# Extract features
features = extract_features(peaks)
```

## Functional Groups Supported

Common polymer functional groups detected:
- **C-H Stretching** (2800-3000 cm⁻¹)
- **C=O Stretching** (1600-1750 cm⁻¹)
- **C-O Stretching** (1000-1300 cm⁻¹)
- **Aromatic Rings** (1400-1600 cm⁻¹)
- **Hydroxyl Groups** (3300-3500 cm⁻¹)
- **Ether Linkages** (1050-1150 cm⁻¹)

## Signal Processing

Peak identification uses:
- **Savitzky-Golay Filter** - Noise reduction while preserving peak shape
- **Peak Detection** - Local maxima identification
- **Peak Validation** - Filtering by height and prominence
- **Feature Extraction** - Height, width, and area calculation

## Input Data Format

CSV file expected:
- Columns: `Sample_ID`, `Polymer`, `f_600`, `f_602`, ..., `f_4000`
- Feature columns named as `f_{wavenumber}`
- One spectrum per row
- Preprocessed/normalized values

## Output

Identifies and returns:
- Peak positions (wavenumbers)
- Peak intensities/heights
- Peak widths
- Associated functional groups
- Confidence scores

## Parameters

Configurable in code:
- Peak prominence threshold
- Peak height threshold
- Smoothing window size (Savitzky-Golay)
- Wavenumber range of interest

## Requirements

- Pandas
- NumPy
- SciPy (for signal processing)
- Matplotlib (for visualization)

## Example

```python
import pandas as pd
from peakftir import identify_peaks

# Load data
df = pd.read_csv("new.csv")

# Extract feature columns
features = [col for col in df.columns if col.startswith('f_')]

# Identify peaks for first spectrum
spectrum = df.iloc[0][features].values
peaks = identify_peaks(spectrum)

print(f"Found {len(peaks)} peaks")
for peak in peaks:
    print(f"  Wavenumber: {peak['wavenumber']} cm⁻¹, "
          f"Intensity: {peak['intensity']}, "
          f"Group: {peak['functional_group']}")
```

## Integration

Used in:
- Spectral analysis pipelines
- Feature engineering for ML models
- Peak-based classification approaches
- Spectral interpretation and reporting

## Notes

- Peak identification is sensitive to noise; input data should be preprocessed
- Filter parameters may need adjustment for different data quality
- Functional group mappings are approximate
- Multiple peaks may contribute to classification
