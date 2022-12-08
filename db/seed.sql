INSERT INTO department (name)
VALUES 
('Engineering'),
('Finance'),
('Sales'),
('Legal');

INSERT INTO role (title, salary, department_id)
VALUES
('Lead Engineer', 150000, 1),
('Software Engineer', 120000, 1),
('Accountant', 100000, 2), 
('Finanical Analyst', 150000, 2),
('Sales Lead', 90000, 3), 
('Salesperson', 70000, 3),
('Legal Team Lead', 100000, 4),
('Lawyer', 180000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Ryan', 'Bonnet', 2, null),
('Noe', 'Jones', 1, 1),
('Gabby', 'Duran', 4, null),
('Alex', 'Koch', 3, 3),
('Aiden', 'Stella', 6, null),
('Bryce', 'Carter', 5, 5),
('Nick', 'Diaz', 7, null),
('Robbie', 'Lawler', 8, 7);
