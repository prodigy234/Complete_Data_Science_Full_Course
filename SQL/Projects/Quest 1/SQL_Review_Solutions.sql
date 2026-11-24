-- SQL Review Solutions (MySQL)
-- Part 1: setup
CREATE DATABASE IF NOT EXISTS company_db;
USE company_db;

CREATE TABLE Department (
    DepartmentID   INT PRIMARY KEY,
    DepartmentName VARCHAR(50) NOT NULL,
    Location       VARCHAR(50),
    DepartmentType VARCHAR(60)
);

CREATE TABLE Employees (
    EmployeeID     INT PRIMARY KEY,
    EmployeeName   VARCHAR(50) NOT NULL,
    Gender         VARCHAR(10),
    Salary         INT,
    DepartmentID   INT,
    Email          VARCHAR(100),
    HireDate       DATE,
    FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID)
);

CREATE TABLE Project (
    ProjectID      INT PRIMARY KEY,
    ProjectName    VARCHAR(100) NOT NULL,
    EmployeeID     INT NULL,
    DepartmentID   INT NULL,
    Budget         INT,
    StartDate      DATE,
    Status         VARCHAR(20),
    Priority       VARCHAR(20),
    FOREIGN KEY (EmployeeID)   REFERENCES Employees(EmployeeID),
    FOREIGN KEY (DepartmentID) REFERENCES Department(DepartmentID)
);

INSERT INTO Department (DepartmentID, DepartmentName, Location, DepartmentType) VALUES
  (100, 'Finance', 'Lagos', 'Corporate Finance'),
  (200, 'Human Resources', 'Abuja', 'People Management'),
  (300, 'Information Technology', 'Port Harcourt', 'Technology'),
  (400, 'Marketing', 'Enugu', 'Marketing & Communications'),
  (500, 'Sales', 'Lagos', 'Revenue & Sales'),
  (600, 'Operations', 'Ibadan', 'Business Operations');

INSERT INTO Employees (EmployeeID, EmployeeName, Gender, Salary, DepartmentID, Email, HireDate) VALUES
  (101, 'John', 'Male', 65000, 100, 'john@company.com', '2022-01-15'),
  (102, 'Mary', 'Female', 58000, 200, 'mary@company.com', '2023-03-20'),
  (103, 'Peter', 'Male', 72000, 300, 'peter@company.com', '2021-07-10'),
  (104, 'Grace', 'Female', 68000, 100, 'grace@company.com', '2022-09-05'),
  (105, 'David', 'Male', 70000, 500, 'david@company.com', '2020-11-12'),
  (106, 'Susan', 'Female', 62000, 400, 'susan@company.com', '2023-01-25'),
  (107, 'James', 'Male', 75000, 300, 'james@company.com', '2019-06-18'),
  (108, 'Linda', 'Female', 59000, 200, 'linda@company.com', '2024-02-14'),
  (109, 'Michael', 'Male', 67000, 500, 'michael@company.com', '2021-10-30'),
  (110, 'Sarah', 'Female', 64000, 400, 'sarah@company.com', '2022-12-01'),
  (111, 'Daniel', 'Male', 61000, 500, 'daniel@company.com', '2024-05-08'),
  (112, 'Esther', 'Female', 69000, 100, 'esther@company.com', '2023-08-22'),
  (113, 'Victor', 'Male', 63000, 400, 'victor@company.com', '2025-01-10');

