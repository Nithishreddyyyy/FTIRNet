# Experiments

Experiment tracking, results, and artifacts from model development and evaluation.

## Overview

This directory tracks various ML experiments including:
- Different CNN architectures
- Hyperparameter tuning runs
- Model comparisons
- Cross-validation results
- Fine-tuning experiments

## Project Structure

```
experiments/
├── cnn_1d/                  # Original 1D CNN implementation
├── cnn_1d_1stMay/           # CNN trained on May 1st data
├── cnn_1d_2ndMay/           # CNN trained on May 2nd data
├── cnn_1d_2ndMay_FT/        # Fine-tuned version (May 2nd)
├── cnn_1d_3rdMay_Trans/     # Transfer learning (May 3rd)
├── cnn_1d_7thMay_FT/        # Fine-tuned version (May 7th)
├── cnn_1d-OnRealData/       # Trained on real-world samples
├── CNN_metrics_21stMay/     # Metrics and evaluation (May 21st)
├── old_cnn/                 # Legacy CNN implementations
└── random_forest/           # Random Forest baselines
```

## Experiment Naming Convention

Experiments are named by:
- **Model Type:** `cnn_1d`, `random_forest`, etc.
- **Date:** When the experiment was run
- **Variant:** `_FT` for fine-tuning, `_Trans` for transfer learning
- **Data:** Specific dataset or preprocessing version used

### Examples

- `cnn_1d_2ndMay` - 1D CNN trained on May 2nd
- `cnn_1d_2ndMay_FT` - Fine-tuned version of the May 2nd model
- `cnn_1d_3rdMay_Trans` - Transfer learning initialized from May 2nd model

## Typical Experiment Contents

Each experiment directory contains:
- **Model weights** - Trained model files (.pth, .pkl)
- **Training logs** - Loss, accuracy curves
- **Evaluation metrics** - Precision, recall, F1-scores
- **Confusion matrices** - Per-class performance
- **Hyperparameters** - Configuration used for training
- **Notes/comments** - Observations and findings

## Key Experiments

### cnn_1d/ (Baseline)
The original 1D CNN implementation serving as baseline.

### cnn_1d_2ndMay / cnn_1d_2ndMay_FT (Best Performing)
Second-generation models with improved preprocessing. The fine-tuned version shows best results.

### cnn_1d_3rdMay_Trans (Transfer Learning)
Transfer learning from previous model. Useful for adapting to new data.

### cnn_1d-OnRealData
Evaluated on real-world polymer samples (from RealWorldSamples/). Tests model generalization.

### CNN_metrics_21stMay
Comprehensive evaluation with:
- 5-fold cross-validation results
- Per-class metrics
- ROC curves (if available)
- Detailed classification reports

### random_forest/
Baseline comparison using Random Forest classifier. Used to benchmark CNN performance.

## Accessing Experiment Results

### Training Logs
Check for files like:
- `training_log.txt`
- `metrics.json`
- `loss_curve.png`

### Model Files
Look for:
- `model.pth` or `model.pkl`
- `checkpoint_best.pth`
- `final_model.pth`

### Evaluation Reports
Find:
- `classification_report.txt`
- `confusion_matrix.csv`
- `metrics.json`

## Reproducibility

To reproduce an experiment:

1. **Get Configuration**
   ```bash
   cat cnn_1d_2ndMay/config.json
   ```

2. **Load Model**
   ```python
   import torch
   model = torch.load('cnn_1d_2ndMay/model.pth')
   ```

3. **Run Evaluation**
   ```bash
   python evaluate.py --experiment cnn_1d_2ndMay
   ```

## Comparing Experiments

To compare multiple experiments:

```python
import json
import pandas as pd

experiments = [
    'cnn_1d_1stMay',
    'cnn_1d_2ndMay',
    'cnn_1d_2ndMay_FT'
]

results = {}
for exp in experiments:
    with open(f'{exp}/metrics.json') as f:
        results[exp] = json.load(f)

df = pd.DataFrame(results).T
print(df)
```

## Creating New Experiments

When running a new experiment:

1. **Create Experiment Directory**
   ```bash
   mkdir -p experiments/cnn_1d_DATEHERE
   ```

2. **Save Configuration**
   ```python
   config = {
       'model': 'cnn_1d',
       'learning_rate': 3e-4,
       'batch_size': 32,
       'epochs': 30,
       'data': 'processed_ftir_2ndMay_Pre.csv'
   }
   
   with open('experiments/cnn_1d_DATEHERE/config.json', 'w') as f:
       json.dump(config, f)
   ```

3. **Save Model**
   ```python
   torch.save(model.state_dict(), 
              'experiments/cnn_1d_DATEHERE/model.pth')
   ```

4. **Save Metrics**
   ```python
   metrics = {
       'accuracy': 0.95,
       'f1_score': 0.94,
       'training_time': 127.5
   }
   
   with open('experiments/cnn_1d_DATEHERE/metrics.json', 'w') as f:
       json.dump(metrics, f)
   ```

## Experiment Workflow

Typical workflow:
1. Prepare data (preprocessing/)
2. Define model architecture
3. Set hyperparameters
4. Train model
5. Evaluate on test set
6. Save results to experiments/
7. Document findings
8. Compare with previous experiments

## Analysis Tools

Suggested tools for analysis:
- **Pandas** - Load and compare metrics
- **Matplotlib/Seaborn** - Visualize results
- **Jupyter** - Interactive analysis
- **TensorBoard** - Training visualization (if used)

## Best Practices

- **Document Experiments** - What was tested and why
- **Version Control** - Track changes in code and configs
- **Seed Management** - Set random seeds for reproducibility
- **Regular Cleanup** - Archive old/unsuccessful experiments
- **Metadata** - Keep notes on observations and learnings

## Archive

Old or superseded experiments:
- Move to `old_cnn/` or `archive/`
- Keep for historical reference
- Document why they were replaced

## Integration

Experiment results used by:
- **backend/app/services/** - Load best models
- **CNN/inf.py** - Inference with specific models
- **Comparison studies** - Benchmark different approaches

## Notes

- Each experiment is independent
- Models can be loaded and compared
- Metrics help track improvements over time
- Document hyperparameter changes
- Keep track of which data was used for training
