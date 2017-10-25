var inquirer = require('inquirer');
var mysql = require('mysql');

// Define the MySQL connection parameters
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,

	// Your username
	user: 'root',

	// Your password
	password: '',
	database: "bamazon_db"
});

function validateInput(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Please enter a whole non-zero number.';
	}
}

function validateNumber(value) {
	var number = parseFloat(value);
	var positive = parseFloat(value) > 0;

	if (number && positive) {
		return true;
	} else {
		return "Please enter a positive number for the unit price."	}
}


function promptManager() {
	inquirer.prompt([
			{
				type: "list",
				name: "choice",
				message: "Please select an option:",
				choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
			}
	]).then(function(input) {
		if (input.choice === "View Products for Sale") {
			availableInventory();
		} else if (input.choice === "View Low Inventory") {
			lowInventory();
		} else if (input.choice === "Add to Inventory") {
			addInventory();
		} else if (input.choice === "Add New Product") {
			newProduct();
		}
	})
}


function availableInventory() {
	console.log("Available Inventory:");
	console.log("-----------------------------------\n");

	// Construct the db query string
	var queryStr = "SELECT * FROM products";

	connection.query(queryStr, function(err, res) {
		if (err) throw err;

			for (var i = 0; i < res.length; i++) {
				console.log([
					"Item ID: " + res[i].item_id,
					"Product Name: " + res[i].product_name,
					"Department: " + res[i].department_name,
					"Price: $" + res[i].price + "\n"
				].join(" // "));

			}

		console.log("------------------------------------------------------------------------------------\n");
		
		connection.end();
	});
}


function lowInventory() {
	console.log("Low Inventory Items (below qty 5):");
	console.log("-----------------------------------\n");

	// Construct the db query string
	var queryStr = "SELECT * FROM products WHERE stock_quantity < 5";

	connection.query(queryStr, function(err, res) {
		if (err) throw err;

			for (var i = 0; i < res.length; i++) {
				console.log([
					"Item ID: " + res[i].item_id,
					"Product Name: " + res[i].product_name,
					"Department: " + res[i].department_name,
					"Price: $" + res[i].price + "\n"
				].join(" // "));

			}

		console.log("------------------------------------------------------------------------------------\n");
		
		connection.end();
	});
}


function addInventory() {
	inquirer.prompt([
		{
			type: 'input',
			name: 'item_id',
			message: "Please enter the Item ID you would like to add too.",
			validate: validateInput, 
		},
		{
			type: 'input',
			name: 'quantity',
			message: "How many items would you like to add?",
			validate: validateInput
		}
	]).then(function(input) {
		var item = input.item_id;
		var itemInArr = parseInt(item);
		var placeInArr = itemInArr - 1;

		var quantity = input.quantity;

		var queryStr = "SELECT * FROM products";

		connection.query(queryStr, function(err, res) {
			if (err) throw err;

			var productData = res[placeInArr];

			var updateQueryStr = "UPDATE products SET stock_quantity = " + ( parseInt(productData.stock_quantity) + parseInt(quantity) ) + " WHERE item_id = " + item;

			connection.query(updateQueryStr, function(err, data) {
				if (err) throw err;

				console.log("\nStock quantity for Item ID " + item + " has been updated to " + (parseInt(productData.stock_quantity) + parseInt(quantity)));
				console.log("\n---------------------------------------------------------------------\n");

				// End the database connection
				connection.end();
			});

		});
	})
}


function newProduct() {
	inquirer.prompt([
		{
			type: 'input',
			name: 'product_name',
			message: 'Please enter the name of the new product you would like to add.',
		},
		{
			type: 'input',
			name: 'department_name',
			message: 'Which department does the new product belong to?',
		},
		{
			type: 'input',
			name: 'price',
			message: 'What is the price per unit of the item?',
			validate: validateNumber
		},
		{
			type: 'input',
			name: 'stock_quantity',
			message: 'How many would you like to add?',
			validate: validateInput
		}
	]).then(function(input) {

		console.log("\nNew Product Info: \n");   
		console.log("Product Name = " + input.product_name + "\n"); 
		console.log("Department = " + input.department_name + "\n")  
		console.log("price = " + input.price + "\n");  
		console.log("Stock Quantity = " + input.stock_quantity + "\n");

		// Create the insertion query string
		var queryStr = 'INSERT INTO products SET ?';

		// Add new product to the db
		connection.query(queryStr, input, function (error, results, fields) {
			if (error) throw error;

			console.log('A new product has been added to the inventory under Item ID ' + results.insertId + '.');
			console.log("---------------------------------------------------------------------\n");

			// End the database connection
			connection.end();
		});
	})
}


function runBamazon() {
	console.log("\nWelcome to BAMAZON!");
	console.log("---------------------------\n");

	// Display available inventory
	promptManager();
}

runBamazon();