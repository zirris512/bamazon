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
    console.log(res);

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
                if(isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 100) {
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
        updateItem(chosenItem);
    });
});

const updateItem = item => {

}