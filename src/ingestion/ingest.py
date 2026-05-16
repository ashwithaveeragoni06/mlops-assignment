import pandas as pd
import yaml
import os

def ingest_data():
    with open("params.yaml") as f:
        params = yaml.safe_load(f)

    raw_path = params["data"]["raw_path"]
    out_path = params["data"]["processed_path"]

    print(f"Loading data from {raw_path}...")
    df = pd.read_csv(raw_path)

    print(f"Shape: {df.shape}")
    print(f"Columns: {df.columns.tolist()}")

    # Drop unnecessary columns if they exist
    cols_to_drop = ['Unnamed: 0','trans_num',
                    'cc_num','first','last','street',
                    'trans_date_trans_time','dob']
    cols_to_drop = [c for c in cols_to_drop 
                    if c in df.columns]
    df = df.drop(columns=cols_to_drop)

    # Save
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    df.to_csv(out_path, index=False)
    print(f"Saved to {out_path}")
    return df

if __name__ == "__main__":
    ingest_data()