# inf_latent_3d.py

import argparse

import joblib
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import torch
import torch.nn as nn
import torch.nn.functional as F
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

from model import FTIRCNN

# =========================================================
# ARGUMENTS
# =========================================================

parser = argparse.ArgumentParser()

parser.add_argument("--file", required=True, help="Path to inference CSV")

parser.add_argument(
    "--train", required=True, help="Path to training CSV used for visualization"
)

parser.add_argument(
    "--model",
    default="models/pretrained/pretrained_cnn.pth",
    help="Path to trained model",
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
# LABEL ENCODER
# =========================================================

ENCODER_PATH = "models/label_encoder_2ndMay_Pre.pkl"

le = joblib.load(ENCODER_PATH)

# =========================================================
# LOAD MODEL
# =========================================================

checkpoint = torch.load(args.model, map_location=device)

input_size = checkpoint["input_size"]

model = FTIRCNN(input_size=input_size, num_classes=len(le.classes_)).to(device)

model.load_state_dict(checkpoint["model_state_dict"])

model.eval()

print("✅ Model Loaded\n")

# =========================================================
# FEATURE EXTRACTOR
# =========================================================
# We remove final classifier layer effect
# and capture latent embeddings
# =========================================================


class FeatureExtractor(nn.Module):
    def __init__(self, model):
        super().__init__()

        self.model = model

    def forward(self, x):

        # First conv block
        x = self.model.pool(self.model.relu(self.model.conv1(x)))

        # Second conv block
        x = self.model.pool(self.model.relu(self.model.conv2(x)))

        # Third conv block
        x = self.model.pool(self.model.relu(self.model.conv3(x)))

        # Flatten latent vector
        x = torch.flatten(x, 1)

        return x


extractor = FeatureExtractor(model).to(device)

# =========================================================
# LOAD TRAINING DATA
# =========================================================

print("Loading Training Data...\n")

train_df = pd.read_csv(args.train)

train_y = train_df["Polymer"].values

drop_cols = ["Sample_ID", "Polymer"]

train_X = train_df.drop(columns=drop_cols).values.astype(np.float32)

# =========================================================
# LOAD INFERENCE DATA
# =========================================================

print("Loading Inference Data...\n")

infer_df = pd.read_csv(args.file)

if "Sample_ID" in infer_df.columns:
    sample_ids = infer_df["Sample_ID"].values
else:
    sample_ids = np.arange(len(infer_df))

drop_cols = []

if "Sample_ID" in infer_df.columns:
    drop_cols.append("Sample_ID")

if "Polymer" in infer_df.columns:
    drop_cols.append("Polymer")

infer_X = infer_df.drop(columns=drop_cols).values.astype(np.float32)

# =========================================================
# VALIDATION
# =========================================================

if train_X.shape[1] != input_size:
    raise ValueError("Training feature mismatch")

if infer_X.shape[1] != input_size:
    raise ValueError("Inference feature mismatch")

# =========================================================
# TENSORS
# =========================================================

train_tensor = torch.tensor(train_X, dtype=torch.float32).unsqueeze(1).to(device)

infer_tensor = torch.tensor(infer_X, dtype=torch.float32).unsqueeze(1).to(device)

# =========================================================
# EXTRACT LATENT FEATURES
# =========================================================

print("Extracting CNN Latent Features...\n")

with torch.no_grad():
    train_features = extractor(train_tensor).cpu().numpy()

    infer_features = extractor(infer_tensor).cpu().numpy()

# =========================================================
# NORMALIZATION
# =========================================================

scaler = StandardScaler()

train_features = scaler.fit_transform(train_features)

infer_features = scaler.transform(infer_features)

# =========================================================
# PCA → 3D
# =========================================================

print("Running PCA Projection...\n")

pca = PCA(n_components=3)

train_3d = pca.fit_transform(train_features)

infer_3d = pca.transform(infer_features)

# =========================================================
# MODEL PREDICTIONS
# =========================================================

with torch.no_grad():
    outputs = model(infer_tensor)

    probs = F.softmax(outputs, dim=1)

    confs, preds = torch.max(probs, 1)

pred_labels = le.inverse_transform(preds.cpu().numpy())

conf_scores = confs.cpu().numpy()

# =========================================================
# COLORS
# =========================================================

unique_classes = sorted(list(set(train_y)))

colors = px.colors.qualitative.Bold

class_color_map = {cls: colors[i % len(colors)] for i, cls in enumerate(unique_classes)}

# =========================================================
# BUILD 3D FIGURE
# =========================================================

fig = go.Figure()

# =========================================================
# TRAINING CLUSTERS
# =========================================================

for cls in unique_classes:
    idx = np.where(train_y == cls)[0]

    fig.add_trace(
        go.Scatter3d(
            x=train_3d[idx, 0],
            y=train_3d[idx, 1],
            z=train_3d[idx, 2],
            mode="markers",
            marker=dict(size=4, opacity=0.55, color=class_color_map[cls]),
            name=f"{cls} Cluster",
        )
    )

# =========================================================
# INFERENCE SAMPLES
# =========================================================

for i in range(len(infer_3d)):
    pred_cls = pred_labels[i]

    confidence = conf_scores[i] * 100

    x, y, z = infer_3d[i]

    # glowing sample point
    fig.add_trace(
        go.Scatter3d(
            x=[x],
            y=[y],
            z=[z],
            mode="markers+text",
            marker=dict(
                size=12,
                color="white",
                line=dict(color=class_color_map[pred_cls], width=6),
            ),
            text=[f"{pred_cls}<br>{confidence:.2f}%"],
            textposition="top center",
            name=f"Inference {sample_ids[i]}",
        )
    )

    # trajectory line
    cluster_idx = np.where(train_y == pred_cls)[0]

    centroid = train_3d[cluster_idx].mean(axis=0)

    fig.add_trace(
        go.Scatter3d(
            x=[x, centroid[0]],
            y=[y, centroid[1]],
            z=[z, centroid[2]],
            mode="lines",
            line=dict(width=6, color=class_color_map[pred_cls]),
            showlegend=False,
        )
    )

# =========================================================
# LAYOUT
# =========================================================

fig.update_layout(
    title="3D Latent Polymer Space (CNN Feature Embeddings)",
    template="plotly_dark",
    scene=dict(
        xaxis_title="Latent Dimension 1",
        yaxis_title="Latent Dimension 2",
        zaxis_title="Latent Dimension 3",
        bgcolor="black",
    ),
    height=900,
)

# =========================================================
# SAVE HTML
# =========================================================

html_path = "latent_space_visualization.html"

fig.write_html(html_path)

print("\n===================================")
print("✅ Interactive 3D Visualization Saved")
print(html_path)
print("===================================\n")

# =========================================================
# SHOW RESULTS
# =========================================================

for i in range(len(pred_labels)):
    print(f"Sample ID        : {sample_ids[i]}")
    print(f"Predicted Polymer: {pred_labels[i]}")
    print(f"Confidence       : {conf_scores[i] * 100:.2f}%")

    print("\n===================================\n")

fig.show()
