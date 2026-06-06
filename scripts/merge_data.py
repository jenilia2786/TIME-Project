import json
import os
import glob

data_dir = r"n:\Projects\T.I.M.E\data"
output_file = os.path.join(data_dir, "unified_tnea_data.json")

unified_data = {}

def get_or_create_college(code):
    code = str(code).strip()
    if code not in unified_data:
        unified_data[code] = {
            "college_code": code,
            "college_name": "",
            "details": {},
            "branches": {}
        }
    return unified_data[code]

# 1. Load colleges.json
colleges_path = os.path.join(data_dir, "docs", "colleges.json")
if os.path.exists(colleges_path):
    with open(colleges_path, "r", encoding="utf-8") as f:
        colleges = json.load(f)
        for c in colleges:
            code = str(c.get("college_code"))
            if not code or code == "None": continue
            college = get_or_create_college(code)
            college["college_name"] = c.get("college_name", "")
            college["details"] = {k: v for k, v in c.items() if k not in ["college_code", "college_name", "courses"]}
            
            # courses from colleges.json
            courses = c.get("courses", [])
            for course in courses:
                b_name = course.get("course_name")
                if b_name:
                    if b_name not in college["branches"]:
                        college["branches"][b_name] = {"branch_name": b_name, "cutoffs": {}}
                    # Add intake/years if available
                    for k, v in course.items():
                        if k != "course_name":
                            college["branches"][b_name][k] = v

# 2. Load tnea_master_database.json
master_db_path = os.path.join(data_dir, "tnea_master_database.json")
if os.path.exists(master_db_path):
    with open(master_db_path, "r", encoding="utf-8") as f:
        master_db = json.load(f)
        for c in master_db:
            code = str(c.get("college_code"))
            if not code or code == "None": continue
            college = get_or_create_college(code)
            if not college["college_name"]:
                college["college_name"] = c.get("college_name", "")
            
            b_name = c.get("branch_name")
            if b_name:
                if b_name not in college["branches"]:
                    college["branches"][b_name] = {"branch_name": b_name, "cutoffs": {}}
                
                college["branches"][b_name]["categories"] = c.get("categories", {})
                college["branches"][b_name]["allotted_2025"] = c.get("allotted_2025", [])
                college["branches"][b_name]["available_2025"] = c.get("available_2025", [])

# 3. Load tnea_cutoff_data_full.json
cutoff_full_path = os.path.join(data_dir, "tnea_cutoff_data_full.json")
if os.path.exists(cutoff_full_path):
    with open(cutoff_full_path, "r", encoding="utf-8") as f:
        cutoffs = json.load(f)
        for c in cutoffs:
            code = str(c.get("code"))
            if not code or code == "None": continue
            college = get_or_create_college(code)
            if not college["college_name"]:
                college["college_name"] = c.get("college", "")
            
            b_name = c.get("branch")
            if b_name:
                if b_name not in college["branches"]:
                    college["branches"][b_name] = {"branch_name": b_name, "cutoffs": {}}
                
                # Add categories OC, BC, etc.
                for cat in ["OC", "BC", "BCM", "MBC", "SC", "SCA", "ST"]:
                    if cat in c:
                        college["branches"][b_name]["cutoffs"][cat] = c[cat]

# Write unified data
print("Writing unified data to:", output_file)
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(unified_data, f, indent=2, ensure_ascii=False)

print(f"Merged {len(unified_data)} colleges into {output_file}")
