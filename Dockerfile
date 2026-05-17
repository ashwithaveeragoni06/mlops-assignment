FROM python:3.11-slim

WORKDIR /app

RUN pip install --no-cache-dir \
    fastapi \
    uvicorn \
    joblib \
    pydantic \
    pyyaml \
    --retries 10 \
    --timeout 600 \
    -i https://pypi.org/simple/

RUN pip install --no-cache-dir \
    pandas \
    numpy \
    scikit-learn \
    --retries 10 \
    --timeout 600 \
    -i https://pypi.org/simple/

COPY models/ ./models/
COPY fastapi_app/ ./fastapi_app/
COPY src/ ./src/
COPY params.yaml .

EXPOSE 8000

CMD ["uvicorn", "fastapi_app.main:app", "--host", "0.0.0.0", "--port", "8000"]
