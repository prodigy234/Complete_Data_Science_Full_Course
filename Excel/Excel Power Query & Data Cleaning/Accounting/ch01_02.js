const L = require('./docx_lib.js');
const { p, h1, h2, h3, bullets, steps, table, code, warn } = L;
const { review } = require('./lesson.js');

const ch1 = [
  h1('Chapter 1: Introduction to Data Preparation in Accounting'),
  p('Accountants rarely receive data in the shape they need. A bank core system exports transactions with text dates, amounts that contain currency symbols, status labels that differ from branch to branch, and references that are sometimes missing. Before any total, ratio, reconciliation or report can be trusted, that data has to be prepared. This chapter explains what data preparation is, why it matters to accountants and auditors, and how Power Query makes the work repeatable and auditable.'),
  h2('1.1 What data preparation means'),
  p('Data preparation is the set of steps that turns data as it arrives (raw data) into data that can be analysed reliably. It includes inspecting the data, correcting or flagging faults, standardising formats and labels, combining related tables, and checking that the result still agrees with the source. It is not the same as analysis. Preparation answers the question "Can I trust this data?" and analysis answers "What does this data tell me?".'),
  h2('1.2 Why accountants need data preparation'),
  ...bullets([
    'Financial statements, reconciliations and regulatory returns are built from system extracts. A single mis-typed date or text amount can move a figure into the wrong period or drop it from a total.',
    'Auditors must be able to explain every adjustment made to data. A documented preparation process is evidence; an undocumented manual edit is a risk.',
    'Banks produce large volumes. The Transactions sheet in the training workbook has 2,980 rows; a real branch network produces millions. Manual cleaning does not scale.',
    'Month-end work repeats. A process that can be refreshed saves hours and removes human error.']),
  h2('1.3 What data quality means'),
  p('Data quality is the degree to which data is fit for its intended use. Common dimensions are listed below. Each is illustrated with a real problem from the training workbook.'),
  table(['Dimension', 'Question', 'Example in the workbook'], [
    ['Completeness', 'Is anything missing?', 'Transactions: 60 rows have no Transaction_Reference and 29 have no Transaction_Date.'],
    ['Validity', 'Is the value allowed and in the right format?', 'Transactions.Transaction_Date contains text such as "TBD" and "0", and dates such as 31/02/2026.'],
    ['Consistency', 'Is the same thing written the same way?', 'Customers.Customer_Segment holds Retail, RETAIL, retail, "Retail " and "Retail Banking" for the same segment.'],
    ['Uniqueness', 'Is each real-world item recorded once?', 'Customers: 62 Customer_IDs appear as exact duplicate rows and 47 appear with conflicting details.'],
    ['Accuracy', 'Does it reflect reality?', 'Accounts: some Current_Balance values are negative on accounts with no overdraft limit.'],
    ['Integrity', 'Do related records agree?', 'General_Ledger: 144 of 1,168 journals do not balance; Loan_Repayments contains Loan_IDs that do not exist in Loans.'],
    ['Timeliness', 'Is it current and in the right period?', 'Bank_Statement lines can post 1 to 3 days after the Transactions booking date.']], [1800, 2700, 4860]),
  h2('1.4 Why dirty data creates financial reporting risk'),
  ...bullets([
    'Understatement or overstatement: General_Ledger.Debit is stored as text in 456 rows. A SUM ignores text, so a ledger total built without cleaning silently omits those lines.',
    'Wrong period: a date such as 01/08/2025 can mean 1 August or 8 January. If it is read with the wrong convention the transaction lands in the wrong month with no error message.',
    'Broken joins: "ACC000123 " (with a trailing space) does not equal "ACC000123", so the transaction appears to belong to no account.',
    'Double counting: an exact duplicate row doubles an amount. A reused reference with a different amount is not a duplicate to delete but a conflict to investigate.',
    'Missed fraud or error indicators: if unusual records are deleted during cleaning, the audit trail loses the very items a reviewer needs to see.']),
  warn('Accounting safeguard', 'Never delete a financial record merely because it looks unusual. Flag it, keep it, and let the responsible person decide.'),
  h2('1.5 Raw, cleaned, transformed and analysis-ready data'),
  table(['State', 'Meaning', 'Example'], [
    ['Raw data', 'Exactly as received. Never edited.', 'The Transactions sheet as supplied, including text dates and duplicate rows.'],
    ['Cleaned data', 'Faults corrected or flagged; formats and labels standardised.', 'Dates converted to the Date type, statuses mapped to Successful, Failed, Pending, Cancelled, Reversed.'],
    ['Transformed data', 'Reshaped or combined for a purpose.', 'Transactions merged with Accounts and Branches; a signed amount column added.'],
    ['Analysis-ready data', 'Validated, with exceptions reported separately, ready for totals and reports.', 'A monthly transaction summary that agrees to control totals.']], [2000, 3800, 3560]),
  h2('1.6 Common banking data problems'),
  table(['Problem', 'Where to see it', 'Typical consequence'], [
    ['Numbers stored as text with symbols and separators', 'Customers.Annual_Income (544 text values such as "₦2,505,000.00" and "3.494.000,00")', 'Not summed; wrong conversion if the separator is misread'],
    ['Mixed date formats', 'Transactions.Transaction_Date (678 text dates in seven formats)', 'Wrong month or conversion errors'],
    ['Placeholders instead of blanks', 'Loans.Days_Past_Due ("N/A", "-", "Unknown", "NULL" in 88 rows)', 'Numeric conversion errors; false "zero days"'],
    ['Inconsistent labels', 'Transactions.Transaction_Status ("Success", "Completed", "successful")', 'Failed or pending items counted as successful'],
    ['Orphan and missing keys', 'Transactions.Account_ID (30 blank, 30 not in Accounts)', 'Transactions cannot be linked to a customer'],
    ['Unbalanced entries', 'General_Ledger (Journal_ID groups)', 'Trial balance does not agree']], [2900, 3700, 2760]),
  h2('1.7 Why manual cleaning is inefficient'),
  p('Filtering, find-and-replace and formulas in the worksheet all change the data in place. They are hard to review, easy to apply inconsistently, and must be repeated from the beginning every month. There is no record of what was changed or why. Manual cleaning also mixes the raw data with the corrected data, which undermines the audit trail.'),
  h2('1.8 The role of Power Query'),
  p('Power Query records each cleaning action as a step. The steps are saved with the workbook and can be replayed on new data by pressing Refresh. The source data is never modified. A reviewer can open the query, read the steps in order, and see exactly what was done. This makes data preparation repeatable (same steps every time), auditable (steps are visible) and scalable (works on larger data than a manual process can handle).'),
  h2('1.9 Real-world applications'),
  table(['Area', 'Typical use', 'Workbook sheets used'], [
    ['Finance', 'Month-end summaries, accruals support, fee income analysis', 'Transactions, Fees_and_Charges, General_Ledger'],
    ['Auditing', 'Duplicate and exception testing, journal testing, population completeness', 'General_Ledger, Chart_of_Accounts, Transactions'],
    ['Banking operations', 'Bank reconciliation, failed and reversed transaction review, ATM/POS settlement', 'Transactions, Bank_Statement, ATM_and_POS_Transactions'],
    ['Credit', 'Loan ageing, repayment monitoring, delinquency reporting', 'Loans, Loan_Repayments'],
    ['Management reporting', 'Branch and product dashboards fed from clean source tables', 'Branches, Accounts, Customers']], [1800, 4400, 3160]),
  ...review('Chapter 1 review questions', [
    'Explain the difference between cleaned data and analysis-ready data.',
    'Give two reasons why removing an exact duplicate row is safer than removing a row that merely shares a Transaction_Reference.',
    'A ledger total built with SUM ignores text values. Using the workbook, name one column where this would cause an understatement and state how many rows are affected.',
    'Why is manual cleaning of a month-end extract hard to audit?',
    'List three data-quality dimensions and give one example of each from the training workbook.'])
];

