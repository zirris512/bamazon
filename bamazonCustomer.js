const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'bamazon'
});

connection.query('SELECT * FROM products', function(err, res) {
    if(err) throw err;
    for(let i = 0; i < res.length; i++) {
        console.log(`
    ID: ${res[i].item_id}
    Product Name: ${res[i].product_name}
    Quantity: ${res[i].stock_quantity}
    Price: ${res[i].price}`)
    }

    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the ID of the item you would like to buy?',
            name: 'choice',
            validate: function(value) {
                if(isNaN(value) === false) {
                    return true;
                }
                else {
                    return false;
                }
            }
        },
        {
            type: 'input',
            message: 'How many would you like to purchase?',
            name: 'quantity',
            validate: function (value) {
                if(isNaN(value) === false && parseInt(value) > 0) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    ]).then(function(response) {
        let chosenItem;
        for(let i = 0; i < res.length; i++) {
            if(response.choice == res[i].item_id) {
                chosenItem = res[i];
            }
        }
        if(!chosenItem) {
            return console.log('Invalid Item ID');
        }
        else if(chosenItem.stock_quantity < response.quantity) {
            return console.log('Quantity ordered is greater than quantity available');
        }
        else {
            updateItem(chosenItem, response.quantity);
        }
    });
});

const updateItem = (item, quantity) => {
    connection.query('UPDATE products SET ? WHERE ?',
    [{ stock_quantity: (item.stock_quantity - quantity )}, { item_id: item.item_id }], function(err) {
        if(err) throw err;
        console.log('\nItem purchased successfully!\n');
        connection.query('SELECT * FROM products WHERE ?', [{ item_id: item.item_id }], function(err, res) {
            if(err) throw err;
            let total = item.price * quantity;
            console.log(`Your total was $${total}\n`);
            console.log(`
    ID: ${res[0].item_id}
    Product Name: ${res[0].product_name}
    Quantity: ${res[0].stock_quantity}
    Price: ${res[0].price}`)
        })
    });
};