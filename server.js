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
    
    const sql = `INSERT INTO department (name)
                 VALUES (?)`;


  db.query(sql, answer.addDepartment ,(err, results) => {
   
    console.log(chalk.blue(`You have added ${answer.addDepartment} to Departments!`));
    promptUserquestions();
  });

 })
  
}

// Add Role Function
addRole = () => {
  
  // crating the object for the choices for departments
  const departments = [];
  db.query("SELECT * FROM DEPARTMENT", (err, res) => {
    if (err) throw err;

    res.forEach(dep => {
      let depOBJ = {
        name: dep.name,
        value: dep.id
      }
      departments.push(depOBJ);
    });

    
    let questions = [
      {
        type: "input",
        name: "title",
        message: "What is the name of this Role??"
      },
      {
        type: "input",
        name: "salary",
        message: "What is the expected Salary of the Role??"
      },
      {
        type: "list",
        name: "department",
        choices: departments,
        message: "what Department is this Role in?"
      }
    ];

    inquirer.prompt(questions)
    .then(response => {
      
    const query = `INSERT INTO ROLE (title, salary, department_id) 
                   VALUES (?)`;
      
    db.query(query, [[response.title, response.salary, response.department]], (err, res) => {
        if (err) throw err;
        
        console.log(chalk.blue(`Successfully added the ${response.title} role!`));
        promptUserquestions();
      });
    })
    .catch(err => {
      console.error(err);
    });
  });
}

// Add Employee Function
addEmployee = () => {
  
  // creating choices for the managers for that added employee
  db.query("SELECT * FROM EMPLOYEE", (err, eRes) => {
    if (err) throw err;
    const managerChoice = [
      {
        name: 'None',
        value: 0
      }
    ]; 
      eRes.forEach(({ first_name, last_name, id }) => {
        managerChoice.push({
          name: first_name + " " + last_name,
          value: id
      });
    });
    
  // creating the role choices for that added employee
    db.query("SELECT * FROM ROLE", (err, roleRes) => {
      if (err) throw err;
      const roles = [];
        roleRes.forEach(({ title, id }) => {
          roles.push({
            name: title,
            value: id
            });
        });

        let questions = [
          {
            type: "input",
            name: "first_name",
            message: "what is the employee's first name?"
          },
          {
            type: "input",
            name: "last_name",
            message: "what is the employee's last name?"
          },
          {
            type: "list",
            name: "role_id",
            choices: roles,
            message: "what is the employee's role?"
          },
          {
            type: "list",
            name: "manager_id",
            choices: managerChoice,
            message: "who is the employee's manager? (could be null)"
          }
        ]

        inquirer.prompt(questions)
        .then(response => {

          const query = `INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id) 
                        VALUES (?)`;

          let manager_id = response.manager_id !== 0? response.manager_id: null;

          db.query(query, [[response.first_name, response.last_name, response.role_id, manager_id]], (err, res) => {
            if (err) throw err;
                console.log(chalk.blue(`Successfully added ${response.first_name} ${response.last_name} as an Employee!`));

              promptUserquestions();
           });
        })
        .catch(err => {
          console.error(err);
        });
    })
  });
};

// Update Employees role function
updateEmployee = () => {

  // Get list of roles as a variable
  db.query("SELECT * FROM EMPLOYEE", (err, eRes) => {
    if (err) throw err;
    
  const empChoice = [];
     
      eRes.forEach(({ first_name, last_name, id }) => {
        empChoice.push({
          name: first_name + " " + last_name,
          value: id
      });

    });
    
    // Get list of employees as a variable
    db.query("SELECT * FROM ROLE", (err, rolRes) => {
      if (err) throw err;
      
   const roles = [];
        
      rolRes.forEach(({ title, id }) => {
          roles.push({
            name: title,
            value: id
          });

        });
     
      let questions = [
        {
          type: "list",
          name: "id",
          choices: empChoice,
          message: "Which employee's role do you want to update?"
        },
        {
          type: "list",
          name: "role_id",
          choices: roles,
          message: "what is the new role for this employee?"
        }
      ]
  
      inquirer.prompt(questions)
        
      .then(response => {
          
        const sql = `UPDATE EMPLOYEE 
                     SET ? 
                     WHERE ?? = ?;`;
          db.query(sql, [
            {role_id: response.role_id},
            "id",
            response.id], (err, res) => {
            if (err) throw err;
            
            console.log(chalk.blue("You have updated this employees role!"));
            promptUserquestions();
          });
        })
        .catch(err => {
          console.error(err);
        });
      })
  });
};
 