import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from scipy.signal import find_peaks, savgol_filter

from utils import identify_functional_group

# Load data

df = pd.read_csv("FTIR_PLASTIC_c4.csv")

df.columns = df.columns.str.strip()

# Extract x and y columns

x_cols = [col for col in df.columns if "Data(x)" in col]
y_cols = [col for col in df.columns if "Data(y)" in col]

# Convert FTIR data

processed_data = []

for _, row in df.iterrows():

    sample_id = row['IDE']
    polymer = row['Polymer']

    x_vals = row[x_cols].values.astype(float)
    y_vals = row[y_cols].values.astype(float)

    mask = (x_vals >= 600) & (x_vals <= 3930)

    x_filtered = x_vals[mask]
    y_filtered = y_vals[mask]

    idx = np.argsort(x_filtered)

    x_filtered = x_filtered[idx]
    y_filtered = y_filtered[idx]

    x_target = np.arange(600, 3930 + 2, 2)

    y_target = np.interp(x_target, x_filtered, y_filtered)

    feature_dict = {}

    for x, y in zip(x_target, y_target):

        feature_dict[f"f_{int(x)}"] = y

    new_row = {
        "Sample_ID": sample_id,
        "Polymer": polymer
    }

    new_row.update(feature_dict)

    processed_data.append(new_row)

# Create dataframe

new_df = pd.DataFrame(processed_data)

# Sort columns

cols = ["Sample_ID", "Polymer"] + sorted(
    [c for c in new_df.columns if c.startswith("f_")],
    key=lambda x: int(x.split('_')[1])
)

new_df = new_df[cols]

# Select sample

new_df = new_df.iloc[[500]]

# Prepare wavenumbers

feature_cols = new_df.columns[2:]

wavenumbers = np.array([
    int(col.split('_')[1]) for col in feature_cols
])

# Plot

fig, ax = plt.subplots(figsize=(22, 11))

for _, row in new_df.iterrows():

    sample_id = row['Sample_ID']
    polymer = row['Polymer']

    intensities = row[feature_cols].values.astype(float)

    # Smooth spectrum

    smoothed = savgol_filter(intensities, 11, 3)

    # Detect dips

    peaks, properties = find_peaks(
        -smoothed,
        prominence=0.8,
        distance=20
    )

    # Plot spectrum

    ax.plot(
        wavenumbers,
        smoothed,
        linewidth=2,
        label=f"{sample_id} ({polymer})"
    )

    # Mark peaks

    ax.scatter(
        wavenumbers[peaks],
        smoothed[peaks],
        s=50,
        zorder=5
    )

    # Important peaks

    top_peaks = peaks[np.argsort(smoothed[peaks])[:12]]

    # Label positions

    label_positions = {

        2914: (3200, 79),
        2846: (2600, 79),

        2360: (2480, 90),

        2158: (1830, 96),

        1648: (1730, 90),

        1536: (1470, 90),

        1466: (1290, 86),

        1044: (1120, 94),

        718: (700, 81)
    }

    # Add labels

    for p in top_peaks:

        wn = int(wavenumbers[p])

        fg = identify_functional_group(wn)

        if fg is None:
            continue

        label = f"{wn}\n{fg}"

        if wn in label_positions:

            tx, ty = label_positions[wn]

        else:

            tx = wn
            ty = smoothed[p] - 8

        ax.annotate(
            label,

            xy=(wn, smoothed[p]),

            xytext=(tx, ty),

            fontsize=9,

            ha='center',

            bbox=dict(
                boxstyle="round,pad=0.35",
                fc="white",
                ec="gray",
                alpha=0.95
            ),

            arrowprops=dict(
                arrowstyle='-',
                color='gray',
                lw=0.8
            )
        )

# Final graph settings

ax.invert_xaxis()

ax.set_xlabel(
    "Wavenumber (cm⁻¹)",
    fontsize=14
)

ax.set_ylabel(
    "Absorbance",
    fontsize=14
)

ax.set_title(
    "FTIR Spectrum with Peak Detection and Functional Group Identification",
    fontsize=18
)

ax.legend(fontsize=11)

ax.grid(alpha=0.2)

plt.tight_layout()

plt.show()