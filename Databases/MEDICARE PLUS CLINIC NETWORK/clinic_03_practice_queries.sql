-- ============================================================================
-- MEDICARE PLUS CLINIC NETWORK -- Practice Queries
-- Organized topic-by-topic, in teaching order. Uncomment and run one query
-- at a time in class. Each section builds on the last.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. SELECT -- pulling columns from a table
-- ---------------------------------------------------------------------------

-- 1.1 Select everything
-- SELECT * FROM patients LIMIT 10;

-- 1.2 Select specific columns
-- SELECT first_name, last_name, city, state_province FROM patients LIMIT 10;

-- 1.3 Rename columns with an alias
-- SELECT first_name AS "First Name", last_name AS "Last Name" FROM patients LIMIT 10;

-- 1.4 Compute a new column
-- SELECT medication_name, unit_price, ROUND(unit_price * 1.08, 2) AS price_with_tax
-- FROM medications
-- LIMIT 10;


-- ---------------------------------------------------------------------------
-- 2. ORDER BY -- sorting results
-- ---------------------------------------------------------------------------

-- 2.1 Sort ascending (default)
-- SELECT medication_name, unit_price FROM medications ORDER BY unit_price;

-- 2.2 Sort descending
-- SELECT medication_name, unit_price FROM medications ORDER BY unit_price DESC;

-- 2.3 Sort by multiple columns
-- SELECT last_name, first_name, city FROM patients ORDER BY city ASC, last_name ASC;

-- 2.4 Sort then limit -- "5 most experienced doctors"
-- SELECT first_name, last_name, years_experience
-- FROM doctors
-- ORDER BY years_experience DESC
-- LIMIT 5;


-- ---------------------------------------------------------------------------
-- 3. LIKE -- pattern matching on text
-- ---------------------------------------------------------------------------

-- 3.1 Starts with -- patients whose last name starts with "Sm"
-- SELECT first_name, last_name FROM patients WHERE last_name LIKE 'Sm%';

-- 3.2 Contains -- medications with "acetamin" anywhere in the name
-- SELECT medication_name FROM medications WHERE medication_name LIKE '%acetamin%';

-- 3.3 Ends with -- doctors whose email ends in a specific domain
-- SELECT first_name, last_name, email FROM doctors WHERE email LIKE '%@medicareplus.com';

-- 3.4 Case-insensitive LIKE (Postgres-specific: ILIKE)
-- SELECT first_name, last_name FROM patients WHERE first_name ILIKE 'jo%';


-- ---------------------------------------------------------------------------
-- 4. GROUP BY -- collapsing rows into groups
-- ---------------------------------------------------------------------------

-- 4.1 Number of doctors per department
-- SELECT department_id, COUNT(*) AS num_doctors
-- FROM doctors
-- GROUP BY department_id
-- ORDER BY num_doctors DESC;

-- 4.2 Number of appointments per status
-- SELECT status, COUNT(*) AS num_appointments
-- FROM appointments
-- GROUP BY status
-- ORDER BY num_appointments DESC;

-- 4.3 GROUP BY with a join -- appointment count by department name
-- SELECT d.department_name, COUNT(a.appointment_id) AS num_appointments
-- FROM appointments a
-- JOIN doctors doc ON doc.doctor_id = a.doctor_id
-- JOIN departments d ON d.department_id = doc.department_id
-- GROUP BY d.department_name
-- ORDER BY num_appointments DESC;

-- 4.4 GROUP BY with HAVING -- medication categories averaging over $15
-- SELECT category, ROUND(AVG(unit_price)::numeric, 2) AS avg_price
-- FROM medications
-- GROUP BY category
-- HAVING AVG(unit_price) > 15
-- ORDER BY avg_price DESC;


-- ---------------------------------------------------------------------------
-- 5. AGGREGATE FUNCTIONS -- COUNT, SUM, AVG, MIN, MAX
-- ---------------------------------------------------------------------------

