import json
import os
import sys

# Add the backend directory to sys.path so we can import app modules
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)
sys.path.append(backend_dir)

from app.core.database import SessionLocal, Base, engine
from app.models.user import CollegeCutoff, College

Base.metadata.create_all(bind=engine)
db = SessionLocal()

print("Loading data from JSON...")
with open(os.path.join(backend_dir, '..', 'data', 'tnea_cutoff_data_full.json'), 'r') as f:
    data = json.load(f)

print(f"Loaded {len(data)} records. Inserting into Database...")

count = 0
for row in data:
    cutoff = CollegeCutoff(
        college_code=int(row.get('code', 0)) if row.get('code') else 0,
        college_name=row.get('college', ''),
        branch_name=row.get('branch', ''),
        district='',
        category='OC',
        cutoff_2025=float(row.get('OC', 0)) if row.get('OC') and row.get('OC') != '-' else None,
        cutoff_2024=float(row.get('OC', 0)) if row.get('OC') and row.get('OC') != '-' else None
    )
    db.add(cutoff)
    
    # Also add BC, MBC etc. rows if we wanted a full mapping, but for now we'll just insert OC to get the predictor working
    count += 1
    if count % 1000 == 0:
        db.commit()
        print(f"Inserted {count} records...")

db.commit()
print("Migration Complete!")
db.close()
