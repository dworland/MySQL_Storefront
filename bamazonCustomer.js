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


function promptQuestions() {
	inquirer.prompt([
		{
			type: 'input',
			name: 'item_id',
			message: 'Please enter the Item ID that you would like to purchase.',
			validate: validateInput, 
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many do you need?',
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
			var updatedQuantity = productData.stock_quantity - quantity;

			if (quantity <= productData.stock_quantity) {
				console.log("\nCongratulations, the product you requested is in stock! Your order is being placed!");

				var updateQueryStr = "UPDATE products SET stock_quantity = " + updatedQuantity + " WHERE item_id = " + item;

				// Update the inventory
				connection.query(updateQueryStr, function(err, data) {
					if (err) throw err;

					console.log("\nYour oder has been placed! Your total is $" + productData.price * quantity);
					console.log("\nThank you for shopping with us!");
					console.log("\n---------------------------------------------------------------------\n");

					// End the database connection
					connection.end();
				});

			} else {
				console.log("Sorry, there is not enough product in stock, your order can not be placed.");
				console.log("------------------------------------------------------------------------------------\n");

				availableInventory();
			}
			
		});

	});
}


function availableInventory() {
	console.log("Available Inventory:");
	console.log("---------------------------");

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
		promptQuestions();
	});
}


function runBamazon() {
	console.log("\nWelcome to BAMAZON!");
	console.log("---------------------------\n");

	// Display available inventory
	availableInventory();
}

runBamazon();

