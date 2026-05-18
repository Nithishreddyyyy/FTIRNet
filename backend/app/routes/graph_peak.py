import io
import base64
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib
from fastapi import APIRouter, UploadFile, File, HTTPException
from scipy.signal import find_peaks, savgol_filter

# Use Agg backend for non-interactive plotting
matplotlib.use('Agg')

router = APIRouter(tags=["Graph Peak Identifier"])

functional_groups = {
    "O-H stretch": (3200, 3600),
    "O-H bend": (1300, 1450),
    "Asymmetric C-H stretch": (2910, 2960),
    "Symmetric C-H stretch": (2840, 2890),
    "CH2 bend": (1450, 1475),
    "CH3 bend": (1370, 1395),
    "CH2 rocking": (700, 750),
    "C=O stretch": (1650, 1800),
    "C=C stretch": (1600, 1680),
    "Aromatic ring": (1500, 1600),
    "C-O stretch": (1000, 1300),
    "C≡C stretch": (2100, 2260),
    "C≡N stretch": (2210, 2260),
    "Atmospheric CO₂": (2340, 2380),
    "Ester C-O": (1150, 1250),
    "Ether C-O": (1050, 1150)
}

mp_relevance = {
    "O-H stretch": "Often indicates absorbed water or surface oxidative degradation in aged microplastics.",
    "O-H bend": "Can indicate moisture or specific hydroxyl-containing polymers.",
    "Asymmetric C-H stretch": "Strong indicator of aliphatic chains, highly characteristic of Polyethylene (PE) and Polypropylene (PP).",
    "Symmetric C-H stretch": "Confirms aliphatic backbone, typical in PE and PP.",
    "CH2 bend": "Characteristic of Polyethylene (PE) indicating long alkyl chains.",
    "CH3 bend": "Characteristic of Polypropylene (PP), used to distinguish PP from PE.",
    "CH2 rocking": "Typical signature for Polyethylene (PE) indicating crystallinity (long chains >= 4 CH2).",
    "C=O stretch": "Crucial marker for Polyesters like PET, or indicates oxidative degradation (carbonyl index) in weathered microplastics.",
    "C=C stretch": "Indicates unsaturated bonds, common in Polystyrene (PS) or rubber components.",
    "Aromatic ring": "Strong indicator of Polystyrene (PS) or Polyethylene Terephthalate (PET) microplastics.",
    "C-O stretch": "Typical of esters and ethers, a primary marker for PET.",
    "C≡C stretch": "Rare in common microplastics, may indicate specific additives.",
    "C≡N stretch": "Indicates nitriles, characteristic of Polyacrylonitrile (PAN) or ABS.",
    "Ester C-O": "Specific marker for PET and other polyester-based microplastics.",
    "Ether C-O": "Indicates ether linkages, found in some polyurethanes.",
    "Atmospheric CO₂": "Background interference, usually ignored in microplastic analysis."
}

def identify_functional_group(wavenumber):
    best_match = None
    smallest_distance = float("inf")
    for group, (low, high) in functional_groups.items():
        if low <= wavenumber <= high:
            center = (low + high) / 2
            distance = abs(wavenumber - center)
            if distance < smallest_distance:
                smallest_distance = distance
                best_match = group
    return best_match

@router.post("/analyze")
async def analyze_graph_peaks(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")
    
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        df.columns = df.columns.str.strip()
        
        feature_cols = [col for col in df.columns if col.startswith("f_")]
        if not feature_cols:
            raise HTTPException(status_code=400, detail="No feature columns starting with 'f_' found.")
        
        cols = []
        if "Sample_ID" in df.columns:
            cols.append("Sample_ID")
        if "Polymer" in df.columns:
            cols.append("Polymer")
            
        cols += sorted(feature_cols, key=lambda x: int(x.split('_')[1]))
        df = df[cols]
        
        # Select first sample for the graph
        row = df.iloc[0]
        sample_id = row['Sample_ID'] if 'Sample_ID' in df.columns else 'Unknown_Sample'
        polymer = row['Polymer'] if 'Polymer' in df.columns else 'Unknown_Polymer'
        
        intensities = row[[c for c in cols if c.startswith('f_')]].values.astype(float)
        wavenumbers = np.array([int(col.split('_')[1]) for col in cols if col.startswith('f_')])
        
        # Smooth spectrum
        smoothed = savgol_filter(intensities, 11, 3)
        
        # Detect dips (peaks in inverted graph)
        peaks, _ = find_peaks(-smoothed, prominence=0.8, distance=20)
        
        # Prepare Plot
        fig, ax = plt.subplots(figsize=(14, 7))
        ax.plot(wavenumbers, smoothed, linewidth=2, color="#0369a1", label=f"{sample_id} ({polymer})")
        ax.scatter(wavenumbers[peaks], smoothed[peaks], s=50, color="#b91c1c", zorder=5)
        
        top_peaks = peaks[np.argsort(smoothed[peaks])[:12]]
        
        identified_peaks = []
        
        for p in top_peaks:
            wn = int(wavenumbers[p])
            fg = identify_functional_group(wn)
            if fg is None:
                continue
                
            relevance = mp_relevance.get(fg, "No specific microplastic relevance defined.")
            identified_peaks.append({
                "wavenumber": wn,
                "absorbance": float(smoothed[p]),
                "functional_group": fg,
                "relevance": relevance
            })
            
            label = f"{wn}\n{fg}"
            ax.annotate(
                label,
                xy=(wn, smoothed[p]),
                xytext=(wn, smoothed[p] - 5),
                fontsize=8,
                ha='center',
                bbox=dict(boxstyle="round,pad=0.3", fc="white", ec="gray", alpha=0.9),
                arrowprops=dict(arrowstyle='-', color='gray', lw=0.8)
            )

        ax.invert_xaxis()
        ax.set_xlabel("Wavenumber (cm⁻¹)", fontsize=12)
        ax.set_ylabel("Absorbance", fontsize=12)
        ax.set_title("FTIR Spectrum with Peak Detection & Microplastic Markers", fontsize=14)
        ax.legend(fontsize=10)
        ax.grid(alpha=0.2)
        plt.tight_layout()
        
        # Save plot to base64
        buf = io.BytesIO()
        plt.savefig(buf, format="png", dpi=150, bbox_inches='tight')
        buf.seek(0)
        img_base64 = base64.b64encode(buf.read()).decode("utf-8")
        plt.close(fig)
        
        # Sort identified peaks by wavenumber descending
        identified_peaks = sorted(identified_peaks, key=lambda x: x["wavenumber"], reverse=True)
        
        return {
            "status": "success",
            "sample_id": str(sample_id),
            "polymer": str(polymer),
            "image_base64": img_base64,
            "peaks": identified_peaks
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing graph: {str(e)}")
