import pandas as pd
import json
import sys
import os

def validate_data():
    print("Running data validation...")
    df = pd.read_csv(
        "data/processed/processed_features.csv"
    )

    errors = []

    # Check 1: No nulls in key columns
    key_cols = ['amt', 'age', 'city_pop']
    for col in key_cols:
        if col in df.columns:
            nulls = df[col].isnull().sum()
            if nulls > 0:
                errors.append(
                    f"Column '{col}' has {nulls} nulls"
                )

    # Check 2: Dataset has enough rows
    if len(df) < 1000:
        errors.append(
            f"Too few rows: {len(df)}"
        )

    # Check 3: amt should not be all zeros
    if 'amt' in df.columns:
        if df['amt'].std() == 0:
            errors.append("amt column has no variance")

    # Check 4: Required columns exist
    required = ['amt', 'age', 'city_pop',
                'merchant', 'category']
    for col in required:
        if col not in df.columns:
            errors.append(
                f"Missing column: {col}"
            )

    if errors:
        print("VALIDATION FAILED:")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)
    else:
        print(f"Validation passed!")
        print(f"Rows: {len(df)}")
        print(f"Columns: {len(df.columns)}")

        os.makedirs("data", exist_ok=True)
        summary = {
            "status": "passed",
            "rows": len(df),
            "columns": len(df.columns),
            "checks_passed": 4
        }
        with open("data/validation_report.json","w") as f:
            json.dump(summary, f, indent=2)
        print("Report saved!")

if __name__ == "__main__":
    validate_data()