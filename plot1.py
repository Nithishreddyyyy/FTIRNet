import pandas as pd
import numpy as np
import plotly.graph_objects as go
from scipy.signal import find_peaks

ATA_PATH = "data/processed/processed_ftir_26thApril.csv"

ROW_INDICES = [0, 1, 2, 2911, 2912, 2913]   
PEAK_PROMINENCE = 0.05    #

df = pd.read_csv(DATA_PATH)

feature_cols = df.columns[2:]
wavenumbers = np.array([int(col.split("_")[1]) for col in feature_cols])

fig = go.Figure()

for idx in ROW_INDICES:
    row = df.iloc[idx]

    polymer = row["Polymer"]
    sample_id = row["Sample_ID"]

    intensity = row[feature_cols].values.astype(float)

    inverted_signal = -intensity

    peaks, _ = find_peaks(
        inverted_signal,
        prominence=PEAK_PROMINENCE
    )

    fig.add_trace(go.Scatter(
        x=wavenumbers,
        y=intensity,
        mode='lines',
        name=f"{polymer} ({sample_id})"
    ))

    fig.add_trace(go.Scatter(
        x=wavenumbers[peaks],
        y=intensity[peaks],
        mode='markers',
        marker=dict(size=6),
        name=f"Peaks ({polymer})",
        showlegend=False
    ))

fig.update_layout(
    title="FTIR Spectra (Interactive)",
    xaxis_title="Wavenumber (cm⁻¹)",
    yaxis_title="Transmittance (%)",
    template="plotly_white",
    hovermode="closest"
)

fig.update_xaxes(autorange="reversed")

fig.show()
