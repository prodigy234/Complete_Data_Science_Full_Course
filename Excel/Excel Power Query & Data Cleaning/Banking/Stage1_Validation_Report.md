# Stage 1 Validation Report - Dirty Dataset

Prepared by Kajola Gbenga
Data Scientist & AI Engineer

File: Banking_Power_Query_Training_Dirty_Dataset.xlsx (all data synthetic and fictional)

## Result by requirement
| Check | Result |
|---|---|
| Workbook opens (openpyxl and LibreOffice) | Pass |
| Sheets | 16 (13 operational, Data_Dictionary, Dataset_Guide, Data_Quality_Issues_Register) |
| Each operational sheet has at least 2,000 data rows | Pass (range 2,130 to 3,000) |
| Headers match the specification and the Data Dictionary | Pass (checked programmatically, every column) |
| Excel tables (tbl_<SheetName>) present for Power Query import | Pass |
| Joins coherent | Pass (about 95 to 99 percent of foreign keys match before deliberate orphans and format problems) |
| Balanced and unbalanced journals | 1,168 journals: 1,024 balance, 144 do not (58 altered on purpose, the rest broken by duplicated lines) |
| Reconciliation has matched and unmatched items | Pass (2,348 statement lines match a transaction reference; 542 do not; 552 transaction references have no statement line) |
| Exact and conflicting duplicates | Pass (Customers: 62 IDs exact duplicates, 47 IDs conflicting) |
| Debit and credit rule breaches | 22 rows with both populated, 38 with neither |
| Register matches generated data | Pass (353 entries; counts come from the injection log, not estimates) |

## Rows per operational sheet
Customers 3,000 | Accounts 3,000 | Transactions 2,980 | Bank_Statement 2,980 | Branches 2,130 | Employees 2,489 | Loans 2,950 | Loan_Repayments 2,950 | Fees_and_Charges 2,980 | General_Ledger 2,989 | Chart_of_Accounts 2,158 | ATM_and_POS_Transactions 2,945 | Exchange_Rates 2,940

## Limitations to know about
- Several sheets are below 3,000 rows (the target was approximately 3,000, the minimum 2,000). Branches, Employees and Chart_of_Accounts are history tables by design.
- Excel reports 11 #N/A cells in Customers and Transactions. These are deliberate (register category: Excel error value), including copies inside duplicated rows.
- Register counts overlap: one cell can carry several issues, so do not add the counts to get a total.
- The register is an instructor answer list. Remove that sheet from the student copy.
- Balance_After_Transaction is a synthetic running balance and is not tied to Accounts.Current_Balance.
- Native Power Query connections are not embedded. M scripts will be supplied separately in later stages.
- _instructor_support holds the generator scripts and the clean (pre-dirt) data used later for the cleaned reference workbook. Do not give it to students.
