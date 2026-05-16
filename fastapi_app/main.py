from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import os

app = FastAPI(title="Fraud Detection API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None
feature_columns = None

@app.on_event("startup")
def load_model():
    global model, feature_columns
    if os.path.exists("models/fraud_model.pkl"):
        model = joblib.load("models/fraud_model.pkl")
        feature_columns = joblib.load("models/feature_columns.pkl")
        print("Model loaded successfully!")
    else:
        print("No model found. Run training first.")

class Transaction(BaseModel):
    merchant: float = 100.0
    category: float = 5.0
    amt: float = 0.5
    gender: float = 1.0
    city: float = 200.0
    state: float = 10.0
    zip: float = 50000.0
    lat: float = 0.5
    long: float = -0.5
    city_pop: float = 0.3
    job: float = 150.0
    unix_time: float = 0.1
    merch_lat: float = 0.5
    merch_long: float = -0.5
    transaction_hour: float = 14.0
    transaction_day: float = 15.0
    transaction_month: float = 6.0
    transaction_year: float = 2023.0
    transaction_dayofweek: float = 2.0
    weekend_transaction: float = 0.0
    night_transaction: float = 0.0
    age: float = 0.2
    high_amount_flag: float = 0.0
    large_city_flag: float = 1.0

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
            detail="Model not loaded. Run training first."
        )
    data = pd.DataFrame([transaction.dict()])
    prediction = int(model.predict(data)[0])
    probability = float(model.predict_proba(data)[0][1])
    return {
        "prediction": prediction,
        "fraud": "Yes" if prediction == 1 else "No",
        "probability": round(probability, 4),
        "confidence": f"{probability*100:.1f}%"
    }