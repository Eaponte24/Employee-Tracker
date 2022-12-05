DROP DATABASE IF EXISTS workers_db;
CREATE DATABASE workers_db;

USE workers_db;

CREATE TABLE department (
    id            INT            NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(30)    NOT NULL
);

CREATE TABLE role (
    id                INT             NOT NULL    AUTO_INCREMENT PRIMARY KEY,
    title             VARCHAR(30)     NOT NULL,
    salary            DECIMAL(10,2)   NOT NULL,
    department_id     INT,
        FOREIGN KEY (department_id)
        REFERENCES department(id)
        ON DELETE SET NULL
);

CREATE TABLE employee (
    id            INT             NOT NULL    AUTO_INCREMENT PRIMARY KEY,
    first_name    VARCHAR(30)     NOT NULL,
    last_name     VARCHAR(30)     NOT NULL,
    role_id       INT,
        FOREIGN KEY (role_id)
        REFERENCES role(id)
        ON DELETE SET NULL,
    manager_id    INT,
        FOREIGN KEY (manager_id)
        REFERENCES employee(id)
        ON DELETE SET NULL
);

Select 
    employee.id, 
    concat (employee.first_name, " ", employee.last_name) as Employee,
    role.salary as Salary,
    role.title as Job_Title,
    department.name as Department,
    CONCAT (manager.first_name, " ", manager.last_name) AS manager
from employee
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id
LEFT JOIN employee manager ON employee.manager_id = manager.id;

    
