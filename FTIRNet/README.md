# FTIRNet

FTIRNet is a deep learning-powered Python package for polymer identification from FTIR (Fourier Transform Infrared Spectroscopy) spectra.

Using a 1D Convolutional Neural Network (CNN), FTIRNet can classify FTIR spectra into common polymer categories with a simple Python API or command-line interface.

## Features

* Deep Learning-based FTIR classification
* Simple Python API
* Command Line Interface (CLI)
* Supports multiple trained models
* Returns prediction confidence scores
* Returns probabilities for all supported polymer classes
* Lightweight package with bundled pretrained weights

## Supported Polymer Classes

* HDPE (High-Density Polyethylene)
* LDPE (Low-Density Polyethylene)
* PET (Polyethylene Terephthalate)
* PP (Polypropylene)
* PS (Polystyrene)
* PVC (Polyvinyl Chloride)

---

## Installation

```bash
pip install ftirnet
```

---

## Input Format

FTIRNet expects a processed FTIR CSV file where:

* Each row represents a spectrum
* Feature columns contain absorbance/transmittance values
* Optional columns:

  * `Sample_ID`
  * `Polymer`

Example:

```csv
Sample_ID,Polymer,f_600,f_602,f_604,f_606,...
HDPE004,HDPE,95.74,95.69,95.75,95.89,...
```

For inference, the `Polymer` column is optional and will be ignored if present.

---

## Python API

### Basic Prediction

```python
import ftir

result = ftir.predict(
    "sample.csv"
)

print(result.prediction)
print(result.confidence)
```

### Using a Specific Model

```python
import ftir

result = ftir.predict(
    "sample.csv",
    model="pretrained"
)
```

```python
import ftir

result = ftir.predict(
    "sample.csv",
    model="base"
)
```

---

## Prediction Result Object

The `predict()` function returns an `FTIRResult` object.

### Prediction

```python
print(result.prediction)
```

Example:

```text
HDPE
```

### Confidence Score

```python
print(result.confidence)
```

Example:

```text
93.95
```

### Sample ID

```python
print(result.sample_id)
```

Example:

```text
HDPE004
```

### Class Probabilities

```python
print(result.probabilities)
```

Example:

```python
{
    "HDPE": 93.95,
    "LDPE": 2.67,
    "PET": 0.99,
    "PP": 0.55,
    "PS": 1.28,
    "PVC": 0.56
}
```

### Access Individual Class Probabilities

```python
print(result.probabilities["HDPE"])
```

---

## Command Line Interface

### Default Prediction

```bash
ftir sample.csv
```

### Use Pretrained Model

```bash
ftir sample.csv --model pretrained
```

### Use Base Model

```bash
ftir sample.csv --model base
```

### Help

```bash
ftir --help
```

---

## Available Models

| Model      | Description                                        |
| ---------- | -------------------------------------------------- |
| pretrained | Transfer learning based model with higher accuracy |
| base       | Base CNN model trained from scratch                |

---

## Example Output

```text
Sample ID : HDPE004
Prediction: HDPE
Confidence: 93.95%

Probabilities:

HDPE      : 93.95%
LDPE      : 2.67%
PET       : 0.99%
PP        : 0.55%
PS        : 1.28%
PVC       : 0.56%
```

---

## Requirements

* Python 3.11+
* PyTorch
* NumPy
* Pandas
* Scikit-learn
* Joblib

---

## Citation

If you use FTIRNet in academic research, please cite the associated project or publication when available.

---

## License

MIT License

