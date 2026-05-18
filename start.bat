@echo off
echo Starting FraudGuard AI MLOps System...
echo.

echo [1/4] Starting FastAPI...
start "FastAPI" cmd /k "cd /d C:\Users\ashug\Desktop\mlops-assignment && python -m uvicorn fastapi_app.main:app --reload --port 8000"

timeout /t 3

echo [2/4] Starting MLflow...
start "MLflow" cmd /k "cd /d C:\Users\ashug\Desktop\mlops-assignment && python -m mlflow ui"

timeout /t 3

echo [3/4] Starting React Frontend...
start "React" cmd /k "cd /d C:\Users\ashug\Desktop\mlops-assignment\react_frontend && npm run dev"

timeout /t 5

echo [4/4] Opening browser...
start http://localhost:5173

echo.
echo All services started!
echo.
echo FastAPI:  http://localhost:8000/docs
echo React:    http://localhost:5173
echo MLflow:   http://127.0.0.1:5000
echo.
echo Starting Docker services...
docker start grafana
docker start prometheus
echo Grafana: http://localhost:3001
pause