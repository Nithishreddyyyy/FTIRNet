import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import find_peaks

DATA_PATH = "data/processed/processed_ftir_26thApril.csv"

ROW_INDEX = 0
PEAK_PROMINENCE = 0.05 

f = pd.read_csv(DATA_PATH)

row = df.iloc[ROW_INDEX]

polymer = row["Polymer"]
sample_id = row["Sample_ID"]

feature_cols = df.columns[2:]

wavenumbers = np.array([int(col.split("_")[1]) for col in feature_cols])
intensity = row[feature_cols].values.astype(float)

inverted_signal = -intensity

peaks, properties = find_peaks(
    inverted_signal,
    prominence=PEAK_PROMINENCE
)

plt.figure(figsize=(12, 6))

plt.plot(wavenumbers, intensity, label="FTIR Spectrum")

plt.scatter(
    wavenumbers[peaks],
    intensity[peaks],
    color="red",
    label="Detected Peaks",
    zorder=5
)

for p in peaks:
    plt.text(
        wavenumbers[p],
        intensity[p],
        str(wavenumbers[p]),
        fontsize=8,
        rotation=90,
        verticalalignment='bottom'
    )

plt.gca().invert_xaxis()

plt.xlabel("Wavenumber (cm⁻¹)")
plt.ylabel("Transmittance (%)")
plt.title(f"FTIR Spectrum | Polymer: {polymer} | Sample: {sample_id}")

plt.legend()
plt.grid(True)

plt.tight_layout()
plt.show()
