-- ============================================================================
-- GLOBALMART ANALYTICS -- Teaching Database for Business SQL
-- ============================================================================
-- Dialect: PostgreSQL (tested on 13+)
--
-- Notes for other engines:
--   MySQL   : replace "SERIAL" with "INT AUTO_INCREMENT", remove
--             "GENERATED ALWAYS AS IDENTITY" style if present, and change
--             BOOLEAN defaults if needed (MySQL accepts TRUE/FALSE fine).
--   SQLite  : replace "SERIAL PRIMARY KEY" with
--             "INTEGER PRIMARY KEY AUTOINCREMENT" and drop explicit FK
--             constraint syntax variations if you hit issues (SQLite is lax
--             about types anyway).
--
-- Business scenario:
--   GlobalMart is a mid-size B2B distributor selling office equipment,
--   electronics, furniture and supplies to companies across several regions.
--   The schema models the full order-to-cash cycle: regions, org structure,
--   customers, suppliers, products, orders, order line items and payments.
--   It's intentionally "messy" in realistic ways (nulls, cancelled orders,
--   discounts, failed payments) so students get practice with real-world
--   query patterns, not toy data.
-- ============================================================================

-- Clean slate -----------------------------------------------------------------
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS regions CASCADE;

-- ============================================================================
-- 1. REGIONS  -- geographic/operational regions used by employees, customers,
--                and shipments
-- ============================================================================
CREATE TABLE regions (
    region_id       SERIAL PRIMARY KEY,
    region_name     VARCHAR(50)  NOT NULL,
    country         VARCHAR(50)  NOT NULL,
    timezone        VARCHAR(50)  NOT NULL
);

-- ============================================================================
-- 2. DEPARTMENTS -- internal org units
-- ============================================================================
CREATE TABLE departments (
    department_id       SERIAL PRIMARY KEY,
    department_name     VARCHAR(60)  NOT NULL,
    annual_budget        NUMERIC(12,2) NOT NULL,
    department_head_id  INT NULL   -- FK to employees, added after employees exists
);

-- ============================================================================
-- 3. EMPLOYEES -- sales reps, managers, support staff
-- ============================================================================
CREATE TABLE employees (
    employee_id      SERIAL PRIMARY KEY,
    first_name       VARCHAR(50) NOT NULL,
    last_name        VARCHAR(50) NOT NULL,
    email            VARCHAR(120) UNIQUE NOT NULL,
    phone            VARCHAR(30),
    hire_date        DATE NOT NULL,
    job_title        VARCHAR(60) NOT NULL,
    department_id    INT REFERENCES departments(department_id),
    region_id        INT REFERENCES regions(region_id),
    manager_id       INT REFERENCES employees(employee_id),  -- self-referencing
    base_salary      NUMERIC(10,2) NOT NULL,
    commission_pct   NUMERIC(5,2) DEFAULT 0,      -- e.g. 2.50 = 2.5%
    employment_status VARCHAR(20) NOT NULL DEFAULT 'Active'
                     CHECK (employment_status IN ('Active','On Leave','Terminated'))
);

ALTER TABLE departments
    ADD CONSTRAINT fk_dept_head FOREIGN KEY (department_head_id)
    REFERENCES employees(employee_id);

-- ============================================================================
-- 4. CUSTOMERS -- the companies GlobalMart sells to
-- ============================================================================
CREATE TABLE customers (
    customer_id        SERIAL PRIMARY KEY,
    company_name        VARCHAR(120) NOT NULL,
    contact_name         VARCHAR(80)  NOT NULL,
    contact_title        VARCHAR(60),
    email                VARCHAR(120),
    phone                VARCHAR(30),
    address_line         VARCHAR(150),
    city                 VARCHAR(60),
    state_province       VARCHAR(60),
    postal_code          VARCHAR(20),
    country              VARCHAR(60),
    customer_segment     VARCHAR(20) NOT NULL
                         CHECK (customer_segment IN
                         ('Enterprise','SMB','Startup','Government','Non-Profit')),
    credit_limit         NUMERIC(12,2) DEFAULT 0,
    account_manager_id   INT REFERENCES employees(employee_id),
    region_id            INT REFERENCES regions(region_id),
    signup_date          DATE NOT NULL,
    is_active            BOOLEAN NOT NULL DEFAULT TRUE
);

-- ============================================================================
-- 5. CATEGORIES -- product categories
-- ============================================================================
CREATE TABLE categories (
    category_id     SERIAL PRIMARY KEY,
    category_name    VARCHAR(60) NOT NULL,
    description      VARCHAR(255)
);