const ch2 = [
  h1('Chapter 2: Understanding Excel Power Query'),
  h2('2.1 What Power Query is'),
  p('Power Query is the data connection and preparation engine built into Excel (and also Power BI). It lets you connect to a source, apply a recorded series of transformations, and load the result to a worksheet or to the Data Model. In Excel for Windows it appears on the Data tab in the Get & Transform Data group. Behind every action you take is a script written in the Power Query M language.'),
  h2('2.2 Where it is found'),
  ...bullets([
    'Data tab > Get & Transform Data group: Get Data, From Text/CSV, From Web, From Table/Range, Recent Sources, Existing Connections.',
    'Data tab > Queries & Connections group: Refresh All, Queries & Connections, Properties.',
    'The Power Query Editor is a separate window that opens when you create or edit a query.']),
  p('Version note: Excel 2016 and earlier used a separate add-in; Excel 2019, Microsoft 365 and later include it. Menu labels and some features differ between versions. Excel for Mac supports Power Query in current Microsoft 365 builds, but the set of connectors and editor features has lagged behind Windows, so confirm availability in your version. Excel for the web has limited Power Query support. The instructions in this book are written for Excel for Windows (Microsoft 365).'),
  h2('2.3 Power Query compared with other Excel tools'),
  table(['Tool', 'What it does', 'Key difference from Power Query'], [
    ['Worksheet formulas', 'Calculate values in cells that you maintain.', 'Formulas sit beside the data and change as you edit cells. Power Query records a pipeline from the unchanged source to a result table.'],
    ['PivotTables', 'Summarise data you already have.', 'A PivotTable summarises; it does not clean. Power Query prepares the table that a PivotTable then summarises.'],
    ['VBA macros', 'Automate actions with code you write.', 'VBA needs programming skill and macro-enabled files. Power Query records steps from the interface and is easier to review.'],
    ['Power BI', 'Reporting and modelling application.', 'Uses the same Power Query engine and M language. Queries built in Excel can usually be reused there.']], [1800, 3000, 4560]),
  h2('2.4 ETL: Extract, Transform, Load'),
  table(['Stage', 'Meaning', 'Example with the workbook'], [
    ['Extract', 'Read data from a source without changing it.', 'Excel.CurrentWorkbook(){[Name="tbl_Transactions"]}[Content] reads the Transactions table.'],
    ['Transform', 'Clean, reshape and combine.', 'Trim descriptions, convert dates, flag duplicate references, merge with Accounts.'],
    ['Load', 'Write the result somewhere useful.', 'Load cln_Transactions to a worksheet table or as a connection for other queries.']], [1500, 3000, 4860]),
  h2('2.5 Queries, tables, connections and the Data Model'),
  table(['Term', 'Meaning'], [
    ['Excel table', 'A named block of cells (for example tbl_Transactions) that grows and shrinks with its data.'],
    ['Query', 'A saved set of steps that starts from a source and produces a table.'],
    ['Connection', 'The stored link between the workbook and a query. A "connection only" query is not loaded to a worksheet; other queries can still use it.'],
    ['Data Model', 'An in-memory store inside the workbook that holds loaded tables and relationships for PivotTables. Loading to it is optional.'],
    ['Query output table', 'The worksheet table a loaded query writes. Do not type over it; refresh rewrites it.']], [2400, 6960]),
  h2('2.6 Transformation steps and refresh'),
  p('Each action you take (change a type, filter rows, add a column) is stored as an Applied Step. Steps run in order from the source down. Because they are recorded, Power Query can run them again when the source changes. This replay is called a refresh. Refresh does not edit the source; it re-reads it and rebuilds the output.'),
  p('Why steps are recorded: a recorded process is repeatable (same result each month), reviewable (an auditor can read it) and testable (you can click an earlier step and see the data at that point).'),
  h2('2.7 A first look at an M step'),
  p('When you choose Data > From Table/Range on the Transactions table, Power Query writes a first step similar to this:'),
  ...code(['let', '    Source = Excel.CurrentWorkbook(){[Name="tbl_Transactions"]}[Content]', 'in', '    Source']),
  p(''),
  table(['Part', 'Meaning'], [
    ['let ... in', 'Defines a query: steps between let and in, and the result named after in.'],
    ['Source', 'The step name. It holds a table.'],
    ['Excel.CurrentWorkbook()', 'Returns a table listing the tables, named ranges and connections in the open workbook.'],
    ['{[Name="tbl_Transactions"]}', 'Selects the row whose Name column equals tbl_Transactions.'],
    ['[Content]', 'Takes the Content column of that row, which is the table itself.']], [3000, 6360]),
  warn('Dataset note', 'Query results can change the shape of data but must not change the workbook source. Always keep the raw sheets untouched and build cleaned outputs as new queries.'),
  ...review('Chapter 2 review questions', [
    'State the three stages of ETL and give one workbook example for each.',
    'Explain why a PivotTable cannot replace Power Query for cleaning the Transactions sheet.',
    'What is the difference between a query and its output table?',
    'What does a "connection only" query mean and when is it useful?',
    'Why is a refresh safer than repeating manual edits?'])
];
module.exports = { ch1, ch2 };
