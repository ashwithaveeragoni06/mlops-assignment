@echo off
echo Starting FraudGuard AI MLOps System...
echo.

echo [1/5] Starting FastAPI...
start "FastAPI" cmd /k "cd /d C:\Users\ashug\Desktop\mlops-assignment && python -m uvicorn fastapi_app.main:app --reload --port 8000"

timeout /t 3

echo [2/5] Starting MLflow...
start "MLflow" cmd /k "cd /d C:\Users\ashug\Desktop\mlops-assignment && python -m mlflow ui"

timeout /t 3

echo [3/5] Starting React Frontend...
start "React" cmd /k "cd /d C:\Users\ashug\Desktop\mlops-assignment\react_frontend && npm run dev"

timeout /t 3

echo [4/5] Starting Grafana and Prometheus...
docker start grafana
docker start prometheus

timeout /t 5

echo [5/5] Opening browser...
start http://localhost:5173
start http://localhost:3001

echo.
echo ================================
echo All services started!
echo ================================
echo FastAPI:    http://localhost:8000/docs
echo React:      http://localhost:5173
echo MLflow:     http://127.0.0.1:5000
echo Grafana:    http://localhost:3001
echo Prometheus: http://localhost:9090
echo ================================
pause