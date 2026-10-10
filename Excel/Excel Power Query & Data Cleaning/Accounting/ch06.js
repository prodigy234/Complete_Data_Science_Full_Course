const L = require('./docx_lib.js');
const { p, h1, h2, h3, bullets, steps, table, code, warn } = L;
const { lesson, review } = require('./lesson.js');

const ch6 = [
  h1('Chapter 6: Handling Missing and Incomplete Data'),
  p('Missing data is not one problem but several. A null, an empty string, a cell holding spaces and the text "N/A" all look like "nothing" to a reader but behave differently in Power Query. Treating them the same way, or replacing them with zero, can change financial meaning. This chapter teaches you to tell them apart, flag them, and decide when not to delete a row.'),
  h2('6.1 Forms of missing data'),
  table(['Form', 'What it is', 'Example in the workbook', 'Rows'], [
    ['Null', 'No value stored.', 'Customers.Email_Address empty cell', '147'],
    ['Empty string', 'Text of length zero.', 'Customers.First_Name stored as ""', 'part of 32'],
    ['Whitespace only', 'Spaces and nothing else.', 'Customers.First_Name stored as " "', 'part of 32'],
    ['Placeholder text', 'Text that stands for "no value".', 'Customers.Customer_Segment "N/A", "NULL", "Unknown", "-", "Not Available", "None"', '60'],
    ['Empty numeric cell', 'Null in an amount column.', 'Transactions.Debit_Amount empty', '607'],
    ['Missing date', 'Null in a date column.', 'Transactions.Transaction_Date empty', '29'],
    ['Missing key', 'Null in an identifier.', 'Transactions.Transaction_Reference 60, Account_ID 30', '60 and 30']], [1800, 2300, 4260, 1000]),
  h2('6.2 Null is not zero'),
  p('A null amount means "unknown or not recorded". A zero means "the amount is nil". In a debit/credit pair, a blank on one side is conventionally nil when the other side holds the amount. But if both sides are blank, the amount is unknown, not zero. Replacing nulls with zero without an explicit business rule can hide a missing transaction.'),
  table(['Debit', 'Credit', 'Interpretation', 'Treatment'], [
    ['Amount', '0.00 or blank', 'A debit', 'Treat blank credit as 0 by rule'],
    ['0.00 or blank', 'Amount', 'A credit', 'Treat blank debit as 0 by rule'],
    ['Blank', 'Blank', 'Amount unknown', 'Flag and investigate; never assume 0'],
    ['Amount', 'Amount', 'Invalid combination', 'Flag; see Chapter 9']], [1800, 1800, 2800, 2960]),
  h2('6.3 Techniques and their risks'),
  table(['Technique', 'Where in the interface', 'Risk if misused'], [
    ['Replace Values', 'Transform > Replace Values, or right-click the column', 'Replaces text everywhere in the column, including parts of other values if Match entire cell contents is not ticked.'],
    ['Replace Errors', 'Transform > Replace Errors', 'Turns hidden failures into values such as 0 and masks the reason.'],
    ['Filter blanks', 'Filter arrow > uncheck (null) or (blank)', 'Deletes rows from the analytic result; the exception record is lost unless saved.'],
    ['Remove Blank Rows', 'Home > Remove Rows > Remove Blank Rows', 'Only removes rows where every column is empty; rarely what you need.'],
    ['Fill Down / Fill Up', 'Transform > Fill', 'Copies a neighbouring value into blanks; wrong whenever the neighbour belongs to a different entity.'],
    ['Conditional replacement / flag', 'Add Column > Conditional Column', 'Low risk when it adds a flag and leaves the original value in place.']], [2400, 3400, 3560]),
  warn('Accounting safeguard', 'Preserve records for investigation. Add a flag column and keep the row. Delete a row only when it is proven to be a valueless exact duplicate or empty line, and document that decision.'),

  ...lesson({
    id: '6.A', title: 'Convert blanks and placeholders to null in Customers',
    objectives: ['Distinguish blank, whitespace and placeholder values.', 'Convert them to null with one reusable step.', 'Verify the number of newly empty cells.'],
    scenario: 'Compliance wants to know how many customers have no segment, occupation or address. Placeholders hide the true number because they look like values.',
    source: { sheet: 'Customers', table: 'tbl_Customers', cols: 'First_Name, Customer_Segment, Occupation, Residential_Address', dirty: '"N/A", "NULL", "Unknown", "-", "Not Available", "None", "", " "', expected: 'Customer_Segment empty count rises from 118 to 178; Occupation from 0 to 116; Residential_Address from 19 to 106; First_Name from 17 to 32' },
    steps: [
      'Open src_Customers and note the Empty percentage of the four columns (Column quality on).',
      'Right-click src_Customers in the Queries pane > Reference. Rename the new query cln_Customers.',
      'Choose Home > Advanced Editor. Replace the Source line with Source = src_Customers, and add the Placeholders, NullifyText and Cleaned steps shown in the code below. (The code shows the Excel.CurrentWorkbook source so that it runs on its own; use the src_Customers source when you work with Reference.) Click Done.',
      'Compare the Empty percentages. Verification: Customer_Segment now shows 178 empty (5.9%).',
      'Click the Placeholders step name in the Advanced Editor to review the list. Add any further placeholder your organisation uses (for example "TBC") and observe that other values are unchanged.'],
    before: { h: ['Customer_ID', 'Column', 'Before', 'After'], rows: [['(any)', 'Customer_Segment', '"N/A"', 'null'], ['(any)', 'Customer_Segment', '"-"', 'null'], ['(any)', 'Occupation', '"Unknown"', 'null'], ['(any)', 'First_Name', '"" or " "', 'null'], ['(any)', 'Customer_Segment', '"Retail "', '"Retail " (unchanged; spacing is fixed in Chapter 7)']], w: [1800, 2300, 2400, 2860] },
    mcode: ['let', '    Source = Excel.CurrentWorkbook(){[Name="tbl_Customers"]}[Content],', '    Placeholders = {"N/A", "NULL", "Unknown", "-", "Not Available", "None"},', '    NullifyText = (v as any) as any =>', '        if v is text then', '            (let t = Text.Trim(v)', '             in if t = "" or List.Contains(Placeholders, t, Comparer.OrdinalIgnoreCase) then null else v)', '        else v,', '    Cleaned = Table.TransformColumns(Source, {', '        {"Customer_Segment", NullifyText},', '        {"Occupation", NullifyText},', '        {"Residential_Address", NullifyText},', '        {"First_Name", NullifyText}})', 'in', '    Cleaned'],
    explain: [['Placeholders = {...}', 'A list of the placeholder texts. Curly braces create a list.'], ['NullifyText = (v as any) as any => ...', 'Defines a function that takes one value and returns a value. "as any" allows text, numbers or null.'], ['if v is text then ... else v', 'Only text is tested; numbers and nulls pass through unchanged.'], ['let t = Text.Trim(v) in ...', 'Local variable: the trimmed text, used for testing only. The original v is returned when no match, so other values are not changed.'], ['List.Contains(Placeholders, t, Comparer.OrdinalIgnoreCase)', 'True when t equals any placeholder ignoring upper and lower case.'], ['Table.TransformColumns(Source, {{col, function}, ...})', 'Applies the function to each named column.']],
    expected: 'The listed columns show the higher Empty percentages. No other column changes and the row count is still 3,000.',
    validation: ['Customer_Segment Empty = 178; Occupation Empty = 116; Residential_Address Empty = 106; First_Name Empty = 32.', 'Row count 3,000.', 'The distinct list of Customer_Segment no longer contains N/A, NULL, Unknown, -, Not Available or None.'],
    errors: [['Type error: Expression.Error ... cannot convert', 'A column was already converted to a number', 'Apply this step to text columns only.'], ['Placeholder lists differ in case', '"n/a" vs "N/A"', 'The comparer ignores case, so one entry is enough.'], ['Replacing "-" with Replace Values on a whole column without "Match entire cell contents"', 'Would damage values containing a hyphen (for example "Sub-branch")', 'Use the function above or tick Match entire cell contents.']],
    interp: 'Placeholders understate the true amount of missing KYC data. Converting them to null lets Column quality and Table.Profile report the real percentage, which compliance can act on.',
    practice: 'Apply the same function to Loans.Collateral_Type and report the number of placeholder values removed.',
    solution: 'Loan collateral placeholders were injected at about 5 percent of rows. Result: the Empty count rises by the number of placeholder cells; record it before and after. Marking: 2 marks for correct reuse of the function, 1 for the count comparison.'
  }),

  ...lesson({
    id: '6.B', title: 'Blank is not zero: debit and credit in Transactions',
    objectives: ['Count rows where only one side, both sides or neither side is blank.', 'Create a flag that preserves the original columns.', 'Explain why replacing nulls with zero requires an explicit rule.'],
    scenario: 'A reconciliation will use signed amounts. First you must know which rows have an amount on only one side and which have no amount at all.',
    source: { sheet: 'Transactions', table: 'tbl_Transactions', cols: 'Transaction_ID, Debit_Amount, Credit_Amount', dirty: 'Debit_Amount empty (607 rows), Credit_Amount empty (595 rows), both empty (4 rows)', expected: 'An Amount_Presence column: 4 Both blank, 1,194 One side blank, 1,782 Both present' },
    steps: [
      'Open src_Transactions.',
      'Choose Add Column > Custom Column.',
      'Name it Amount_Presence and enter the expression that follows each in the code below. The dialog supplies the each automatically and no leading = sign is typed.',
      'Click OK. A new column appears at the right.',
      'Choose Transform > Group By. Group by Amount_Presence and add a Count Rows operation.',
      'Compare the result with the expected counts and then delete or hide the grouping step (it was a check; keep the Amount_Presence column).'],
    before: { h: ['Transaction_ID', 'Debit_Amount', 'Credit_Amount', 'Amount_Presence'], rows: [['(a normal debit)', '66829.72', '0', 'Both present'], ['(debit with unused credit blank)', '12000', 'blank', 'One side blank'], ['(missing amount)', 'blank', 'blank', 'Both blank']], w: [3000, 2000, 2000, 2360] },
    mcode: ['let', '    Source = src_Transactions,', '    Presence = Table.AddColumn(Source, "Amount_Presence", each', '        if [Debit_Amount] = null and [Credit_Amount] = null then "Both blank"', '        else if [Debit_Amount] = null or [Credit_Amount] = null then "One side blank"', '        else "Both present", type text)', 'in', '    Presence'],
    explain: [['[Debit_Amount] = null and [Credit_Amount] = null', 'True only when both cells are empty.'], ['... or ...', 'True when exactly one is empty (the previous test already handled both).'], ['else "Both present"', 'Neither is empty (note: they could both hold amounts, which Chapter 9 tests).'], ['type text', 'Gives the new column a text type.']],
    expected: 'Four rows are labelled Both blank, 1,194 One side blank and 1,782 Both present (2,980 in total).',
    validation: ['The three counts sum to 2,980.', 'Debit_Amount and Credit_Amount are unchanged.', 'The 4 Both blank rows are listed for investigation.'],
    errors: [['Using Replace Values null -> 0 on both columns', 'Turns the 4 unknown amounts into zeros', 'Do not replace. Flag, then apply the debit/credit rule in Chapter 9.'], ['Text "0.00" tested as non-null', 'Cells holding text are not null', 'Amounts stored as text are converted in Chapter 9 before further testing.']],
    interp: 'Rows with no amount on either side cannot be reconciled and must go to the exception report. Treating them as zero would let an unrecorded movement pass unnoticed.',
    practice: 'Do the same for General_Ledger Debit and Credit.',
    solution: 'Counts differ by sheet; compute using the same formula with [Debit] and [Credit]. Expect many One side blank rows because the unused side is often left empty. Marking: 2 marks for the formula, 1 for stating the rule.'
  }),

  ...lesson({
    id: '6.C', title: 'Flag missing dates, references and account IDs',
    objectives: ['Build a Missing_Fields column listing which mandatory fields are empty.', 'Extract an exception table without deleting rows from the main query.', 'Decide that no row is deleted.'],
    scenario: 'Internal control requires every transaction to have a date, a reference and an account. Rows missing any of these must be listed for correction.',
    source: { sheet: 'Transactions', table: 'tbl_Transactions', cols: 'Transaction_ID, Transaction_Date, Transaction_Reference, Account_ID', dirty: 'Transaction_Date empty 29; Transaction_Reference empty 60; Account_ID empty 30', expected: 'Missing_Fields column; exception table with 118 rows (rows with at least one missing field)' },
    steps: [
      'Open src_Transactions and right-click it in the Queries pane > Reference. Rename the new query tx_Missing.',
      'Choose Add Column > Custom Column named Missing_Fields. Enter the expression that follows each in the code below (the Text.Combine expression).',
      'Check a few rows: a row with a blank Account_ID should show Account_ID in Missing_Fields.',
      'Right-click tx_Missing > Reference. Rename the new query exc_Transaction_Missing_Mandatory.',
      'In it filter Missing_Fields to exclude empty text: click the filter arrow, untick the empty entry, OK.',
      'Choose Home > Close & Load To... and load exc_Transaction_Missing_Mandatory to a new worksheet. Load tx_Missing as connection only.'],
    before: { h: ['Transaction_ID', 'Transaction_Date', 'Transaction_Reference', 'Account_ID', 'Missing_Fields'], rows: [['(example)', 'empty', 'TXN2025...', 'ACC000100', 'Transaction_Date'], ['(example)', '09/01/2025', 'empty', 'empty', 'Transaction_Reference, Account_ID'], ['(complete row)', '2025-01-09', 'TXN2025...', 'ACC000101', '(empty text)']], w: [1800, 1800, 2000, 1700, 2060] },
    mcode: ['let', '    Source = src_Transactions,', '    Flagged = Table.AddColumn(Source, "Missing_Fields", each', '        Text.Combine(List.Select({', '            if [Transaction_Date] = null then "Transaction_Date" else null,', '            if [Transaction_Reference] = null then "Transaction_Reference" else null,', '            if [Account_ID] = null then "Account_ID" else null},', '            each _ <> null), ", "), type text),', '    Exceptions = Table.SelectRows(Flagged, each [Missing_Fields] <> "")', 'in', '    Exceptions'],
    explain: [['{ if ... then "..." else null, ... }', 'A list with one entry per mandatory column: the column name if it is missing, otherwise null.'], ['List.Select(list, each _ <> null)', 'Keeps only the non-null entries (the missing column names).'], ['Text.Combine(list, ", ")', 'Joins the names into one text. An empty list gives an empty text.'], ['Table.SelectRows(Flagged, each [Missing_Fields] <> "")', 'Keeps only rows where something is missing.']],
    expected: 'Flagged keeps all 2,980 rows. Exceptions has 118 rows. Row counts: 29 with a missing date, 60 with a missing reference, 30 with a missing account (some rows have more than one).',
    validation: ['Flagged row count equals the source row count.', 'Exceptions row count is 118.', 'No row has been removed from the main data path.'],
    errors: [['Filtering the main query instead of a referenced query', 'Removes the rows from the analysis', 'Always build the exception table in a separate referenced query.'], ['Blank strings not detected', '"" is not null', 'Run the Lesson 6.A function first for text columns.']],
    interp: 'The exception table is the evidence that completeness was tested. Corrections go back to the source system; the original rows stay available to explain differences.',
    practice: 'Add Transaction_Status blank/whitespace (59 rows) to the mandatory list.',
    solution: 'Status uses blank strings, not nulls, so test: [Transaction_Status] = null or Text.Trim([Transaction_Status]) = "". The union count of exceptions rises above 118. Marking: 2 marks for the correct test, 1 for the updated count.'
  }),

  ...lesson({
    id: '6.D', title: 'Fill Down is dangerous: recover blank account names safely',
    objectives: ['See why Fill Down can copy the wrong value.', 'Recover a blank name from other history rows of the same account code.', 'Keep unresolved items flagged.'],
    scenario: 'Chart_of_Accounts holds each account code many times (one row per effective period). 43 rows have a blank Account_Name. Reports need the name.',
    source: { sheet: 'Chart_of_Accounts', table: 'tbl_Chart_of_Accounts', cols: 'Account_Code, Account_Name, Effective_From', dirty: 'Account_Name: "", " ", null in 43 rows; Account_Code: 216 numeric values among text codes, some with trailing space or ".0"', expected: 'A Recovered_Name column; names recovered from other rows of the same code' },
    steps: [
      'Load tbl_Chart_of_Accounts as src_Chart_of_Accounts. Delete automatic type steps.',
      'Look at the Account_Code column: the data type icon shows mixed content (text and numbers).',
      'Choose Add Column > Custom Column named Code_Clean and enter the formula from the code below to make every code a clean text.',
      'Select Account_Name, choose Transform > Format > Trim, then use Replace Values on blank text (or the Lesson 6.A function) to make blanks null.',
      'Warning demonstration: sort by Code_Clean then Effective_From and apply Transform > Fill > Down on Account_Name. If the first row of a code is blank, it takes the name of the previous code. Delete this step after observing.',
      'Safer method: Home > Group By Code_Clean with an All Rows or the recovery formula in the code below, then merge the recovered name back. The code below does it in one step.'],
    before: { h: ['Account_Code', 'Account_Name as stored', 'Recovered_Name', 'Risk with Fill Down'], rows: [['10100 (text)', 'blank', 'Cash in Vault', 'Fill Down copies the row above, which may be a different code'], ['10100.0 or " 10100"', 'Cash in Vault', 'Cash in Vault', 'Code variants must be cleaned first'], ['(code not found elsewhere)', 'blank', 'null (flag)', 'Fill Down would invent a name']], w: [1900, 2300, 2300, 2860] },
    mcode: ['let', '    Source = src_Chart_of_Accounts,', '    CodeClean = Table.AddColumn(Source, "Code_Clean", each Text.Split(Text.Trim(Text.From([Account_Code])), "."){0}, type text),', '    NameClean = Table.TransformColumns(CodeClean, {{"Account_Name", each if _ = null or Text.Trim(_) = "" then null else Text.Trim(_), type nullable text}}),', '    NamesByCode = Table.Group(NameClean, {"Code_Clean"}, {{"Recovered_Name", each List.First(List.RemoveNulls([Account_Name])), type nullable text}}),', '    Joined = Table.NestedJoin(NameClean, {"Code_Clean"}, NamesByCode, {"Code_Clean"}, "Names", JoinKind.LeftOuter),', '    Expanded = Table.ExpandTableColumn(Joined, "Names", {"Recovered_Name"})', 'in', '    Expanded'],
    explain: [['Text.From([Account_Code])', 'Converts a number or text to text so all codes have the same type.'], ['Text.Split(..., "."){0}', 'Splits on the dot and takes the first piece; "10100.0" becomes "10100" and a code without a dot is unchanged.'], ['each if _ = null or Text.Trim(_) = "" then null else Text.Trim(_)', 'Trims text and turns empty text into null.'], ['Table.Group(... List.First(List.RemoveNulls([Account_Name])))', 'For each code, takes the first non-empty name found in its rows (null if none).'], ['Table.NestedJoin(... JoinKind.LeftOuter)', 'Left outer join keeps every history row and attaches the recovered name.'], ['Table.ExpandTableColumn(Joined, "Names", {"Recovered_Name"})', 'Expands the matched value into a normal column.']],
    expected: 'All 2,158 rows remain. Recovered_Name is filled for each blank Account_Name whose code has a name on another row. Rows still empty are those with no name for that code anywhere.',
    validation: ['Row count after the merge equals the source (2,158). If it is higher, the grouping key was not unique.', 'Count of blank Account_Name before: 43; count of blank Recovered_Name after: 0 or a small number to investigate.', 'The original Account_Name column is still present.'],
    errors: [['Fill Down across codes', 'Neighbour belongs to a different account', 'Use the recovery by code.'], ['Merge fails to match', 'Code types differ (number vs text)', 'Clean the codes first (Code_Clean).'], ['More rows after merge', 'Grouping key not unique', 'Group first, then merge a one-row-per-code table.']],
    interp: 'A name recovered from the same account code in another period is evidence-based. A name copied from the row above is a guess and could mislabel a ledger account.',
    practice: 'Recover missing Account_Category in the same way.',
    solution: 'Repeat the Group and merge with Account_Category. Note that Header rows have category "Header". Marking: 2 marks for method, 1 for count checks.'
  }),

  ...lesson({
    id: '6.E', title: 'Keep and investigate errors before replacing them',
    objectives: ['Find Excel error cells with Keep Errors.', 'Replace errors only after documenting them.', 'Explain why replacing errors with zero is dangerous.'],
    scenario: 'Five Transaction_Amount cells contain Excel #N/A errors and four Annual_Income cells in Customers do too. They must be reviewed, not silently zeroed.',
    source: { sheet: 'Transactions', table: 'tbl_Transactions', cols: 'Transaction_ID, Transaction_Amount', dirty: '#N/A in TRX0000296, TRX0000677, TRX0001135, TRX0001543, TRX0001553', expected: 'A list of rows with errors; a replacement step only in the cleaned path' },
    steps: [
      'Open src_Transactions. In Column quality, Transaction_Amount shows a red Error portion (5 rows).',
      'Choose Home > Keep Rows > Keep Errors. Select Transaction_Amount if asked. The table shrinks to the error rows.',
      'Read the Transaction_ID of each row for the exception log, then remove the Keep Errors step (right-click > Delete) or work in a referenced query.',
      'In the cleaned path choose Transform > Replace Errors on Transaction_Amount and type null (not 0).',
      'Confirm that these five rows now show null in Transaction_Amount and appear in the missing-amount exception list.'],
    before: { h: ['Transaction_ID', 'Transaction_Amount', 'After Replace Errors with null'], rows: [['TRX0000296', '#N/A (error)', 'null'], ['TRX0000677', '#N/A (error)', 'null'], ['TRX0001135', '#N/A (error)', 'null']], w: [3000, 3180, 3180] },
    mcode: ['let', '    Source = src_Transactions,', '    ErrorRows = Table.SelectRowsWithErrors(Source, {"Transaction_Amount"}),', '    ErrorKeys = Table.SelectColumns(ErrorRows, {"Transaction_ID"}),', '    CleanPath = Table.ReplaceErrorValues(Source, {{"Transaction_Amount", null}})', 'in', '    CleanPath'],
    explain: [['Table.SelectRowsWithErrors(Source, {"Transaction_Amount"})', 'Returns only rows whose Transaction_Amount is an error.'], ['Table.SelectColumns(ErrorRows, {"Transaction_ID"})', 'Keeps just the key for the exception list.'], ['Table.ReplaceErrorValues(Source, {{"Transaction_Amount", null}})', 'Replaces error cells in that column with null.']],
    expected: 'ErrorKeys lists five Transaction_IDs. CleanPath has no error cells in Transaction_Amount and the same 2,980 rows.',
    validation: ['ErrorRows has 5 rows.', 'CleanPath Column quality shows 0 percent Error for Transaction_Amount.', 'Row count unchanged.'],
    errors: [['Replacing errors with 0', 'A missing amount becomes a real-looking zero', 'Use null and flag.'], ['Errors reappear after refresh', 'Source cells still contain errors', 'The step runs each refresh; correct the source if appropriate.']],
    interp: 'Errors indicate the data could not be read. The exception list tells the owner of the source which transactions to correct.',
    practice: 'Do the same for Customers.Annual_Income and list the four Customer_IDs.',
    solution: 'Use Table.SelectRowsWithErrors(src_Customers, {"Annual_Income"}). The four IDs come from the dataset. Marking: 2 marks for the list, 1 for using null.'
  }),
  h2('6.4 When not to delete a row'),
  table(['Situation', 'Delete?', 'Reason'], [
    ['Row has a missing Account_ID', 'No', 'It may be recoverable and it is an exception to report.'],
    ['Row has a placeholder in Occupation', 'No', 'Convert to null; the rest of the record is valid.'],
    ['Row is an exact duplicate in every column', 'Possibly, after confirmation', 'Still document the count and the control totals before and after.'],
    ['Row fails a type conversion', 'No', 'Keep and flag; conversion failure is a data issue, not a reason to drop a financial record.'],
    ['Row is completely empty', 'Yes', 'No information is lost (Remove Blank Rows).']], [3400, 1800, 4160]),
  ...review('Chapter 6 review questions', [
    'What is the difference between a null and a cell holding "N/A"?', 'Why can a missing debit and credit pair not be set to zero?',
    'Describe a case where Fill Down gives a wrong result in Chart_of_Accounts.', 'Why should Replace Errors use null rather than 0?',
    'Which rows in Transactions would you list in a mandatory-field exception report?']),
  p(''), p('End of Volume 1. Volume 2 continues with Chapters 7 to 12 (text, dates, numbers, filtering, duplicates, conditional columns).')
];
module.exports = { ch6 };
