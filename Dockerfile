version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - ./models:/app/models

  mlflow:
    image: ghcr.io/mlflow/mlflow:v2.11.1
    ports:
      - "5000:5000"
    command: mlflow server --host 0.0.0.0 --port 5000

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    depends_on:
      - prometheus

  marquez:
    image: marquezproject/marquez:latest
    ports:
      - "5001:5000"
      - "5002:5001"