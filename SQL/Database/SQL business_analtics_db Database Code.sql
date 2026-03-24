CREATE DATABASE business_analytics_db;

USE business_analytics_db;

CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    city VARCHAR(50),
    country VARCHAR(50),
    registration_date DATE
);

CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    category_id INT,
    price DECIMAL(10,2),
    stock_quantity INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id)
    REFERENCES categories(category_id)
);

CREATE TABLE employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    job_title VARCHAR(100),
    hire_date DATE,
    salary DECIMAL(10,2)
);

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    employee_id INT,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    order_status VARCHAR(50),
    
    FOREIGN KEY (customer_id)
    REFERENCES customers(customer_id),
    
    FOREIGN KEY (employee_id)
    REFERENCES employees(employee_id)
);

CREATE TABLE order_details (
    order_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    unit_price DECIMAL(10,2),
    discount DECIMAL(5,2) DEFAULT 0,
    
    FOREIGN KEY (order_id)
    REFERENCES orders(order_id),
    
    FOREIGN KEY (product_id)
    REFERENCES products(product_id)
);

CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    payment_date DATETIME,
    payment_method VARCHAR(50),
    amount DECIMAL(10,2),
    
    FOREIGN KEY (order_id)
    REFERENCES orders(order_id)
);

CREATE TABLE suppliers (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(100),
    contact_name VARCHAR(100),
    phone VARCHAR(20),
    city VARCHAR(50),
    country VARCHAR(50)
);

CREATE TABLE product_suppliers (
    product_supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    supplier_id INT,
    
    FOREIGN KEY (product_id)
    REFERENCES products(product_id),
    
    FOREIGN KEY (supplier_id)
    REFERENCES suppliers(supplier_id)
);

INSERT INTO categories (category_name, description) VALUES
('Electronics','Devices and gadgets'),
('Computers','Laptops and desktops'),
('Mobile Phones','Smartphones and accessories'),
('Home Appliances','Kitchen and home electronics'),
('Office Supplies','Office equipment'),
('Sports','Sports equipment'),
('Fashion','Clothing and accessories'),
('Books','Educational and recreational books'),
('Furniture','Home and office furniture'),
('Gaming','Gaming consoles and accessories');

INSERT INTO suppliers (supplier_name, contact_name, phone, city, country) VALUES
('TechSource Ltd','Michael Adams','08034567890','Lagos','Nigeria'),
('Global Gadgets','Sarah Johnson','08045678901','London','UK'),
('Smart Devices Co','David Lee','08056789012','New York','USA'),
('HomeTech Suppliers','Maria Garcia','08067890123','Toronto','Canada'),
('OfficeWorld','Ahmed Hassan','08078901234','Dubai','UAE');

INSERT INTO products (product_name, category_id, price, stock_quantity) VALUES
('Dell Laptop',2,850.00,50),
('HP Laptop',2,800.00,40),
('iPhone 13',3,999.00,60),
('Samsung Galaxy S21',3,850.00,70),
('LED Television',1,600.00,30),
('Office Chair',9,120.00,90),
('Gaming Mouse',10,45.00,150),
('Football',6,25.00,200),
('Men T-Shirt',7,15.00,300),
('Python Programming Book',8,40.00,120);

INSERT INTO product_suppliers (product_id, supplier_id) VALUES
(1,1),
(2,1),
(3,2),
(4,2),
(5,3),
(6,4),
(7,1),
(8,5),
(9,5),
(10,4);

INSERT INTO employees (first_name, last_name, email, job_title, hire_date, salary) VALUES
('John','Smith','john@company.com','Sales Manager','2020-01-10',55000),
('Mary','Johnson','mary@company.com','Sales Representative','2021-03-12',42000),
('Daniel','Brown','daniel@company.com','Data Analyst','2022-07-18',60000),
('Grace','Wilson','grace@company.com','Customer Support','2021-11-02',38000),
('James','Taylor','james@company.com','Operations Manager','2019-09-25',70000);

INSERT INTO customers (first_name, last_name, email, phone, city, country, registration_date) VALUES
('Michael','Anderson','michael@email.com','08011111111','Lagos','Nigeria','2023-01-10'),
('Sarah','Williams','sarah@email.com','08022222222','Abuja','Nigeria','2023-02-14'),
('Ahmed','Ali','ahmed@email.com','08033333333','Cairo','Egypt','2023-03-22'),
('Linda','Garcia','linda@email.com','08044444444','Madrid','Spain','2023-04-05'),
('Robert','Miller','robert@email.com','08055555555','New York','USA','2023-05-18');

INSERT INTO orders (customer_id, employee_id, order_date, order_status) VALUES
(1,1,'2024-01-10','Completed'),
(2,2,'2024-01-15','Completed'),
(3,1,'2024-01-18','Pending'),
(4,3,'2024-01-22','Completed'),
(5,2,'2024-01-25','Shipped');

INSERT INTO order_details (order_id, product_id, quantity, unit_price, discount) VALUES
(1,1,1,850,0),
(1,7,2,45,0.05),
(2,3,1,999,0),
(3,5,1,600,0.1),
(4,10,3,40,0),
(5,6,2,120,0.05);

INSERT INTO payments (order_id, payment_date, payment_method, amount) VALUES
(1,'2024-01-10','Credit Card',940),
(2,'2024-01-15','Debit Card',999),
(3,'2024-01-18','Bank Transfer',540),
(4,'2024-01-22','Credit Card',120),
(5,'2024-01-25','Cash',240);