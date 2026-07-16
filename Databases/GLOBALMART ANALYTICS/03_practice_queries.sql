-- ============================================================================
-- GLOBALMART ANALYTICS -- Practice Queries for Teaching
-- Organized in a teaching progression: basics -> joins -> aggregation ->
-- subqueries/CTEs -> window functions -> business scenarios.
-- Uncomment and run one at a time in class.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- LEVEL 1: SELECT, WHERE, ORDER BY, LIMIT
-- ---------------------------------------------------------------------------

-- 1.1 Look at raw data
-- SELECT * FROM customers LIMIT 10;

-- 1.2 Filter rows
-- SELECT company_name, country, customer_segment
-- FROM customers
-- WHERE customer_segment = 'Enterprise';

-- 1.3 Sort and limit -- "Top 10 most expensive products"
-- SELECT product_name, unit_price
-- FROM products
-- ORDER BY unit_price DESC
-- LIMIT 10;

-- 1.4 Multiple conditions -- "Active US-based SMB customers"
-- SELECT company_name, city, state_province
-- FROM customers
-- WHERE country = 'United States' AND customer_segment = 'SMB' AND is_active = TRUE;


-- ---------------------------------------------------------------------------
-- LEVEL 2: JOINS
-- ---------------------------------------------------------------------------

-- 2.1 Basic join -- which company placed each order, and when
-- SELECT o.order_id, c.company_name, o.order_date, o.order_status
-- FROM orders o
-- JOIN customers c ON c.customer_id = o.customer_id
-- ORDER BY o.order_date DESC
-- LIMIT 20;

-- 2.2 Three-table join -- line items with product and order context
-- SELECT o.order_id, p.product_name, oi.quantity, oi.unit_price
-- FROM order_items oi
-- JOIN orders o ON o.order_id = oi.order_id
-- JOIN products p ON p.product_id = oi.product_id
-- LIMIT 20;

-- 2.3 LEFT JOIN -- find customers who have NEVER placed an order
-- SELECT c.customer_id, c.company_name
-- FROM customers c
-- LEFT JOIN orders o ON o.customer_id = c.customer_id
-- WHERE o.order_id IS NULL;

-- 2.4 Self join -- employees and their managers
-- SELECT e.first_name || ' ' || e.last_name AS employee,
--        m.first_name || ' ' || m.last_name AS manager
-- FROM employees e
-- LEFT JOIN employees m ON m.employee_id = e.manager_id
-- ORDER BY manager;


-- ---------------------------------------------------------------------------
-- LEVEL 3: AGGREGATION -- GROUP BY, HAVING
-- ---------------------------------------------------------------------------

-- 3.1 Revenue by product category
-- SELECT cat.category_name,
--        ROUND(SUM(oi.quantity * oi.unit_price * (1 - oi.discount_pct/100.0))::numeric, 2) AS revenue
-- FROM order_items oi
-- JOIN products p ON p.product_id = oi.product_id
-- JOIN categories cat ON cat.category_id = p.category_id
-- GROUP BY cat.category_name
-- ORDER BY revenue DESC;

-- 3.2 Orders per customer segment, with average order value
-- SELECT c.customer_segment,
--        COUNT(DISTINCT o.order_id) AS num_orders,
--        ROUND(AVG(order_totals.order_total)::numeric, 2) AS avg_order_value
-- FROM customers c
-- JOIN orders o ON o.customer_id = c.customer_id
-- JOIN (
--     SELECT order_id, SUM(quantity * unit_price * (1 - discount_pct/100.0)) AS order_total
--     FROM order_items
--     GROUP BY order_id
-- ) order_totals ON order_totals.order_id = o.order_id
-- GROUP BY c.customer_segment
-- ORDER BY avg_order_value DESC;

-- 3.3 HAVING -- categories with more than 500 units sold
-- SELECT cat.category_name, SUM(oi.quantity) AS units_sold
-- FROM order_items oi
-- JOIN products p ON p.product_id = oi.product_id
-- JOIN categories cat ON cat.category_id = p.category_id
-- GROUP BY cat.category_name
-- HAVING SUM(oi.quantity) > 500
-- ORDER BY units_sold DESC;

-- 3.4 Monthly revenue trend
-- SELECT DATE_TRUNC('month', o.order_date)::date AS month,
--        ROUND(SUM(oi.quantity * oi.unit_price * (1 - oi.discount_pct/100.0))::numeric, 2) AS revenue
-- FROM orders o
-- JOIN order_items oi ON oi.order_id = o.order_id
-- WHERE o.order_status <> 'Cancelled'
-- GROUP BY month
-- ORDER BY month;


-- ---------------------------------------------------------------------------
-- LEVEL 4: SUBQUERIES & CTEs
-- ---------------------------------------------------------------------------

-- 4.1 Subquery in WHERE -- products priced above the overall average
-- SELECT product_name, unit_price
-- FROM products
-- WHERE unit_price > (SELECT AVG(unit_price) FROM products);

