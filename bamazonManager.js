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
            choices: ['View Products For Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit'],
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
            default:
                connection.end();
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
                message: 'Which item would you like to add to?',
                name: 'itemChoice',
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
                message: 'How much would you like to add?',
                name: 'addQuantity',
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
                if(response.itemChoice == res[i].item_id) {
                    chosenItem = res[i];
                }
            }

            if(!chosenItem) {
                return console.log('Invalid Item ID');
            }

            let total = chosenItem.stock_quantity + parseInt(response.addQuantity);
            connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [total, response.itemChoice], function(error) {
                if(error) throw error;
                console.log('\nItem Successfully Updated!\n');
                prompts();
            });
        });
    });
};

const addItem = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Item ID?',
            name: 'newID',
            validate: function(value) {
                if(isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 9999) {
                    return true;
                }
                else {
                    return false;
                }
            }
        },
        {
            type: 'input',
            message: 'Product Name?',
            name: 'newName'
        },
        {
            type: 'input',
            message: 'Department?',
            name: 'newDepartment'
        },
        {
            type: 'input',
            message: 'Price?',
            name: 'newPrice',
            validate: function(value) {
                if(isNaN(value) === false && parseFloat(value) > 0 && parseFloat(value) <= 9999.99) {
                    return true;
                }
                else {
                    return false;
                }
            }
        },
        {
            type: 'input',
            message: 'Quantity?',
            name: 'newQuantity',
            validate: function(value) {
                if(isNaN(value) === false && parseInt(value) > 0) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    ]).then(function(response) {
        connection.query('INSERT INTO products SET ?',
        {
            item_id: response.newID,
            product_name: response.newName,
            department_name: response.newDepartment,
            price: response.newPrice,
            stock_quantity: response.newQuantity
        }, function(err) {
            if(err) throw err;
            console.log('\nNew Item Added Successfully\n');
            prompts();
        });
    });
};

prompts();