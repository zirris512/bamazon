const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'bamazon'
});
const prompts = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View Products For Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
            name: 'choice'
        }
    ]).then(function(response) {
        switch (response.choice) {
            case 'View Products For Sale':
                viewProducts();
                break;
            case 'View Low Inventory':
                viewInventory();
                break;
            case 'Add to Inventory':
                addStock();
                break;
            case 'Add New Product':
                addItem();
                break;
        };
    })
};

const viewProducts = () => {
    connection.query('SELECT * FROM products', function(err, res) {
        if(err) throw err;
        for(let i = 0; i < res.length; i++) {
            console.log(`
    ID: ${res[i].item_id}
    Product Name: ${res[i].product_name}
    Quantity: ${res[i].stock_quantity}
    Price: ${res[i].price}`);
        }
            prompts();
    });
};

const viewInventory = () => {
    connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(err, res) {
        if(err) throw err;
        for(let i = 0; i < res.length; i++) {
            console.log(`
    ID: ${res[i].item_id}
    Product Name: ${res[i].product_name}
    Quantity: ${res[i].stock_quantity}
    Price: ${res[i].price}`)
        }
            prompts();
    });
};

const addStock = () => {
    connection.query('SELECT * FROM products', function(err, res) {
        if(err) throw err;
        
    })
}

prompts();