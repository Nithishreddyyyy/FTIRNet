import argparse
from .inference import predict


def main():
    parser = argparse.ArgumentParser(
        description="FTIR Polymer Classification"
    )

    parser.add_argument(
        "file",
        help="Processed FTIR CSV"
    )

    parser.add_argument(
        "--model",
        choices=["base", "pretrained"],
        default="pretrained"
    )

    args = parser.parse_args()

    result = predict(
        args.file,
        model=args.model
    )

    print()
    print(f"Sample ID : {result.sample_id}")
    print(f"Prediction: {result.prediction}")
    print(f"Confidence: {result.confidence:.2f}%")

    print("\nProbabilities:\n")

    for cls, prob in result.probabilities.items():
        print(f"{cls:<10}: {prob:.2f}%")
