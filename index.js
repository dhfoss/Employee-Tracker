const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql');
const Department = require(__dirname + '/classes/Department.js');
const Role = require(__dirname + '/classes/Role.js');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'company'
});


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
            choices: ['Add Department', 'Add Role', 'Add Employee', 'View Departments', 'View Roles', 'View Employees', 'Exit Employee Tracker']
        }
    ]).then((answers) => {
        switch(answers.init) {
            case 'Exit Employee Tracker':
                connection.end();
                console.log('Goodbye');
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'View Departments':
                viewDepartments();
                break;
            case 'View Employees':
                viewEmployees();
                break;
            case 'View Roles':
                viewRoles();
                break;
        }
    })
}



// // Regular expression for VARCHAR(30)
// /.{1,30}/



// =============
// ADD FUNCTIONS
// =============
// Add departments
function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the new department?'
        }
    ]).then((answers) => {
        insertDepartment(answers.name);
    });
}

function insertDepartment(newDepot) {
    connection.query('INSERT INTO departments SET ?', new Department(newDepot), (err, res) => {
        if (err) throw err;
        console.log(`Successfully added ${newDepot} to Departments`);
        init();
    });
}

// Add Roles
// title, salary, department
function addRole() {
    const array = [];
    getDepartmentsAsync()
    .then(data => {
            for (let i=0; i<data.length; i++) {
                array.push(data[i])
            }
        })
    .catch(err => {
        console.log(err);
    });

    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the title of the new role?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the new role?'
        },
        {
            type: 'list',
            name: 'department',
            message: 'In which department is the new role?',
            choices: array
        }
    ]).then(answers => {
        let departmentId;
        for (let i = 0; i < array.length; i++) {
            if (answers.department === array[i].name) {
                departmentId = array[i].id;
            }
        }
        insertRole(answers.title, answers.salary, departmentId);
    })
}

function insertRole(title, salary, department_id) {
    connection.query('INSERT INTO roles SET ?', new Role(title, salary, department_id), (err, res) => {
        if (err) throw err;
        console.log(`Successfully added ${title} to Roles`);
        init();
    });

}

function getDepartmentsAsync() {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM departments`, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        })
    })
}







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
function viewEmployees() {
    inquirer.prompt([
        {
            name: 'sortBy',
            type: 'list',
            message: 'How would you like to sort your employees?',
            choices: ['Last name', 'Manager', 'Department']
        }
    ]).then((answers) => {
        switch(answers.sortBy) {
            case 'Last name':
                sortByLastName();
                break;
            case 'Manager':
                sortByManager();
                break;
            case 'Department':
                sortByDepartment();
                break;
        }
    })
}

function sortByLastName() {
connection.query(`SELECT e.last_name AS 'Last Name', e.first_name AS 'First Name', r.title AS 'Role', d.name AS 'Department'
                  FROM employees e
                  JOIN roles r
                  ON e.role_id = r.id
                  LEFT JOIN departments d
                  ON r.department_id = d.id
                  ORDER BY e.last_name`, (err, res) => {
                    if (err) throw err;
                    console.log('\n\n')
                    console.table(res);
                    init();
                  });

}

function sortByManager() {
    connection.query(`SELECT e.last_name AS 'Employee Last Name', e.first_name AS 'Employee First Name', m.last_name AS 'Manager'
                      FROM employees e
                      LEFT JOIN employees m
                      ON e.manager_id = m.id
                      ORDER BY m.last_name, e.last_name`, (err, res) => {
                        if (err) throw err;
                        console.log('\n\n')
                        console.table(res);
                        init();
    });

}

function sortByDepartment() {
    connection.query(`SELECT d.name AS 'Department', e.last_name AS 'Last Name', e.first_name AS 'First Name', r.title AS 'Role'
                      FROM employees e
                      JOIN roles r
                      ON e.role_id = r.id
                      LEFT JOIN departments d
                      ON r.department_id = d.id
                      ORDER BY d.name, e.last_name`, (err, res) => {
                        if (err) throw err;
                        console.log('\n\n')
                        console.table(res);
                        init();
    });
}





// Update Employee Roles