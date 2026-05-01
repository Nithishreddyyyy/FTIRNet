# ============================================
# FILE: dataset_2ndMay.py
# ============================================

import torch
import numpy as np

from torch.utils.data import Dataset

# =========================================================
# DATA AUGMENTATION
# =========================================================

def augment_spectrum(x):

    # -----------------------------------------------------
    # GAUSSIAN NOISE
    # -----------------------------------------------------

    if np.random.rand() < 0.7:

        noise = np.random.normal(
            loc=0.0,
            scale=0.015,
            size=x.shape
        )

        x = x + noise

    # -----------------------------------------------------
    # RANDOM INTENSITY SCALING
    # -----------------------------------------------------

    if np.random.rand() < 0.5:

        scale = np.random.uniform(
            0.95,
            1.05
        )

        x = x * scale

    # -----------------------------------------------------
    # SMALL BASELINE SHIFT
    # -----------------------------------------------------

    if np.random.rand() < 0.5:

        shift = np.random.uniform(
            -0.03,
            0.03
        )

        x = x + shift

    return x

# =========================================================
# DATASET
# =========================================================

class FTIRDataset(Dataset):

    def __init__(self, X, y, augment=False):

        self.X = X.astype(np.float32)
        self.y = y
        self.augment = augment

    def __len__(self):

        return len(self.X)

    def __getitem__(self, idx):

        x = self.X[idx].copy()

        if self.augment:
            x = augment_spectrum(x)

        x = torch.tensor(
            x,
            dtype=torch.float32
        )

        y = torch.tensor(
            self.y[idx],
            dtype=torch.long
        )

        return x.unsqueeze(0), y