-- 4.2 CTE -- top 5 customers by lifetime revenue
-- WITH customer_revenue AS (
--     SELECT o.customer_id,
--            SUM(oi.quantity * oi.unit_price * (1 - oi.discount_pct/100.0)) AS total_revenue
--     FROM orders o
--     JOIN order_items oi ON oi.order_id = o.order_id
--     WHERE o.order_status <> 'Cancelled'
--     GROUP BY o.customer_id
-- )
-- SELECT c.company_name, ROUND(cr.total_revenue::numeric, 2) AS lifetime_revenue
-- FROM customer_revenue cr
-- JOIN customers c ON c.customer_id = cr.customer_id
-- ORDER BY lifetime_revenue DESC
-- LIMIT 5;

-- 4.3 Correlated subquery -- customers whose most recent order was Cancelled
-- SELECT c.company_name
-- FROM customers c
-- WHERE (
--     SELECT o.order_status FROM orders o
--     WHERE o.customer_id = c.customer_id
--     ORDER BY o.order_date DESC LIMIT 1
-- ) = 'Cancelled';


-- ---------------------------------------------------------------------------
-- LEVEL 5: WINDOW FUNCTIONS
-- ---------------------------------------------------------------------------

-- 5.1 Rank sales reps by number of orders handled
-- SELECT e.first_name || ' ' || e.last_name AS rep,
--        COUNT(DISTINCT o.order_id) AS orders_handled,
--        RANK() OVER (ORDER BY COUNT(DISTINCT o.order_id) DESC) AS sales_rank
-- FROM employees e
-- JOIN orders o ON o.employee_id = e.employee_id
-- GROUP BY e.employee_id, rep
-- ORDER BY sales_rank;

-- 5.2 Running total of revenue by month
-- WITH monthly AS (
--     SELECT DATE_TRUNC('month', o.order_date)::date AS month,
--            SUM(oi.quantity * oi.unit_price * (1 - oi.discount_pct/100.0)) AS revenue
--     FROM orders o
--     JOIN order_items oi ON oi.order_id = o.order_id
--     GROUP BY month
-- )
-- SELECT month, ROUND(revenue::numeric,2) AS revenue,
--        ROUND(SUM(revenue) OVER (ORDER BY month)::numeric, 2) AS running_total
-- FROM monthly
-- ORDER BY month;

-- 5.3 Each customer's orders ranked by size (biggest order first)
-- SELECT c.company_name, o.order_id, ot.order_total,
--        ROW_NUMBER() OVER (PARTITION BY c.customer_id ORDER BY ot.order_total DESC) AS order_rank
-- FROM orders o
-- JOIN customers c ON c.customer_id = o.customer_id
-- JOIN (
--     SELECT order_id, SUM(quantity*unit_price*(1-discount_pct/100.0)) AS order_total
--     FROM order_items GROUP BY order_id
-- ) ot ON ot.order_id = o.order_id;


-- ---------------------------------------------------------------------------
-- LEVEL 6: BUSINESS SCENARIOS (multi-concept, discussion-style)
-- ---------------------------------------------------------------------------

-- 6.1 Which products are at risk of stockout? (below reorder level, not discontinued)
-- SELECT product_name, units_in_stock, reorder_level, units_on_order
-- FROM products
-- WHERE units_in_stock < reorder_level AND discontinued = FALSE
-- ORDER BY (reorder_level - units_in_stock) DESC;

-- 6.2 Payment health check -- outstanding (Pending/Failed) payments by customer
-- SELECT c.company_name, p.payment_status, p.amount, p.payment_date
-- FROM payments p
-- JOIN orders o ON o.order_id = p.order_id
-- JOIN customers c ON c.customer_id = o.customer_id
-- WHERE p.payment_status IN ('Pending','Failed')
-- ORDER BY p.payment_date;

-- 6.3 Employee performance -- revenue generated per sales rep, with headcount context
-- SELECT e.first_name || ' ' || e.last_name AS rep, d.department_name,
--        ROUND(SUM(oi.quantity*oi.unit_price*(1-oi.discount_pct/100.0))::numeric,2) AS revenue_generated
-- FROM employees e
-- JOIN departments d ON d.department_id = e.department_id
-- JOIN orders o ON o.employee_id = e.employee_id
-- JOIN order_items oi ON oi.order_id = o.order_id
-- WHERE o.order_status <> 'Cancelled'
-- GROUP BY rep, d.department_name
-- ORDER BY revenue_generated DESC;

-- 6.4 Customer concentration risk -- % of total revenue from top 5 customers
-- WITH customer_revenue AS (
--     SELECT o.customer_id, SUM(oi.quantity*oi.unit_price*(1-oi.discount_pct/100.0)) AS revenue
--     FROM orders o JOIN order_items oi ON oi.order_id = o.order_id
--     WHERE o.order_status <> 'Cancelled'
--     GROUP BY o.customer_id
-- ),
-- ranked AS (
--     SELECT *, RANK() OVER (ORDER BY revenue DESC) AS rnk, SUM(revenue) OVER () AS total_revenue
--     FROM customer_revenue
-- )
-- SELECT ROUND(SUM(revenue) FILTER (WHERE rnk <= 5)::numeric / SUM(total_revenue)::numeric * 100, 1)
--        AS pct_from_top5
-- FROM ranked;

-- ============================================================================
-- End of practice queries.
-- ============================================================================
