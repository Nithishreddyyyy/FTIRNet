import argparse
import torch
import pandas as pd
import numpy as np
import joblib

from model import FTIRCNN

# -------------------------------
# ARGUMENTS
# -------------------------------
parser = argparse.ArgumentParser()
parser.add_argument("--file", required=True, help="Path to input CSV")
args = parser.parse_args()

# -------------------------------
# LOAD MODEL + LABELS
# -------------------------------
MODEL_PATH = "models/cnn_group_split.pth"
ENCODER_PATH = "models/label_encoder.pkl"

device = torch.device("cuda" if torch.cuda.is_available() else "mps")

le = joblib.load(ENCODER_PATH)

# -------------------------------
# LOAD INPUT CSV
# -------------------------------
df = pd.read_csv(args.file)

if "Sample_ID" in df.columns:
    df = df.drop(columns=["Sample_ID"])
if "Polymer" in df.columns:
    df = df.drop(columns=["Polymer"])

X = df.values.astype(np.float32)

# -------------------------------
# PREPARE MODEL
# -------------------------------
input_size = X.shape[1]

model = FTIRCNN(
    input_size=input_size,
    num_classes=len(le.classes_)
).to(device)

model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.eval()

# -------------------------------
# PREDICT
# -------------------------------
X_tensor = torch.tensor(X).unsqueeze(1).to(device)

with torch.no_grad():
    outputs = model(X_tensor)
    _, preds = torch.max(outputs, 1)

pred_labels = le.inverse_transform(preds.cpu().numpy())

# -------------------------------
# OUTPUT
# -------------------------------
for i, label in enumerate(pred_labels):
    print(f"Sample {i}: {label}")
