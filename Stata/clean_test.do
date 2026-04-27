* ==============================
* STATA TRAINING SESSION
* ==============================

* Load data
cd "C:\Users\user\Desktop\My Datasets\Clean Dashboard Data"
import excel "clean_powerbi_dataset.xlsx", sheet("Customers") firstrow clear

* Understand data
describe
summarize

* Correct analysis
tabulate Segment
tabulate Region

* Numerical analysis
summarize Age
