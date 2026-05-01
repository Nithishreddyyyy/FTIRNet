# ============================================
# FILE: inf1_2ndMay.py
# ============================================

import argparse
import torch
import torch.nn.functional as F
import pandas as pd
import numpy as np
import joblib

from scipy.signal import savgol_filter

from model_2ndMay import FTIRCNN

# =========================================================
# CONFIG
# =========================================================

MODEL_PATH = "models/cnn_group_split_2ndMay.pth"

ENCODER_PATH = "models/label_encoder_2ndMay.pkl"

WN_START = 600
WN_END = 1800
WN_STEP = 2

SMOOTH_WINDOW = 21
SMOOTH_POLYORDER = 3

# =========================================================
# DEVICE
# =========================================================

if torch.cuda.is_available():

    device = torch.device("cuda")

elif torch.backends.mps.is_available():

    device = torch.device("mps")

else:

    device = torch.device("cpu")

print(f"\nUsing device: {device}")

# =========================================================
# ARGUMENTS
# =========================================================

parser = argparse.ArgumentParser()

parser.add_argument(
    "--file",
    required=True,
    help="Path to FTIR CSV"
)

args = parser.parse_args()

# =========================================================
# LOAD CSV
# =========================================================

print("\n===================================")
print("Loading FTIR File...")
print("===================================")

raw_df = pd.read_csv(
    args.file,
    header=None
)

spectral_rows = []

for _, row in raw_df.iterrows():

    try:

        wn = float(row[0])
        intensity = float(row[1])

        spectral_rows.append([
            wn,
            intensity
        ])

    except:
        continue

spectral_df = pd.DataFrame(
    spectral_rows,
    columns=[
        "Wavenumber",
        "Intensity"
    ]
)

print(
    "Raw Spectral Points:",
    len(spectral_df)
)

# =========================================================
# SORT
# =========================================================

spectral_df = spectral_df.sort_values(
    "Wavenumber"
)

x = spectral_df["Wavenumber"].values

y = spectral_df["Intensity"].values

# =========================================================
# REMOVE DUPLICATES
# =========================================================

unique_x, unique_indices = np.unique(
    x,
    return_index=True
)

x = x[unique_indices]

y = y[unique_indices]

# =========================================================
# INTERPOLATE
# =========================================================

wn_grid = np.arange(
    WN_START,
    WN_END + 1,
    WN_STEP
)

y_interp = np.interp(
    wn_grid,
    x,
    y
)

# =========================================================
# TRANSMITTANCE -> ABSORBANCE
# =========================================================

y_interp = np.clip(
    y_interp,
    1e-6,
    None
)

y_interp = -np.log10(
    y_interp / 100.0
)

# =========================================================
# SMOOTH
# =========================================================

y_interp = savgol_filter(
    y_interp,
    window_length=SMOOTH_WINDOW,
    polyorder=SMOOTH_POLYORDER
)

# =========================================================
# MIN-MAX NORMALIZATION
# =========================================================

y_min = np.min(y_interp)

y_max = np.max(y_interp)

y_interp = (
    y_interp - y_min
) / (y_max - y_min + 1e-8)

# =========================================================
# TENSOR
# =========================================================

X = y_interp.astype(np.float32)

X_tensor = torch.tensor(X)\
    .unsqueeze(0)\
    .unsqueeze(0)\
    .to(device)

print(
    "Final Input Shape:",
    X_tensor.shape
)

# =========================================================
# LABELS
# =========================================================

le = joblib.load(
    ENCODER_PATH
)

# =========================================================
# MODEL
# =========================================================

model = FTIRCNN(
    input_size=len(X),
    num_classes=len(le.classes_)
).to(device)

model.load_state_dict(
    torch.load(
        MODEL_PATH,
        map_location=device
    )
)

model.eval()

# =========================================================
# PREDICT
# =========================================================

with torch.no_grad():

    outputs = model(X_tensor)

    probs = F.softmax(
        outputs,
        dim=1
    )

    confs, preds = torch.max(
        probs,
        1
    )

predicted_label = le.inverse_transform(
    preds.cpu().numpy()
)[0]

confidence = confs.item()

# =========================================================
# OUTPUT
# =========================================================

print("\n===================================")
print("FTIR INFERENCE RESULT")
print("===================================\n")

print(
    f"Predicted Polymer : {predicted_label}"
)

print(
    f"Confidence        : {confidence*100:.2f}%"
)

if confidence < 0.80:

    print(
        "\n⚠️ Low confidence prediction"
    )

print("\nClass Probabilities:\n")

all_probs = probs.cpu().numpy()[0]

for cls, prob in zip(
    le.classes_,
    all_probs
):

    print(
        f"{cls:<10} : {prob*100:.2f}%"
    )

print("\n===================================")
