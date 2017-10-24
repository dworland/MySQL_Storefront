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
		var parsedQty = parseInt(quantity);

		var queryStr = "SELECT * FROM products";

		connection.query(queryStr, function(err, res) {
			if (err) throw err;

			var productData = res[placeInArr];
			console.log(productData);
			var updatedQuantity = productData.stock_quantity + quantity;
			var parsedUpdatedQty = parseInt(updatedQuantity);


			var updateQueryStr = "UPDATE products SET stock_quantity = " + parsedUpdatedQty + " WHERE item_id = " + item;

			connection.query(updateQueryStr, function(err, data) {
				if (err) throw err;

				console.log("\nStock quantity for Item ID " + item + " has been updated to " + updatedQuantity);
				console.log("\n---------------------------------------------------------------------\n");

				// End the database connection
				connection.end();
			});

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