-- 5.1 Basic aggregates on the whole table
-- SELECT
--     COUNT(*)                    AS total_patients,
--     MIN(date_of_birth)          AS oldest_dob,
--     MAX(date_of_birth)          AS youngest_dob
-- FROM patients;

-- 5.2 SUM and AVG on invoices
-- SELECT
--     SUM(amount)      AS total_billed,
--     SUM(amount_due)  AS total_outstanding,
--     ROUND(AVG(amount)::numeric, 2) AS avg_invoice
-- FROM invoices;

-- 5.3 Aggregates per group -- revenue and average fee by department
-- SELECT d.department_name,
--        COUNT(DISTINCT doc.doctor_id) AS num_doctors,
--        ROUND(AVG(doc.consultation_fee)::numeric, 2) AS avg_fee,
--        MIN(doc.consultation_fee) AS lowest_fee,
--        MAX(doc.consultation_fee) AS highest_fee
-- FROM doctors doc
-- JOIN departments d ON d.department_id = doc.department_id
-- GROUP BY d.department_name
-- ORDER BY avg_fee DESC;


-- ---------------------------------------------------------------------------
-- 6. REGULAR EXPRESSIONS -- pattern matching beyond LIKE
-- ---------------------------------------------------------------------------
-- Postgres uses ~ (case-sensitive match) and ~* (case-insensitive match).
-- MySQL uses REGEXP / RLIKE with similar pattern syntax.

-- 6.1 Patients whose first name starts with a vowel
-- SELECT first_name, last_name FROM patients WHERE first_name ~* '^[aeiou]';

-- 6.2 Emails that follow a standard username@domain.tld shape
-- SELECT first_name, last_name, email
-- FROM patients
-- WHERE email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';

-- 6.3 Medications with a dosage number in the name (e.g. "500mg")
-- SELECT medication_name FROM medications WHERE medication_name ~ '[0-9]+mg';

-- 6.4 Phone numbers containing exactly 3 consecutive digits followed by a dash
-- SELECT first_name, last_name, phone FROM patients WHERE phone ~ '[0-9]{3}-';


-- ---------------------------------------------------------------------------
-- 7. WHERE -- filtering rows
-- ---------------------------------------------------------------------------

-- 7.1 Simple equality
-- SELECT * FROM appointments WHERE status = 'Cancelled';

-- 7.2 Comparison operators
-- SELECT medication_name, unit_price FROM medications WHERE unit_price >= 20;

-- 7.3 Filtering on a date
-- SELECT appointment_id, patient_id, appointment_date
-- FROM appointments
-- WHERE appointment_date > '2026-01-01';

-- 7.4 Filtering with a join
-- SELECT p.first_name, p.last_name, a.appointment_date
-- FROM appointments a
-- JOIN patients p ON p.patient_id = a.patient_id
-- WHERE a.status = 'No-Show';


-- ---------------------------------------------------------------------------
-- 8. COUNT -- counting rows
-- ---------------------------------------------------------------------------

-- 8.1 Count all rows
-- SELECT COUNT(*) FROM patients;

-- 8.2 Count non-null values in a column (patients WITH an email on file)
-- SELECT COUNT(email) AS patients_with_email FROM patients;

-- 8.3 Count with a filter
-- SELECT COUNT(*) AS overdue_invoices FROM invoices WHERE payment_status = 'Overdue';

-- 8.4 Count per group
-- SELECT doctor_id, COUNT(*) AS appointments_handled
-- FROM appointments
-- GROUP BY doctor_id
-- ORDER BY appointments_handled DESC
-- LIMIT 5;


-- ---------------------------------------------------------------------------
-- 9. DISTINCT -- unique values
-- ---------------------------------------------------------------------------

-- 9.1 Unique specialties
-- SELECT DISTINCT specialty FROM doctors;

-- 9.2 Unique cities patients come from
-- SELECT DISTINCT city FROM patients ORDER BY city;

