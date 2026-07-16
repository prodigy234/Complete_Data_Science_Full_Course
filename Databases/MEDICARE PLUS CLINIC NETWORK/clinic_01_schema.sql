-- ============================================================================
-- MEDICARE PLUS CLINIC NETWORK -- Teaching Database #2
-- ============================================================================
-- Dialect: PostgreSQL (tested on version 16)
--
-- Notes for other engines:
--   MySQL   : replace "SERIAL" with "INT AUTO_INCREMENT"; replace the
--             regex operator "~" with REGEXP; TRUE/FALSE work fine as-is.
--   SQLite  : replace "SERIAL PRIMARY KEY" with
--             "INTEGER PRIMARY KEY AUTOINCREMENT"; SQLite has no native
--             regex operator unless the REGEXP extension is loaded.
--
-- Business scenario:
--   MediCare Plus operates a small network of outpatient clinics. Patients
--   book appointments with doctors across departments, get prescriptions
--   filled, and get billed (sometimes with insurance covering part of the
--   cost). This dataset intentionally contains realistic NULLs (missing
--   emails, no insurance, cancelled appointments with no room assigned,
--   unpaid invoices) so students get practice handling real-world data
--   quality issues.
-- ============================================================================

DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS prescriptions CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS medications CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- ============================================================================
-- 1. DEPARTMENTS
-- ============================================================================
CREATE TABLE departments (
    department_id     SERIAL PRIMARY KEY,
    department_name    VARCHAR(60) NOT NULL,
    floor_number        INT NOT NULL,
    phone_extension      VARCHAR(10) NOT NULL,
    annual_budget        NUMERIC(12,2) NOT NULL
);

-- ============================================================================
-- 2. DOCTORS
-- ============================================================================
CREATE TABLE doctors (
    doctor_id                SERIAL PRIMARY KEY,
    first_name                 VARCHAR(50) NOT NULL,
    last_name                  VARCHAR(50) NOT NULL,
    specialty                  VARCHAR(60) NOT NULL,
    department_id              INT REFERENCES departments(department_id),
    email                       VARCHAR(120) UNIQUE NOT NULL,
    phone                       VARCHAR(30),
    hire_date                   DATE NOT NULL,
    years_experience            INT NOT NULL,
    consultation_fee            NUMERIC(8,2) NOT NULL,
    is_accepting_patients       BOOLEAN NOT NULL DEFAULT TRUE
);

-- ============================================================================
-- 3. PATIENTS
-- ============================================================================
CREATE TABLE patients (
    patient_id                 SERIAL PRIMARY KEY,
    first_name                   VARCHAR(50) NOT NULL,
    last_name                    VARCHAR(50) NOT NULL,
    middle_name                  VARCHAR(50),                 -- often NULL
    date_of_birth                 DATE NOT NULL,
    gender                        VARCHAR(20),
    email                         VARCHAR(120),                -- sometimes NULL (no email on file)
    phone                         VARCHAR(30) NOT NULL,
    address_line                  VARCHAR(150),
    city                          VARCHAR(60),
    state_province                VARCHAR(60),
    zip_code                      VARCHAR(20),
    blood_type                    VARCHAR(5),                  -- sometimes NULL (unknown / not on file)
    insurance_provider             VARCHAR(80),                 -- NULL means uninsured
    registration_date              DATE NOT NULL,
    emergency_contact_name          VARCHAR(100),                -- sometimes NULL
    emergency_contact_phone          VARCHAR(30)                  -- sometimes NULL
);

-- ============================================================================
-- 4. MEDICATIONS
-- ============================================================================
CREATE TABLE medications (
    medication_id           SERIAL PRIMARY KEY,
    medication_name           VARCHAR(100) NOT NULL,
    category                    VARCHAR(60) NOT NULL,
    unit_price                  NUMERIC(8,2) NOT NULL,
    manufacturer                 VARCHAR(100),
    requires_prescription        BOOLEAN NOT NULL DEFAULT TRUE,
    stock_quantity                INT NOT NULL DEFAULT 0
);

-- ============================================================================
-- 5. APPOINTMENTS
-- ============================================================================
CREATE TABLE appointments (
    appointment_id       SERIAL PRIMARY KEY,
    patient_id             INT NOT NULL REFERENCES patients(patient_id),
    doctor_id              INT NOT NULL REFERENCES doctors(doctor_id),
    appointment_date        DATE NOT NULL,
    appointment_time         TIME NOT NULL,
    reason                   VARCHAR(150),
    status                   VARCHAR(20) NOT NULL
                             CHECK (status IN
                             ('Scheduled','Completed','Cancelled','No-Show','Rescheduled')),
    room_number              VARCHAR(10),          -- NULL when Cancelled / No-Show
    duration_minutes          INT NOT NULL DEFAULT 30,
    notes                    VARCHAR(255)          -- frequently NULL
);

-- ============================================================================
-- 6. PRESCRIPTIONS
-- ============================================================================
CREATE TABLE prescriptions (
    prescription_id       SERIAL PRIMARY KEY,
    appointment_id           INT NOT NULL REFERENCES appointments(appointment_id) ON DELETE CASCADE,
    medication_id            INT NOT NULL REFERENCES medications(medication_id),
    dosage                    VARCHAR(50) NOT NULL,     -- e.g. '500mg twice daily'
    duration_days             INT NOT NULL,
    quantity                  INT NOT NULL,
    refills_allowed            INT NOT NULL DEFAULT 0,
    prescribed_date            DATE NOT NULL
);

-- ============================================================================
-- 7. INVOICES
-- ============================================================================
CREATE TABLE invoices (
    invoice_id                SERIAL PRIMARY KEY,
    patient_id                  INT NOT NULL REFERENCES patients(patient_id),
    appointment_id               INT REFERENCES appointments(appointment_id),
    invoice_date                  DATE NOT NULL,
    amount                        NUMERIC(10,2) NOT NULL,
    insurance_covered_amount       NUMERIC(10,2) NOT NULL DEFAULT 0,
    amount_due                    NUMERIC(10,2) NOT NULL,
    payment_status                 VARCHAR(20) NOT NULL
                                  CHECK (payment_status IN
                                  ('Paid','Unpaid','Partially Paid','Overdue','Refunded')),
    due_date                      DATE NOT NULL,
    paid_date                     DATE               -- NULL until paid
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_doctors_department      ON doctors(department_id);
CREATE INDEX idx_appointments_patient    ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor     ON appointments(doctor_id);
CREATE INDEX idx_appointments_date       ON appointments(appointment_date);
CREATE INDEX idx_prescriptions_appt      ON prescriptions(appointment_id);
CREATE INDEX idx_prescriptions_med       ON prescriptions(medication_id);
CREATE INDEX idx_invoices_patient        ON invoices(patient_id);
CREATE INDEX idx_invoices_appt           ON invoices(appointment_id);

-- ============================================================================
-- End of schema. Load 02_data.sql next.
-- ============================================================================
