# inf_3d.py

import argparse
import torch
import torch.nn.functional as F
import pandas as pd
import numpy as np
import joblib

import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

from model import FTIRCNN

# =========================================================
# ARGUMENTS
# =========================================================

parser = argparse.ArgumentParser()

parser.add_argument(
    "--file",
    required=True,
    help="Path to processed CSV file"
)

parser.add_argument(
    "--model",
    default="models/pretrained/pretrained_cnn.pth",
    help="Path to trained model"
)

args = parser.parse_args()

# =========================================================
# DEVICE
# =========================================================

device = torch.device(
    "cuda" if torch.cuda.is_available() else "mps"
)

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

# Preserve sample IDs
if "Sample_ID" in df.columns:
    sample_ids = df["Sample_ID"].values
else:
    sample_ids = np.arange(len(df))

# Drop unwanted columns
drop_cols = []

if "Sample_ID" in df.columns:
    drop_cols.append("Sample_ID")

if "Polymer" in df.columns:
    drop_cols.append("Polymer")

df_features = df.drop(columns=drop_cols)

X = df_features.values.astype(np.float32)

print(f"Input Shape : {X.shape}")

# =========================================================
# LOAD MODEL
# =========================================================

print("\n===================================")
print("Loading Model...")
print("===================================\n")

checkpoint = torch.load(
    args.model,
    map_location=device
)

input_size = checkpoint["input_size"]

# Feature validation
if X.shape[1] != input_size:

    raise ValueError(
        f"\nFeature mismatch!\n\n"
        f"Model expects : {input_size} features\n"
        f"Input has     : {X.shape[1]} features\n"
    )

# =========================================================
# BUILD MODEL
# =========================================================

model = FTIRCNN(
    input_size=input_size,
    num_classes=len(le.classes_)
).to(device)

model.load_state_dict(
    checkpoint["model_state_dict"]
)

model.eval()

print("Model Loaded\n")

# =========================================================
# PREPARE INPUT
# =========================================================

X_tensor = torch.tensor(
    X,
    dtype=torch.float32
).unsqueeze(1).to(device)

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

pred_labels = le.inverse_transform(
    preds.cpu().numpy()
)

conf_scores = confs.cpu().numpy()

all_probs = probs.cpu().numpy()

# =========================================================
# DISPLAY RESULTS
# =========================================================

for i in range(len(pred_labels)):

    print(f"Sample ID        : {sample_ids[i]}")
    print(f"Predicted Polymer: {pred_labels[i]}")
    print(f"Confidence       : {conf_scores[i]*100:.2f}%")

    print("\nClass Probabilities:\n")

    for cls, prob in zip(le.classes_, all_probs[i]):

        print(f"{cls:<10} : {prob*100:.2f}%")

    print("\n===================================\n")

# =========================================================
# 3D VISUALIZATION
# =========================================================

for sample_idx in range(len(pred_labels)):

    probs_sample = all_probs[sample_idx]

    classes = le.classes_

    x = np.arange(len(classes))
    y = np.linspace(0, 10, len(classes))   # fake progression axis
    z = probs_sample

    fig = plt.figure(figsize=(12, 8))

    ax = fig.add_subplot(111, projection='3d')

    # 3D bars
    dx = np.ones(len(classes)) * 0.5
    dy = np.ones(len(classes)) * 0.5

    ax.bar3d(
        x,
        y,
        np.zeros(len(classes)),
        dx,
        dy,
        z,
        shade=True
    )

    # Highlight prediction
    pred_idx = preds[sample_idx].item()

    ax.scatter(
        x[pred_idx],
        y[pred_idx],
        z[pred_idx],
        s=200,
        marker='*'
    )

    ax.set_xticks(x)
    ax.set_xticklabels(classes)

    ax.set_xlabel("Polymer Class")
    ax.set_ylabel("Prediction Progression")
    ax.set_zlabel("Probability")

    ax.set_title(
        f"3D CNN Prediction Space\n"
        f"Predicted: {pred_labels[sample_idx]} "
        f"({conf_scores[sample_idx]*100:.2f}%)"
    )

    plt.tight_layout()

    out_img = f"prediction_3d_{sample_ids[sample_idx]}.png"

    plt.savefig(out_img, dpi=300)

    print(f"3D visualization saved: {out_img}")

    plt.show()

# =========================================================
# SAVE RESULTS
# =========================================================

out_df = pd.DataFrame({
    "Sample_ID": sample_ids,
    "Predicted_Polymer": pred_labels,
    "Confidence": conf_scores
})

out_df.to_csv(
    "out.csv",
    index=False
)

print("\nPredictions saved to out.csv\n")
