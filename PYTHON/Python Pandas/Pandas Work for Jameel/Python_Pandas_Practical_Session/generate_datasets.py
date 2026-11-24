"""
generate_datasets.py
Creates every practice dataset used in the notebook:
Python_Pandas_Practical_Session.ipynb

Author: Kajola Gbenga, Data Scientist & AI Engineer
All data is synthetic and created only for training purposes.
Run:  python generate_datasets.py
"""
import os
import sqlite3
import numpy as np
import pandas as pd

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "pandas_datasets")
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(2026)

FIRST = ["Adaeze", "Chinedu", "Tunde", "Ngozi", "Ibrahim", "Funke", "Emeka", "Aisha", "Segun", "Bisi",
         "Chioma", "Musa", "Kemi", "Obinna", "Hauwa", "Damilola", "Yetunde", "Uche", "Sadiq", "Folake",
         "Tobi", "Amaka", "Kunle", "Zainab", "Ifeanyi", "Temitope", "Gift", "Abdul", "Rotimi", "Nneka",
         "Femi", "Halima", "Chika", "Bayo", "Ruth", "Dayo", "Ebere", "Lanre", "Mariam", "Kelechi"]
LAST = ["Adewale", "Okafor", "Balogun", "Eze", "Bello", "Ogunleye", "Nwosu", "Abubakar", "Adeyemi", "Okonkwo",
        "Lawal", "Chukwu", "Ibrahim", "Afolabi", "Umar", "Olawale", "Nnamdi", "Salami", "Ojo", "Danjuma",
        "Akinola", "Obi", "Yusuf", "Fashola", "Ekwueme", "Aliyu", "Oladipo", "Igwe", "Sanni", "Okeke",
        "Ajayi", "Mohammed", "Onuoha", "Adebayo", "Garba", "Ogundipe", "Anyanwu", "Suleiman", "Idowu", "Ezeh"]
CITIES = ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano", "Enugu"]
DEPTS = ["Engineering", "Sales", "Marketing", "Support", "Finance", "HR", "Operations"]
DEPT_BASE = {"Engineering": 120000, "Sales": 85000, "Marketing": 80000, "Support": 62000,
             "Finance": 100000, "HR": 72000, "Operations": 78000}

# ---------------------------------------------------------------- 1. employees.csv
n = 600
combos = [(f, l) for f in FIRST for l in LAST]
pick = rng.choice(len(combos), size=n, replace=False)
names = [f"{combos[i][0]} {combos[i][1]}" for i in pick]
dept = rng.choice(DEPTS, size=n, p=[0.22, 0.2, 0.12, 0.14, 0.1, 0.07, 0.15])
level = rng.choice([0, 1, 2], size=n, p=[0.45, 0.4, 0.15])
salary = np.array([DEPT_BASE[d] for d in dept]) * (1 + 0.35 * level) * rng.normal(1, 0.08, n)
salary = np.clip(salary, 45000, 190000).round(-2)
hire = pd.to_datetime("2014-01-01") + pd.to_timedelta(rng.integers(0, 365 * 12 + 150, n), unit="D")
age = np.clip(rng.normal(34, 7, n).round(), 21, 60).astype(int)
domains = rng.choice(["gmail.com", "yahoo.com", "outlook.com", "prodigy.ng"], size=n, p=[0.4, 0.15, 0.15, 0.3])
emails = [f"{nm.split()[0].lower()}.{nm.split()[1].lower()}@{d}" for nm, d in zip(names, domains)]
phones = []
for i in range(n):
    body = f"{rng.choice(['803', '805', '806', '810', '814', '903', '908'])}{rng.integers(1000000, 9999999)}"
    style = rng.integers(0, 4)
    phones.append([f"0{body[:3]}-{body[3:6]}-{body[6:]}", f"+234 {body[:3]} {body[3:6]} {body[6:]}",
                   f"(0{body[:3]}) {body[3:]}", f"0{body}"][style])
skills_pool = ["python", "sql", "excel", "power bi", "tableau", "statistics", "cloud", "r"]
skills = ["|".join(rng.choice(skills_pool, size=rng.integers(1, 4), replace=False)) for _ in range(n)]
emp = pd.DataFrame({
    "id": [f"{i:05d}" for i in range(1, n + 1)],
    "name": names, "department": dept, "salary": salary.astype(object),
    "hire_date": hire.strftime("%Y-%m-%d"), "email": emails, "phone": phones, "age": age,
    "city": rng.choice(CITIES, size=n, p=[0.35, 0.2, 0.12, 0.12, 0.11, 0.1]),
    "is_manager": level == 2,
    "t_shirt_size": rng.choice(["Small", "Medium", "Large"], size=n, p=[0.3, 0.5, 0.2]),
    "skills": skills, "status": rng.choice(["active", "inactive"], size=n, p=[0.88, 0.12]),
})
for q in ["q1", "q2", "q3", "q4"]:
    emp[q] = np.clip(rng.normal(72, 12, n), 30, 100)
