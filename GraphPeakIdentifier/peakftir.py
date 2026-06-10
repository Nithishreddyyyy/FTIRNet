import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from scipy.signal import find_peaks, savgol_filter

from utils import identify_functional_group

# Load data

df = pd.read_csv("new.csv")

df.columns = df.columns.str.strip()

# Extract feature columns (already processed in new.csv)

feature_cols = [col for col in df.columns if col.startswith("f_")]

# Use new.csv directly (no need for processing since features are already computed)

new_df = df[["Sample_ID", "Polymer"] + feature_cols].copy()

# Ensure columns are sorted properly

cols = ["Sample_ID", "Polymer"] + sorted(
    feature_cols,
    key=lambda x: int(x.split('_')[1])
)

new_df = new_df[cols]

# Select sample

new_df = new_df.iloc[[0]]

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

    # Important peaks
    top_peaks = peaks[np.argsort(smoothed[peaks])[:12]]

    # Filter top peaks to only those that have a valid functional group
    valid_peaks = []
    for p in top_peaks:
        wn = int(wavenumbers[p])
        fg = identify_functional_group(wn)
        if fg is not None:
            valid_peaks.append(p)

    # Plot spectrum
    ax.plot(
        wavenumbers,
        smoothed,
        linewidth=2,
        label=f"{sample_id} ({polymer})"
    )

    # Highlight ONLY the valid peaks with matched functional groups
    highlight_x = [wavenumbers[p] for p in valid_peaks]
    highlight_y = [smoothed[p] for p in valid_peaks]
    ax.scatter(
        highlight_x,
        highlight_y,
        s=50,
        zorder=5
    )

    # Sort valid peaks by wavenumber (left to right) to stagger close peaks correctly
    sorted_top_peaks = sorted(valid_peaks, key=lambda p: wavenumbers[p])
    
    # Calculate dynamic x-axis span for collision threshold (~6% of total span)
    x_span = np.max(wavenumbers) - np.min(wavenumbers) if len(wavenumbers) > 0 else 1.0
    collision_threshold = x_span * 0.06
    
    # Greedy interval coloring to assign staggering levels for labels
    assigned_levels = {}
    for i, p in enumerate(sorted_top_peaks):
        wn = wavenumbers[p]
        occupied = set()
        for prev_p in sorted_top_peaks[:i]:
            if abs(wavenumbers[prev_p] - wn) < collision_threshold:
                if prev_p in assigned_levels:
                    occupied.add(assigned_levels[prev_p])
        
        level = 0
        while level in occupied:
            level += 1
        assigned_levels[p] = level

    # Add labels
    for p in top_peaks:
        wn = int(wavenumbers[p])
        fg = identify_functional_group(wn)
        if fg is None:
            continue

        label = f"{wn}\n{fg}"
        
        level = assigned_levels.get(p, 0)
        y_offset = -40 - level * 35

        ax.annotate(
            label,
            xy=(wn, smoothed[p]),
            xytext=(0, y_offset),
            textcoords='offset points',
            fontsize=9,
            ha='center',
            va='top',
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
    "Transmittance",
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