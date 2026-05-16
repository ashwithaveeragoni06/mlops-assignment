from fastapi.testclient import TestClient
import sys
import os
sys.path.insert(0, os.path.dirname(
    os.path.dirname(__file__)))

from fastapi_app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200

def test_root():
    response = client.get("/")
    assert response.status_code == 200