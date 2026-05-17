# Credit Card Fraud Detection — MLOps Pipeline

End-to-end MLOps system for detecting credit card fraud.

## Live Demo
- FastAPI: http://localhost:8000/docs
- React UI: http://localhost:5173
- MLflow: http://localhost:5000

## Results
| Metric | Score |
|--------|-------|
| Accuracy | 97% |
| AUC-ROC | 0.9873 |
| Fraud Recall | 92% |

## Tech Stack
| Layer | Tool | Purpose |
|-------|------|---------|
| Data versioning | DVC | Track datasets |
| Data validation | Great Expectations | Validate data |
| Experiment tracking | MLflow | Track training runs |
| Model serving | FastAPI | REST API |
| Frontend | React + Vite | Prediction UI |
| Monitoring | Evidently AI | Drift detection |
| CI/CD | GitHub Actions | Auto test + build |
| Containers | Docker | Containerization |
| Orchestration | Kubernetes | Deployment |

## Quick Start

### 1. Clone repository
## Screenshots

### React Frontend
![React Frontend](screenshots/frontend.png)

### FastAPI Swagger Docs
![FastAPI Docs](screenshots/api-docs.png)

### MLflow Experiment Tracking
![MLflow](screenshots/mlflow.png)

### Evidently Drift Report
![Evidently Report](screenshots/evidently-report.png)

### GitHub Actions CI
![GitHub Actions](screenshots/github-actions.png)

### FastAPI Health Check
![FastAPI Health](screenshots/api-health.png)