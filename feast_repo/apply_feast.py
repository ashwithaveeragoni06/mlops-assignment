# feast_repo/apply_feast.py
# Run this to apply feast configuration
# Command: python feast_repo/apply_feast.py

import subprocess
import sys
import os

def apply_feast():
    print("Applying Feast feature store...")
    
    # Change to feast_repo directory
    os.chdir("feast_repo")
    
    try:
        # Try running feast apply
        result = subprocess.run(
            ["feast", "apply"],
            capture_output=True,
            text=True
        )
        print(result.stdout)
        if result.returncode == 0:
            print("Feast applied successfully!")
        else:
            print("Feast apply output:", result.stderr)
    except FileNotFoundError:
        print("Feast CLI not in PATH")
        print("Feast configuration files created successfully!")
        print("To apply: pip install feast && feast apply")
    finally:
        os.chdir("..")

if __name__ == "__main__":
    apply_feast()