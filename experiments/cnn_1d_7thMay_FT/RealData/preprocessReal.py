import os
import glob
import argparse
import numpy as np
import pandas as pd

# =========================================================
# CONFIG
# =========================================================

WN_START = 600
WN_END = 3930
WN_STEP = 2

# SAME GRID USED IN TRAINING
wn_grid = np.arange(
    WN_START,
    WN_END + 1,
    WN_STEP
)

feature_cols = [f"f_{int(w)}" for w in wn_grid]

# =========================================================
# ARGUMENTS
# =========================================================

parser = argparse.ArgumentParser()

parser.add_argument(
    "--input_dir",
    required=True,
    help="Directory containing real-world FTIR CSV files"
)

parser.add_argument(
    "--output",
    default="real_world.csv",
    help="Output processed CSV"
)

args = parser.parse_args()

# =========================================================
# CREATE OUTPUT DIRECTORY
# =========================================================

output_dir = os.path.dirname(args.output)

if output_dir != "":
    os.makedirs(output_dir, exist_ok=True)

# =========================================================
# FIND FILES
# =========================================================

csv_files = glob.glob(
    os.path.join(args.input_dir, "*.csv")
)

if len(csv_files) == 0:
    raise ValueError(
        f"No CSV files found in {args.input_dir}"
    )

print("\n===================================")
print("REAL-WORLD FTIR PREPROCESSING")
print("===================================\n")

print(f"Found {len(csv_files)} CSV files\n")

processed_rows = []

# =========================================================
# PROCESS EACH FILE
# =========================================================

for file_path in csv_files:

    filename = os.path.basename(file_path)

    print(f"Processing: {filename}")

    # =========================================
    # READ RAW LINES
    # =========================================

    with open(file_path, "r") as f:
        lines = f.readlines()

    # =========================================
    # FIND START OF SPECTRAL DATA
    # =========================================

    data_start = None

    for i, line in enumerate(lines):

        first_part = line.strip().split(",")[0]

        try:
            float(first_part)
            data_start = i
            break

        except:
            continue

    if data_start is None:
        print(f"❌ Could not find spectral data in {filename}")
        continue

    # =========================================
    # LOAD SPECTRAL DATA
    # =========================================

    spectral_df = pd.read_csv(
        file_path,
        skiprows=data_start,
        header=None
    )

    spectral_df.columns = [
        "Wavenumber",
        "Intensity"
    ]

    # =========================================
    # CLEAN
    # =========================================

    spectral_df = spectral_df.dropna()

    spectral_df["Wavenumber"] = pd.to_numeric(
        spectral_df["Wavenumber"],
        errors="coerce"
    )

    spectral_df["Intensity"] = pd.to_numeric(
        spectral_df["Intensity"],
        errors="coerce"
    )

    spectral_df = spectral_df.dropna()

    # =========================================
    # SORT
    # =========================================

    spectral_df = spectral_df.sort_values(
        "Wavenumber"
    )

    x = spectral_df["Wavenumber"].values
    y = spectral_df["Intensity"].values

    # =========================================
    # REMOVE DUPLICATES
    # =========================================

    unique_x, unique_indices = np.unique(
        x,
        return_index=True
    )

    unique_y = y[unique_indices]

    # =========================================
    # INTERPOLATE TO TRAINING GRID
    # =========================================

    y_interp = np.interp(
        wn_grid,
        unique_x,
        unique_y
    )

    # =========================================
    # POLYMER LABEL
    # =========================================

    polymer = os.path.splitext(filename)[0]

    # Example:
    # HDPE.csv -> HDPE

    # =========================================
    # SAMPLE ID
    # =========================================

    sample_id = filename.replace(".csv", "")

    # =========================================
    # STORE
    # =========================================

    processed_rows.append(
        [sample_id, polymer] + list(y_interp)
    )

# =========================================================
# FINAL DATAFRAME
# =========================================================

df_final = pd.DataFrame(
    processed_rows,
    columns=["Sample_ID", "Polymer"] + feature_cols
)

# =========================================================
# SAVE
# =========================================================

df_final.to_csv(
    args.output,
    index=False
)

# =========================================================
# DONE
# =========================================================

print("\n===================================")
print("✅ REAL-WORLD PREPROCESSING COMPLETE")
print("===================================\n")

print(f"Saved To : {args.output}")
print(f"Shape    : {df_final.shape}")
print(f"Range    : {WN_START} -> {WN_END}")
print(f"Step     : {WN_STEP}")

print("\n===================================\n")
