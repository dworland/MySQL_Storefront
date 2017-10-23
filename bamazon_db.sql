-- Create a database called 'Bamazon' and switch into it for this activity --
CREATE DATABASE bamazon_db;

USE bamazon_db;


	-- Create a table called 'products' which will contain the store inventory --
	CREATE TABLE products (
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(100) NOT NULL,
	department_name VARCHAR(100) NOT NULL,
	price DECIMAL(10,2),
	stock_quantity INTEGER(10),
	PRIMARY KEY (item_id)
	);

	-- Insert mock data into the 'products' table --
	INSERT INTO products (product_name, department_name, price, stock_quantity) 
	VALUES ("Headphones", "Electronics", 25.99, 400),
			("Ibuprophen", "Pharmacy", 3.25, 650),
			("First Aid Kit", "Pharmacy", 11.99, 260),
			("Charmin Toilet Paper", "Grocery", 12.99, 800),
			("Yoga Mat", "Sports", 15.99, 125),
			('5lb Dumb bell', 'Sports', 7.99, 89),
			("Ninja Blender", "Kitchen", 89.95, 195),
			("Crock Pot", "Kitchen", 79.99, 275),
			("Glad 12 Gal Trash Bags", "Grocery", 5.99, 515),
			("K BELL Socks 9-Pack", "Clothing", 10.50, 380);