# ---- inject mess
def messy_name(s):
    r = rng.random()
    if r < 0.08: return "  " + s.lower() + " "
    if r < 0.14: return s.upper()
    if r < 0.18: return s + "  "
    return s
emp["name"] = [messy_name(s) for s in emp["name"]]
emp.loc[rng.choice(n, 18, replace=False), "department"] = np.nan
miss_idx = rng.choice(n, 45, replace=False)
tokens = ["NA", "N/A", "null", "confidential", ""]
for k, i in enumerate(miss_idx):
    emp.at[i, "salary"] = tokens[k % len(tokens)]
emp.loc[rng.choice(n, 10, replace=False), "hire_date"] = "not available"
emp.loc[rng.choice(n, 6, replace=False), "hire_date"] = np.nan
emp.loc[rng.choice(n, 20, replace=False), "email"] = np.nan
emp.loc[rng.choice(n, 15, replace=False), "age"] = np.nan
for q in ["q1", "q2", "q3", "q4"]:
    emp.loc[rng.choice(n, 25, replace=False), q] = np.nan
# 5 salary outliers (typing mistakes)
emp.loc[rng.choice(n, 3, replace=False), "salary"] = [9500000, 1200000, 8000000]
# near duplicates: same person, different id and messy casing
near = emp.sample(12, random_state=5).copy()
near["id"] = [f"{i:05d}" for i in range(n + 1, n + 13)]
near["name"] = [str(x).strip().upper() + " " for x in near["name"]]
# exact duplicates
exact = emp.sample(20, random_state=9).copy()
emp = pd.concat([emp, near, exact], ignore_index=True).sample(frac=1, random_state=3).reset_index(drop=True)
emp.to_csv(f"{OUT}/employees.csv", index=False)

# ---------------------------------------------------------------- 2. customers.csv
nc = 900
cust = pd.DataFrame({
    "customer_id": [f"C{i:04d}" for i in range(1, nc + 1)],
    "customer_name": [f"{rng.choice(FIRST)} {rng.choice(LAST)}" for _ in range(nc)],
    "signup_date": (pd.to_datetime("2023-01-01") + pd.to_timedelta(rng.integers(0, 1000, nc), unit="D")).strftime("%Y-%m-%d"),
    "segment": rng.choice(["Retail", "SME", "Corporate"], size=nc, p=[0.65, 0.25, 0.1]),
    "city": rng.choice(CITIES, size=nc),
})
cust.to_csv(f"{OUT}/customers.csv", index=False)

# ---------------------------------------------------------------- 3. orders.csv
CATS = {"Electronics": [("Smartphone", 185000), ("Laptop", 650000), ("Earbuds", 28000), ("Power Bank", 15000)],
        "Fashion": [("Ankara Dress", 22000), ("Sneakers", 35000), ("Agbada Set", 90000), ("Handbag", 25000)],
        "Groceries": [("Rice 50kg", 82000), ("Vegetable Oil 25L", 62000), ("Garri 10kg", 14000), ("Beans 25kg", 48000)],
        "Home & Kitchen": [("Blender", 32000), ("Gas Cooker", 120000), ("Standing Fan", 45000), ("Mattress", 150000)],
        "Beauty": [("Shea Butter", 6000), ("Perfume", 30000), ("Hair Dryer", 18000), ("Face Cream", 12000)],
        "Books": [("Data Science Handbook", 15000), ("Python Guide", 12000), ("Finance Basics", 9000), ("Novel", 5000)]}