INSERT INTO Project (ProjectID, ProjectName, EmployeeID, DepartmentID, Budget, StartDate, Status, Priority) VALUES
  (1001, 'Financial Reporting Automation', 101, 100, 85000, '2026-01-05', 'Completed', 'High'),
  (1002, 'Payroll System Upgrade', 102, 200, 60000, '2026-01-12', 'In Progress', 'High'),
  (1003, 'Cloud Migration', 103, 300, 150000, '2026-01-20', 'In Progress', 'Critical'),
  (1004, 'Budget Control Dashboard', 104, 100, 90000, '2026-02-03', 'Completed', 'Medium'),
  (1005, 'CRM Implementation', 105, 500, 180000, '2026-02-10', 'In Progress', 'Critical'),
  (1006, 'Digital Marketing Campaign', 106, 400, 75000, '2026-02-18', 'Completed', 'Medium'),
  (1007, 'Cybersecurity Upgrade', 107, 300, 130000, '2026-02-25', 'In Progress', 'Critical'),
  (1008, 'Recruitment Portal', 108, 200, 55000, '2026-03-05', 'Planned', 'Medium'),
  (1009, 'Sales Analytics Dashboard', 109, 500, 110000, '2026-03-12', 'Completed', 'High'),
  (1010, 'Brand Awareness Campaign', 110, 400, 70000, '2026-03-20', 'In Progress', 'Medium'),
  (1011, 'Sales Forecasting Model', 111, 500, 95000, '2026-04-02', 'Planned', 'High'),
  (1012, 'Financial Audit System', 112, 100, 125000, '2026-04-10', 'In Progress', 'High'),
  (1013, 'Employee Training Platform', 102, 200, 65000, '2026-04-18', 'Completed', 'Medium'),
  (1014, 'Data Warehouse Project', 103, 300, 200000, '2026-05-03', 'In Progress', 'Critical'),
  (1015, 'Customer Retention Campaign', 105, 500, 85000, '2026-05-15', 'Planned', 'High'),
  (1016, 'IT Service Desk Upgrade', 107, 300, 100000, '2026-05-22', 'Completed', 'High'),
  (1017, 'Market Research Study', 106, 400, 50000, '2026-06-05', 'Planned', 'Low'),
  (1018, 'Expense Management System', 101, 100, 95000, '2026-06-12', 'In Progress', 'High'),
  (1019, 'Product Launch Campaign', 110, 400, 120000, '2026-06-20', 'Planned', 'Critical'),
  (1020, 'Sales Performance Review', 109, 500, 80000, '2026-07-02', 'Completed', 'Medium'),
  (1021, 'Employee Engagement Survey', NULL, NULL, 45000, '2026-07-10', 'Planned', 'Low'),
  (1022, 'Operations Process Review', NULL, 600, 90000, '2026-07-18', 'Planned', 'Medium');

-- Part 2: solutions

-- Question 1: Display all columns and records from the Employees table.
SELECT *
FROM Employees;

-- Question 2: Display only EmployeeID, EmployeeName, Salary, and DepartmentID from the Employees table.
SELECT EmployeeID, EmployeeName, Salary, DepartmentID
FROM Employees;

-- Question 3: Display EmployeeName as Employee and Salary as Monthly Salary.
SELECT EmployeeName AS Employee,
       Salary AS `Monthly Salary`
FROM Employees;

-- Question 4: Display ProjectName as Project, Budget as Project Budget, and Status as Project Status.
SELECT ProjectName AS Project,
       Budget AS `Project Budget`,
       Status AS `Project Status`
FROM Project;

-- Question 5: Display EmployeeName, Salary, and calculate a new column called Annual Salary by multiplying salary by 12.
SELECT EmployeeName, Salary,
       Salary * 12 AS `Annual Salary`
FROM Employees;

-- Question 6: Display DepartmentName as Department and Location as Office Location.
SELECT DepartmentName AS Department,
       Location AS `Office Location`
FROM Department;

-- Question 7: Find all employees whose salary is greater than 65,000.
SELECT *
FROM Employees
WHERE Salary > 65000;

-- Question 8: Find all employees whose salary is less than 65,000.
SELECT *
FROM Employees
WHERE Salary < 65000;

-- Question 9: Find all employees whose salary is equal to 70,000.
SELECT *
FROM Employees
WHERE Salary = 70000;