-- ============================================================================
-- 6. SUPPLIERS -- vendors GlobalMart buys product from
-- ============================================================================
CREATE TABLE suppliers (
    supplier_id          SERIAL PRIMARY KEY,
    supplier_name         VARCHAR(120) NOT NULL,
    contact_name          VARCHAR(80),
    email                 VARCHAR(120),
    phone                 VARCHAR(30),
    country               VARCHAR(60),
    reliability_rating    NUMERIC(2,1) CHECK (reliability_rating BETWEEN 1.0 AND 5.0),
    lead_time_days        INT DEFAULT 7
);

-- ============================================================================
-- 7. PRODUCTS -- items GlobalMart sells
-- ============================================================================
CREATE TABLE products (
    product_id       SERIAL PRIMARY KEY,
    product_name      VARCHAR(120) NOT NULL,
    category_id       INT REFERENCES categories(category_id),
    supplier_id       INT REFERENCES suppliers(supplier_id),
    unit_price        NUMERIC(10,2) NOT NULL,
    unit_cost         NUMERIC(10,2) NOT NULL,
    units_in_stock    INT NOT NULL DEFAULT 0,
    reorder_level     INT NOT NULL DEFAULT 10,
    units_on_order    INT NOT NULL DEFAULT 0,
    discontinued      BOOLEAN NOT NULL DEFAULT FALSE,
    launch_date       DATE
);

-- ============================================================================
-- 8. ORDERS -- one row per sales order (header)
-- ============================================================================
CREATE TABLE orders (
    order_id        SERIAL PRIMARY KEY,
    customer_id      INT NOT NULL REFERENCES customers(customer_id),
    employee_id      INT REFERENCES employees(employee_id),
    order_date       DATE NOT NULL,
    required_date    DATE,
    shipped_date     DATE,
    ship_region_id   INT REFERENCES regions(region_id),
    order_status     VARCHAR(20) NOT NULL
                     CHECK (order_status IN
                     ('Pending','Processing','Shipped','Delivered','Cancelled','Returned')),
    payment_method   VARCHAR(30)
                     CHECK (payment_method IN
                     ('Credit Card','Bank Transfer','Purchase Order','Check','PayPal')),
    shipping_cost    NUMERIC(10,2) DEFAULT 0,
    notes            VARCHAR(255)
);

-- ============================================================================
-- 9. ORDER_ITEMS -- line items (many-to-many between orders and products)
-- ============================================================================
CREATE TABLE order_items (
    order_item_id   SERIAL PRIMARY KEY,
    order_id         INT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id       INT NOT NULL REFERENCES products(product_id),
    quantity         INT NOT NULL CHECK (quantity > 0),
    unit_price       NUMERIC(10,2) NOT NULL,   -- price AT TIME OF SALE (may differ from current product price)
    discount_pct     NUMERIC(5,2) DEFAULT 0    -- e.g. 10.00 = 10% off this line
);

-- ============================================================================
-- 10. PAYMENTS -- payments applied against orders (an order can have 0+ payments)
-- ============================================================================
CREATE TABLE payments (
    payment_id           SERIAL PRIMARY KEY,
    order_id              INT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    payment_date          DATE NOT NULL,
    amount                NUMERIC(12,2) NOT NULL,
    payment_method        VARCHAR(30),
    payment_status        VARCHAR(20) NOT NULL
                         CHECK (payment_status IN
                         ('Completed','Pending','Failed','Refunded')),
    transaction_reference VARCHAR(60)
);

-- ============================================================================
-- INDEXES -- speed up the joins/filters students will practice
-- ============================================================================
CREATE INDEX idx_employees_dept        ON employees(department_id);
CREATE INDEX idx_employees_manager     ON employees(manager_id);
CREATE INDEX idx_customers_region      ON customers(region_id);
CREATE INDEX idx_customers_manager     ON customers(account_manager_id);
CREATE INDEX idx_products_category     ON products(category_id);
CREATE INDEX idx_products_supplier     ON products(supplier_id);
CREATE INDEX idx_orders_customer       ON orders(customer_id);
CREATE INDEX idx_orders_employee       ON orders(employee_id);
CREATE INDEX idx_orders_date           ON orders(order_date);
CREATE INDEX idx_order_items_order     ON order_items(order_id);
CREATE INDEX idx_order_items_product   ON order_items(product_id);
CREATE INDEX idx_payments_order        ON payments(order_id);

-- ============================================================================
-- End of schema. Load 02_data.sql next.
-- ============================================================================
