# inf.py

import torch
import joblib
import numpy as np
import pandas as pd
import argparse

from model import FastCNN1D
import config


def get_device():
    if torch.backends.mps.is_available():
        return torch.device("mps")
    return torch.device("cpu")


class FTIRInference:
    def __init__(self):
        self.device = get_device()
        print("Using device:", self.device)

        self.label_encoder = joblib.load(config.ENCODER_PATH)
        self.scaler = joblib.load("scaler.pkl")

        self.model = FastCNN1D(num_classes=len(self.label_encoder.classes_))
        self.model.load_state_dict(
            torch.load(config.MODEL_PATH, map_location=self.device)
        )
        self.model.to(self.device)
        self.model.eval()

    def predict(self, signal_array):
        signal_array = np.array(signal_array, dtype=np.float32)

        # Check correct length
        expected_length = self.scaler.mean_.shape[0]
        if len(signal_array) != expected_length:
            raise ValueError(
                f"Input length {len(signal_array)} does not match "
                f"expected length {expected_length}"
            )

        signal_array = signal_array.reshape(1, -1)
        signal_array = self.scaler.transform(signal_array)

        signal_tensor = torch.tensor(signal_array, dtype=torch.float32)
        signal_tensor = signal_tensor.unsqueeze(1).to(self.device)

        with torch.no_grad():
            output = self.model(signal_tensor)
            probs = torch.softmax(output, dim=1)
            pred = torch.argmax(probs, dim=1).cpu().numpy()

        predicted_label = self.label_encoder.inverse_transform(pred)[0]
        confidence = probs.max().item()

        return predicted_label, confidence


def main():
    parser = argparse.ArgumentParser(description="FTIR Polymer Classification")

    parser.add_argument(
        "--data",
        nargs="+",
        type=float,
        help="Spectrum intensity values separated by space"
    )

    parser.add_argument(
        "--file",
        type=str,
        help="Path to CSV file containing Data(y) columns"
    )

    args = parser.parse_args()

    infer = FTIRInference()

    if args.data:
        signal = args.data
        polymer, confidence = infer.predict(signal)

    elif args.file:
        df = pd.read_csv(args.file)
        signal_columns = [col for col in df.columns if "Data(y)" in col]
        signal = df[signal_columns].values[0]
        polymer, confidence = infer.predict(signal)

    else:
        print("Please provide --data or --file")
        return

    print("\nPredicted Polymer:", polymer)
    print("Confidence:", round(confidence, 4))


if __name__ == "__main__":
    main()
