import pandas as pd
import numpy as np
import mlflow
import mlflow.sklearn
import yaml
import json
import os
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score, f1_score,
    precision_score, recall_score,
    roc_auc_score, classification_report
)

def train():
    with open("params.yaml") as f:
        params = yaml.safe_load(f)

    mp       = params["model"]
    exp_name = params["mlflow"]["experiment_name"]
    mod_name = params["mlflow"]["model_name"]

    print("Loading data...")
    df = pd.read_csv(
        params["data"]["processed_path"]
    )

    # Target column
    target = "is_fraud"

    # Check target exists
    if target not in df.columns:
        print(f"ERROR: '{target}' column not found!")
        print(f"Columns: {df.columns.tolist()}")
        return

    X = df.drop(target, axis=1)
    y = df[target]

    print(f"Features: {X.shape}")
    print(f"Fraud rate: {y.mean()*100:.2f}%")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=mp["test_size"],
        random_state=mp["random_state"],
        stratify=y
    )

    print(f"Train: {X_train.shape}")
    print(f"Test:  {X_test.shape}")

    mlflow.set_experiment(exp_name)

    with mlflow.start_run() as run:
        print(f"MLflow Run: {run.info.run_id}")

        # Train
        model = RandomForestClassifier(
            n_estimators=mp["n_estimators"],
            max_depth=mp["max_depth"],
            random_state=mp["random_state"],
            n_jobs=-1,
            class_weight="balanced"
        )
        model.fit(X_train, y_train)

        # Evaluate
        y_pred  = model.predict(X_test)
        y_proba = model.predict_proba(X_test)[:,1]

        accuracy  = accuracy_score(y_test, y_pred)
        f1        = f1_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred)
        recall    = recall_score(y_test, y_pred)
        auc       = roc_auc_score(y_test, y_proba)

        # Log to MLflow
        mlflow.log_params(mp)
        mlflow.log_metric("accuracy",  accuracy)
        mlflow.log_metric("f1_score",  f1)
        mlflow.log_metric("precision", precision)
        mlflow.log_metric("recall",    recall)
        mlflow.log_metric("auc_roc",   auc)

        # Log model
        mlflow.sklearn.log_model(
            model, "model",
            registered_model_name=mod_name
        )

        # Save locally
        os.makedirs("models", exist_ok=True)
        joblib.dump(model, "models/fraud_model.pkl")
        joblib.dump(
            list(X_train.columns),
            "models/feature_columns.pkl"
        )

        # Save metrics
        metrics = {
            "accuracy":  round(accuracy, 4),
            "f1_score":  round(f1, 4),
            "precision": round(precision, 4),
            "recall":    round(recall, 4),
            "auc_roc":   round(auc, 4)
        }
        with open("metrics.json", "w") as f:
            json.dump(metrics, f, indent=2)

        print("\n=== RESULTS ===")
        for k, v in metrics.items():
            print(f"  {k}: {v}")
        print(classification_report(y_test, y_pred))
        print("Model saved: models/fraud_model.pkl")

if __name__ == "__main__":
    train()