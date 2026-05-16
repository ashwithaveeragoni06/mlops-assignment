import pandas as pd
import numpy as np
from evidently.report import Report
from evidently.metric_preset import DataDriftPreset
from evidently.metrics import DatasetMissingValuesMetric
import os
import json
from datetime import datetime

def generate_drift_report():
    print("Generating drift report...")

    df = pd.read_csv("data/processed/processed_features.csv")

    # Split into reference and current
    split = int(len(df) * 0.7)
    reference = df.iloc[:split]
    current = df.iloc[split:]

    # Simulate drift by adding noise
    current = current.copy()
    current["amt"] = current["amt"] * np.random.uniform(
        0.8, 1.3, len(current)
    )
    current["age"] = current["age"] * np.random.uniform(
        0.9, 1.1, len(current)
    )

    # Generate report
    report = Report(metrics=[
        DataDriftPreset(),
        DatasetMissingValuesMetric(),
    ])

    report.run(
        reference_data=reference,
        current_data=current
    )

    # Save HTML report
    os.makedirs("monitoring", exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_path = f"monitoring/drift_report_{timestamp}.html"
    report.save_html(report_path)

    print(f"Drift report saved: {report_path}")

    # Save summary
    summary = {
        "timestamp": timestamp,
        "report_path": report_path,
        "reference_rows": len(reference),
        "current_rows": len(current)
    }
    with open("monitoring/drift_summary.json", "w") as f:
        json.dump(summary, f, indent=2)

    print("Done!")
    return report_path

if __name__ == "__main__":
    generate_drift_report()