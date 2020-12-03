const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'company'
});

// connection.connect();

// connection.query('SELECT * FROM employees', (err, res) => {
//     if (err) throw err;
//     console.table(res);
// });

// connection.end();




// What would you like to do?

console.log('\n\nWelcome to the Employee Tracker\n\n===============================');
connection.connect();
init();


function init() {
    console.log('\n\n')
    inquirer.prompt([
        {
            type: 'list',
            name: 'init',
            message: 'What would you like to do?',
            choices: ['Add Departments', 'Add Roles', 'Add Employees', 'View Departments', 'View Roles', 'View Employess', 'Exit Employee Tracker']
        }
    ]).then((answers) => {
        switch(answers.init) {
            case 'Exit Employee Tracker':
                connection.end();
                console.log('Goodbye')
                break;
            case 'View Departments':
                viewDepartments();
                break;
            case 'View Roles':
                viewRoles();
                break;
        }
    })
}





// =============
// ADD FUNCTIONS
// =============
// Add departments
// Add Roles
// Add Employees





// ==============
// VIEW FUNCTIONS
// ==============


// View departments
function viewDepartments() {
    connection.query(`SELECT name AS 'Departments' FROM departments`, (err, res) => {
        if (err) throw err;
        console.log('\n\n')
        console.table(res);
        init();
    });
}

// View Roles
function viewRoles() {
    connection.query(`SELECT r.title AS 'Role', d.name AS 'Department', r.salary AS 'Salary'
                      FROM company.roles r
                      JOIN departments d
                      ON r.department_id = d.id
                      ORDER BY r.department_id`, 
                      (err, res) => {
                          if (err) throw err;
                          console.log('\n\n')
                          console.table(res);
                          init();
                      });
}

// View Employees



// Update Employee Roles