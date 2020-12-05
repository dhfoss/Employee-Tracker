const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql');
const Department = require(__dirname + '/classes/Department.js');
const Role = require(__dirname + '/classes/Role.js');
const Employee = require(__dirname + '/classes/Employee.js');

// const viewFunctions = require(__dirname + '/crud-functions/read-functions/view.js');

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
            choices: ['Update Employee','Add Department', 'Add Role', 'Add Employee', 'View Departments', 'View Roles', 'View Employees', 'Delete Employee', 'Delete Department', 'Delete Role', 'Exit Employee Tracker'],
            pageSize: 12
        }
    ]).then((answers) => {
        switch(answers.init) {
            case 'Exit Employee Tracker':
                connection.end();
                console.log('Goodbye');
                break;
            case 'Update Employee':
                updateEmployee();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Add Employee':
                addEmployee();
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
            case 'Delete Employee':
                deleteEmployee();
                break;
            case 'Delete Department':
                deleteDepartment();
                break;
            case 'Delete Role':
                deleteRole();
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








// Add Employees

// First get an array of objects that includes:
// role titles and ids
// employee lastnames and ids

function addEmployee() {
    const rolesData = [];
    const rolesNames = [];

    const employeesData = [];
    const employeesNames = ['No Manager'];

    getRolesAsync()
    .then(data => {
        for (let i = 0; i < data.length; i++) {
            rolesData.push(data[i]);
            rolesNames.push(data[i].role)
        }

        getEmployeesAsync()
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                employeesData.push(data[i]);
                employeesNames.push(data[i].last_name)
            }
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    });

    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: `What is the employee's first name?`,
        },
        {
            type: 'input',
            name: 'lastName',
            message: `What is the employee's last name?`
        },
        {
            type: 'list',
            name: 'role',
            message: `What is the employee's role?`,
            choices: rolesNames
        },
        {
            type: 'list',
            name: 'manager',
            message: `Who is the employee's manager?`,
            choices: employeesNames
        }
    ]).then(answers => {
        let roleId;
        let managerId;

        for (let i = 0; i < rolesData.length; i++) {
            if (answers.role === rolesData[i].role) {
                roleId = rolesData[i].id;
            }
        }

        for (let i = 0; i < employeesData.length; i++) {
            if (answers.manager === employeesData[i].last_name) {
                managerId = employeesData[i].id;
            } else if (answers.manager === 'No Manager') {
                managerId = null;
            }
        }
        insertEmployee(answers.firstName, answers.lastName, roleId, managerId);
    });
}

function insertEmployee(firstName, lastName, roleId, managerId) {
    connection.query('INSERT INTO employees SET ?', new Employee(firstName, lastName, roleId, managerId), (err, res) => {
        if (err) throw err;
        console.log(`Successfully added ${firstName} ${lastName} to Employees`);
        init();
    });
}





// ==============
// VIEW FUNCTIONS
// ==============


// View departments MOVED TO VIEW PAGE
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

// Update Employee Information

function updateEmployee() {
    const rolesData = [];
    const rolesNames = [];

    const employeesData = [];
    const employeesNames = [];

    getRolesAsync()
    .then(data => {
        for (let i = 0; i < data.length; i++) {
            rolesData.push(data[i]);
            rolesNames.push(data[i].role)
        }

        getEmployeesAsync()
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                employeesData.push(data[i]);
                employeesNames.push(data[i].last_name)
            }
            updateEmployeeQuestions(rolesData, rolesNames, employeesData, employeesNames);
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    });
}


function updateEmployeeQuestions(rolesData, rolesNames, employeesData, employeesNames){
    inquirer.prompt([
        {
            type: 'list', 
            name: 'employee',
            message: 'Which employee would you like to update?',
            choices: employeesNames
        },
        {
            type: 'list',
            name: 'update',
            message: 'What information would you like to update?',
            choices: [`Employee's role`, `Employee's manager`, 'Cancel']
        }
    ]).then(answers => {
        let employeeId;
        for (let i = 0; i < employeesData.length; i++) {
            if (answers.employee === employeesData[i].last_name) {
                employeeId = employeesData[i].id;
            }
        }
        if (answers.update === `Employee's role`) {
            getNewRoleId(employeeId, rolesData, rolesNames)
        } else if (answers.update === `Employee's manager`) {
            employeesNames.push('No Manager');
            getManagerId(employeeId, employeesData, employeesNames)
        } else {
            init();
        }
    })
}


function getNewRoleId(employeeId, rolesData, rolesNames){
    inquirer.prompt([
        {
            type: 'list',
            name: 'role',
            message: `What is the employee's new role?`,
            choices: rolesNames
        }
    ]).then(answers => {
        let roleId;
        for (let i = 0; i < rolesData.length; i++) {
            if (answers.role === rolesData[i].role) {
                roleId = rolesData[i].id;
            }
        }
        updateEmployeeRole(employeeId, roleId)
    })
}

function updateEmployeeRole(employeeId, roleId) {
    connection.query(`UPDATE employees SET ? WHERE ?`, [
        {
            role_id: roleId
        },
        {
            id: employeeId
        }
    ],
    (err, res) => {
        if (err) throw err;
        console.log(`Successfully changed employee's role`);
        init();
    })
}


