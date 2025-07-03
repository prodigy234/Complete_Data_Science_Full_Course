import streamlit as st
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

st.set_page_config(page_title="2023 Nigerian Presidential Election Analysis", layout="wide")

st.title("🗳️ 2023 Nigerian Presidential Election Analysis (Using NumPy)")

# -----------------------------
# Data Ingestion and Preprocessing
# -----------------------------

data = [
    ["Abia", 8154, 22236, 327095, 1322],
    ["Adamawa", 182881, 417611, 105648, 8006],
    ["Akwa Ibom", 160620, 214012, 132683, 7381],
    ["Anambra", 5566, 9032, 584621, 1783],
    ["Bauchi", 316694, 426607, 27260, 72087],
    ["Bayelsa", 42572, 68818, 49975, 5401],
    ["Benue", 310468, 130081, 308372, 4128],
    ["Borno", 252282, 19031, 7471, 42838],
    ["Cross River", 130520, 95150, 17921, 1233],
    ["Delta", 90539, 161600, 341866, 3046],
    ["Ebonyi", 4202, 13240, 259738, 674],
    ["Edo", 144471, 89868, 331163, 2855],
    ["Ekiti", 201494, 89554, 111397, 2644],
    ["Enugu", 4772, 15749, 428640, 1808],
    ["FCT", 90414, 74649, 281717, 4240],
    ["Gombe", 146977, 319123, 26160, 10248],
    ["Imo", 6641, 30457, 360495, 1322],
    ["Jigawa", 421390, 386587, 18810, 98134],
    ["Kaduna", 399293, 55436, 294494, 92447],
    ["Kano", 517341, 131716, 28513, 997279],
    ["Katsina", 482283, 61976, 6376, 69866],
    ["Kebbi", 248088, 285175, 10865, 96541],
    ["Kogi", 240751, 145104, 56217, 4372],
    ["Kwara", 263572, 136909, 31186, 3141],
    ["Lagos", 572606, 75750, 582454, 8442],
    ["Nasarawa", 172922, 147093, 191361, 12515],
    ["Niger", 375183, 284898, 26512, 21336],
    ["Ogun", 341554, 123831, 85229, 2000],
    ["Ondo", 369924, 115463, 47728, 9302],
    ["Osun", 343945, 354498, 233, 713],
    ["Oyo", 449884, 182977, 99141, 4211],
    ["Plateau", 307195, 243808, 466807, 8180],
    ["Rivers", 231591, 88468, 175071, 13297],
    ["Sokoto", 285444, 288679, 6876, 95702],
    ["Taraba", 135165, 189017, 14661, 12482],
    ["Yobe", 151459, 198567, 2581, 18143],
    ["Zamfara", 298396, 193978, 1686, 10063]
]

columns = ["State", "APC", "PDP", "LP", "NNPP"]
df = pd.DataFrame(data, columns=columns)
votes = df.iloc[:, 1:].to_numpy()
candidates = columns[1:]
states = df["State"].values

# -----------------------------
# Total Votes per Candidate
# -----------------------------
total_votes = np.sum(votes, axis=0)

total_df = pd.DataFrame({"Candidate": candidates, "Total Votes": total_votes})
total_df_sorted = total_df.sort_values(by="Total Votes", ascending=False)

st.subheader("1️⃣ Total Votes per Candidate")
st.dataframe(total_df_sorted, use_container_width=True)

fig1, ax1 = plt.subplots()
sns.barplot(data=total_df_sorted, x="Candidate", y="Total Votes", palette="viridis", ax=ax1)
ax1.set_title("Total Votes by Candidate")
st.pyplot(fig1)

# -----------------------------
# State-by-State Winners
# -----------------------------
winner_indices = np.argmax(votes, axis=1)
winners = [candidates[i] for i in winner_indices]
df["Winner"] = winners

st.subheader("2️⃣ State-by-State Winners")
st.dataframe(df[["State", "Winner"]], use_container_width=True)

# -----------------------------
# Vote Share Percentage
# -----------------------------
total_national_votes = np.sum(total_votes)
percentages = (total_votes / total_national_votes) * 100

percent_df = pd.DataFrame({"Candidate": candidates, "Vote %": percentages})
percent_df_sorted = percent_df.sort_values(by="Vote %", ascending=False)

st.subheader("3️⃣ Vote Share Percentage")
st.dataframe(percent_df_sorted, use_container_width=True)

fig2, ax2 = plt.subplots()
sns.barplot(data=percent_df_sorted, x="Candidate", y="Vote %", palette="magma", ax=ax2)
ax2.set_title("Percentage of Votes by Candidate")
st.pyplot(fig2)

# -----------------------------
# Regional Analysis
# -----------------------------
regions = {
    "South West": ["Lagos", "Oyo", "Osun", "Ondo", "Ekiti", "Ogun"],
    "South East": ["Abia", "Anambra", "Ebonyi", "Enugu", "Imo"],
    "South South": ["Akwa Ibom", "Bayelsa", "Cross River", "Delta", "Edo", "Rivers"],
    "North Central": ["Benue", "Kogi", "Kwara", "Nasarawa", "Niger", "Plateau", "FCT"],
    "North West": ["Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Sokoto", "Zamfara"],
    "North East": ["Adamawa", "Bauchi", "Borno", "Gombe", "Taraba", "Yobe"]
}

region_votes = {region: np.sum(df[df.State.isin(states)][candidates].to_numpy(), axis=0) 
                 for region, states in regions.items()}

region_df = pd.DataFrame(region_votes, index=candidates).T

st.subheader("4️⃣ Regional Analysis")
st.dataframe(region_df)

fig3, ax3 = plt.subplots(figsize=(10, 6))
region_df.plot(kind='bar', stacked=True, ax=ax3, colormap='Accent')
plt.title("Votes per Candidate by Region")
plt.ylabel("Votes")
st.pyplot(fig3)

# -----------------------------
# Margin of Victory
# -----------------------------
margins = []
for row in votes:
    sorted_votes = np.sort(row)
    margin = sorted_votes[-1] - sorted_votes[-2]
    margins.append(margin)

df["Victory Margin"] = margins

st.subheader("5️⃣ Margin of Victory")
st.dataframe(df[["State", "Victory Margin"]].sort_values(by="Victory Margin", ascending=False), use_container_width=True)

fig4, ax4 = plt.subplots()
sns.barplot(data=df.sort_values(by="Victory Margin", ascending=False), x="Victory Margin", y="State", palette="coolwarm", ax=ax4)
ax4.set_title("States with Widest to Closest Margins")
st.pyplot(fig4)

st.markdown("""
---
## 📌 Key Insights:
- **LP** dominated in the South East and FCT.
- **APC** maintained strongholds in the North and parts of the South West.
- **NNPP** was highly dominant in **Kano**, making it a key outlier.
- Some states had extremely close results showing high electoral competitiveness.
""")