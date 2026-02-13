#dataset.py

import torch
import numpy as np
from torch.utils.data import Dataset

class FTIRDataset(Dataset):
    def __init__(self, dataframe, label_encoder, scaler=None, fit_scaler=False):
        self.df = dataframe
        self.label_encoder = label_encoder

        self.signal_columns = [col for col in self.df.columns if "Data(y)" in col]

        X = self.df[self.signal_columns].values.astype(np.float32)

        if scaler:
            if fit_scaler:
                X = scaler.fit_transform(X)
            else:
                X = scaler.transform(X)

        self.X = X
        self.y = self.label_encoder.transform(self.df["Polymer"])

    def __len__(self):
        return len(self.X)

    def __getitem__(self, idx):
        signal = torch.tensor(self.X[idx]).unsqueeze(0)
        label = torch.tensor(self.y[idx])
        return signal, label
