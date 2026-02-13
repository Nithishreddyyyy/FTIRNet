import torch
import torch.nn as nn
import pandas as pd
import torch.optim as optim
import numpy as np
import joblib

from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split, StratifiedKFold
from torch.utils.data import DataLoader

from dataset import FTIRDataset
from model import FastCNN1D
import config

torch.manual_seed(config.SEED)


def get_device():
    if torch.backends.mps.is_available():
        return torch.device("mps")
    elif torch.cuda.is_available():
        return torch.device("cuda")
    else:
        return torch.device("cpu")


def train_epoch(model, loader, criterion, optimizer, device):
    model.train()
    total_loss = 0

    for x, y in loader:
        x, y = x.to(device), y.to(device)

        optimizer.zero_grad()
        output = model(x)
        loss = criterion(output, y)
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    return total_loss / len(loader)


def evaluate(model, loader, device):
    model.eval()
    correct = 0
    total = 0

    with torch.no_grad():
        for x, y in loader:
            x, y = x.to(device), y.to(device)
            output = model(x)
            preds = torch.argmax(output, dim=1)

            correct += (preds == y).sum().item()
            total += y.size(0)

    return correct / total


def main():
    device = get_device()
    print("Using compute device:", device)

    df = pd.read_csv("data.csv")
    df["Polymer"] = df["Polymer"].astype(str)

    # Encode labels
    label_encoder = LabelEncoder()
    label_encoder.fit(df["Polymer"])
    joblib.dump(label_encoder, config.ENCODER_PATH)


    # 60/20/20 split
    train_df, temp_df = train_test_split(
        df, test_size=0.4, stratify=df["Polymer"], random_state=42
    )

    val_df, test_df = train_test_split(
        temp_df, test_size=0.5, stratify=temp_df["Polymer"], random_state=42
    )

    print("Starting Stratified K-Fold on training set")

    skf = StratifiedKFold(
        n_splits=config.KFOLD_SPLITS,
        shuffle=True,
        random_state=42
    )

    best_model = None
    best_acc = 0

    for fold, (train_idx, val_idx) in enumerate(
        skf.split(train_df, train_df["Polymer"])
    ):

        print(f"\nFold {fold + 1}")

        fold_train = train_df.iloc[train_idx]
        fold_val = train_df.iloc[val_idx]

        # Fit scaler ONLY on training fold
        scaler = StandardScaler()

        train_dataset = FTIRDataset(
            fold_train, label_encoder, scaler, fit_scaler=True
        )

        val_dataset = FTIRDataset(
            fold_val, label_encoder, scaler, fit_scaler=False
        )

        train_loader = DataLoader(
            train_dataset,
            batch_size=config.BATCH_SIZE,
            shuffle=True
        )

        val_loader = DataLoader(
            val_dataset,
            batch_size=config.BATCH_SIZE
        )

        model = FastCNN1D(
            num_classes=len(label_encoder.classes_)
        ).to(device)

        criterion = nn.CrossEntropyLoss()
        optimizer = optim.Adam(model.parameters(), lr=config.LR)

        for epoch in range(config.EPOCHS):
            loss = train_epoch(model, train_loader, criterion, optimizer, device)
            val_acc = evaluate(model, val_loader, device)

            print(
                f"Epoch {epoch+1}: "
                f"Loss={loss:.4f} | Val Acc={val_acc:.4f}"
            )

        if val_acc > best_acc:
            best_acc = val_acc
            best_model = model.state_dict()
            joblib.dump(scaler, "scaler.pkl")

    print("\nBest Fold Validation Accuracy:", best_acc)

    # Final Test Evaluation
    test_dataset = FTIRDataset(
        test_df, label_encoder, scaler, fit_scaler=False
    )

    test_loader = DataLoader(
        test_dataset,
        batch_size=config.BATCH_SIZE
    )

    model.load_state_dict(best_model)

    test_acc = evaluate(model, test_loader, device)
    print("\nFinal Test Accuracy:", test_acc)

    torch.save(best_model, config.MODEL_PATH)


if __name__ == "__main__":
    main()
