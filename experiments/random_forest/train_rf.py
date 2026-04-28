import os
import pandas as pd
import joblib
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix

TRAIN_PATH = "../../data/processed/processed_ftir_clean.csv"
TEST_PATH  = "../../data/processed/processed_ftir_noisy.csv"

os.makedirs("models", exist_ok=True)
os.makedirs("results", exist_ok=True)

train_df = pd.read_csv(TRAIN_PATH)
test_df = pd.read_csv(TEST_PATH)

X_train = train_df.drop(columns=["Sample_ID", "Polymer"])
y_train = train_df["Polymer"]

X_test = test_df.drop(columns=["Sample_ID", "Polymer"])
y_test = test_df["Polymer"]

model = RandomForestClassifier(
    n_estimators=300,
    max_features="sqrt",
    n_jobs=-1,
    random_state=42
)

model.fit(X_train, y_train)

y_pred = model.predict(X_test)

report = classification_report(y_test, y_pred)

print("\n=== Classification Report ===\n")
print(report)

with open("results/classification_report.txt", "w") as f:
    f.write(report)

labels = sorted(y_test.unique())

plt.figure(figsize=(10, 8))
sns.heatmap(cm, annot=True, fmt="d",
            xticklabels=labels,
            yticklabels=labels)

plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix")

plt.tight_layout()
plt.savefig("results/confusion_matrix.png")
plt.close()

joblib.dump(model, "models/rf.pkl")

print("✅ Model saved!")
print(f"\nTrain Accuracy: {model.score(X_train, y_train):.4f}")
print(f"Test Accuracy: {model.score(X_test, y_test):.4f}")
