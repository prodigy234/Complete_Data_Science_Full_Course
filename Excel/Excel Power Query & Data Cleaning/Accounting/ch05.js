const L = require('./docx_lib.js');
const { p, h1, h2, h3, bullets, steps, table, code, warn } = L;
const { lesson, review } = require('./lesson.js');

const ch5 = [
  h1('Chapter 5: Data Types and Data Profiling'),
  p('A data type tells Power Query how to treat a value. Dates can be sorted and compared, decimals can be summed, text can be searched. The wrong type, or no type, produces wrong totals or errors. This chapter explains the types, shows how to convert them safely, and teaches profiling so you know what you are converting before you convert it.'),
  h2('5.1 The data types'),
  table(['Type', 'Holds', 'M type', 'Banking example'], [
    ['Text', 'Letters, digits, symbols', 'type text', 'Account_Number (digits that are an identifier, not a quantity)'],
    ['Whole Number', 'Integers', 'Int64.Type', 'Tenure_Months, Days_Past_Due'],
    ['Decimal Number', 'Floating-point numbers (about 15 digits)', 'type number', 'Exchange_Rate, Interest_Rate'],
    ['Fixed Decimal Number', 'Four decimal places, exact; suited to money', 'Currency.Type', 'Debit_Amount, Principal_Amount'],
    ['Date', 'Calendar date', 'type date', 'Transaction_Date'],
    ['Time', 'Time of day', 'type time', 'Transaction_Time'],
    ['Date/Time', 'Date with time', 'type datetime', 'Transaction_DateTime (ATM_and_POS_Transactions)'],
    ['Date/Time/Timezone', 'Date and time with UTC offset', 'type datetimezone', 'Not used in this workbook; used when systems in different zones export data'],
    ['True/False', 'Logical values', 'type logical', 'A flag column such as Is_Duplicate'],
    ['Duration', 'A length of time', 'type duration', 'Days between Due_Date and Repayment_Date'],
    ['Percentage', 'A number shown as a percentage', 'Percentage.Type', 'Interest_Rate once standardised (available in current versions)']], [1900, 2500, 1800, 3160]),
  h3('Currency-related numeric data'),
  p('Power Query has no separate currency code type. A currency symbol or code such as ₦ or NGN is text. To calculate you must remove the symbol, convert the number, and keep the currency in its own column. Amounts in different currencies must never be added together.'),
  h3('Formatting a number in Excel versus assigning a type in Power Query'),
  p('In Excel a cell can look like a number (format #,##0.00) while holding text, or look like text while holding a number. The format is only how the cell is displayed. In Power Query the data type is what the value actually is. A cell showing "50,000.00" that was typed as text is text; Power Query will not treat it as a number until you convert it.'),
  h3('Fixed Decimal Number: use and limits'),
  p('Fixed Decimal Number stores four decimals exactly, which avoids floating-point rounding noise such as 0.1 + 0.2 producing 0.30000000000000004. Use it for monetary amounts. Its limit is the four-decimal precision: do not use it for exchange rates (which may need more) or for high-precision ratios. Use Decimal Number for those.'),
  h2('5.2 Why types matter and how detection goes wrong'),
  ...bullets([
    'Sorting: text sorts "10" before "9"; numbers sort 9 before 10.',
    'Totals: Group By Sum ignores text values (they become errors or are skipped depending on the step).',
    'Joins: a text key "10000" does not match a number key 10000. Chart_of_Accounts.Account_Code holds 216 numeric codes among text codes for this reason.',
    'Automatic detection reads only the first rows (by default 200 for Excel sources). If the first rows look like dates but later rows are text, the guess is wrong.']),
  warn('Locale risk', 'Converting text to a date or a number uses a locale (language and region). The same text can give different results under different locales. Always state the locale explicitly. Power Query Desktop interprets text using your computer\'s regional settings unless you say otherwise, so the same file can give different results on different machines. Do not let Excel decide silently.'),
  h2('5.3 Changing types and locale-aware conversion'),
  ...steps([
    'Select the column. Choose Transform > Data Type and pick the type, or click the icon at the left of the column header.',
    'For an explicit locale, right-click the column header > Change Type > Using Locale...',
    'In the Change Type with Locale dialog choose the Data Type and the Locale (for Nigerian dates use English (United Kingdom), which reads dd/MM/yyyy).',
    'Click OK. The Applied Step is named Changed Type with Locale.']),
  h2('5.4 Reading quality and distribution'),
  p('Valid means the value fits the current type. Error means a value could not be converted (the cell shows Error in red). Empty means null or an empty string. Distribution shows Distinct (number of different values, counting each once) and Unique (values that occur exactly once). A key column should have Distinct equal to Unique; a category column should have a small Distinct count.'),

  ...lesson({
    id: '5.A', title: 'Profile and convert Transaction_Date with an explicit locale',
    objectives: ['Count text dates and empty dates.', 'Convert dates with the en-GB locale.', 'Identify rows that cannot be read and rows that are silently misread.'],
    scenario: 'The finance team groups transactions by month. A date read with the wrong convention puts a transaction in the wrong period without any warning.',
    source: { sheet: 'Transactions', table: 'tbl_Transactions (query src_Transactions)', cols: 'Transaction_ID, Transaction_Date', dirty: '"01.01.2025", "04-01-25", "06-Jan-2025", "09 January 2025", "09/01/2025", "01/18/2025", "TBD", "0"', expected: 'A Date_Status column and a count of unreadable and ambiguous dates' },
    steps: [
      'Open src_Transactions. Choose View > Column profile and switch profiling to the entire data set.',
      'Click the Transaction_Date header. Note that the column is a mix: 2,273 real dates, 678 text dates and 29 empty cells (2,980 rows).',
      'Right-click the Transaction_Date header > Change Type > Using Locale...',
      'Select Data Type: Date and Locale: English (United Kingdom). Click OK.',
      'Look at the quality bar. A red portion appears: these are text values that cannot be read as day/month/year.',
      'Click the red Error in a cell (click beside the word Error, not on it). Power Query shows the error message at the bottom of the preview, for example "We couldn\'t parse the input provided as a Date value".',
      'Right-click the Changed Type with Locale step and choose Delete Step. We will test without losing the original text.',
      'Choose Add Column > Custom Column. Name it Date_Test. Enter: try Date.From([Transaction_Date], "en-GB") otherwise null. Click OK.',
      'Choose Add Column > Conditional Column. Name it Date_Status. Add the rules: if Transaction_Date equals null then "Missing"; else if Date_Test equals null then "Unreadable"; else "Readable".',
      'Filter Date_Status to Unreadable and look at the original Transaction_Date text (for example "01/18/2025", "TBD", "0").',
      'Remember that "Readable" is not the same as "correct": check the table below for the 116 ambiguous values.'],
    before: { h: ['Transaction_ID', 'Text in Transaction_Date', 'True date', 'Read as en-GB', 'Result'], rows: [['TRX0000032', '09/01/2025', '9 Jan 2025', '9 Jan 2025', 'Correct'], ['TRX0000029', '01/08/2025', '8 Jan 2025', '1 Aug 2025', 'WRONG, no error'], ['TRX0000079', '01/18/2025', '18 Jan 2025', 'Error (month 18)', 'Detected'], ['TRX0001154', 'TBD', 'unknown', 'Error', 'Detected'], ['TRX0000623', '0', 'unknown', 'Error', 'Detected']], w: [1700, 2000, 1700, 2000, 1960] },
    mcode: ['let', '    Source = src_Transactions,', '    DateTest = Table.AddColumn(Source, "Date_Test", each try Date.From([Transaction_Date], "en-GB") otherwise null, type nullable date),', '    DateStatus = Table.AddColumn(DateTest, "Date_Status", each', '        if [Transaction_Date] = null then "Missing"', '        else if [Date_Test] = null then "Unreadable"', '        else "Readable", type text)', 'in', '    DateStatus'],
    explain: [['src_Transactions', 'The raw staging query from Chapter 3.'], ['Table.AddColumn(Source, "Date_Test", each ..., type nullable date)', 'Adds a column. The expression runs once per row; the last argument declares the column type.'], ['try Date.From(...) otherwise null', 'Tries to convert; if that raises an error, returns null instead of failing the whole table.'], ['Date.From([Transaction_Date], "en-GB")', 'Converts a value to a date. Text is parsed with the en-GB culture (day before month). Real dates pass through.'], ['if ... else if ... else', 'Three outcomes: Missing, Unreadable, Readable.'], ['type text', 'Declares Date_Status as text.']],
    expected: 'Date_Status shows Missing for 29 rows. Unreadable is at least 64 rows (60 text dates such as 01/18/2025 whose second number exceeds 12, plus values such as "TBD" and "0"), and more if invalid calendar dates such as 31/02/2026 are included; expect about 75 to 90 in total. Your exact figure depends on how your Excel version reads formats such as 01.01.2025.',
    validation: ['Missing + Unreadable + Readable = 2,980 (row count unchanged).', 'The 29 empty dates are not marked Unreadable.', 'Of the 116 dates written with both numbers 12 or below, tracing back to the clean source shows 72 are genuinely day/month (read correctly), 31 are genuinely month/day (misread silently), 12 have day equal to month (unaffected) and 1 cannot be traced. Locale cannot solve this; Chapter 8 shows a rule-based approach and flagging.'],
    errors: [['Using US English locale', 'Chose English (United States)', 'Use English (United Kingdom) for dd/MM/yyyy.'], ['Replacing errors with null immediately', 'Hides the problem rows', 'First list the unreadable rows, then decide.'], ['Assuming Readable means correct', 'Ambiguous dates convert without error', 'Cross-check with Value_Date or other dates and flag ambiguous rows.']],
    interp: 'Transactions dated in the wrong month change monthly totals and cut-off. Flagging unreadable and ambiguous dates lets the team correct them from source documents.',
    practice: 'Repeat the test on Customers.Date_of_Birth (791 text values). How many are missing or unreadable?',
    solution: 'Date_of_Birth has 791 text values and no missing values. Unreadable count depends on your Excel version; expect the invalid values and placeholders plus mm/dd values with a day above 12. Record your own count. Marking: 2 marks for the method (Date_Test and status column), 1 mark for the recorded count.'
  }),

  ...lesson({
    id: '5.B', title: 'Detect numbers stored as text in General_Ledger',
    objectives: ['Count text values in Debit and Credit.', 'See why a type change produces errors.', 'Record counts before cleaning (cleaning is taught in Chapter 9).'],
    scenario: 'The trial balance built from the General_Ledger sheet must include every journal line. Text amounts would be left out of a sum.',
    source: { sheet: 'General_Ledger', table: 'tbl_General_Ledger', cols: 'Journal_Line_ID, Debit, Credit', dirty: '"195,863.26", "17.607,45", "48.812.828,57", "14249918.72", "₦..." forms', expected: 'Counts of numeric, text and empty cells in Debit and Credit' },
    steps: [
      'Load tbl_General_Ledger (Data > From Table/Range) and name the query src_General_Ledger. Delete the automatic Changed Type step.',
      'Select the Debit column and read the quality bar with profiling on the entire data set.',
      'Right-click the Debit header > Change Type > Decimal Number.',
      'Observe the red Error portion. Click an Error cell to read the message.',
      'Delete the type step again (the raw column must stay available for cleaning).',
      'Add Column > Custom Column named Debit_Kind with the formula shown in the code below.',
      'Group By Debit_Kind (Transform > Group By) with a Count Rows operation to produce a three-row summary.'],
    before: { h: ['Journal_Line_ID', 'Debit as stored', 'Intended value', 'Observation'], rows: [['JNL000002-01', '195,863.26', '195863.26', 'Text with comma thousands'], ['JNL000003-01', '17.607,45', '17607.45', 'Text with comma decimal'], ['JNL000004-01', '48.812.828,57', '48812828.57', 'Text, European format'], ['JNL000006-01', '14249918.72', '14249918.72', 'Text, no separators']], w: [1900, 2200, 2200, 3060] },
    mcode: ['let', '    Source = src_General_Ledger,', '    DebitKind = Table.AddColumn(Source, "Debit_Kind", each', '        if [Debit] = null then "Empty"', '        else if [Debit] is number then "Number"', '        else "Text", type text),', '    Summary = Table.Group(DebitKind, {"Debit_Kind"}, {{"Rows", each Table.RowCount(_), Int64.Type}})', 'in', '    Summary'],
    explain: [['[Debit] = null', 'Tests for an empty cell.'], ['[Debit] is number', 'The is operator tests the type of the value.'], ['Table.Group(DebitKind, {"Debit_Kind"}, {...})', 'Groups rows by Debit_Kind and applies the aggregation.'], ['{"Rows", each Table.RowCount(_), Int64.Type}', 'Creates a Rows column that counts the rows in each group.']],
    expected: 'The summary shows about 1,938 Number, 456 Text and 595 Empty rows (total 2,989). Repeat for Credit: about 1,941 Number, 448 Text and 600 Empty.',
    validation: ['The three counts add to 2,989.', 'No row is removed.', 'The text count matches the 456 listed in the issues register for Debit.'],
    errors: [['Changing type first', 'Errors hide the original text', 'Keep the text and add a test column instead.'], ['Treating Empty as zero', 'A blank is not proven to be zero', 'See Chapter 6 for the debit/credit rule.']],
    interp: 'If ledger totals are built from the numeric cells only, about 15 percent of Debit lines are missing from the total. Counting before cleaning quantifies the risk.',
    practice: 'Apply the same profile to Accounts.Current_Balance (440 text values).',
    solution: 'Counts: 2,560 Number, 440 Text, 0 Empty (3,000 rows). Marking: 1 mark per correct count.'
  }),

  ...lesson({
    id: '5.C', title: 'Use column distribution on Customers',
    objectives: ['Read Distinct and Unique counts.', 'Identify inconsistent category labels from the distribution.', 'Recognise text numbers in Annual_Income.'],
    scenario: 'Management wants customer counts by segment. Segment labels must be consistent before the counts are meaningful.',
    source: { sheet: 'Customers', table: 'tbl_Customers', cols: 'Customer_ID, Customer_Segment, Customer_Status, Annual_Income', dirty: 'Segment: "Retail", "RETAIL", "retail", "Retail ", "Retail Banking"; Annual_Income: "₦2,505,000.00", "3.494.000,00"', expected: 'Distinct and Unique counts recorded for four columns' },
    steps: [
      'Load tbl_Customers as src_Customers (Lesson 3.A). Delete automatic type steps.',
      'Turn on Column distribution and Column profile with the entire data set.',
      'Click Customer_ID. Read Distinct and Unique. Duplicates exist, so Distinct is less than the number of rows and Unique is less than Distinct.',
      'Click Customer_Segment. Read Distinct: there are 29 non-empty variants of five real segments.',
      'In the Column profile pane, hover the longest bars: Retail (1,439), SME (565), Student (317), Corporate (176), Private Banking (145).',
      'Click Annual_Income. Note 544 text values and 4 Excel error cells.'],
    before: { h: ['Column', 'Expected clean Distinct', 'Actual Distinct', 'Meaning'], rows: [['Customer_Segment', '5', '29 (plus empty)', 'Label variants'], ['Customer_Status', '4', '17', 'Case and spelling variants'], ['State', '10', '38', 'State and Lagos/Lagos State variants'], ['KYC_Status', '4', '25', 'Case and spelling variants'], ['Customer_ID', 'equal to row count (3,000)', '2,890 distinct; 2,781 unique', 'Distinct is below 3,000 and Unique is below Distinct because IDs repeat']], w: [2400, 2400, 2200, 2360] },
    mcode: ['let', '    Source = src_Customers,', '    Segments = Table.Group(Source, {"Customer_Segment"}, {{"Customers", each Table.RowCount(_), Int64.Type}}),', '    Sorted = Table.Sort(Segments, {{"Customers", Order.Descending}})', 'in', '    Sorted'],
    explain: [['Table.Group(Source, {"Customer_Segment"}, ...)', 'One row per distinct label, including null.'], ['Table.RowCount(_)', 'Counts rows in each group.'], ['Table.Sort(..., {{"Customers", Order.Descending}})', 'Sorts largest to smallest.']],
    expected: 'A table listing every variant with its count. The cleaned five categories need a mapping table or Replace Values (Chapter 7).',
    validation: ['The Customers column adds to 3,000.', 'Retail appears with its variants listed separately.'],
    errors: [['Reading Distinct as the number of customers', 'Distinct counts different values, not people', 'Count only after duplicates are investigated.']],
    interp: 'Reporting customers by segment before standardising understates the main segment and overstates the number of segments.',
    practice: 'Produce the same summary for Customer_Status.',
    solution: 'Seventeen variants appear. Active (including padding and case variants) dominates. Marking: 2 marks for the summary, 1 for sorting.'
  }),

  ...lesson({
    id: '5.D', title: 'Investigate Interest_Rate and Days_Past_Due in Loans',
    objectives: ['Find mixed conventions in one numeric column.', 'Standardise a rate with explicit, documented assumptions.', 'Find placeholders inside a whole-number column.'],
    scenario: 'Credit risk reports average interest by loan type. If some rows hold 0.2336 and others 23.36, the average is meaningless.',
    source: { sheet: 'Loans', table: 'tbl_Loans', cols: 'Loan_ID, Interest_Rate, Days_Past_Due', dirty: 'Interest_Rate: 22.03, 0.2336, "14.66%", "25,37"; Days_Past_Due: "N/A", "-", "Unknown", "NULL"', expected: 'An Interest_Rate_Pct column with one convention, and a list of placeholder values in Days_Past_Due' },
    steps: [
      'Load tbl_Loans as src_Loans. Delete automatic type steps.',
      'Profile Interest_Rate: 2,567 numbers of 1 or more, 62 numbers below 1 (fractions such as 0.2336), 233 text values (such as "14.66%" and "25,37") and 88 empty cells.',
      'Choose Add Column > Custom Column named Interest_Rate_Pct and enter the let ... in expression that follows each in the code below.',
      'Profile Days_Past_Due: 2,862 whole numbers, 88 text placeholders and 5 negative numbers.',
      'A mixed column cannot be filtered by text rules and number rules at once, so add the DPD_Kind test column shown in the code below and filter on that.'],
    before: { h: ['Loan_ID (example)', 'Interest_Rate as stored', 'Interpreted as (percent)'], rows: [['(any)', '22.03', '22.03'], ['(any)', '0.2336', '23.36'], ['(any)', '"14.66%"', '14.66'], ['(any)', '"25,37"', '25.37'], ['(any)', 'empty', 'empty (kept)']], w: [2400, 3200, 3760] },
    mcode: ['let', '    Source = src_Loans,', '    RatePct = Table.AddColumn(Source, "Interest_Rate_Pct", each', '        let v = [Interest_Rate],', '            n = if v = null then null', '                else if v is number then v', '                else try Number.FromText(Text.Replace(Text.Replace(Text.Trim(v), "%", ""), ",", "."), "en-US") otherwise null', '        in if n = null then null else if n < 1 then n * 100 else n, type nullable number),', '    DpdKind = Table.AddColumn(RatePct, "DPD_Kind", each', '        if [Days_Past_Due] = null then "Empty"', '        else if [Days_Past_Due] is number then (if [Days_Past_Due] < 0 then "Negative" else "Number")', '        else "Placeholder text", type text)', 'in', '    DpdKind'],
    explain: [['let v = [Interest_Rate], n = ... in ...', 'A local calculation inside the custom column: v holds the original value, n the converted number.'], ['v is number', 'True when the cell holds a number.'], ['Number.FromText(..., "en-US")', 'Converts text to a number using the en-US culture (dot decimal).'], ['Text.Replace(..., "%", "")', 'Removes the percent sign.'], ['Text.Replace(..., ",", ".")', 'Turns a comma decimal such as 25,37 into 25.37. Safe here because no rate contains a thousands separator.'], ['n < 1 then n * 100', 'Business assumption: no loan has a rate below 1 percent, so values below 1 are fractions.'], ['try ... otherwise null', 'Returns null if conversion fails.']],
    expected: 'Interest_Rate_Pct holds one convention (percentage points). The 88 empty rates remain empty. DPD_Kind shows 2,857 Number, 5 Negative, 88 Placeholder text and 0 Empty.',
    validation: ['Minimum of Interest_Rate_Pct is above 1 and the maximum is about 30.', 'Row count remains 2,950.', 'The assumption (below 1 means fraction) is recorded in the query description.'],
    errors: [['Multiplying every value by 100', 'Ignores that most are already percentages', 'Use the below-1 rule only.'], ['Replacing placeholders with 0', 'Zero days past due is a real, favourable value', 'Keep as null and flag.']],
    interp: 'Negative Days_Past_Due and placeholder values are indicators for investigation. A rate assumption must be approved by the credit team because it changes interest analysis.',
    practice: 'Report how many loans have Interest_Rate_Pct above 30.',
    solution: 'Use Table.SelectRows(RatePct, each [Interest_Rate_Pct] <> null and [Interest_Rate_Pct] > 30) and Table.RowCount. The generated maximum is below 30 for most loan types; any result is an observation to report, not a deletion. Marking: 2 marks for the filter, 1 for the explanation.'
  }),
  ...review('Chapter 5 review questions', [
    'Why is Account_Number a text column even though it contains digits?', 'What is the difference between Valid and correct?',
    'Give an example from Transactions where the en-GB and en-US locales read the same text differently.', 'Why use Fixed Decimal Number for Debit_Amount but Decimal Number for Exchange_Rate?',
    'Why does Chart_of_Accounts.Account_Code cause failed joins to General_Ledger?'])
];
module.exports = { ch5 };
