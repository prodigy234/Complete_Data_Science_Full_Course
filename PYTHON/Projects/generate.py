import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Set seed for reproducibility
np.random.seed(42)

print("Generating super-clean QHSE Occupational Hazards dataset...")

# ==========================================
# 1. DIMENSION TABLE: SITE LOCATIONS (15 Sites)
# ==========================================
sites_data = [
    ("SITE-01", "Lagos Offshore Terminal", "South-West", "Oil & Gas", "High", 420),
    ("SITE-02", "Port Harcourt Refinery Hub", "South-South", "Petrochemical", "High", 580),
    ("SITE-03", "Warri Flowstation Alpha", "South-South", "Oil & Gas", "High", 310),
    ("SITE-04", "Ibadan Manufacturing Plant", "South-West", "Heavy Manufacturing", "Medium", 390),
    ("SITE-05", "Ogun Industrial Complex", "South-West", "Chemical Processing", "High", 450),
    ("SITE-06", "Kano Logistics & Fleet Hub", "North-West", "Supply Chain & Logistics", "Medium", 280),
    ("SITE-07", "Abuja Central Engineering Yard", "North-Central", "Construction", "Medium", 340),
    ("SITE-08", "Kaduna Fabrication Facility", "North-West", "Heavy Manufacturing", "High", 360),
    ("SITE-09", "Bonny Island LNG Terminal", "South-South", "Oil & Gas", "High", 610),
    ("SITE-10", "Calabar Marine Base", "South-South", "Maritime & Logistics", "Medium", 240),
    ("SITE-11", "Enugu Mining & Quarry Ops", "South-East", "Mining & Extraction", "High", 330),
    ("SITE-12", "Onne Deepwater Support Base", "South-South", "Oil & Gas", "High", 490),
    ("SITE-13", "Abeokuta Cement & Aggregates", "South-West", "Mining & Extraction", "High", 410),
    ("SITE-14", "Lekki Free Zone Warehouse", "South-West", "Supply Chain & Logistics", "Low", 220),
    ("SITE-15", "Uyo Gas Processing Facility", "South-South", "Petrochemical", "High", 370),
]

df_sites = pd.DataFrame(sites_data, columns=[
    "Site_ID", "Site_Name", "Region", "Industry_Sector", "Facility_Risk_Tier", "Active_Headcount"
])

# ==========================================
# 2. DIMENSION TABLE: EMPLOYEE MASTER (500 Employees)
# ==========================================
num_employees = 500
departments = ["Operations", "Maintenance", "Logistics", "Engineering", "HSE & Compliance", "Quality Assurance", "Drilling & Extraction"]
roles_map = {
    "Operations": ["Plant Operator", "Field Technician", "Process Controller"],
    "Maintenance": ["Mechanical Technician", "Electrical Engineer", "Instrumentation Tech"],
    "Logistics": ["Heavy Duty Driver", "Crane Operator", "Warehouse Specialist"],
    "Engineering": ["Structural Engineer", "Project Engineer", "Site Supervisor"],
    "HSE & Compliance": ["HSE Officer", "Safety Inspector", "Environmental Specialist"],
    "Quality Assurance": ["QA/QC Inspector", "Lab Analyst", "NDT Specialist"],
    "Drilling & Extraction": ["Roustabout", "Derrickhand", "Drilling Supervisor"]
}
shifts = ["Day Shift (06:00-18:00)", "Night Shift (18:00-06:00)", "Rotational (14/14)"]
cert_statuses = ["Valid", "Expiring Soon", "Expired"]

emp_records = []
for i in range(1, num_employees + 1):
    emp_id = f"EMP-{i:04d}"
    site_id = np.random.choice(df_sites["Site_ID"])
    dept = np.random.choice(departments, p=[0.28, 0.22, 0.15, 0.12, 0.06, 0.07, 0.10])
    role = np.random.choice(roles_map[dept])
    tenure_yrs = round(np.random.uniform(0.5, 18.0), 1)
    age = int(np.clip(np.random.normal(36, 7), 22, 62))
    shift = np.random.choice(shifts, p=[0.45, 0.30, 0.25])
    cert = np.random.choice(cert_statuses, p=[0.82, 0.12, 0.06])
    
    emp_records.append([emp_id, site_id, dept, role, age, tenure_yrs, shift, cert])

df_employees = pd.DataFrame(emp_records, columns=[
    "Employee_ID", "Assigned_Site_ID", "Department", "Job_Role", "Age", 
    "Tenure_Years", "Shift_Schedule", "Safety_Cert_Status"
])

# ==========================================
# 3. FACT TABLE 1: INCIDENT LOGS (3,500 Rows)
# ==========================================
num_incidents = 3500
start_date = datetime(2024, 1, 1)
end_date = datetime(2026, 10, 31)
total_days = (end_date - start_date).days