-- 9.3 Count of unique values -- how many distinct insurance providers are in use
-- SELECT COUNT(DISTINCT insurance_provider) AS distinct_providers FROM patients;

-- 9.4 DISTINCT on multiple columns -- unique doctor/status combinations
-- SELECT DISTINCT doctor_id, status FROM appointments ORDER BY doctor_id;


-- ---------------------------------------------------------------------------
-- 10. AND / OR -- combining conditions
-- ---------------------------------------------------------------------------

-- 10.1 AND -- both conditions must be true
-- SELECT first_name, last_name, insurance_provider
-- FROM patients
-- WHERE state_province = 'CA' AND insurance_provider IS NOT NULL;

-- 10.2 OR -- either condition can be true
-- SELECT medication_name, category
-- FROM medications
-- WHERE category = 'Cardiovascular' OR category = 'Diabetes';

-- 10.3 Combining AND with OR (use parentheses to control logic!)
-- SELECT appointment_id, status, appointment_date
-- FROM appointments
-- WHERE (status = 'Cancelled' OR status = 'No-Show') AND appointment_date >= '2026-01-01';

-- 10.4 NOT combined with AND/OR
-- SELECT first_name, last_name FROM patients
-- WHERE NOT (state_province = 'CA' OR state_province = 'NY');


-- ---------------------------------------------------------------------------
-- 11. BETWEEN -- range filtering
-- ---------------------------------------------------------------------------

-- 11.1 Numeric range
-- SELECT medication_name, unit_price FROM medications WHERE unit_price BETWEEN 10 AND 20;

-- 11.2 Date range
-- SELECT appointment_id, appointment_date
-- FROM appointments
-- WHERE appointment_date BETWEEN '2026-01-01' AND '2026-03-31';

-- 11.3 BETWEEN with NOT
-- SELECT medication_name, unit_price FROM medications WHERE unit_price NOT BETWEEN 10 AND 20;

-- 11.4 BETWEEN on a computed age range -- patients between 30 and 50 years old
-- SELECT first_name, last_name, date_of_birth
-- FROM patients
-- WHERE date_of_birth BETWEEN (CURRENT_DATE - INTERVAL '50 years') AND (CURRENT_DATE - INTERVAL '30 years');


-- ---------------------------------------------------------------------------
-- 12. IN -- matching against a list
-- ---------------------------------------------------------------------------

-- 12.1 Basic IN
-- SELECT * FROM appointments WHERE status IN ('Cancelled', 'No-Show', 'Rescheduled');

-- 12.2 IN with a subquery -- patients who have at least one overdue invoice
-- SELECT first_name, last_name
-- FROM patients
-- WHERE patient_id IN (SELECT patient_id FROM invoices WHERE payment_status = 'Overdue');

-- 12.3 NOT IN
-- SELECT medication_name, category
-- FROM medications
-- WHERE category NOT IN ('Supplement', 'Allergy');

-- 12.4 IN across a doctor list -- appointments handled by specific doctors
-- SELECT appointment_id, doctor_id, appointment_date
-- FROM appointments
-- WHERE doctor_id IN (1, 2, 3);


-- ---------------------------------------------------------------------------
-- 13. INSERT INTO -- adding a single row
-- ---------------------------------------------------------------------------

-- 13.1 Insert one new patient
-- INSERT INTO patients
--     (first_name, last_name, date_of_birth, gender, email, phone, address_line, city,
--      state_province, zip_code, insurance_provider, registration_date)
-- VALUES
--     ('Grace', 'Okafor', '1994-03-12', 'Female', 'grace.okafor@example.com', '555-0142',
--      '12 Palm Street', 'Austin', 'TX', '73301', 'CarePlus Insurance', CURRENT_DATE);

-- 13.2 Insert a new appointment for that patient (assumes patient_id 151 was just created)
-- INSERT INTO appointments
--     (patient_id, doctor_id, appointment_date, appointment_time, reason, status, room_number, duration_minutes)
-- VALUES
--     (151, 4, '2026-08-01', '09:30', 'Annual check-up', 'Scheduled', '2B05', 30);


