# ============================================
# FILE: train_2ndMay.py
# ============================================

import os
import torch
import torch.nn as nn
import torch.optim as optim
import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import GroupShuffleSplit
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix

from torch.utils.data import DataLoader

from dataset_2ndMay import FTIRDataset
from model_2ndMay import FTIRCNN

from utils import train_one_epoch
from utils import evaluate

# =========================================================
# DEVICE
# =========================================================

if torch.cuda.is_available():

    device = torch.device("cuda")

elif torch.backends.mps.is_available():

    device = torch.device("mps")

else:

    device = torch.device("cpu")

print(f"\nUsing device: {device}")

# =========================================================
# CONFIG
# =========================================================

DATASET_PATH = "../../data/processed/processed_ftir_2ndMay.csv"

MODEL_SAVE_PATH = "models/cnn_group_split_2ndMay.pth"

ENCODER_SAVE_PATH = "models/label_encoder_2ndMay.pkl"

REPORT_PATH = "results/classification_report_cnn_2ndMay.txt"

CM_PATH = "results/confusion_matrix_cnn_2ndMay.png"

BATCH_SIZE = 32
LR = 0.001
EPOCHS = 25

# =========================================================
# CREATE DIRS
# =========================================================

os.makedirs("models", exist_ok=True)
os.makedirs("results", exist_ok=True)

# =========================================================
# LOAD DATASET
# =========================================================

print("\n===================================")
print("Loading Dataset...")
print("===================================")

df = pd.read_csv(DATASET_PATH)

print("\nDataset Shape:", df.shape)

# =========================================================
# USE ONLY FINGERPRINT REGION
# =========================================================

feature_cols = []

for col in df.columns:

    if col.startswith("f_"):

        wn = int(col.split("_")[1])

        if 600 <= wn <= 1800:

            feature_cols.append(col)

print(f"\nUsing {len(feature_cols)} fingerprint features")

# =========================================================
# FEATURES + LABELS
# =========================================================

X = df[feature_cols].values.astype(np.float32)

y = df["Polymer"].values

groups = df["Sample_ID"]

print("Feature Shape:", X.shape)

# =========================================================
# LABEL ENCODING
# =========================================================

le = LabelEncoder()

y = le.fit_transform(y)

joblib.dump(
    le,
    ENCODER_SAVE_PATH
)

print("\nClasses:")
print(le.classes_)

# =========================================================
# GROUP SPLIT
# =========================================================

gss = GroupShuffleSplit(
    test_size=0.2,
    n_splits=1,
    random_state=42
)

train_idx, test_idx = next(
    gss.split(X, y, groups)
)

X_train, X_test = X[train_idx], X[test_idx]

y_train, y_test = y[train_idx], y[test_idx]

train_ids = set(groups.iloc[train_idx])

test_ids = set(groups.iloc[test_idx])

print(
    "\nOverlap (should be 0):",
    len(train_ids.intersection(test_ids))
)

# =========================================================
# DATALOADERS
# =========================================================

train_loader = DataLoader(
    FTIRDataset(
        X_train,
        y_train,
        augment=True
    ),
    batch_size=BATCH_SIZE,
    shuffle=True
)

test_loader = DataLoader(
    FTIRDataset(
        X_test,
        y_test,
        augment=False
    ),
    batch_size=BATCH_SIZE,
    shuffle=False
)

# =========================================================
# MODEL
# =========================================================

model = FTIRCNN(
    input_size=X.shape[1],
    num_classes=len(le.classes_)
).to(device)

criterion = nn.CrossEntropyLoss()

optimizer = optim.Adam(
    model.parameters(),
    lr=LR
)

# =========================================================
# TRAINING
# =========================================================

print("\n===================================")
print("TRAINING STARTED")
print("===================================")

best_acc = 0.0

for epoch in range(EPOCHS):

    loss = train_one_epoch(
        model,
        train_loader,
        optimizer,
        criterion,
        device
    )

    acc = evaluate(
        model,
        test_loader,
        device
    )

    print(
        f"Epoch {epoch+1}/{EPOCHS} "
        f"| Loss: {loss:.4f} "
        f"| Test Acc: {acc:.4f}"
    )

    # -----------------------------------------------------
    # SAVE BEST MODEL
    # -----------------------------------------------------

    if acc > best_acc:

        best_acc = acc

        torch.save(
            model.state_dict(),
            MODEL_SAVE_PATH
        )

        print("✅ Best model updated")

# =========================================================
# LOAD BEST MODEL
# =========================================================

print("\n===================================")
print("FINAL EVALUATION")
print("===================================")

model.load_state_dict(
    torch.load(
        MODEL_SAVE_PATH,
        map_location=device
    )
)

model.eval()

y_pred = []

y_true = []

with torch.no_grad():

    for xb, yb in test_loader:

        xb = xb.to(device)

        outputs = model(xb)

        _, predicted = torch.max(outputs, 1)

        y_pred.extend(
            predicted.cpu().numpy()
        )

        y_true.extend(
            yb.numpy()
        )

# =========================================================
# CLASSIFICATION REPORT
# =========================================================

report = classification_report(
    y_true,
    y_pred,
    target_names=le.classes_
)

print("\n=== Classification Report ===\n")

print(report)

with open(REPORT_PATH, "w") as f:

    f.write(report)

# =========================================================
# CONFUSION MATRIX
# =========================================================

cm = confusion_matrix(
    y_true,
    y_pred
)

plt.figure(figsize=(10, 8))

sns.heatmap(
    cm,
    annot=True,
    fmt="d",
    xticklabels=le.classes_,
    yticklabels=le.classes_
)

plt.xlabel("Predicted")

plt.ylabel("Actual")

plt.title("CNN Confusion Matrix - 2ndMay")

plt.tight_layout()

plt.savefig(CM_PATH)

plt.close()

# =========================================================
# DONE
# =========================================================

print("\n===================================")
print("TRAINING COMPLETE")
print("===================================")

print(f"Best Accuracy : {best_acc:.4f}")

print(f"Model Saved   : {MODEL_SAVE_PATH}")

print(f"Encoder Saved : {ENCODER_SAVE_PATH}")
