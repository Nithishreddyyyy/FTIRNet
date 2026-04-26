# experiments/cnn/train.py

import os
import torch
import torch.nn as nn
import torch.optim as optim
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from torch.utils.data import DataLoader

from config import *
from dataset import FTIRDataset
from model import FTIRCNN
from utils import train_one_epoch, evaluate

device = torch.device(DEVICE if torch.cuda.is_available() else "mps")

os.makedirs("models", exist_ok=True)

df = pd.read_csv(DATA_PATH)

X = df.drop(columns=["Sample_ID", "Polymer"]).values
y = df["Polymer"].values

le = LabelEncoder()
y = le.fit_transform(y)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

train_loader = DataLoader(
    FTIRDataset(X_train, y_train),
    batch_size=BATCH_SIZE,
    shuffle=True
)

test_loader = DataLoader(
    FTIRDataset(X_test, y_test),
    batch_size=BATCH_SIZE
)

model = FTIRCNN(input_size=X.shape[1], num_classes=len(le.classes_)).to(device)

criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=LR)

for epoch in range(EPOCHS):
    loss = train_one_epoch(model, train_loader, optimizer, criterion, device)
    acc = evaluate(model, test_loader, device)

    print(f"Epoch {epoch+1}/{EPOCHS} | Loss: {loss:.4f} | Test Acc: {acc:.4f}")

torch.save(model.state_dict(), "models/cnn_base.pth")

print("✅ CNN model saved!")