-- ---------------------------------------------------------------------------
-- 14. INSERT INTO -- multiple rows at once
-- ---------------------------------------------------------------------------

-- 14.1 Insert several medications in one statement
-- INSERT INTO medications (medication_name, category, unit_price, manufacturer, requires_prescription, stock_quantity)
-- VALUES
--     ('Simvastatin 20mg', 'Cardiovascular', 15.75, 'CardioPharm', TRUE, 120),
--     ('Pantoprazole 40mg', 'Gastrointestinal', 14.25, 'GastroHealth', TRUE, 95),
--     ('Zinc Supplement', 'Supplement', 7.25, 'WellnessLabs', FALSE, 200);

-- 14.2 Insert several new departments at once
-- INSERT INTO departments (department_name, floor_number, phone_extension, annual_budget)
-- VALUES
--     ('Oncology', 5, '505', 1100000.00),
--     ('Physical Therapy', 1, '120', 380000.00);


-- ---------------------------------------------------------------------------
-- 15. NULL VALUES -- handling missing data
-- ---------------------------------------------------------------------------

-- 15.1 Find rows where a column IS NULL
-- SELECT first_name, last_name FROM patients WHERE email IS NULL;

-- 15.2 Find rows where a column IS NOT NULL
-- SELECT first_name, last_name, insurance_provider FROM patients WHERE insurance_provider IS NOT NULL;

-- 15.3 COALESCE -- substitute a default value when NULL
-- SELECT first_name, last_name, COALESCE(insurance_provider, 'Uninsured') AS coverage
-- FROM patients
-- LIMIT 15;

-- 15.4 NULL-safe counting -- percentage of patients missing an email
-- SELECT
--     COUNT(*) AS total_patients,
--     COUNT(email) AS with_email,
--     ROUND(100.0 * (COUNT(*) - COUNT(email)) / COUNT(*), 1) AS pct_missing_email
-- FROM patients;


-- ---------------------------------------------------------------------------
-- 16. UPDATE -- modifying existing rows
-- ---------------------------------------------------------------------------

-- 16.1 Update a single row (always use WHERE with UPDATE!)
-- UPDATE patients
-- SET phone = '555-0199'
-- WHERE patient_id = 1;

-- 16.2 Update multiple columns at once
-- UPDATE doctors
-- SET consultation_fee = consultation_fee * 1.05,
--     is_accepting_patients = TRUE
-- WHERE department_id = 1;

-- 16.3 Update based on a condition affecting many rows
-- UPDATE invoices
-- SET payment_status = 'Overdue'
-- WHERE payment_status = 'Unpaid' AND due_date < CURRENT_DATE;

-- 16.4 Update using a subquery
-- UPDATE patients
-- SET insurance_provider = 'CarePlus Insurance'
-- WHERE patient_id IN (
--     SELECT patient_id FROM invoices WHERE payment_status = 'Overdue'
-- ) AND insurance_provider IS NULL;


-- ---------------------------------------------------------------------------
-- 17. DELETE -- removing rows
-- ---------------------------------------------------------------------------

-- 17.1 Delete a specific row (always use WHERE with DELETE!)
-- DELETE FROM appointments WHERE appointment_id = 999;

-- 17.2 Delete rows matching a condition
-- DELETE FROM prescriptions WHERE refills_allowed = 0 AND duration_days < 5;

-- 17.3 Delete using a subquery -- remove cancelled appointments older than a year with no prescriptions
-- DELETE FROM appointments
-- WHERE status = 'Cancelled'
--   AND appointment_date < CURRENT_DATE - INTERVAL '1 year'
--   AND appointment_id NOT IN (SELECT appointment_id FROM prescriptions);

-- 17.4 (Reference only -- do not run in class) DELETE FROM medications; would delete every row,
-- since it has no WHERE clause. Always double-check your WHERE clause before running DELETE.