REGIONS = ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano", "Enugu"]
n_orders = 2300
rows = []
seg_of = dict(zip(cust["customer_id"], cust["segment"]))             # segment lookup per customer
qty_mult = {"Retail": 1, "SME": 2, "Corporate": 4}                   # businesses buy in larger quantities
weights = 1.0 / np.arange(1, nc + 1) ** 0.7                         # Zipf-like: a few customers buy a lot, many buy once
weights = rng.permutation(weights)                                   # shuffle so activity is not tied to the id order
weights = weights / weights.sum()                                    # probabilities must add up to 1
for oid in range(1, n_orders + 1):
    date = pd.Timestamp("2025-01-01") + pd.Timedelta(days=int(rng.integers(0, 546)))
    cid = cust["customer_id"].iloc[rng.choice(nc, p=weights)]
    region = rng.choice(REGIONS)
    pay = rng.choice(["Card", "Transfer", "Cash on Delivery", "USSD"], p=[0.3, 0.4, 0.2, 0.1])
    for _ in range(rng.choice([1, 2, 3], p=[0.7, 0.22, 0.08])):
        cat = rng.choice(list(CATS))
        prod, price = CATS[cat][rng.integers(0, 4)]
        rows.append([f"ORD-{oid:06d}", date, cid, cat, prod, round(price * rng.normal(1, 0.05), -2),
                     int(rng.integers(1, 6)) * qty_mult[seg_of[cid]], region, pay, float(rng.choice([0, 0, 0, 5, 10]))])
orders = pd.DataFrame(rows, columns=["order_id", "order_date", "customer_id", "product_category", "product",
                                     "unit_price", "quantity", "region", "payment_method", "discount_pct"])
orders = orders.sort_values("order_date").reset_index(drop=True)
orders["unit_price"] = orders["unit_price"].astype(object)
bad = rng.choice(len(orders), 90, replace=False)
orders.loc[bad[:60], "unit_price"] = np.nan
orders.loc[bad[60:80], "unit_price"] = "unknown"
orders.loc[bad[80:], "unit_price"] = "N/A"
orders.loc[rng.choice(len(orders), 25, replace=False), "customer_id"] = np.nan
orders.loc[rng.choice(len(orders), 6, replace=False), "order_date"] = pd.NaT
orders["order_date"] = pd.to_datetime(orders["order_date"]).dt.strftime("%Y-%m-%d")
def messy_region(s):
    r = rng.random()
    if r < 0.1: return " " + s.lower() + " "
    if r < 0.18: return s.upper()
    if r < 0.22: return s + " "
    return s
orders["region"] = [messy_region(s) for s in orders["region"]]
orders = pd.concat([orders, orders.sample(40, random_state=2)], ignore_index=True).sample(frac=1, random_state=8)
orders = orders.sort_values("order_id", kind="stable").reset_index(drop=True)
orders.to_csv(f"{OUT}/orders.csv", index=False)

# ---------------------------------------------------------------- 4. daily_sales.csv (time series)
days = pd.date_range("2025-01-01", "2026-06-30", freq="D")
stores = {"Lagos-Ikeja": 900000, "Abuja-Wuse": 650000, "Port Harcourt-GRA": 480000}
frames = []
for s, base in stores.items():
    t = np.arange(len(days))
    season = 1 + 0.18 * (days.dayofweek >= 5) + 0.25 * (days.month.isin([11, 12])) + 0.0006 * t
    month_end = 1 + 0.15 * days.is_month_end
    sales = base * season * month_end * rng.normal(1, 0.07, len(days))
    tx = (sales / rng.normal(18000, 1500, len(days))).round().astype(int)
    frames.append(pd.DataFrame({"date": days.strftime("%Y-%m-%d"), "store": s, "sales": sales.round(0), "transactions": tx}))
ds = pd.concat(frames, ignore_index=True)
ds = ds.sort_values(["date", "store"]).reset_index(drop=True)
ds.loc[rng.choice(len(ds), 30, replace=False), "sales"] = np.nan
ds.to_csv(f"{OUT}/daily_sales.csv", index=False)

# ---------------------------------------------------------------- 5. web_traffic_hourly.csv (UTC timestamps)
hours = pd.date_range("2026-03-01", periods=24 * 14, freq="h")
visitors = (200 + 120 * np.clip(np.sin((hours.hour.to_numpy() - 8) / 24 * 2 * np.pi), 0, None) + rng.normal(0, 15, len(hours))).round().astype(int)
pd.DataFrame({"timestamp_utc": hours.strftime("%Y-%m-%d %H:%M:%S"), "visitors": visitors}).to_csv(
    f"{OUT}/web_traffic_hourly.csv", index=False)

