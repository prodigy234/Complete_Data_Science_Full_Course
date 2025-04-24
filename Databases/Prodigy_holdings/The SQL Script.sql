-- CREATE DATABASE prodigy_holdings;

-- USE prodigy_holdings;

-- CREATE TABLE customers (
--     customer_id INT PRIMARY KEY,
--     first_name VARCHAR(50),
--     last_name VARCHAR(50),
--     email VARCHAR(100),
--     phone VARCHAR(20),
--     created_at DATETIME
-- );

-- CREATE TABLE products (
--     product_id INT PRIMARY KEY,
--     product_name VARCHAR(100),
--     category VARCHAR(50),
--     price DECIMAL(10, 2),
--     stock_quantity INT
-- );

-- CREATE TABLE orders (
--     order_id INT PRIMARY KEY,
--     customer_id INT,
--     order_date DATETIME,
--     total_amount DECIMAL(10, 2),
--     FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
-- );

-- CREATE TABLE order_items (
--     order_item_id INT PRIMARY KEY,
--     order_id INT,
--     product_id INT,
--     quantity INT,
--     unit_price DECIMAL(10, 2),
--     FOREIGN KEY (order_id) REFERENCES orders(order_id),
--     FOREIGN KEY (product_id) REFERENCES products(product_id)
-- );

-- CREATE TABLE employees (
--     employee_id INT PRIMARY KEY,
--     first_name VARCHAR(50),
--     last_name VARCHAR(50),
--     position VARCHAR(50),
--     hire_date DATE
-- );

-- CREATE TABLE sales (
--     sale_id INT PRIMARY KEY,
--     product_id INT,
--     employee_id INT,
--     sale_date DATETIME,
--     quantity_sold INT,
--     total_price DECIMAL(10, 2),
--     FOREIGN KEY (product_id) REFERENCES products(product_id),
--     FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
-- );


