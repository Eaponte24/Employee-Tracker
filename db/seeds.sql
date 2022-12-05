INSERT INTO department (name)
VALUES 
('Operations'),
('Accounting'),
('Marketing'),
('IT');

INSERT INTO role (title, salary, department_id)
VALUES
('Retail Manager', 60000, 1),
('Retail Sales Associate', 40000, 1),
('Accountant', 100000, 2), 
('Finance Analyst', 150000, 2),
('Social Media Coordindator', 60000, 3), 
('Sales Manager', 80000, 3),
('Software Engineer', 120000, 4),
('Full Stack Developer', 90000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Conor', 'Valen', 2, null),
('Alex', 'Terlizzi', 1, 1),
('Peter', 'Freeman', 4, null),
('Scott', 'Northrop', 3, 3),
('Ricky', 'Aponte', 6, null),
('Alex', 'Sanchez', 5, 5),
('Andrew','Feder', 7, null),
('Matt', 'Brown', 8, 7);
