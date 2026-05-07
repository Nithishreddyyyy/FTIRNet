import argparse

import joblib
import numpy as np
import pandas as pd
import torch
import torch.nn.functional as F
from model import FTIRCNN

# =========================================================
# ARGUMENTS
# =========================================================

parser = argparse.ArgumentParser()

parser.add_argument("--file", required=True, help="Path to processed CSV file")

parser.add_argument(
    "--model", default="models/base_cnn.pth", help="Path to trained model"
)

args = parser.parse_args()

# =========================================================
# DEVICE
# =========================================================

device = torch.device("cuda" if torch.cuda.is_available() else "mps")

print("\n===================================")
print(f"Using Device: {device}")
print("===================================\n")

# =========================================================
# LOAD LABEL ENCODER
# =========================================================

ENCODER_PATH = "models/label_encoder_2ndMay_Pre.pkl"

le = joblib.load(ENCODER_PATH)

# =========================================================
# LOAD INPUT CSV
# =========================================================

print("===================================")
print("Loading Input CSV...")
print("===================================\n")

df = pd.read_csv(args.file)

# =========================================================
# PRESERVE SAMPLE IDS
# =========================================================

if "Sample_ID" in df.columns:
    sample_ids = df["Sample_ID"].values
else:
    sample_ids = np.arange(len(df))

# =========================================================
# DROP NON-FEATURE COLUMNS
# =========================================================

drop_cols = []

if "Sample_ID" in df.columns:
    drop_cols.append("Sample_ID")

if "Polymer" in df.columns:
    drop_cols.append("Polymer")

df_features = df.drop(columns=drop_cols)

X = df_features.values.astype(np.float32)

# =========================================================
# PER-SPECTRUM STANDARDIZATION
# =========================================================

mean = X.mean(axis=1, keepdims=True)

std = X.std(axis=1, keepdims=True) + 1e-8

X = (X - mean) / std

print(f"Input Shape : {X.shape}")

# =========================================================
# LOAD MODEL CHECKPOINT
# =========================================================

print("\n===================================")
print("Loading Model...")
print("===================================\n")

checkpoint = torch.load(args.model, map_location=device)

input_size = checkpoint["input_size"]

# =========================================================
# FEATURE VALIDATION
# =========================================================

if X.shape[1] != input_size:
    raise ValueError(
        f"\nFeature mismatch!\n\n"
        f"Model expects : {input_size} features\n"
        f"Input has     : {X.shape[1]} features\n\n"
        f"Ensure preprocessing uses the "
        f"same wavenumber grid as training."
    )

# =========================================================
# BUILD MODEL
# =========================================================

model = FTIRCNN(input_size=input_size, num_classes=len(le.classes_)).to(device)

model.load_state_dict(checkpoint["model_state_dict"])

model.eval()

print("Model Loaded\n")

# =========================================================
# PREPARE INPUT TENSOR
# =========================================================

X_tensor = torch.tensor(X, dtype=torch.float32).unsqueeze(1).to(device)

# =========================================================
# INFERENCE
# =========================================================

print("===================================")
print("FTIR INFERENCE RESULT")
print("===================================\n")

with torch.no_grad():
    outputs = model(X_tensor)

    probs = F.softmax(outputs, dim=1)

    confs, preds = torch.max(probs, 1)

# =========================================================
# CONVERT LABELS
# =========================================================

pred_labels = le.inverse_transform(preds.cpu().numpy())

conf_scores = confs.cpu().numpy()

all_probs = probs.cpu().numpy()

# =========================================================
# DISPLAY RESULTS
# =========================================================

for i in range(len(pred_labels)):
    print(f"Sample ID        : {sample_ids[i]}")
    print(f"Predicted Polymer: {pred_labels[i]}")
    print(f"Confidence       : {conf_scores[i] * 100:.2f}%")

    print("\nClass Probabilities:\n")

    for cls, prob in zip(le.classes_, all_probs[i]):
        print(f"{cls:<10} : {prob * 100:.2f}%")

    print("\n===================================\n")

# =========================================================
# SAVE RESULTS
# =========================================================

out_df = pd.DataFrame(
    {
        "Sample_ID": sample_ids,
        "Predicted_Polymer": pred_labels,
        "Confidence": conf_scores,
    }
)

out_df.to_csv("out.csv", index=False)

print("Predictions saved to out.csv\n")
