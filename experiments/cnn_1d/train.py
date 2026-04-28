import os
import torch
import torch.nn as nn
import torch.optim as optim
import pandas as pd
import joblib
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import GroupShuffleSplit
from sklearn.metrics import classification_report, confusion_matrix
from torch.utils.data import DataLoader

from config import *
from dataset import FTIRDataset
from model import FTIRCNN
from utils import train_one_epoch, evaluate

device = torch.device(DEVICE if torch.cuda.is_available() else "mps")

os.makedirs("models", exist_ok=True)
os.makedirs("results", exist_ok=True)

df = pd.read_csv("../../data/processed/processed_ftir_26thApril.csv")

X = df.drop(columns=["Sample_ID", "Polymer"]).values
y = df["Polymer"].values
groups = df["Sample_ID"]

le = LabelEncoder()
y = le.fit_transform(y)

joblib.dump(le, "models/label_encoder.pkl")

gss = GroupShuffleSplit(test_size=0.2, n_splits=1, random_state=42)
train_idx, test_idx = next(gss.split(X, y, groups))

X_train, X_test = X[train_idx], X[test_idx]
y_train, y_test = y[train_idx], y[test_idx]

train_ids = set(groups.iloc[train_idx])
test_ids = set(groups.iloc[test_idx])
print(f"Overlap (should be 0): {len(train_ids.intersection(test_ids))}")

train_loader = DataLoader(
    FTIRDataset(X_train, y_train),
    batch_size=BATCH_SIZE,
    shuffle=True
)

test_loader = DataLoader(
    FTIRDataset(X_test, y_test),
    batch_size=BATCH_SIZE
)

model = FTIRCNN(
    input_size=X.shape[1],
    num_classes=len(le.classes_)
).to(device)

criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=LR)

for epoch in range(EPOCHS):
    loss = train_one_epoch(model, train_loader, optimizer, criterion, device)
    acc = evaluate(model, test_loader, device)
    print(f"Epoch {epoch+1}/{EPOCHS} | Loss: {loss:.4f} | Test Acc: {acc:.4f}")

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

report = classification_report(y_true, y_pred, target_names=le.classes_)

print("\n=== Classification Report ===\n")
print(report)

with open("results/classification_report_cnn.txt", "w") as f:
    f.write(report)

cm = confusion_matrix(y_true, y_pred)

plt.figure(figsize=(10, 8))
sns.heatmap(cm, annot=True, fmt="d",
            xticklabels=le.classes_,
            yticklabels=le.classes_)

plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("CNN Confusion Matrix")

plt.tight_layout()
plt.savefig("results/confusion_matrix_cnn.png")
plt.close()

torch.save(model.state_dict(), "models/cnn_group_split.pth")

print("✅ CNN model saved!")
