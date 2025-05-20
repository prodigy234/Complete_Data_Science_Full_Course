-- SELECT * FROM users WHERE name REGEXP '^A'

SELECT * FROM users WHERE name REGEXP 'Bo*b';

-- Names that start with A
SELECT * FROM users WHERE name REGEXP '^A';

-- Names that end with A
SELECT * FROM users WHERE name REGEXP 'a$';

-- Names starting with a, b, or c
SELECT * FROM users WHERE name REGEXP '^[abc]';

-- Names not starting with a, b, or c
SELECT * FROM users WHERE name REGEXP '^[^abc]';

-- Lowercase-starting names from a to z
SELECT * FROM users WHERE name REGEXP '^[a-z]';

-- Names that start with a number
SELECT * FROM users WHERE name REGEXP '^[0-9]';

-- Names of Exactly 4 Characters
SELECT * 
FROM users 
WHERE name REGEXP '^.{4}$';

-- Names with Only Digits (e.g., '123')
SELECT * 
FROM users 
WHERE name REGEXP '^[0-9]+$';

-- Names with Double Letters (e.g., 'oo', 'll')
SELECT * 
FROM users 
WHERE name REGEXP '(.)\\1';

-- Names Starting with a Vowel
SELECT * 
FROM users 
WHERE name REGEXP '^[aeiouAEIOU]';

-- Names Starting with a Consonant
SELECT * 
FROM users 
WHERE name REGEXP '^[^aeiouAEIOU]';

-- Names Containing Only Letters
SELECT * 
FROM users 
WHERE name REGEXP '^[A-Za-z]+$';

-- Names That Contain Numbers
SELECT * 
FROM users 
WHERE name REGEXP '[0-9]';

-- Names Ending with 'y' or 'e'
SELECT * 
FROM users 
WHERE name REGEXP '[ye]$';

-- Names with At Least One Uppercase Letter
SELECT * 
FROM users 
WHERE name REGEXP '[A-Z]';

-- Names That Start and End with the Same Letter For MySQL
SELECT * 
FROM users 
WHERE LEFT(name, 1) = RIGHT(name, 1);

-- Names That Start and End with the Same Letter For other RDBMS like PostgreSQL
-- SELECT * 
-- FROM users 
-- WHERE name REGEXP '^(.).*\1$';

-- Names with 2 to 5 Characters Only
SELECT * 
FROM users 
WHERE name REGEXP '^.{2,5}$';

-- Names That Contain the Word “man”

SELECT * 
FROM users 
WHERE name REGEXP 'man';