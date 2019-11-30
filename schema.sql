DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(20),
    price DECIMAL(6,2),
    stock_quantity INT NOT NULL,
    PRIMARY KEY(item_id)
);

INSERT INTO products(item_id, product_name, department_name, price, stock_quantity) VALUES
    (3452, 'Laptop', 'Electronics', 1999.99, 44),
    (7755, 'Aleve', 'Pharmacy', 4.99, 65),
    (8321, 'Goldfish Crackers', 'Food&Bev', 3.99, 74),
    (3948, 'Super Mario', 'Electronics', 49.99, 4),
    (8890, 'Corn Chips', 'Food&Bev', 1.99, 70),
    (9445, 'Blanket', 'General', 89.99, 20),
    (5322, 'Clue', 'Toys', 14.99, 20),
    (4338, 'Doll', 'Toys', 9.99, 24),
    (3333, 'Cell Phone', 'Electronics', 699.99, 55),
    (2020, 'Glasses', 'Pharmacy', 39.99, 40);