# ---------------------------------------------------------------- 6. report.xlsx (multi-sheet, title rows above the header)
prod_lines = ["Electronics", "Fashion", "Groceries", "Home & Kitchen"]
with pd.ExcelWriter(f"{OUT}/report.xlsx", engine="openpyxl") as writer:
    for qi, q in enumerate(["Q1", "Q2", "Q3", "Q4"], start=1):
        data = pd.DataFrame([(r, p, int(rng.integers(8, 60) * 100000 * (1 + 0.05 * qi)), int(rng.integers(80, 900)),
                              int(rng.integers(10, 55) * 100000)) for r in REGIONS for p in prod_lines],
                            columns=["region", "product_line", "sales", "units", "target"])
        data.to_excel(writer, sheet_name=q, index=False, startrow=2)
        ws = writer.sheets[q]
        ws["A1"] = "Prodigy Mart Regional Sales Report"
        ws["A2"] = f"Quarter {qi}, 2026 (all figures in NGN)"
    summary = pd.DataFrame({"note": ["Prepared by Kajola Gbenga", "Data Scientist & AI Engineer"], "value": [1, 2]})
    summary.to_excel(writer, sheet_name="Summary", index=False)

# ---------------------------------------------------------------- 7. departments.xlsx
dep = pd.DataFrame({
    "department": DEPTS + ["Legal"],
    "head_of_department": ["Tunde Balogun", "Ngozi Okafor", "Kemi Lawal", "Musa Bello", "Funke Adeyemi", "Aisha Umar", "Segun Ojo", "Bisi Afolabi"],
    "annual_budget_ngn": [215_000_000, 135_000_000, 85_000_000, 100_000_000, 125_000_000, 90_000_000, 98_000_000, 75_000_000],
    "location": ["Lagos", "Lagos", "Abuja", "Ibadan", "Lagos", "Abuja", "Port Harcourt", "Abuja"],
})
dep.to_excel(f"{OUT}/departments.xlsx", sheet_name="Departments", index=False)

# ---------------------------------------------------------------- 8. salary_history.csv (different key name on purpose)
sh = []
for i in rng.choice(np.arange(1, n + 1), 450, replace=False):
    base = rng.integers(55000, 150000)
    for k, yr in enumerate([2024, 2025, 2026]):
        sh.append([f"{i:05d}", yr, int(round(base * (1.07 ** k), -2))])
sh += [["00999", 2025, 90000], ["01000", 2026, 120000]]       # ids that do not exist in employees.csv
pd.DataFrame(sh, columns=["emp_id", "year", "monthly_salary"]).to_csv(f"{OUT}/salary_history.csv", index=False)

# ---------------------------------------------------------------- 9. regional sales (long + wide) and scores wide
rs = pd.DataFrame([(r, q, p, int(rng.integers(8, 60) * 100000), int(rng.integers(50, 700)))
                   for r in REGIONS for q in ["Q1", "Q2", "Q3", "Q4"] for p in prod_lines],
                  columns=["region", "quarter", "product_line", "sales", "units"])
rs.to_csv(f"{OUT}/regional_sales.csv", index=False)
wide = rs.pivot_table(index="region", columns="quarter", values="sales", aggfunc="sum").reset_index()
wide.columns.name = None
wide.to_csv(f"{OUT}/regional_sales_wide.csv", index=False)
sc = pd.DataFrame({"student_id": [f"S{i:03d}" for i in range(1, 41)],
                   "student_name": [f"{rng.choice(FIRST)} {rng.choice(LAST)}" for _ in range(40)],
                   "score_t1": rng.integers(35, 95, 40), "score_t2": rng.integers(35, 95, 40),
                   "score_t3": rng.integers(35, 98, 40), "attendance_t1": rng.integers(60, 100, 40),
                   "attendance_t2": rng.integers(60, 100, 40), "attendance_t3": rng.integers(60, 100, 40)})
sc.to_csv(f"{OUT}/student_scores_wide.csv", index=False)

# ---------------------------------------------------------------- 10. products.json (records orientation)
prod_rows = []
pid = 1
for cat, items in CATS.items():
    for name, price in items:
        prod_rows.append({"product_id": f"P{pid:03d}", "name": name, "category": cat, "price": price,
                          "rating": round(float(rng.uniform(3.2, 4.9)), 1), "stock": int(rng.integers(0, 400))})
        pid += 1
pd.DataFrame(prod_rows).to_json(f"{OUT}/products.json", orient="records", indent=2)

