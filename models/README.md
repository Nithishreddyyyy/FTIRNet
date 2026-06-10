# Models

Pre-trained model weights and model artifacts for polymer classification.

## Overview

This directory contains trained model weights used for inference and deployment.

## Directory Structure

```
models/
└── best_model.pth          # Best performing trained model
```

## Model Files

### best_model.pth

The primary production model used for inference.

**Details:**
- **Framework:** PyTorch
- **Architecture:** 1D Convolutional Neural Network
- **Input:** FTIR spectrum (600-4000 cm⁻¹, 1700 features)
- **Output:** Polymer class probabilities (6 classes)
- **Accuracy:** [See CNN/results/ for metrics]
- **File Size:** ~5-10 MB

### How to Use

**Load in Python:**
```python
import torch

# Load model
model = torch.load('models/best_model.pth')
model.eval()

# Prepare input (1700 features)
import torch.nn.functional as F
spectrum = torch.randn(1, 1700)

# Get predictions
with torch.no_grad():
    output = model(spectrum)
    predictions = F.softmax(output, dim=1)
    
print(predictions)
```

**In Backend API:**
```python
from app.services.model_service import load_model

model = load_model('best_model.pth')
predictions = model.predict(spectrum_data)
```

## Model Architecture

The best_model.pth uses:
- **Type:** 1D Convolutional Neural Network
- **Layers:**
  - Input: 1700 features
  - Conv1D layers with ReLU activation
  - Max pooling for dimensionality reduction
  - Dropout for regularization
  - Fully connected layers
  - Output: 6 classes (softmax)

## Related Model Files

Additional trained models stored elsewhere:
- `CNN/models/base_cnn.pth` - Base model
- `CNN/models/cnn_group_split.pth` - Group-split variant
- `CNN/models/cnn_group_split_29thApril.pth` - April variant
- `experiments/*/model.pth` - Experiment-specific models

## Model Performance

Expected metrics on test set:
- **Accuracy:** 90-95%
- **Precision:** 88-94% (per class)
- **Recall:** 88-94% (per class)
- **F1-Score:** 88-94% (per class)

See `CNN/results/classification_report_cnn.txt` for detailed metrics.

## Supported Polymer Classes

The model classifies into 6 polymer types:
1. **HDPE** - High-Density Polyethylene
2. **LDPE** - Low-Density Polyethylene
3. **PET** - Polyethylene Terephthalate
4. **PP** - Polypropylene
5. **PS** - Polystyrene
6. **PVC** - Polyvinyl Chloride

## Inference Specifications

**Input:**
- Format: NumPy array or PyTorch tensor
- Shape: (batch_size, 1700)
- Data Type: float32
- Range: [0, 1] (normalized)

**Output:**
- Format: NumPy array or tensor
- Shape: (batch_size, 6)
- Values: Probabilities per class (sum to 1.0)
- Data Type: float32

## Model Management

### Updating the Model

To update with a better model:

1. **Save New Model**
   ```python
   torch.save(new_model.state_dict(), 'models/best_model_new.pth')
   ```

2. **Backup Old Model**
   ```bash
   cp models/best_model.pth models/best_model_backup.pth
   ```

3. **Replace**
   ```bash
   mv models/best_model_new.pth models/best_model.pth
   ```

4. **Update Documentation**
   - Update this README
   - Document accuracy improvements
   - Note training date

## Version Control

Track model versions:
- **Date Trained**
- **Training Data Version**
- **Hyperparameters Used**
- **Validation Accuracy**
- **Any Notable Changes**

## Inference Performance

Typical inference times:
- **CPU:** 10-50 ms per spectrum
- **GPU/MPS:** 1-5 ms per spectrum
- **Batch Processing:** ~0.5 ms per spectrum (larger batches)

## Deployment

For production deployment:

1. **Load Model**
   ```python
   model = torch.load('models/best_model.pth')
   model.eval()
   ```

2. **Set Device**
   ```python
   device = torch.device('cpu')  # or 'cuda', 'mps'
   model = model.to(device)
   ```

3. **Batch Processing**
   ```python
   with torch.no_grad():
       predictions = model(input_tensor.to(device))
   ```

## Troubleshooting

**Model Not Loading:**
- Check file exists: `ls -lh models/best_model.pth`
- Check file format: Must be PyTorch .pth file
- Check Python version compatibility

**Inference Issues:**
- Ensure input shape is correct: (batch, 1700)
- Check data type: Must be float32
- Verify data is normalized to [0, 1]

## Integration Points

Model used by:
- **backend/app/services/** - Load for API inference
- **CNN/inf.py** - Standalone inference scripts
- **FTIRNet/** - Python package predictions
- **frontend/** - REST API calls

## Backup and Maintenance

- Keep backup of best_model.pth
- Archive old models in experiments/
- Document all model changes
- Version control model metadata
- Regular backups to secure storage

## Notes

- Always test new models before deployment
- Keep production and development models separate
- Document performance metrics
- Plan for model updates and improvements
- Consider model quantization for deployment
