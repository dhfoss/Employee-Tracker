const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'company'
});

connection.connect();

connection.query('SELECT * FROM employees', (err, res) => {
    if (err) throw err;
    console.table(res);
});

connection.end();




// What would you like to do?


// Add departments

// Add Roles

// Add Employees



// View departments

// View Roles

// View Employees



// Update Employee Roles



// inquirer.prompt({


// })