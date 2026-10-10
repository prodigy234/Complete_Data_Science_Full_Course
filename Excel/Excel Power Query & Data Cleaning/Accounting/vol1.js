const L = require('./docx_lib.js');
const { p, h1, h2, h3, bullets, steps, table, warn, titlePage, build, TableOfContents, PageBreak, Paragraph } = L;
const { ch1, ch2 } = require('./ch01_02.js');
const { ch3, ch4 } = require('./ch03_04.js');
const { ch5 } = require('./ch05.js');
const { ch6 } = require('./ch06.js');

const front = [
  ...titlePage('Complete Excel Power Query for Accountants', 'Volume 1: Foundations, the Editor, Data Types and Missing Data (Chapters 1 to 6)', 'Intended audience: accountants, auditors, financial analysts and banking professionals with basic Excel skills and no previous Power Query experience'),
  h1('About this textbook'),
  p('This textbook teaches Excel Power Query using a single synthetic banking workbook, Banking_Power_Query_Training_Dirty_Dataset.xlsx. All data is fictional. Harbourline Bank Nigeria and Cedarstone Bank are invented names; customers, account numbers, phone numbers, e-mail addresses and exchange rates are randomly generated and represent no real person or institution.'),
  p('The full textbook is issued in volumes with consistent terminology and cross-references. This is Volume 1.'),
  table(['Volume', 'Chapters', 'Theme'], [
    ['1 (this volume)', '1 to 6', 'Foundations, setup, editor, data types and profiling, missing data'],
    ['2', '7 to 12', 'Text, dates, numbers, filtering, duplicates, conditional and custom columns'],
    ['3', '13 to 18', 'M language, functions reference, restructuring, Group By, merge and append'],
    ['4', '19 to 24', 'Bank reconciliation, ledger validation, loans, parameters, errors, dependencies and performance'],
    ['5', '25 to 30', 'Loading, automated pipeline, projects, troubleshooting, best practice, capstone']], [1800, 1500, 6060]),
  h2('Learning outcomes for Volume 1'),
  ...bullets([
    'Explain why data preparation matters to financial reporting and describe data-quality dimensions using real examples.',
    'Distinguish Power Query from formulas, PivotTables, VBA and Power BI, and describe ETL.',
    'Prepare the workbook, load a table into Power Query, name queries and steps, and load and refresh results.',
    'Use every part of the Power Query Editor, including column profiling.',
    'Choose and convert data types with an explicit locale, and recognise silent mis-conversion.',
    'Identify nulls, blanks and placeholders and apply a safe, documented treatment without deleting financial records.']),
  h2('Conventions'),
  table(['Convention', 'Meaning'], [
    ['Data > From Table/Range', 'Click the Data tab, then the From Table/Range command.'],
    ['Courier text', 'M code or a column name.'],
    ['Red warning box', 'An accounting or data-integrity safeguard.'],
    ['src_ / cln_ / exc_', 'Query name prefixes: raw staging, cleaned output, exception report.'],
    ['Lesson A to M', 'Every practical lesson follows the same 13-part layout: objectives, scenario, source data, procedure, before and after, M code, explanation, expected result, validation, common errors, accounting interpretation, independent practice and instructor solution.']], [3000, 6360]),
  h2('Environment and verification notes'),
  ...bullets([
    'Instructions are written for Excel for Windows (Microsoft 365). Menu names and some features differ in older versions, in Excel for Mac and in Excel for the web; check availability in your version.',
    'Counts such as "2,980 rows" and "178 empty values" were computed from the generated workbook. Date-parsing results depend on your Excel version and regional settings, so where this book says "about", record your own figure.',
    'The M code was written against the documented M syntax and the actual table and column names. It could not be executed in Excel in the environment where this book was produced. Run each step, and report any difference to your instructor.',
    'Screenshots are not included because genuine Excel screenshots were not available. Interface descriptions are written in full so that screenshots are not needed.']),
  warn('Safeguards that run through the whole book', 'Never overwrite the raw data. Never delete financial records because they look unusual. Never convert a missing amount to zero without an explicit business rule. Never assume every date uses the same convention. Document the reason for every material transformation.'),
  new Paragraph({ children: [new PageBreak()] }),
  h1('Contents'),
  new TableOfContents('Table of contents', { hyperlink: true, headingStyleRange: '1-2' }),
  p('If the contents list is empty when you open the file in Word, right-click it and choose Update Field, then Update entire table.'),
  new Paragraph({ children: [new PageBreak()] }),
];

const back = [
  h1('Glossary (Volume 1)'),
  table(['Term', 'Meaning'], [
    ['Applied Step', 'One recorded transformation in a query.'], ['Column profile', 'Statistics and a value chart for the selected column.'],
    ['Connection only', 'A query that is not loaded to a worksheet but can feed other queries.'], ['Data Model', 'In-memory store in the workbook for loaded tables and relationships.'],
    ['Distinct / Unique', 'Distinct counts different values; Unique counts values that occur once.'], ['ETL', 'Extract, Transform, Load.'],
    ['Fixed Decimal Number', 'Number type with four exact decimal places, suited to money.'], ['Locale', 'Language and region setting that controls how text is read as dates and numbers.'],
    ['M', 'The Power Query formula language.'], ['Null', 'No value stored; different from zero and from an empty string.'],
    ['Placeholder', 'Text such as N/A that stands in for a missing value.'], ['Query', 'A saved set of steps from a source to a result table.'],
    ['Refresh', 'Re-running a query on the current source data.'], ['Staging query', 'A raw, usually connection-only, query that other queries reference.']], [2600, 6760]),
  h1('References'),
  p('The following Microsoft documentation pages were confirmed to exist by web search while preparing this volume.'),
  table(['Title', 'Link'], [
    ['Power Query M formula language', 'https://learn.microsoft.com/en-us/powerquery-m/'],
    ['Power Query M language specification: Introduction', 'https://learn.microsoft.com/powerquery-m/m-spec-introduction'],
    ['Power Query M function reference', 'https://learn.microsoft.com/powerquery-m/power-query-m-function-reference'],
    ['Data types in Power Query', 'https://learn.microsoft.com/en-us/power-query/data-types']], [4200, 5160]),
  p('Links were located through search and may redirect to your language version.'),
];

build('/mnt/user-data/outputs/Complete_Excel_Power_Query_for_Accountants_Textbook_Vol1.docx', [...front, ...ch1, ...ch2, ...ch3, ...ch4, ...ch5, ...ch6, ...back], 'Complete Excel Power Query for Accountants - Volume 1');
