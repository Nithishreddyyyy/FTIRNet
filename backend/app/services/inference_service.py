"""
inference_service.py
====================
Service layer that orchestrates model inference for the SpectraVision API.

This module handles:
    - Invoking the CNN inference script (inf.py) as a subprocess.
    - Parsing the inference output and results CSV.
    - Error handling and timeout management for the inference process.
    - Logging inference metrics (timing, success/failure).

Design decisions:
    - Uses subprocess.run() with a timeout to prevent hanging processes.
    - Captures both stdout and stderr for diagnostics.
    - Parses the output CSV (out.csv) produced by inf.py for structured results.
"""

import subprocess
import time
import logging
import csv
from pathlib import Path

# Setup logger for this module
logger = logging.getLogger(__name__)

# Default timeout for inference subprocess (seconds)
INFERENCE_TIMEOUT = 120


class InferenceError(Exception):
    """Custom exception for inference failures."""
    pass


def run_inference(csv_path: Path, model_path: Path, timeout: int = INFERENCE_TIMEOUT) -> dict:
    """
    Execute the CNN inference script as a subprocess and capture results.

    This function:
        1. Runs inf.py with the provided CSV and model paths.
        2. Waits for completion (with timeout protection).
        3. Captures and logs stdout/stderr.
        4. Parses the output CSV for structured prediction results.

    Args:
        csv_path: Absolute path to the uploaded CSV file.
        model_path: Absolute path to the selected model .pth file.
        timeout: Maximum seconds to wait for inference (default: 120).

    Returns:
        dict: A dictionary containing:
            - success (bool): Whether inference completed successfully.
            - output (str): Raw stdout from the inference script.
            - error (str | None): Raw stderr if any error occurred.
            - predictions (list): List of prediction dicts with keys:
                'sample_id', 'predicted_polymer', 'confidence'.
            - return_code (int): Subprocess exit code.

    Raises:
        InferenceError: If the subprocess fails, times out, or output is missing.
    """
    # Resolve the inf.py script path
    # inf.py is located in the CNN/ directory at the project root
    # This file is at: backend/app/services/inference_service.py
    # Go up 3 levels to get backend root, then one more for project root
    backend_root = Path(__file__).resolve().parent.parent.parent
    project_root = backend_root.parent
    inf_script = project_root / "CNN" / "inf.py"

    if not inf_script.exists():
        raise InferenceError(f"Inference script not found: {inf_script}")

    # The CNN script writes its output to out.csv in its working directory
    # We run it from the CNN/ directory so relative paths work correctly
    cnn_dir = project_root / "CNN"
    out_csv_path = cnn_dir / "out.csv"

    # Remove stale output file if it exists
    if out_csv_path.exists():
        out_csv_path.unlink()

    logger.info(f"Starting inference: csv={csv_path}, model={model_path}")
    start_time = time.time()

    try:
        # Run the inference script as a subprocess
        result = subprocess.run(
            ["python3", str(inf_script), "--file", str(csv_path), "--model", str(model_path)],
            capture_output=True,
            text=True,
            timeout=timeout,
            cwd=str(cnn_dir),  # Run from CNN directory for correct relative paths
        )

        elapsed_time = time.time() - start_time
        return_code = result.returncode

        # Log the output
        logger.info(f"Inference completed in {elapsed_time:.2f}s (exit code: {return_code})")
        if result.stdout:
            logger.debug(f"Inference stdout:\n{result.stdout}")
        if result.stderr:
            logger.warning(f"Inference stderr:\n{result.stderr}")

        # Parse the output CSV if inference succeeded
        predictions = []
        if return_code == 0 and out_csv_path.exists():
            predictions = _parse_output_csv(out_csv_path)
            logger.info(f"Parsed {len(predictions)} predictions from output CSV")
        elif return_code != 0:
            raise InferenceError(
                f"Inference script failed with exit code {return_code}. "
                f"stderr: {result.stderr.strip()}"
            )

        return {
            "success": True,
            "output": result.stdout,
            "error": result.stderr if result.stderr else None,
            "predictions": predictions,
            "return_code": return_code,
            "elapsed_time_sec": round(elapsed_time, 3),
        }

    except subprocess.TimeoutExpired:
        elapsed_time = time.time() - start_time
        logger.error(f"Inference timed out after {timeout}s")
        raise InferenceError(
            f"Inference timed out after {timeout} seconds. "
            f"The model may be too large or the input file too big."
        )

    except FileNotFoundError:
        raise InferenceError(
            "python3 not found. Ensure Python 3 is installed and available on PATH."
        )

    except Exception as e:
        elapsed_time = time.time() - start_time
        logger.error(f"Inference failed after {elapsed_time:.2f}s: {e}")
        raise InferenceError(f"Unexpected error during inference: {str(e)}")


def _parse_output_csv(csv_path: Path) -> list:
    """
    Parse the output CSV generated by inf.py into a list of prediction dicts.

    The output CSV has columns: Sample_ID, Predicted_Polymer, Confidence

    Args:
        csv_path: Path to the output CSV file.

    Returns:
        list: List of dicts, each with keys 'sample_id', 'predicted_polymer', 'confidence'.
    """
    predictions = []

    with open(csv_path, "r", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            predictions.append({
                "sample_id": row.get("Sample_ID", ""),
                "predicted_polymer": row.get("Predicted_Polymer", "Unknown"),
                "confidence": round(float(row.get("Confidence", 0)), 4),
            })

    return predictions