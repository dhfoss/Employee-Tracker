USE company_db;

INSERT INTO departments(name)
VALUES('Sales'),
('Marketing'),
('HR');

INSERT INTO roles(title, salary, department_id)
VALUES('Sales Leader', 74894.47, 1),
('Junior Salesman', 59486.86, 1),
('Marketing Leader', 89372.64, 2),
('Junior Associate', 53967.55, 2),
('HR Manager', 93758.54, 3),
('Secretary', 49583.55, 3);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES('Karl', 'Strogonakis', 1, NULL),
('Vazas', 'Theronath', 2, 1),
('Bily', 'Bhambi', 2, 1),
('Ilias', 'Cirillo', 3, NULL),
('Atlas', 'Omni', 4, 4),
('Samra', 'Till', 4, 4),
('Ellsworth', 'Wildingham', 5, NULL),
('Titus', 'Andromedon', 6, 7),
('Kimmy', 'Schmitt', 6, 7);