# Employee-Tracker

## Table of Contents
[Description](https://github.com/dhfoss/Employee-Tracker/#description)  
[Installation](https://github.com/dhfoss/Employee-Tracker/#installation)  
[Usage](https://github.com/dhfoss/Employee-Tracker/#usage)  
[Demonstration](https://github.com/dhfoss/Employee-Tracker/#demonstration)  
[Questions](https://github.com/dhfoss/Employee-Tracker/#questions)

### Description
This is a CLI app that allows a user to perform create, read, update, and delete (CRUD) functions on a SQL database representing the departments, roles and employees of a company.  It is set up in a user friendly way, and requires no knowledge of SQL commands to operate.

### Installation
This app uses inquirer.js, mysql, console.table, and comma-number.  Run `npm install` in the root directory to download these dependencies. Since it interacts with a SQL database, a SQL interface is also required.

### Usage
First, download the schema.sql file to create the database and three tables that contain the info for departments, roles, and employees.  A seed.sql file is included as an example.  
![Schema](/screen-shots/1-schema.png?raw=true "Sample Note")


To start the app, run the command `npm index.js` in the terminal.  The user is greeted and offered a list of choices to execute various CRUD functions.  
![Options](/screen-shots/2-options.png?raw=true "Sample Note")

The first three are GET requests for viewing the data for the three databases.  If `View Employees` is selected, the user can sort the employees in three different ways: Alphabetically by last name, by manager, and by department.  
![Employee Sorting](/screen-shots/3-employeesorting.png?raw=true "Sample Note")

The `View Department Budget` allows the user to select one of the departments, and totals up the salaries of all the employees in that department.  
![View Department Budget](/screen-shots/4-viewbudget.png?raw=true "Sample Note")

The next three options are INSERT INTO commands, allowing the user to add departments, roles, and employees.  Inquirer will validate responses to make sure that they can be inserted into their respective table columns.  For example, the 'name' column of the departments table only accepts VARCHAR(30), while the 'salary' column of the roles table only accepts DEC(11, 2) values.  
![Validation](/screen-shots/5-validation.png?raw=true "Sample Note")

Before inquirer runs the questions, a GET function is run behind the scenes, getting the names and ids of the relevant information needed so that the user does not have to know ids, or exact spellings of roles/departments when adding information.  An array of names is passed into the inquirer prompt itself, so they appear as choices in a 'list' type question.  
![Roles List](/screen-shots/6-rolesList.png?raw=true "Sample Note")

The next three options are the DELETE functions.  Once again, the relevant information is queried form SQL and passed to the inquirer prompt. The user is also given a chance to cancel a deletion.  
![Roles List](/screen-shots/7-delete.png?raw=true "Sample Note")

Finally, the last option closes out the application and terminates the connection to the database.

### Demonstration
https://drive.google.com/file/d/18Dmj2zcq-ObV_oEu_spPLQ3fink3Ex7p/view

### Questions
For questions contact me at:  
Email: dhfoss89@gmail.com  
https://github.com/dhfoss

Thank you!  
-DHF
