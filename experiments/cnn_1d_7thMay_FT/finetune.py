import os
import argparse
import torch
import torch.nn as nn
import torch.optim as optim
import pandas as pd
import joblib

from sklearn.preprocessing import LabelEncoder
from torch.utils.data import DataLoader

from dataset import FTIRDataset
from model import FTIRCNN
from utils import train_one_epoch, evaluate

DEVICE = "mps"

device = torch.device(DEVICE if torch.cuda.is_available() else "mps")

BASE_MODEL = "models/base_cnn.pth"
LABEL_ENCODER = "models/label_encoder_2ndMay_Pre.pkl"

BATCH_SIZE = 16
EPOCHS = 10
LR = 1e-4

os.makedirs("models/pretrained", exist_ok=True)

parser = argparse.ArgumentParser()
parser.add_argument("--file", required=True,
                    help="Path to fine-tuning CSV")
args = parser.parse_args()

print("\n===================================")
print("Loading Fine-Tuning Dataset...")
print("===================================\n")

df = pd.read_csv(args.file)

required_cols = ["Sample_ID", "Polymer"]

for col in required_cols:
    if col not in df.columns:
        raise ValueError(f"Missing column: {col}")

X = df.drop(columns=["Sample_ID", "Polymer"]).values
y = df["Polymer"].values

le = joblib.load(LABEL_ENCODER)
y = le.transform(y)

checkpoint = torch.load(BASE_MODEL, map_location=device)

input_size = checkpoint["input_size"]

if X.shape[1] != input_size:
    raise ValueError(
        f"Feature mismatch!\n"
        f"Model expects {input_size} points\n"
        f"CSV has {X.shape[1]} points"
    )

loader = DataLoader(
    FTIRDataset(X, y),
    batch_size=BATCH_SIZE,
    shuffle=True
)

model = FTIRCNN(
    input_size=input_size,
    num_classes=len(le.classes_)
).to(device)

model.load_state_dict(checkpoint["model_state_dict"])

criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=LR)

print("\n===================================")
print("Fine-Tuning Started")
print("===================================\n")

for epoch in range(EPOCHS):
    loss = train_one_epoch(
        model,
        loader,
        optimizer,
        criterion,
        device
    )

    acc = evaluate(model, loader, device)

    print(
        f"Epoch {epoch+1}/{EPOCHS} | "
        f"Loss: {loss:.4f} | "
        f"Acc: {acc:.4f}"
    )

save_path = "models/pretrained/pretrained_cnn.pth"

torch.save({
    "model_state_dict": model.state_dict(),
    "input_size": input_size,
    "classes": le.classes_.tolist()
}, save_path)

print("\n===================================")
print("✅ Fine-Tuned Model Saved")
print(save_path)
print("===================================\n")
