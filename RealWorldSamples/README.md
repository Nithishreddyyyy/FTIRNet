# Real World Samples

Real-world polymer sample data for model testing and evaluation.

## Overview

Contains FTIR spectral data from real polymer samples collected in the field. Used for:
- Testing model generalization to real-world data
- Fine-tuning models on actual samples
- Validating system performance in production
- Quality assurance testing

## Project Structure

```
RealWorldSamples/
├── HDPE*.csv                # High-Density Polyethylene samples (HDPE001-006)
├── LDPE*.csv                # Low-Density Polyethylene samples (LDPE001-004)
├── PET*.csv                 # Polyethylene Terephthalate samples (PET001-004)
├── PP*.csv                  # Polypropylene samples (PP001-006)
├── PS*.csv                  # Polystyrene samples (PS001)
└── PVC*.csv                 # Polyvinyl Chloride samples (PVC001-002)
```

## Sample Data

### High-Density Polyethylene (HDPE)
- **HDPE001.csv** through **HDPE006.csv**
- Total: 6 samples
- Quality: Research/laboratory grade

### Low-Density Polyethylene (LDPE)
- **LDPE001.csv** through **LDPE004.csv**
- Total: 4 samples
- Common in plastic films and bags

### Polyethylene Terephthalate (PET)
- **PET001.csv** through **PET004.csv**
- Total: 4 samples
- Commonly used in beverage bottles

### Polypropylene (PP)
- **PP001.csv** through **PP006.csv**
- Total: 6 samples
- Wide variety of applications

### Polystyrene (PS)
- **PS001.csv**
- Total: 1 sample
- Expanded form used in packaging

### Polyvinyl Chloride (PVC)
- **PVC001.csv**, **PVC002.csv**
- Total: 2 samples
- Used in pipes and construction

## Data Format

Each CSV file contains:
- **Wavenumber column** - Infrared wavenumbers (cm⁻¹)
- **Absorbance column** - Measured absorbance values
- **Metadata** - Sample ID, collection date, conditions

Example structure:
```csv
Wavenumber,Absorbance
600,0.5234
602,0.5198
604,0.5165
...
4000,0.3021
```

## Total Sample Count

- **HDPE:** 6 samples
- **LDPE:** 4 samples
- **PET:** 4 samples
- **PP:** 6 samples
- **PS:** 1 sample
- **PVC:** 2 samples
- **Total:** 23 samples

## Usage

### Loading Real-World Data

```python
import pandas as pd

# Load single sample
sample = pd.read_csv('RealWorldSamples/HDPE001.csv')

# Load all samples of a type
import glob

hdpe_files = glob.glob('RealWorldSamples/HDPE*.csv')
hdpe_samples = [pd.read_csv(f) for f in hdpe_files]
```

### Testing Model Performance

```python
from CNN import model
import torch

# Load real sample
sample_data = pd.read_csv('RealWorldSamples/HDPE001.csv')
spectrum = torch.tensor(sample_data['Absorbance'].values)

# Get prediction
with torch.no_grad():
    output = model(spectrum.unsqueeze(0))
    prediction = output.argmax(dim=1)
    
print(f"Predicted: {prediction}")
```

### Fine-tuning on Real Data

```bash
cd CNN
python finetune.py --data ../RealWorldSamples/
```

## Quality Characteristics

Real-world samples typically show:
- **Noise Variations** - From measurement instruments
- **Baseline Shifts** - Due to sample mounting
- **Spectral Variations** - Even within same polymer type
- **Preprocessing Challenges** - Require robust preprocessing

## Comparison with Training Data

| Aspect | Training Data | Real Samples |
|--------|--------------|--------------|
| Source | Laboratory prepared | Field/industrial collected |
| Purity | High (standard polymers) | Variable (recycled, mixed) |
| Noise | Low (controlled) | Higher (real conditions) |
| Quantity | Large (hundreds/thousands) | Small (23 samples) |
| Variability | Controlled | Natural (realistic) |

## Model Evaluation on Real Data

Expected outcomes:
- Model should perform well on well-characterized samples
- Performance may vary on recycled or degraded polymers
- Can identify gaps in training data
- Helps benchmark real-world applicability

## Using Real Data for Fine-tuning

To improve model performance on real-world data:

1. **Combine Training Data + Real Data**
   ```python
   train_data = pd.read_csv('data/processed/processed_ftir_2ndMay_Pre.csv')
   
   # Load real samples
   real_data = []
   for f in glob.glob('RealWorldSamples/*.csv'):
       df = pd.read_csv(f)
       real_data.append(df)
   
   combined = pd.concat([train_data] + real_data)
   ```

2. **Fine-tune Model**
   ```bash
   python CNN/finetune.py
   ```

3. **Evaluate**
   ```python
   predictions = model.predict(real_samples)
   accuracy = evaluate(predictions, true_labels)
   ```

## Data Collection Notes

These samples were collected:
- **Method:** FTIR spectroscopy
- **Instrument:** [Specific model - check metadata]
- **Settings:** [See sample files for parameters]
- **Conditions:** [Room temperature, standard atmosphere]

## Polymer Identification

Using real samples to validate:
- **HDPE** - Recognizable C-H stretches at 2960, 2920, 2850 cm⁻¹
- **LDPE** - Similar to HDPE but with characteristic branches
- **PET** - Strong C=O stretch at 1712 cm⁻¹
- **PP** - Similar to PE but with methyl group features
- **PS** - Aromatic C-H bending around 1600, 1500 cm⁻¹
- **PVC** - Strong C-Cl stretch at 600-800 cm⁻¹

## Preprocessing Considerations

For real samples:
- May need aggressive smoothing
- Outlier removal important
- Consider baseline correction
- Verify normalization range

## Integration Points

Real-world samples used in:
- **backend/app/** - Model validation endpoint
- **CNN/RealData/** - Fine-tuning experiments
- **frontend/** - Demo predictions
- **Testing suites** - Validation testing

## Next Steps

To expand real-world evaluation:
1. **Collect More Samples** - Increase sample diversity
2. **Document Collection** - Metadata for each sample
3. **Cross-validation** - Test across different instruments
4. **Degraded Samples** - Include weathered/aged polymers

## Notes

- Use representative samples for thorough testing
- Document any preprocessing applied to real data
- Keep track of model performance on real vs. synthetic data
- Consider recycled material contamination in real samples
- Archive samples and metadata for reproducibility