-- ---------------------------------------------------------------------------
-- 18. WILDCARDS -- % and _ in pattern matching
-- ---------------------------------------------------------------------------

-- 18.1 % matches any number of characters
-- SELECT medication_name FROM medications WHERE medication_name LIKE 'A%';

-- 18.2 _ matches exactly one character -- 4-letter first names starting with "J"
-- SELECT DISTINCT first_name FROM patients WHERE first_name LIKE 'J___';

-- 18.3 Combining wildcards -- zip codes starting with "7" and ending in "1"
-- SELECT DISTINCT zip_code FROM patients WHERE zip_code LIKE '7%1';

-- 18.4 Wildcard in the middle -- doctors with "ar" in their last name
-- SELECT first_name, last_name FROM doctors WHERE last_name LIKE '%ar%';


-- ---------------------------------------------------------------------------
-- 19. ADVANCED SQL -- joins, subqueries, CTEs, CASE, window functions, views
-- ---------------------------------------------------------------------------

-- 19.1 CASE expression -- bucket patients by age group
-- SELECT first_name, last_name,
--        DATE_PART('year', AGE(date_of_birth)) AS age,
--        CASE
--            WHEN DATE_PART('year', AGE(date_of_birth)) < 18 THEN 'Minor'
--            WHEN DATE_PART('year', AGE(date_of_birth)) BETWEEN 18 AND 64 THEN 'Adult'
--            ELSE 'Senior'
--        END AS age_group
-- FROM patients
-- ORDER BY age;

-- 19.2 CTE + window function -- rank doctors by revenue within their department
-- WITH doctor_revenue AS (
--     SELECT doc.doctor_id, doc.first_name, doc.last_name, doc.department_id,
--            SUM(i.amount) AS total_billed
--     FROM doctors doc
--     JOIN appointments a ON a.doctor_id = doc.doctor_id
--     JOIN invoices i ON i.appointment_id = a.appointment_id
--     GROUP BY doc.doctor_id, doc.first_name, doc.last_name, doc.department_id
-- )
-- SELECT d.department_name, dr.first_name, dr.last_name, dr.total_billed,
--        RANK() OVER (PARTITION BY dr.department_id ORDER BY dr.total_billed DESC) AS dept_rank
-- FROM doctor_revenue dr
-- JOIN departments d ON d.department_id = dr.department_id
-- ORDER BY d.department_name, dept_rank;

-- 19.3 Correlated subquery -- patients whose most recent appointment was a No-Show
-- SELECT first_name, last_name
-- FROM patients p
-- WHERE (
--     SELECT status FROM appointments a
--     WHERE a.patient_id = p.patient_id
--     ORDER BY a.appointment_date DESC LIMIT 1
-- ) = 'No-Show';

-- 19.4 A view -- reusable "patient billing summary"
-- CREATE OR REPLACE VIEW patient_billing_summary AS
-- SELECT p.patient_id, p.first_name, p.last_name,
--        COUNT(i.invoice_id) AS num_invoices,
--        SUM(i.amount) AS total_billed,
--        SUM(i.amount_due) AS total_outstanding
-- FROM patients p
-- LEFT JOIN invoices i ON i.patient_id = p.patient_id
-- GROUP BY p.patient_id, p.first_name, p.last_name;
--
-- -- then query the view like a table:
-- -- SELECT * FROM patient_billing_summary WHERE total_outstanding > 0 ORDER BY total_outstanding DESC;

-- 19.5 GROUP BY with ROLLUP -- subtotals and a grand total in one query
-- SELECT d.department_name, doc.specialty, COUNT(a.appointment_id) AS num_appointments
-- FROM appointments a
-- JOIN doctors doc ON doc.doctor_id = a.doctor_id
-- JOIN departments d ON d.department_id = doc.department_id
-- GROUP BY ROLLUP (d.department_name, doc.specialty)
-- ORDER BY d.department_name NULLS LAST, doc.specialty NULLS LAST;

-- ============================================================================
-- End of practice queries.
-- ============================================================================
