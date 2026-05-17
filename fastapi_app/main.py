from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from prometheus_fastapi_instrumentator import Instrumentator
import joblib
import pandas as pd
import os

app = FastAPI(title="Fraud Detection API", version="1.0.0")

# Prometheus metrics
Instrumentator().instrument(app).expose(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None
feature_columns = None
scaler = None
numerical_features = None

@app.on_event("startup")
def load_model():
    global model, feature_columns, scaler, numerical_features
    if os.path.exists("models/fraud_model.pkl"):
        model = joblib.load("models/fraud_model.pkl")
        feature_columns = joblib.load("models/feature_columns.pkl")
        scaler = joblib.load("models/scaler.pkl")
        numerical_features = joblib.load(
            "models/numerical_features.pkl"
        )
        print("Model and scaler loaded!")
    else:
        print("No model found.")

class Transaction(BaseModel):
    amt: float = 70.0
    city_pop: float = 89057.0
    lat: float = 38.5
    long: float = -90.2
    merch_lat: float = 38.5
    merch_long: float = -90.2
    unix_time: float = 1344905832.0
    age: int = 52
    merchant: float = 100.0
    category: float = 5.0
    gender: float = 1.0
    city: float = 200.0
    state: float = 10.0
    zip: float = 50000.0
    job: float = 150.0
    transaction_hour: int = 14
    transaction_day: int = 15
    transaction_month: int = 6
    transaction_year: int = 2023
    transaction_dayofweek: int = 2
    weekend_transaction: int = 0
    night_transaction: int = 0
    high_amount_flag: int = 0
    large_city_flag: int = 1

@app.get("/")
def root():
    return {"message": "Fraud Detection API", "docs": "/docs"}

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": model is not None
    }

@app.post("/predict")
def predict(transaction: Transaction):
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded."
        )

    data = pd.DataFrame([transaction.dict()])

    if scaler is not None:
        data[numerical_features] = scaler.transform(
            data[numerical_features]
        )

    for col in feature_columns:
        if col not in data.columns:
            data[col] = 0
    data = data[feature_columns]

    probability = float(model.predict_proba(data)[0][1])
    prediction = 1 if probability > 0.65 else 0
    return {
        "prediction": prediction,
        "fraud": "Yes" if prediction == 1 else "No",
        "probability": round(probability, 4),
        "confidence": f"{probability*100:.1f}%"
    }