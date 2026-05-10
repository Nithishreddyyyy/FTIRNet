# ============================================
# FILE: compare_2ndMay.py
# ============================================

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from scipy.signal import savgol_filter

# =========================================================
# CONFIG
# =========================================================

TRAIN_DATASET = "../../data/processed/processed_ftir_2ndMay.csv"

REAL_FILE = "HDPE.csv"

TARGET_POLYMER = "HDPE"

WN_START = 600
WN_END = 1800
WN_STEP = 2

SMOOTH_WINDOW = 11
SMOOTH_POLYORDER = 3

# =========================================================
# LOAD TRAINING DATASET
# =========================================================

print("\n===================================")
print("Loading Processed Training Dataset")
print("===================================")

train_df = pd.read_csv(TRAIN_DATASET)

# =========================================================
# GET ONE TRAINING SAMPLE
# =========================================================

train_sample = train_df[
    train_df["Polymer"] == TARGET_POLYMER
].iloc[0]

feature_cols = []

for col in train_df.columns:

    if col.startswith("f_"):

        wn = int(col.split("_")[1])

        if 600 <= wn <= 1800:

            feature_cols.append(col)

# =========================================================
# TRAINING SPECTRUM
# =========================================================

train_spectrum = train_sample[
    feature_cols
].values.astype(np.float32)

wn_grid = np.arange(
    WN_START,
    WN_END + 1,
    WN_STEP
)

print(
    "\nTraining Spectrum Shape:",
    train_spectrum.shape
)

# =========================================================
# LOAD REAL FTIR FILE
# =========================================================

print("\n===================================")
print("Loading Real FTIR File")
print("===================================")

raw_df = pd.read_csv(
    REAL_FILE,
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
    "Real Spectral Points:",
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

real_interp = np.interp(
    wn_grid,
    x,
    y
)

# =========================================================
# TRANSMITTANCE -> ABSORBANCE
# =========================================================

real_interp = np.clip(
    real_interp,
    1e-6,
    None
)

real_interp = -np.log10(
    real_interp / 100.0
)

# =========================================================
# SMOOTHING
# =========================================================

real_interp = savgol_filter(
    real_interp,
    window_length=SMOOTH_WINDOW,
    polyorder=SMOOTH_POLYORDER
)

# =========================================================
# NORMALIZATION
# =========================================================

mean = np.mean(real_interp)

std = np.std(real_interp)

real_interp = (
    real_interp - mean
) / (std + 1e-8)

print(
    "Real Spectrum Shape:",
    real_interp.shape
)

# =========================================================
# PLOT
# =========================================================

print("\n===================================")
print("Generating Comparison Plot")
print("===================================")

plt.figure(figsize=(14, 6))

# ---------------------------------------------------------
# TRAINING SPECTRUM
# ---------------------------------------------------------

plt.plot(
    wn_grid,
    train_spectrum,
    label="Training HDPE",
    linewidth=2
)

# ---------------------------------------------------------
# REAL SPECTRUM
# ---------------------------------------------------------

plt.plot(
    wn_grid,
    real_interp,
    label="Real HDPE",
    linewidth=2
)

# ---------------------------------------------------------
# STYLE
# ---------------------------------------------------------

plt.gca().invert_xaxis()

plt.xlabel("Wavenumber (cm^-1)")

plt.ylabel("Normalized Intensity")

plt.title("Training vs Real FTIR Spectrum")

plt.legend()

plt.grid(True)

plt.tight_layout()

# =========================================================
# SAVE
# =========================================================

plt.savefig(
    "results/compare_2ndMay.png",
    dpi=300
)

plt.show()

print("\n===================================")
print("DONE")
print("===================================")

print(
    "Saved Plot:",
    "results/compare_2ndMay.png"
)
