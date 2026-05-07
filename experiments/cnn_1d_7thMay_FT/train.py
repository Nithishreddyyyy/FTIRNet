import os

import joblib
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
import torch
import torch.nn as nn
import torch.optim as optim
from config import *
from dataset import FTIRDataset
from model import FTIRCNN
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.model_selection import GroupShuffleSplit
from sklearn.preprocessing import LabelEncoder
from torch.utils.data import DataLoader

from utils import evaluate, train_one_epoch

# =========================================================
# DEVICE
# =========================================================

device = torch.device(DEVICE if torch.cuda.is_available() else "mps")

print("\n===================================")
print(f"Using Device: {device}")
print("===================================\n")

# =========================================================
# CREATE DIRECTORIES
# =========================================================

os.makedirs("models", exist_ok=True)
os.makedirs("models/pretrained", exist_ok=True)
os.makedirs("results", exist_ok=True)

# =========================================================
# LOAD DATASET
# =========================================================

print("===================================")
print("Loading Dataset...")
print("===================================\n")

df = pd.read_csv(DATA_PATH)

print(f"Dataset Shape : {df.shape}")

# =========================================================
# FEATURES / LABELS
# =========================================================

X = df.drop(columns=["Sample_ID", "Polymer"]).values

y = df["Polymer"].values

groups = df["Sample_ID"]

print(f"Feature Shape : {X.shape}")
print(f"Classes       : {sorted(set(y))}\n")

# =========================================================
# LABEL ENCODING
# =========================================================

le = LabelEncoder()

y = le.fit_transform(y)

joblib.dump(le, "models/label_encoder_2ndMay_Pre.pkl")

print("Label Encoder Saved")

# =========================================================
# GROUP SPLIT
# =========================================================

gss = GroupShuffleSplit(test_size=0.2, n_splits=1, random_state=42)

train_idx, test_idx = next(gss.split(X, y, groups))

X_train, X_test = X[train_idx], X[test_idx]

y_train, y_test = y[train_idx], y[test_idx]

train_ids = set(groups.iloc[train_idx])

test_ids = set(groups.iloc[test_idx])

print(
    f"Overlap Between Train/Test (should be 0): {len(train_ids.intersection(test_ids))}"
)

print(f"Train Samples : {len(X_train)}")
print(f"Test Samples  : {len(X_test)}\n")

# =========================================================
# DATALOADERS
# =========================================================

train_loader = DataLoader(
    FTIRDataset(X_train, y_train), batch_size=BATCH_SIZE, shuffle=True
)

test_loader = DataLoader(
    FTIRDataset(X_test, y_test), batch_size=BATCH_SIZE, shuffle=False
)

# =========================================================
# MODEL
# =========================================================

model = FTIRCNN(input_size=X.shape[1], num_classes=len(le.classes_)).to(device)

print("===================================")
print("Model Initialized")
print("===================================\n")

# =========================================================
# LOSS FUNCTION
# =========================================================

criterion = nn.CrossEntropyLoss(label_smoothing=0.1)

# =========================================================
# OPTIMIZER
# =========================================================

optimizer = optim.Adam(model.parameters(), lr=LR, weight_decay=1e-4)

# =========================================================
# TRAINING
# =========================================================

print("===================================")
print("TRAINING STARTED")
print("===================================\n")

best_acc = 0

for epoch in range(EPOCHS):
    loss = train_one_epoch(model, train_loader, optimizer, criterion, device)

    acc = evaluate(model, test_loader, device)

    print(f"Epoch {epoch + 1}/{EPOCHS} | Loss: {loss:.4f} | Test Acc: {acc:.4f}")

    # =====================================================
    # SAVE BEST MODEL
    # =====================================================

    if acc > best_acc:
        best_acc = acc

        torch.save(
            {
                "model_state_dict": model.state_dict(),
                "input_size": X.shape[1],
                "classes": le.classes_.tolist(),
            },
            "models/base_cnn.pth",
        )

        print("Best model updated")

# =========================================================
# FINAL EVALUATION
# =========================================================

print("\n===================================")
print("FINAL EVALUATION")
print("===================================\n")

model.eval()

y_pred = []
y_true = []

with torch.no_grad():
    for xb, yb in test_loader:
        xb = xb.to(device)

        preds = model(xb)

        _, predicted = torch.max(preds, 1)

        y_pred.extend(predicted.cpu().numpy())

        y_true.extend(yb.numpy())

# =========================================================
# CLASSIFICATION REPORT
# =========================================================

report = classification_report(y_true, y_pred, target_names=le.classes_)

print("\n=== Classification Report ===\n")
print(report)

with open("results/classification_report_cnn_7thMay_Pre.txt", "w") as f:
    f.write(report)

# =========================================================
# CONFUSION MATRIX
# =========================================================

cm = confusion_matrix(y_true, y_pred)

plt.figure(figsize=(10, 8))

sns.heatmap(cm, annot=True, fmt="d", xticklabels=le.classes_, yticklabels=le.classes_)

plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("CNN Confusion Matrix")

plt.tight_layout()

plt.savefig("results/confusion_matrix_cnn_7thMayPre.png")

plt.close()

# =========================================================
# DONE
# =========================================================

print("\n===================================")
print("Base CNN Training Complete")
print(f"Best Accuracy : {best_acc:.4f}")
print("Best Model Saved:")
print("models/base_cnn.pth")
print("===================================\n")
