import numpy as np
import matplotlib.pyplot as plt

# ----------------------------
# Data Initialization
# ----------------------------

# Score ranges and corresponding candidate counts
score_ranges = [
    '320 and above',
    '300–319',
    '250–299',
    '200–249',
    '160–199',
    '140–159',
    '120–139',
    '100–119',
    'Below 100'
]

candidate_counts = np.array([
    4756,    # 320 and above
    7658,    # 300–319
    73441,   # 250–299
    334560,  # 200–249
    983187,  # 160–199
    488197,  # 140–159
    57419,   # 120–139
    3820,    # 100–119
    2031     # Below 100
])

# ----------------------------
# Basic Statistics
# ----------------------------

total_candidates = candidate_counts.sum()
percentages = (candidate_counts / total_candidates) * 100

print(f"Total Candidates: {total_candidates}\n")

print("Score Range\t\tCandidates\tPercentage")
print("-" * 50)
for i in range(len(score_ranges)):
    print(f"{score_ranges[i]:<16}\t{candidate_counts[i]:>9}\t{percentages[i]:>8.2f}%")

# ----------------------------
# Visualization
# ----------------------------

# Bar Chart
plt.figure(figsize=(10, 6))
bars = plt.bar(score_ranges, candidate_counts, color='skyblue')
plt.title('JAMB 2025 UTME Score Distribution')
plt.xlabel('Score Range')
plt.ylabel('Number of Candidates')
plt.xticks(rotation=45)
plt.grid(axis='y', linestyle='--', alpha=0.7)

# Annotate bars with percentages
for bar, percentage in zip(bars, percentages):
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2.0, height, f'{percentage:.2f}%', ha='center', va='bottom')

plt.tight_layout()
plt.savefig("jamb_2025_score_distribution_bar.png")
plt.show()

# Pie Chart
plt.figure(figsize=(8, 8))
colors = plt.cm.Paired(np.linspace(0, 1, len(score_ranges)))
plt.pie(candidate_counts, labels=score_ranges, autopct='%1.1f%%', startangle=140, colors=colors)
plt.title('JAMB 2025 UTME Score Distribution')
plt.tight_layout()
plt.savefig("jamb_2025_score_distribution_pie.png")
plt.show()
