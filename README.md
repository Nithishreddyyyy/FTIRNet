# SpectraVision: FTIR Polymer Classification System

A comprehensive machine learning system for automated polymer identification using FTIR (Fourier Transform Infrared) spectroscopy.

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Key Components](#key-components)
- [Quick Start](#quick-start)
- [Technology Stack](#technology-stack)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [System Architecture](#system-architecture)
- [Supported Polymers](#supported-polymers)
- [Development](#development)
- [Contributing](#contributing)

## Overview

SpectraVision is a full-stack application that combines:
- **Deep Learning Models** - 1D CNN for spectral classification
- **REST API Backend** - FastAPI server for inference
- **Web Frontend** - React + Vite UI for data submission
- **AI Chatbot** - Interactive assistant for user guidance
- **Production Package** - FTIRNet for deployment

The system classifies polymer types from FTIR spectra with **90-95% accuracy**, enabling rapid identification of plastic materials for recycling, quality control, and research applications.

## Project Structure

```
MiniProject/
├── backend/                 # FastAPI REST API server
├── frontend/                # React + Vite web UI
├── chatBot/                 # FastAPI chatbot service
├── CNN/                     # 1D CNN model and training
├── FTIRNet/                 # Production Python package
├── GraphPeakIdentifier/     # Peak identification utility
├── preprocessing/           # Data preprocessing scripts
├── data/                    # Raw and processed data
│   ├── raw/                 # Original FTIR spectra
│   └── processed/           # Preprocessed feature data
├── experiments/             # Model training experiments
├── models/                  # Pre-trained model weights
├── RealWorldSamples/        # Real-world test data
├── app/                     # Application utilities
├── requirements.txt         # Root dependencies
└── README.md               # This file
```

### Directory Descriptions

| Directory | Purpose | See |
|-----------|---------|-----|
| **backend/** | FastAPI REST API with inference endpoints | [backend/README.md](backend/README.md) |
| **frontend/** | React web interface for uploading and viewing results | [frontend/README_PROJECT.md](frontend/README_PROJECT.md) |
| **chatBot/** | FastAPI chatbot for user assistance | [chatBot/README.md](chatBot/README.md) |
| **CNN/** | 1D CNN implementation, training, and evaluation | [CNN/README.md](CNN/README.md) |
| **FTIRNet/** | Production-ready Python package for FTIR classification | [FTIRNet/README_PROJECT.md](FTIRNet/README_PROJECT.md) |
| **GraphPeakIdentifier/** | FTIR peak identification and analysis | [GraphPeakIdentifier/README.md](GraphPeakIdentifier/README.md) |
| **preprocessing/** | Scripts for preprocessing raw spectra | [preprocessing/README.md](preprocessing/README.md) |
| **data/** | Training data (raw and processed) | [data/README.md](data/README.md) |
| **experiments/** | Model experiment tracking and results | [experiments/README.md](experiments/README.md) |
| **models/** | Pre-trained model weights | [models/README.md](models/README.md) |
| **RealWorldSamples/** | Real-world polymer samples for testing | [RealWorldSamples/README.md](RealWorldSamples/README.md) |
| **app/** | Shared application utilities and models | [app/README.md](app/README.md) |

## Key Components

### 1. **Backend API** (`backend/`)
FastAPI-based REST server with endpoints for:
- `POST /predict` - Classify FTIR spectra
- `POST /reports` - Generate classification reports
- `GET /models` - List available models
- Interactive API docs at `/docs`

### 2. **Frontend UI** (`frontend/`)
Modern React application for:
- Uploading CSV files with FTIR data
- Selecting model versions
- Viewing predictions and confidence scores
- Downloading reports
- Accessing chatbot

### 3. **Machine Learning Models** (`CNN/`, `models/`)
- 1D Convolutional Neural Network architecture
- Trained on 1700 spectral features (600-4000 cm⁻¹)
- 90-95% accuracy on test sets
- Supports 6 polymer classes

### 4. **Data Pipeline** (`preprocessing/`, `data/`)
- Raw FTIR spectra normalization
- Feature extraction and interpolation
- Standard wavenumber grid (2 cm⁻¹ intervals)
- Ready-to-use datasets for training

### 5. **Production Package** (`FTIRNet/`)
Standalone Python package for deployment:
- Simple CLI interface
- Python API for integration
- Pre-trained model weights included
- Lightweight (~5-10 MB)

### 6. **Chatbot Assistant** (`chatBot/`)
FastAPI service providing:
- Interactive Q&A about polymers
- Guidance on FTIR spectroscopy
- System help and documentation

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+ (for frontend)
- Git

### 1. Clone and Setup

```bash
cd MiniProject

# Install Python dependencies
pip install -r requirements.txt

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install chatbot dependencies
cd chatBot
pip install -r requirements.txt
cd ..
```

### 2. Start Services

**Terminal 1 - Backend API:**
```bash
cd backend
python run.py
# API available at http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# UI available at http://localhost:5173
```

**Terminal 3 - Chatbot (optional):**
```bash
cd chatBot
uvicorn app:app --reload --port 8001
# Chat endpoint at http://localhost:8001/chat
```

### 3. Access the Application

- **Web UI:** http://localhost:5173
- **API Docs:** http://localhost:8000/docs
- **Chatbot:** http://localhost:8001

## Technology Stack

### Backend
- **Framework:** FastAPI
- **Server:** Uvicorn
- **ML Framework:** PyTorch
- **Data Processing:** Pandas, NumPy, Scikit-learn

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** CSS3
- **Linting:** ESLint

### Machine Learning
- **Architecture:** 1D Convolutional Neural Network
- **Training:** PyTorch Lightning (optional)
- **Validation:** Scikit-learn metrics
- **Data:** NumPy, Pandas, SciPy

### Data Pipeline
- **Preprocessing:** SciPy (interpolation, smoothing)
- **Feature Engineering:** NumPy, Pandas
- **Visualization:** Matplotlib, Seaborn

## Installation & Setup

### Development Setup

```bash
# Clone repository
git clone <repo-url>
cd MiniProject

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install all dependencies
pip install -r requirements.txt
cd backend && pip install -r requirements.txt && cd ..
cd frontend && npm install && cd ..
cd chatBot && pip install -r requirements.txt && cd ..
```

### Configuration

**Backend Settings:**
Edit `backend/app/config.py`:
- Model paths
- Upload limits
- CORS settings
- API title and version

**Frontend Settings:**
Edit `frontend/.env` (create if needed):
```
VITE_API_URL=http://localhost:8000
```

**Chatbot Settings:**
Edit `chatBot/prompts.py`:
- System role
- Behavior guidelines
- Context and expertise

## Usage

### Uploading FTIR Data

1. Navigate to http://localhost:5173
2. Click "Upload Spectrum" or drag-drop CSV file
3. Select CNN model version
4. Click "Predict"
5. View results and confidence scores
6. Download report

### CSV Format

Accepted format (processed FTIR data):
```csv
Sample_ID,Polymer,f_600,f_602,f_604,...,f_4000
SAMPLE001,HDPE,0.5,0.48,0.52,...,0.3
SAMPLE002,LDPE,0.6,0.59,0.61,...,0.35
```

### Using the Python API

```python
from ftirnet import FTIRClassifier

# Load classifier
classifier = FTIRClassifier(model_path='models/best_model.pth')

# Predict
predictions = classifier.predict('spectrum.csv')
print(predictions)
```

### Training Custom Models

```bash
cd CNN
python train.py
```

This will:
1. Load training data from `config.DATA_PATH`
2. Train for `config.EPOCHS` epochs
3. Save best model to `models/`
4. Generate evaluation reports

## System Architecture

### Data Flow

```
Raw FTIR Spectrum
    ↓
[Preprocessing] → Normalize, Interpolate, Smooth
    ↓
Standardized Features (1700 dimensions)
    ↓
[1D CNN Model] → Feature Extraction, Classification
    ↓
Polymer Type + Confidence Score
    ↓
[Backend API] → Validation, Report Generation
    ↓
[Frontend UI] → Display Results to User
```

### Component Interaction

```
Frontend (React)
    ↓
Backend API (FastAPI)
    ├─→ Model Service (PyTorch)
    ├─→ Data Service (Pandas)
    └─→ Report Service
    
Chatbot Service (FastAPI)
    ↓
LLM Integration (Ollama/OpenAI)
```

## Supported Polymers

The system classifies 6 common polymer types:

| Code | Name | Abbr. | Applications |
|------|------|-------|--------------|
| 1 | High-Density Polyethylene | HDPE | Bottles, bags, containers |
| 2 | Low-Density Polyethylene | LDPE | Films, bags, tubing |
| 3 | Polyethylene Terephthalate | PET | Beverage bottles, textiles |
| 4 | Polypropylene | PP | Automotive, household items |
| 5 | Polystyrene | PS | Packaging, insulation, toys |
| 6 | Polyvinyl Chloride | PVC | Pipes, vinyl, flooring |

## Development

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test

# Model evaluation
cd CNN
python evaluate.py
```

### Code Quality

```bash
# Backend linting
cd backend
pylint app/

# Frontend linting
cd frontend
npm run lint
npm run lint:fix
```

### Adding New Features

1. **New Model:** Add to `CNN/`, train, save to `models/`
2. **New API Endpoint:** Add route to `backend/app/routes/`
3. **New UI Component:** Add to `frontend/src/components/`
4. **New Preprocessing:** Add to `preprocessing/preprocess.py`

## Model Performance

Current best model (`models/best_model.pth`):
- **Overall Accuracy:** 92-95%
- **Precision (per class):** 88-94%
- **Recall (per class):** 88-94%
- **F1-Score (per class):** 88-94%

See [CNN/results/](CNN/results/) for detailed metrics.

## Deployment

### Docker Deployment

```dockerfile
FROM python:3.9
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy app
COPY backend/ .

# Run
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0"]
```

### Production Checklist

- [ ] Update `config.py` with production settings
- [ ] Enable HTTPS/SSL
- [ ] Configure authentication/authorization
- [ ] Set up monitoring and logging
- [ ] Configure database backups
- [ ] Load test the system
- [ ] Document deployment procedures

## Workflow

### Training New Models

1. **Data Preparation**
   ```bash
   cd preprocessing
   python preprocess.py
   ```

2. **Training**
   ```bash
   cd CNN
   python train.py
   ```

3. **Evaluation**
   - Check metrics in `CNN/results/`
   - Compare with experiments in `experiments/`

4. **Deployment**
   - Copy best model to `models/`
   - Update backend config
   - Test via API

### Improving Performance

1. **Add more training data** → `data/processed/`
2. **Fine-tune on real data** → `RealWorldSamples/`
3. **Experiment with architectures** → `CNN/model.py`
4. **Adjust preprocessing** → `preprocessing/preprocess.py`
5. **Hyperparameter tuning** → `CNN/config.py`

## Contributing

### Guidelines

1. **Code Style:** Follow PEP 8 (Python), ES6+ (JavaScript)
2. **Documentation:** Document all functions and modules
3. **Testing:** Write tests for new features
4. **Commits:** Use descriptive commit messages
5. **Branches:** Use feature branches for new work

### Process

1. Fork the repository
2. Create feature branch: `git checkout -b feature/name`
3. Make changes and test
4. Commit with clear messages
5. Push and create Pull Request

## Troubleshooting

### Common Issues

**API not starting:**
- Check Python version (3.8+)
- Verify all dependencies installed: `pip list`
- Check port 8000 is available

**Frontend not loading:**
- Ensure Node.js installed (v16+)
- Check npm dependencies: `npm install`
- Clear cache: `npm cache clean --force`

**Model not found:**
- Verify file exists: `ls -la models/`
- Check path in `config.py`
- Download model if needed

**Predictions not accurate:**
- Verify data is properly preprocessed
- Check for outliers in input data
- Ensure 1700 features in correct range [0,1]

## Documentation

See individual directory READMEs:
- [backend/README.md](backend/README.md) - API documentation
- [frontend/README_PROJECT.md](frontend/README_PROJECT.md) - UI guide
- [CNN/README.md](CNN/README.md) - Model training
- [data/README.md](data/README.md) - Data format
- [preprocessing/README.md](preprocessing/README.md) - Data pipeline

## Support

For questions or issues:
1. Check relevant README files
2. Review `experiments/` for similar cases
3. Check logs in application output
4. Consult docstrings in code

## License

[Include your license information]

## Acknowledgments

- FTIR spectroscopy research and data
- PyTorch deep learning framework
- FastAPI and Uvicorn
- React and Vite communities

## Project Statistics

- **Total Files:** 100+
- **Python Code:** ~5,000 LOC
- **React Components:** 15+
- **Trained Models:** 3+
- **Test Samples:** 23 real-world polymers
- **Training Data:** 1,000+ spectra
- **API Endpoints:** 5+

## Learn More

- [FTIR Spectroscopy Basics](https://en.wikipedia.org/wiki/Fourier-transform_infrared_spectroscopy)
- [PyTorch Tutorials](https://pytorch.org/tutorials/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)

## Version History

- **v1.0.0** - Initial release with 6 polymer classes
- **v0.2.0** - Added chatbot integration
- **v0.1.0** - Backend API and basic frontend

---

**Last Updated:** June 2024

For the latest information, check individual component READMEs and the main repository.