function getManagerId(employeeId, employeesData, employeesNames) {
    inquirer.prompt([
        {
            type: 'list', 
            name: 'manager',
            message: `Who is the employee's new manager?`,
            choices: employeesNames
        }
    ]).then(answers => {
        let managerId;
        for (let i = 0; i < employeesData.length; i++) {
            if (answers.manager === employeesData[i].last_name) {
                managerId = employeesData[i].id;
            }
        }
        if (answers.manager === 'No Manager') {
            managerId = null;
        }
        updateEmployeeManager(employeeId, managerId)
    })
}

function updateEmployeeManager(employeeId, managerId) {
    connection.query(`UPDATE employees SET ? WHERE ?`, [
        {
            manager_id: managerId
        },
        {
            id: employeeId
        }
    ],
    (err, res) => {
        if (err) throw err;
        console.log(`Successfully changed employee's manager`);
        init();
    })
}






// Delete Employee

function deleteEmployee() {
    getEmployeesAsync()
    .then(data => {
        const employeesData = [];
        const employeesNames = [];
        for (let i = 0; i < data.length; i++) {
            employeesData.push(data[i]);
            employeesNames.push(data[i].last_name)
        }
        deleteEmployeeQuestions(employeesData, employeesNames)
    })
    .catch(err => {
        console.log(err);
    })
}

function deleteEmployeeQuestions(employeesData, employeesNames) {
    inquirer.prompt([
        {
            type: 'list',
            name: 'name',
            message: 'Which employee would you like to delete?',
            choices: employeesNames,
            pageSize: 12
        },
        {
            type: 'confirm',
            name: 'confirm',
            message: 'Are you sure?'
        }
    ]).then(answers => {
        if (answers.confirm){
            let employeeId;
            for (let i = 0; i < employeesData.length; i++) {
                if (answers.name === employeesData[i].last_name) {
                    employeeId = employeesData[i].id;
                }
            }
            deleteEmployeeFromDb(employeeId, answers.name);
        } else {
            init();
        }
    })
}

function deleteEmployeeFromDb(employeeId, name) {
    connection.query(`DELETE FROM employees WHERE ?`, {id: employeeId}, (err, res) => {
        if (err) throw err;
        console.log(`Successfully deleted ${name} from the database.`);
        init();
    })
}


// Delete Department
function deleteDepartment() {
    const departmentsData = [];
    const departmentsNames = [];
    getDepartmentsAsync()
    .then(data => {
        for (let i = 0; i < data.length; i++) {
            departmentsData.push(data[i]);
            departmentsNames.push(data[i].name);
        }
        deleteDepartmentQuestions(departmentsData, departmentsNames);
    }).catch(err => {
        console.log(err);
    })
}

function deleteDepartmentQuestions(departmentsData, departmentsNames) {
    inquirer.prompt([
        {
            type: 'list',
            name: 'name',
            message: `Which department would you like to delete?`,
            choices: departmentsNames,
            pageSize: 12
        },
        {
            type: 'confirm',
            name: 'confirm',
            message: 'Are you sure?'
        }
    ]).then(answers => {
        if (answers.confirm) {
            let departmentId;
            for (let i = 0; i < departmentsData.length; i++) {
                if (answers.name === departmentsData[i].name) {
                    departmentId = departmentsData[i].id;
                }
            }
            deleteDepartmentFromDb(departmentId, answers.name);
        } else {
            init();
        }
    });
}

function deleteDepartmentFromDb(departmentId, name) {
    connection.query(`DELETE FROM departments WHERE ?`, {id: departmentId}, (err, res) => {
        if (err) throw err;
        console.log(`Successfully deleted ${name} from the database.`);
        init();
    })
}

// Delete Role

function deleteRole() {
    getRolesAsync()
    .then(data => {
        const rolesData = [];
        const rolesNames = [];
        for (let i = 0; i < data.length; i++) {
            rolesData.push(data[i]);
            rolesNames.push(data[i].role);
        }
        deleteRoleQuestions(rolesData, rolesNames);
    }).catch(err => {
        console.log(err);
    })
}


function deleteRoleQuestions(rolesData, rolesNames) {
    inquirer.prompt([
        {
            type: 'list',
            name: 'name',
            message: 'Which role would you like to delete?',
            choices: rolesNames,
            pageSize: 12
        },
        {
            type: 'confirm',
            name: 'confirm',
            message: 'Are you sure?'
        }
    ]).then(answers => {
        if (answers.confirm) {
            let roleId;
            for (let i = 0; i < rolesData.length; i++) {
                if (answers.name === rolesData[i].role) {
                    roleId = rolesData[i].id;
                }
            }
            deleteRoleFromDb(roleId, answers.name);
        } else {
            init();
        }
    })
}

function deleteRoleFromDb(roleId, name) {
    connection.query(`DELETE FROM roles WHERE ?`, {id: roleId}, (err, res) => {
        if (err) throw err;
        console.log(`Successfully deleted ${name} from database.`);
        init();
    })
}



// ===============
// Async Functions
// ===============

function getRolesAsync() {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT id, title AS 'role' FROM roles ORDER BY role`, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        });
    });
}

function getEmployeesAsync() {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT id, last_name FROM employees ORDER BY last_name`, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        });
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
