# src/lineage/lineage.py
import requests
import json
from datetime import datetime
import uuid

MARQUEZ_URL = "http://localhost:5001/api/v1/lineage"
NAMESPACE = "fraud-pipeline"

def emit_event(job_name, event_type, 
               inputs=None, outputs=None):
    run_id = str(uuid.uuid4())
    
    def make_dataset(name):
        return {
            "namespace": NAMESPACE,
            "name": name,
            "facets": {}
        }
    
    event = {
        "eventType": event_type,
        "eventTime": datetime.utcnow().isoformat() + "Z",
        "run": {
            "runId": run_id,
            "facets": {}
        },
        "job": {
            "namespace": NAMESPACE,
            "name": job_name,
            "facets": {}
        },
        "inputs": [make_dataset(n) for n in (inputs or [])],
        "outputs": [make_dataset(n) for n in (outputs or [])],
        "producer": "https://github.com/ashwithaveeragoni06/mlops-assignment"
    }
    
    try:
        resp = requests.post(
            MARQUEZ_URL,
            headers={"Content-Type": "application/json"},
            data=json.dumps(event),
            timeout=5
        )
        print(f"Lineage [{event_type}] {job_name} → {resp.status_code}")
    except Exception as e:
        print(f"Marquez not running, event logged locally: {job_name} {event_type}")
    
    # Save locally even if Marquez is not running
    import os
    os.makedirs("monitoring/lineage", exist_ok=True)
    with open(f"monitoring/lineage/{job_name}_{event_type}.json", "w") as f:
        json.dump(event, f, indent=2)

if __name__ == "__main__":
    # Simulate pipeline lineage
    print("Emitting pipeline lineage events...")
    
    emit_event("data_ingestion", "START",
               inputs=["fraud_raw_data"])
    emit_event("data_ingestion", "COMPLETE",
               inputs=["fraud_raw_data"],
               outputs=["processed_features"])
    
    emit_event("data_validation", "START",
               inputs=["processed_features"])
    emit_event("data_validation", "COMPLETE",
               inputs=["processed_features"],
               outputs=["validated_features"])
    
    emit_event("model_training", "START",
               inputs=["validated_features"])
    emit_event("model_training", "COMPLETE",
               inputs=["validated_features"],
               outputs=["fraud_model"])
    
    emit_event("model_serving", "START",
               inputs=["fraud_model"])
    emit_event("model_serving", "COMPLETE",
               inputs=["fraud_model"],
               outputs=["predictions"])
    
    print("Done! Lineage events saved to monitoring/lineage/")