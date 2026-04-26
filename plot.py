import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import find_peaks

DATA_PATH = "data/processed/processed_ftir_26thApril.csv"

ROW_INDICES = [0,923,1042,1628,2145,2255,2913]
PEAK_PROMINENCE = 0.05

df = pd.read_csv(DATA_PATH)

feature_cols = df.columns[2:]
wavenumbers = np.array([int(col.split("_")[1]) for col in feature_cols])

plt.figure(figsize=(12, 6))

for idx in ROW_INDICES:
    row = df.iloc[idx]
    intensity = row[feature_cols].values.astype(float)

    inverted_signal = -intensity
    peaks, _ = find_peaks(inverted_signal, prominence=PEAK_PROMINENCE)

    label = f"{row['Polymer']} ({row['Sample_ID']})"

    plt.plot(wavenumbers, intensity, label=label)
    plt.scatter(wavenumbers[peaks], intensity[peaks], s=20)

plt.gca().invert_xaxis()
plt.xlabel("Wavenumber (cm⁻¹)")
plt.ylabel("Transmittance (%)")
plt.title("FTIR Spectra")
plt.legend()
plt.grid(True)

plt.tight_layout()
plt.show()