-- Question 10: Find all employees whose salary is not equal to 65,000.
SELECT *
FROM Employees
WHERE Salary <> 65000;

-- Question 11: Find all employees who belong to DepartmentID = 100.
SELECT *
FROM Employees
WHERE DepartmentID = 100;

-- Question 12: Find all employees who do not belong to DepartmentID = 100.
SELECT *
FROM Employees
WHERE DepartmentID <> 100;

-- Question 13: Find all projects with a budget greater than 100,000.
SELECT *
FROM Project
WHERE Budget > 100000;

-- Question 14: Find all projects with a budget less than 80,000.
SELECT *
FROM Project
WHERE Budget < 80000;

-- Question 15: Find all projects whose status is Completed.
SELECT *
FROM Project
WHERE Status = 'Completed';

-- Question 16: Find all projects whose status is not Completed.
SELECT *
FROM Project
WHERE Status <> 'Completed';

-- Question 17: Find employees whose salaries are between 60,000 and 70,000.
SELECT *
FROM Employees
WHERE Salary BETWEEN 60000 AND 70000;

-- Question 18: Find projects whose budgets are between 80,000 and 150,000.
SELECT *
FROM Project
WHERE Budget BETWEEN 80000 AND 150000;

-- Question 19: Find projects that started between 2026-02-01 and 2026-04-30.
SELECT *
FROM Project
WHERE StartDate BETWEEN '2026-02-01' AND '2026-04-30';

-- Question 20: Find employees whose salaries are between 65,000 and 75,000, then display their names and salaries.
SELECT EmployeeName, Salary
FROM Employees
WHERE Salary BETWEEN 65000 AND 75000;

-- Question 21: Find employees belonging to departments 100, 300, and 500 using IN.
SELECT *
FROM Employees
WHERE DepartmentID IN (100, 300, 500);

-- Question 22: Find employees belonging to departments 200 and 400.
SELECT *
FROM Employees
WHERE DepartmentID IN (200, 400);

-- Question 23: Find projects whose status is either Completed or Planned using IN.
SELECT *
FROM Project
WHERE Status IN ('Completed', 'Planned');

-- Question 24: Find projects whose priority is either High or Critical.
SELECT *
FROM Project
WHERE Priority IN ('High', 'Critical');

-- Question 25: Display all employees ordered by salary from lowest to highest.
SELECT *
FROM Employees
ORDER BY Salary ASC;

-- Question 26: Display all projects ordered by budget from highest to lowest.
SELECT *
FROM Project
ORDER BY Budget DESC;

-- Question 27: Display employees alphabetically by EmployeeName.
SELECT *
FROM Employees
ORDER BY EmployeeName ASC;

-- Question 28: Display the 5 highest-paid employees.
SELECT *
FROM Employees
ORDER BY Salary DESC
LIMIT 5;

-- Question 29: Display the 3 employees with the lowest salaries.
SELECT *
FROM Employees
ORDER BY Salary ASC
LIMIT 3;

-- Question 30: Display the 5 largest projects by budget.
SELECT *
FROM Project
ORDER BY Budget DESC
LIMIT 5;

-- Question 31: Skip the first 5 employees and display the next 5 employees.
SELECT *
FROM Employees
ORDER BY EmployeeID
LIMIT 5 OFFSET 5;

-- Question 32: Display the 6th to 10th highest-paid employees.
SELECT *
FROM Employees
ORDER BY Salary DESC
LIMIT 5 OFFSET 5;

-- Question 33: Count the number of employees in each department.
SELECT DepartmentID, COUNT(*) AS TotalEmployees
FROM Employees
GROUP BY DepartmentID
ORDER BY DepartmentID;

-- Question 34: Calculate the average salary for each department.
SELECT DepartmentID, ROUND(AVG(Salary), 2) AS AverageSalary
FROM Employees
GROUP BY DepartmentID
ORDER BY DepartmentID;

