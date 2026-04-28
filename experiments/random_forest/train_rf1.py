import os
import pandas as pd
import joblib
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.model_selection import GroupShuffleSplit

DATA_PATH = "../../data/processed/processed_ftir_26thApril.csv"

os.makedirs("models", exist_ok=True)
os.makedirs("results", exist_ok=True)


df = pd.read_csv(DATA_PATH)

X = df.drop(columns=["Sample_ID", "Polymer"])
y = df["Polymer"]

groups = df["Sample_ID"]

gss = GroupShuffleSplit(
    test_size=0.2,
    n_splits=1,
    random_state=42
)

train_idx, test_idx = next(gss.split(X, y, groups))

X_train, X_test = X.iloc[train_idx], X.iloc[test_idx]
y_train, y_test = y.iloc[train_idx], y.iloc[test_idx]

train_ids = set(df.iloc[train_idx]["Sample_ID"])
test_ids = set(df.iloc[test_idx]["Sample_ID"])

intersection = train_ids.intersection(test_ids)

print(f"Train samples: {len(train_ids)}")
print(f"Test samples: {len(test_ids)}")
print(f"Overlap (should be 0): {len(intersection)}")

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

cm = confusion_matrix(y_test, y_pred)
labels = sorted(y.unique())

plt.figure(figsize=(10, 8))
sns.heatmap(cm, annot=True, fmt="d",
            xticklabels=labels,
            yticklabels=labels)

plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix (Group Split)")

plt.tight_layout()
plt.savefig("results/confusion_matrix.png")
plt.close()

joblib.dump(model, "models/rf_group_split.pkl")

print("✅ Model saved!")

print(f"\nTrain Accuracy: {model.score(X_train, y_train):.4f}")
print(f"Test Accuracy: {model.score(X_test, y_test):.4f}")
