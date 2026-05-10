# experiments/cnn/config.py

DATA_PATH = "../../data/processed/processed_ftir.csv"

BATCH_SIZE = 64
EPOCHS = 15
LR = 1e-3

DEVICE = "cuda"  # change to "cpu" if needed