-- Question 35: Calculate the total salary paid by each department.
SELECT DepartmentID, SUM(Salary) AS TotalSalary
FROM Employees
GROUP BY DepartmentID
ORDER BY DepartmentID;

-- Question 36: Find the highest salary in each department.
SELECT DepartmentID, MAX(Salary) AS HighestSalary
FROM Employees
GROUP BY DepartmentID
ORDER BY DepartmentID;

-- Question 37: Find the lowest salary in each department.
SELECT DepartmentID, MIN(Salary) AS LowestSalary
FROM Employees
GROUP BY DepartmentID
ORDER BY DepartmentID;

-- Question 38: Count the number of projects assigned to each employee.
SELECT e.EmployeeID, e.EmployeeName,
       COUNT(p.ProjectID) AS TotalProjects
FROM Employees e
LEFT JOIN Project p ON e.EmployeeID = p.EmployeeID
GROUP BY e.EmployeeID, e.EmployeeName
ORDER BY e.EmployeeID;

-- Question 39: Calculate the total project budget managed by each employee.
SELECT e.EmployeeID, e.EmployeeName,
       COALESCE(SUM(p.Budget), 0) AS TotalProjectBudget
FROM Employees e
LEFT JOIN Project p ON e.EmployeeID = p.EmployeeID
GROUP BY e.EmployeeID, e.EmployeeName
ORDER BY e.EmployeeID;

-- Question 40: Find departments whose total salary expense is greater than 190,000.
SELECT DepartmentID, SUM(Salary) AS TotalSalary
FROM Employees
GROUP BY DepartmentID
HAVING SUM(Salary) > 190000;

-- Question 41: Find employees who are responsible for more than one project.
SELECT e.EmployeeID, e.EmployeeName, COUNT(p.ProjectID) AS TotalProjects
FROM Employees e
INNER JOIN Project p ON e.EmployeeID = p.EmployeeID
GROUP BY e.EmployeeID, e.EmployeeName
HAVING COUNT(p.ProjectID) > 1;

-- Question 42: Find employees whose total project budget is greater than 150,000.
SELECT e.EmployeeID, e.EmployeeName, SUM(p.Budget) AS TotalProjectBudget
FROM Employees e
INNER JOIN Project p ON e.EmployeeID = p.EmployeeID
GROUP BY e.EmployeeID, e.EmployeeName
HAVING SUM(p.Budget) > 150000;

-- Question 43: Find project statuses containing more than 5 projects.
SELECT Status, COUNT(*) AS TotalProjects
FROM Project
GROUP BY Status
HAVING COUNT(*) > 5;

-- Question 44: Find departments whose total project budget is greater than 300,000.
SELECT d.DepartmentID, d.DepartmentName, SUM(p.Budget) AS TotalProjectBudget
FROM Project p
INNER JOIN Department d ON p.DepartmentID = d.DepartmentID
GROUP BY d.DepartmentID, d.DepartmentName
HAVING SUM(p.Budget) > 300000;

-- Question 45: Use an INNER JOIN to display EmployeeName, Salary, DepartmentName, and Location.
SELECT e.EmployeeName, e.Salary, d.DepartmentName, d.Location
FROM Employees e
INNER JOIN Department d
    ON e.DepartmentID = d.DepartmentID;

-- Question 46: Use CASE to classify salary levels.
SELECT EmployeeName, Salary,
       CASE
           WHEN Salary >= 70000 THEN 'High'
           WHEN Salary >= 62000 THEN 'Medium'
           ELSE 'Low'
       END AS SalaryLevel
FROM Employees
ORDER BY Salary DESC;

-- Question 47: Use a LEFT JOIN to display all employees and their projects.
SELECT e.EmployeeID, e.EmployeeName,
       p.ProjectID, p.ProjectName, p.Budget, p.Status
FROM Employees e
LEFT JOIN Project p ON e.EmployeeID = p.EmployeeID
ORDER BY e.EmployeeID, p.ProjectID;
