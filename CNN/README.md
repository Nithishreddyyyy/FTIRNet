# CNN Models

1D Convolutional Neural Network models for FTIR spectral classification of polymers.

## Overview

Contains CNN model implementations, training scripts, and evaluation utilities for polymer classification from FTIR spectral data.

## Project Structure

```
CNN/
├── config.py                # Configuration settings
├── dataset.py               # Dataset loading and preprocessing
├── model.py                 # CNN model architecture
├── train.py                 # Training script
├── finetune.py              # Fine-tuning script
├── inf.py                   # Inference script
├── inf_3d.py                # 3D visualization inference
├── inf_3d_1.py              # Alternative 3D inference
├── utils.py                 # Utility functions
├── models/                  # Pre-trained model weights
│   ├── base_cnn.pth
│   ├── cnn_group_split.pth
│   ├── cnn_group_split_29thApril.pth
│   └── pretrained/
├── results/                 # Training results and reports
│   ├── classification_report_cnn.txt
│   ├── classification_report_cnn_5fold.txt
│   └── ...
└── RealData/                # Real-world sample data and processing
    ├── FineTune.csv
    ├── test.csv
    ├── test-dataset/
    ├── finetune-dataset/
    ├── preprocessReal.py
    └── Presentation/
```

## Configuration

Edit `config.py` to set:
- `DATA_PATH` - Path to training data CSV
- `BATCH_SIZE` - Batch size for training (default: 32)
- `EPOCHS` - Number of training epochs (default: 30)
- `LR` - Learning rate (default: 3e-4)
- `DEVICE` - Compute device (default: "mps")

## Model Architecture

The FTIRCNN model uses:
- 1D convolutional layers for feature extraction
- Max pooling for dimensionality reduction
- Dense layers for classification
- Dropout for regularization
- Softmax activation for multi-class classification

## Training

### Basic Training

```bash
python train.py
```

This will:
1. Load dataset from `DATA_PATH`
2. Create train/validation splits
3. Train the model for specified epochs
4. Save best model to `models/`
5. Generate classification reports to `results/`

### Fine-tuning

```bash
python finetune.py
```

Fine-tune a pre-trained model on new data.

## Inference

### Simple Inference

```bash
python inf.py
```

Run predictions on test data.

### 3D Visualization

```bash
python inf_3d.py
# or
python inf_3d_1.py
```

Visualize learned features and embeddings in 3D space.

## Dataset Format

Training data should be a CSV file with:
- One spectrum per row
- Columns: `[Sample_ID, Polymer, f_600, f_602, ..., f_4000]`
- Spectral features at 2 cm⁻¹ intervals from 600-4000 cm⁻¹
- Polymer label column for classification

## Evaluation

Classification reports generated during training include:
- Precision, Recall, F1-Score
- Confusion matrices
- Per-class metrics
- Overall accuracy

Results are saved to `results/` directory.

## Supported Polymer Classes

- HDPE (High-Density Polyethylene)
- LDPE (Low-Density Polyethylene)
- PET (Polyethylene Terephthalate)
- PP (Polypropylene)
- PS (Polystyrene)
- PVC (Polyvinyl Chloride)

## Key Files

- **config.py** - All hyperparameters in one place
- **model.py** - CNN architecture definition
- **dataset.py** - PyTorch Dataset class for data loading
- **train.py** - Main training loop with validation
- **utils.py** - Helper functions (train_one_epoch, evaluate, etc.)

## Real Data Processing

The `RealData/` subdirectory contains:
- Real-world sample FTIR spectra
- Preprocessing scripts for raw spectral data
- Fine-tuning datasets
- Test datasets with expected labels

Run `RealData/preprocessReal.py` to process raw FTIR spectra.

## Requirements

- PyTorch
- Pandas
- NumPy
- Scikit-learn
- Matplotlib, Seaborn
- Joblib

## Notes

- Models are saved in PyTorch `.pth` format
- Results include confusion matrices and classification reports
- The models directory stores multiple trained variations
- Training may require GPU/MPS acceleration