# ---------------------------------------------------------------- 11. transactions_large.csv and transactions.parquet
m = 150_000
tx = pd.DataFrame({
    "txn_id": np.arange(1, m + 1),
    "timestamp": pd.Timestamp("2026-01-01") + pd.to_timedelta(rng.integers(0, 60 * 60 * 24 * 180, m), unit="s"),
    "channel": rng.choice(["POS", "Web", "Mobile App", "USSD"], size=m, p=[0.4, 0.25, 0.25, 0.1]),
    "store": rng.choice(list(stores), size=m),
    "amount": np.round(rng.gamma(2.0, 9000, m), 2),
    "currency": "NGN",
    "status": rng.choice(["success", "failed", "reversed"], size=m, p=[0.93, 0.05, 0.02]),
})
tx.loc[rng.choice(m, 3000, replace=False), "amount"] = 0.0
tx.loc[rng.choice(m, 1500, replace=False), "amount"] *= -1          # refunds
tx = tx.sort_values("timestamp").reset_index(drop=True)
tx.to_csv(f"{OUT}/transactions_large.csv", index=False)
tx_typed = tx.copy()
tx_typed["channel"] = tx_typed["channel"].astype("category")
tx_typed["store"] = tx_typed["store"].astype("category")
tx_typed["status"] = tx_typed["status"].astype("category")
tx_typed["txn_id"] = tx_typed["txn_id"].astype("int32")
tx_typed.to_parquet(f"{OUT}/transactions.parquet", engine="pyarrow", index=False)

# ---------------------------------------------------------------- 12. company.db (SQLite)
db_path = f"{OUT}/company.db"
if os.path.exists(db_path):
    os.remove(db_path)
con = sqlite3.connect(db_path)
emp_sql = pd.DataFrame({
    "id": [f"{i:05d}" for i in range(1, 301)],
    "name": [f"{combos[i][0]} {combos[i][1]}" for i in pick[:300]],
    "department": dept[:300], "salary": salary[:300],
    "hire_date": hire[:300].strftime("%Y-%m-%d"),
    "active": rng.choice([0, 1], size=300, p=[0.1, 0.9]),
})
emp_sql.to_sql("employees", con, index=False)
dep.rename(columns={"annual_budget_ngn": "budget"}).to_sql("departments", con, index=False)
orders.drop_duplicates().head(1500).to_sql("orders", con, index=False)
con.close()

# ---------------------------------------------------------------- 13. nigerian_states.html (two tables on one page)
zones = {
    "North Central": [("Benue", "Makurdi"), ("Kogi", "Lokoja"), ("Kwara", "Ilorin"), ("Nasarawa", "Lafia"),
                      ("Niger", "Minna"), ("Plateau", "Jos"), ("FCT", "Abuja")],
    "North East": [("Adamawa", "Yola"), ("Bauchi", "Bauchi"), ("Borno", "Maiduguri"), ("Gombe", "Gombe"),
                   ("Taraba", "Jalingo"), ("Yobe", "Damaturu")],
    "North West": [("Jigawa", "Dutse"), ("Kaduna", "Kaduna"), ("Kano", "Kano"), ("Katsina", "Katsina"),
                   ("Kebbi", "Birnin Kebbi"), ("Sokoto", "Sokoto"), ("Zamfara", "Gusau")],
    "South East": [("Abia", "Umuahia"), ("Anambra", "Awka"), ("Ebonyi", "Abakaliki"), ("Enugu", "Enugu"), ("Imo", "Owerri")],
    "South South": [("Akwa Ibom", "Uyo"), ("Bayelsa", "Yenagoa"), ("Cross River", "Calabar"), ("Delta", "Asaba"),
                    ("Edo", "Benin City"), ("Rivers", "Port Harcourt")],
    "South West": [("Ekiti", "Ado Ekiti"), ("Lagos", "Ikeja"), ("Ogun", "Abeokuta"), ("Ondo", "Akure"),
                   ("Osun", "Osogbo"), ("Oyo", "Ibadan")],
}
st = pd.DataFrame([(s, c, z) for z, lst in zones.items() for s, c in lst], columns=["State", "Capital", "Geopolitical Zone"])
zs = st.groupby("Geopolitical Zone").size().reset_index(name="Number of States")
html = ("<html><head><title>Nigerian States</title></head><body>\n<h2>States and capitals</h2>\n"
        + st.to_html(index=False) + "\n<h2>States per geopolitical zone</h2>\n" + zs.to_html(index=False)
        + "\n</body></html>")
open(f"{OUT}/nigerian_states.html", "w", encoding="utf-8").write(html)

print("Datasets written to:", OUT)
for f in sorted(os.listdir(OUT)):
    print(f"  {f:28s} {os.path.getsize(os.path.join(OUT, f)) / 1024:10.1f} KB")
