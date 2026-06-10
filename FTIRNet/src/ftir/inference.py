from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import torch
import torch.nn.functional as F

from .model import FTIRCNN
from .result import FTIRResult


def get_device():
    if torch.cuda.is_available():
        return torch.device("cuda")

    if torch.backends.mps.is_available():
        return torch.device("mps")

    return torch.device("cpu")


def predict(file_path, model="pretrained"):
    """
    Predict polymer class from a processed FTIR CSV.

    Parameters
    ----------
    file_path : str
        Path to processed FTIR CSV.

    model : str
        "pretrained" or "base"

    Returns
    -------
    FTIRResult
    """

    device = get_device()

    package_dir = Path(__file__).parent

    encoder_path = (
        package_dir
        / "models"
        / "label_encoder_2ndMay_Pre.pkl"
    )

    if model == "pretrained":
        model_path = (
            package_dir
            / "models"
            / "pretrained_cnn.pth"
        )

    elif model == "base":
        model_path = (
            package_dir
            / "models"
            / "base_cnn.pth"
        )

    else:
        raise ValueError(
            "model must be 'pretrained' or 'base'"
        )

    # =====================================================
    # LOAD LABEL ENCODER
    # =====================================================

    le = joblib.load(encoder_path)

    # =====================================================
    # LOAD CSV
    # =====================================================

    df = pd.read_csv(file_path)

    if len(df) == 0:
        raise ValueError("CSV contains no samples")

    # =====================================================
    # SAMPLE IDS
    # =====================================================

    if "Sample_ID" in df.columns:
        sample_ids = df["Sample_ID"].values
    else:
        sample_ids = np.arange(len(df))

    # =====================================================
    # DROP NON-FEATURE COLUMNS
    # =====================================================

    drop_cols = []

    if "Sample_ID" in df.columns:
        drop_cols.append("Sample_ID")

    if "Polymer" in df.columns:
        drop_cols.append("Polymer")

    X = (
        df.drop(columns=drop_cols)
        .values
        .astype(np.float32)
    )

    # =====================================================
    # STANDARDIZATION
    # =====================================================

    mean = X.mean(axis=1, keepdims=True)

    std = X.std(axis=1, keepdims=True) + 1e-8

    X = (X - mean) / std

    # =====================================================
    # LOAD CHECKPOINT
    # =====================================================

    checkpoint = torch.load(
        model_path,
        map_location=device,
    )

    input_size = checkpoint["input_size"]

    if X.shape[1] != input_size:
        raise ValueError(
            f"Feature mismatch.\n"
            f"Model expects {input_size} features.\n"
            f"Input contains {X.shape[1]} features."
        )

    # =====================================================
    # BUILD MODEL
    # =====================================================

    net = FTIRCNN(
        input_size=input_size,
        num_classes=len(le.classes_),
    ).to(device)

    net.load_state_dict(
        checkpoint["model_state_dict"]
    )

    net.eval()

    # =====================================================
    # INFERENCE
    # =====================================================

    X_tensor = (
        torch.tensor(
            X,
            dtype=torch.float32,
        )
        .unsqueeze(1)
        .to(device)
    )

    with torch.no_grad():
        outputs = net(X_tensor)

        probs = F.softmax(
            outputs,
            dim=1,
        )

        confs, preds = torch.max(
            probs,
            dim=1,
        )

    pred_labels = le.inverse_transform(
        preds.cpu().numpy()
    )

    conf_scores = confs.cpu().numpy()

    all_probs = probs.cpu().numpy()

    # =====================================================
    # RETURN FIRST SAMPLE
    # =====================================================

    return FTIRResult(
        sample_id=str(sample_ids[0]),
        prediction=str(pred_labels[0]),
        confidence=float(conf_scores[0] * 100),
        probabilities={
            str(cls): float(prob * 100)
            for cls, prob in zip(
                le.classes_,
                all_probs[0],
            )
        },
    )