hazard_categories = [
    "Mechanical & Rotating Equipment", "Slips, Trips & Falls", "Chemical & Hazardous Exposure",
    "Electrical Hazard", "Working at Height", "Vehicle & Mobile Equipment",
    "Ergonomic & Manual Handling", "Thermal & Fire Hazard"
]

injury_types = {
    "First Aid Case (FAC)": ["Minor Laceration", "Abrasion / Contusion", "Minor Thermal Burn", "Eye Irritation"],
    "Medical Treatment Case (MTC)": ["Deep Laceration (Sutures)", "Chemical Splash Burn", "Sprain / Strain", "Heat Exhaustion"],
    "Restricted Work Case (RWC)": ["Lower Back Strain", "Wrist Tendonitis", "Mild Concussion", "Shoulder Dislocation"],
    "Lost Time Injury (LTI)": ["Fracture (Upper/Lower Limb)", "Severe Chemical Burn", "Crush Injury", "Electric Shock"],
    "Property Damage Only (PDO)": ["Equipment Collision", "Valve Rupture / Spill", "Structural Impact", "Electrical Short"]
}

root_causes = [
    "Inadequate PPE Usage", "Failure to Follow LOTO Procedure", "Equipment Wear & Tear",
    "Lack of Job Safety Analysis (JSA)", "Poor Housekeeping / Wet Surface", "Fatigue / Extended Shift",
    "Inadequate Supervision", "Defective Tooling / Machinery"
]

body_parts = ["Hands / Fingers", "Lower Back", "Eyes / Face", "Legs / Knees", "Arms / Shoulders", "Foot / Ankle", "Head / Neck", "Not Applicable"]

incident_records = []
for i in range(1, num_incidents + 1):
    inc_id = f"INC-{2024 + (i % 3)}-{i:05d}"
    inc_date = start_date + timedelta(days=int(np.random.randint(0, total_days)))
    inc_hour = int(np.random.choice(range(24), p=[
        0.03, 0.03, 0.04, 0.04, 0.03, 0.03, 0.04, 0.05, 0.06, 0.06, 0.06, 0.05,
        0.05, 0.06, 0.06, 0.05, 0.05, 0.04, 0.04, 0.04, 0.03, 0.02, 0.02, 0.02
    ]))
    
    emp_row = df_employees.sample(1).iloc[0]
    emp_id = emp_row["Employee_ID"]
    site_id = emp_row["Assigned_Site_ID"]
    dept = emp_row["Department"]
    
    severity = np.random.choice(
        ["First Aid Case (FAC)", "Medical Treatment Case (MTC)", "Restricted Work Case (RWC)", "Lost Time Injury (LTI)", "Property Damage Only (PDO)"],
        p=[0.42, 0.22, 0.14, 0.08, 0.14]
    )
    
    haz_cat = np.random.choice(hazard_categories)
    inj_type = np.random.choice(injury_types[severity])
    root_cause = np.random.choice(root_causes)
    
    if severity == "Property Damage Only (PDO)":
        body_part = "Not Applicable"
        lost_days = 0
        restricted_days = 0
        direct_cost = round(np.random.uniform(1200, 28000), 2)
    elif severity == "First Aid Case (FAC)":
        body_part = np.random.choice(body_parts[:-1])
        lost_days = 0
        restricted_days = 0
        direct_cost = round(np.random.uniform(50, 350), 2)
    elif severity == "Medical Treatment Case (MTC)":
        body_part = np.random.choice(body_parts[:-1])
        lost_days = 0
        restricted_days = 0
        direct_cost = round(np.random.uniform(400, 2500), 2)
    elif severity == "Restricted Work Case (RWC)":
        body_part = np.random.choice(body_parts[:-1])
        lost_days = 0
        restricted_days = int(np.random.randint(2, 15))
        direct_cost = round(np.random.uniform(1500, 6000), 2)
    else:  # LTI
        body_part = np.random.choice(body_parts[:-1])
        lost_days = int(np.random.randint(3, 65))
        restricted_days = int(np.random.randint(0, 14))
        direct_cost = round(np.random.uniform(5000, 75000), 2)
        
    is_recordable = "Yes" if severity in ["Medical Treatment Case (MTC)", "Restricted Work Case (RWC)", "Lost Time Injury (LTI)"] else "No"
    capa_status = np.random.choice(["Closed - Verified", "In Progress", "Overdue"], p=[0.78, 0.16, 0.06])
    
    incident_records.append([
        inc_id, inc_date.strftime("%Y-%m-%d"), inc_date.strftime("%Y-%m"), inc_date.strftime("%A"),
        inc_hour, site_id, emp_id, dept, haz_cat, severity, inj_type, body_part,
        root_cause, is_recordable, lost_days, restricted_days, direct_cost, capa_status
    ])

