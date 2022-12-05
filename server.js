const express = require('express');
const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer'); 
const chalk = require("chalk");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'Winter24!',
    database: 'workers_db'
  },
  console.log(chalk.red(`Connected to the workers_db database.`))
);

db.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + db.threadId);
    DBconnected();
  });
  
  // once connected a 
  DBconnected = () => { 
    
    console.log(chalk.yellow("* ------------------------------- *"))
    console.log(chalk.yellow("*        Workers MANAGER          *"))
    console.log(chalk.yellow("* ------------------------------- *"))
   
    promptUserquestions();
  };


const promptUserquestions = () => {
    inquirer.prompt ([
      {
        type: 'list',
        name: 'choices', 
        message: 'What would you like to do?',
        choices: ['View all departments', 
                  'View all roles', 
                  'View all employees', 
                  'Add a department', 
                  'Add a role', 
                  'Add an employee', 
                  'Update an employee role',
                  'No Action']
      }
    ])
      .then((answers) => {
        const { choices } = answers; 
  
        if (choices === "View all departments") {
          showDepartments();
        }
  
        if (choices === "View all roles") {
          showRoles();
        }
  
        if (choices === "View all employees") {
          showEmployees();
        }
  
        if (choices === "Add a department") {
          addDepartment();
        }
  
        if (choices === "Add a role") {
          addRole();
        }
  
        if (choices === "Add an employee") {
          addEmployee();
        }
  
        if (choices === "Update an employee role") {
          updateEmployee();
        }
  
        if (choices === "No Action") {
          db.end()
      };
    });
  };

  // Showing Departments Function
  showDepartments = () => {
   
    console.log(chalk.green("Now Showing Departments.\n"));

      db.query('SELECT department.id as ID, department.name as Department FROM department', function (err, results) {
          console.table(results);
          promptUserquestions();
        });
};

// Showing Roles Function
showRoles= () => {

  console.log(chalk.green("Now Showing Roles.\n"));

  const sql = `Select 
  role.id as ID, 
  role.title as Role, 
  department.name as Department
  from role
  inner join department on role.department_id = department.id`;

  db.query(sql, function (err, results) {
    console.table(results);
    promptUserquestions();
  });
}

// Showing Employees and their Managers Function
showEmployees = () => {
  
  console.log(chalk.green("Now Showing All Employees.\n"));

  const sql = `Select 
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
`;

  db.query(sql, function (err, results) {
    console.table(results);
    promptUserquestions();
  });
};

// Add Department Function
addDepartment = () => {
  inquirer.prompt([
    {
      type: 'input', 
      name: 'addDepartment',
      message: "What Department are you going to add?",
      validate: addDepartment => {
        if (addDepartment) {
            return true;
        } else {
            console.log(chalk.red('Must Enter a Department!'));
            return false;
        }
      }
    }
  ])
  .then(answer => {
    
    const sql = `INSERT INTO department (name) VALUES (?)`;


  db.query(sql, answer.addDepartment ,(err, results) => {
   
    console.log(Chalk.blue("You have added " + answer.addDepartment + "to the Departments"));
    promptUserquestions();
  });

 })
  
}

// Add Role Function
addRole = () => {
  
  inquirer.prompt([
    {
      type: 'input', 
      name: 'addRole',
      message: "What Role are you going to add?",
      validate: addRole => {
        if (addRole) {
            return true;
        } else {
            console.log(chalk.red('Must Enter a role!'));
            return false;
        }
      }
    },
    {
      type: 'input', 
      name: 'addSalary',
      message: "What is the expected Salary of this role?",
      validate: addSalary => {
        if (addSalary) {
            return true;
        } else {
            console.log(chalk.red('Must Enter a Salary!'));
            return false;
        }
      }
    },
    {
      type: 'list', 
      name: 'addDeptid',
      message: "What Department is this role in?",
      choices: [1,
                2,
                3,
                4],
      validate: addDeptid => {
        if (addDeptid) {
            return true;
        } else {
            console.log(chalk.red('Must enter the Department ID!'));
            return false;
        }
      }
    }
  ])
  .then(answer => {
    
    const sql = `INSERT INTO role (title, salary, department_id)
    VALUES (?, ?, ?)`;
    
  db.query(sql, [answer.addRole, answer.addSalary, answer.addDeptid] ,(err, results) => {
    if (err) throw err;
    console.log(chalk.blue("You have added " + answer.addRole + "to the Roles!"));
    promptUserquestions();
  });

 })
}

// Add Employee Function
addEmployee = () => {

}