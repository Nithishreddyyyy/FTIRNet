import numpy as np
import torch
from torch.utils.data import Dataset


class FTIRDataset(Dataset):
    def __init__(self, X, y):

        X = np.asarray(X, dtype=np.float32)

        # =====================================================
        # PER-SPECTRUM STANDARDIZATION
        # =====================================================

        mean = X.mean(axis=1, keepdims=True)
        std = X.std(axis=1, keepdims=True) + 1e-8

        X = (X - mean) / std

        self.X = torch.tensor(X, dtype=torch.float32)
        self.y = torch.tensor(y, dtype=torch.long)

    def __len__(self):
        return len(self.X)

    def __getitem__(self, idx):

        # Shape:
        # [1, sequence_length]

        return self.X[idx].unsqueeze(0), self.y[idx]