df_incidents = pd.DataFrame(incident_records, columns=[
    "Incident_ID", "Incident_Date", "Year_Month", "Day_of_Week", "Hour_of_Day",
    "Site_ID", "Employee_ID", "Department", "Hazard_Category", "Severity_Classification",
    "Specific_Injury_Outcome", "Affected_Body_Part", "Primary_Root_Cause", "OSHA_Recordable",
    "Lost_Workdays", "Restricted_Workdays", "Direct_Financial_Cost_USD", "CAPA_Status"
])

# ==========================================
# 4. FACT TABLE 2: HAZARD OBSERVATIONS & NEAR MISSES (2,500 Rows)
# ==========================================
num_obs = 2500
obs_types = ["Unsafe Act", "Unsafe Condition", "Near Miss", "Positive Safety Behavior"]
obs_records = []

for i in range(1, num_obs + 1):
    obs_id = f"OBS-{i:05d}"
    obs_date = start_date + timedelta(days=int(np.random.randint(0, total_days)))
    emp_row = df_employees.sample(1).iloc[0]
    
    obs_type = np.random.choice(obs_types, p=[0.35, 0.35, 0.18, 0.12])
    haz_cat = np.random.choice(hazard_categories)
    
    likelihood = int(np.random.randint(1, 6))
    consequence = int(np.random.randint(1, 6))
    risk_score = likelihood * consequence
    
    if risk_score >= 15:
        risk_level = "Critical"
    elif risk_score >= 8:
        risk_level = "High"
    elif risk_score >= 4:
        risk_level = "Moderate"
    else:
        risk_level = "Low"
        
    status = np.random.choice(["Closed", "Open - Action Assigned", "Escalated"], p=[0.84, 0.12, 0.04])
    days_to_close = int(np.random.randint(1, 21)) if status == "Closed" else np.nan
    
    obs_records.append([
        obs_id, obs_date.strftime("%Y-%m-%d"), obs_date.strftime("%Y-%m"),
        emp_row["Assigned_Site_ID"], emp_row["Employee_ID"], emp_row["Department"],
        obs_type, haz_cat, likelihood, consequence, risk_score, risk_level,
        status, days_to_close
    ])

df_observations = pd.DataFrame(obs_records, columns=[
    "Observation_ID", "Observation_Date", "Year_Month", "Site_ID", "Reported_By_Emp_ID",
    "Department", "Observation_Type", "Hazard_Category", "Likelihood_Score_1_5",
    "Consequence_Score_1_5", "Risk_Matrix_Score", "Risk_Rating", "Resolution_Status",
    "Days_To_Close"
])

# ==========================================
# 5. AGGREGATED TABLE: MONTHLY EXPOSURE & MAN-HOURS (510 Rows)
# ==========================================
months = pd.date_range(start="2024-01-01", end="2026-10-01", freq="MS").strftime("%Y-%m").tolist()
exposure_records = []

for _, site in df_sites.iterrows():
    for ym in months:
        # Realistic monthly hours: ~176 hrs/employee +/- seasonal variance
        hours_worked = int(site["Active_Headcount"] * np.random.uniform(168, 192))
        safety_trainings_held = int(np.random.randint(4, 18))
        toolbox_talks = int(np.random.randint(20, 31))
        safety_audits_completed = int(np.random.randint(1, 5))
        
        exposure_records.append([
            ym, site["Site_ID"], site["Site_Name"], hours_worked,
            safety_trainings_held, toolbox_talks, safety_audits_completed
        ])

df_exposure = pd.DataFrame(exposure_records, columns=[
    "Year_Month", "Site_ID", "Site_Name", "Total_Man_Hours_Worked",
    "Safety_Trainings_Conducted", "Toolbox_Talks_Held", "Internal_Audits_Completed"
])

# ==========================================
# EXPORT TO MULTI-SHEET EXCEL WORKBOOK
# ==========================================
output_filename = "QHSE_Occupational_Hazards_Master_Dataset.xlsx"

with pd.ExcelWriter(output_filename, engine="openpyxl") as writer:
    df_incidents.to_excel(writer, sheet_name="1_Incident_Logs", index=False)
    df_observations.to_excel(writer, sheet_name="2_Hazard_Observations", index=False)
    df_employees.to_excel(writer, sheet_name="3_Employee_Master", index=False)
    df_sites.to_excel(writer, sheet_name="4_Site_Locations", index=False)
    df_exposure.to_excel(writer, sheet_name="5_Monthly_Exposure_KPIs", index=False)

print(f"Success! '{output_filename}' created with {len(df_incidents) + len(df_observations) + len(df_employees) + len(df_sites) + len(df_exposure):,} total clean records.")