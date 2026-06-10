class FTIRResult:
    def __init__(
        self,
        sample_id,
        prediction,
        confidence,
        probabilities,
    ):
        self.sample_id = sample_id
        self.prediction = prediction
        self.confidence = confidence
        self.probabilities = probabilities

    def __repr__(self):
        return (
            f"FTIRResult("
            f"sample_id='{self.sample_id}', "
            f"prediction='{self.prediction}', "
            f"confidence={self.confidence:.2f}%)"
        )
