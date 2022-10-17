const inquirer = require('inquirer');
const fs = require("fs");
const mysql = require('mysql2');
require('console.table');

// create the connection to database
var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  database: 'employee_db',
  password: ''
})
// console.log(connection, 'Connected!');


// Menu 
const promptMenu = () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'menu',
      message: 'Please select an action.',
      choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role', 'exit']
    }])

    .then(userOptions => {
      switch (userOptions.menu) {
        case 'view all departments':
          selectDepartments();
          break;
        case 'view all roles':
          selectRoles();
          break;
        case 'view all employees':
          selectEmployees();
          break;
        case 'add a department':
          promptAddDepartment();
          break;
        case 'add a role':
          promptAddRole();
          break;
        case 'add an employee':
          promptAddEmployee();
          break;
        case 'update employee role':
          promptUpdateRole();
          break;
        default:
          process.exit();
      }
    });
};

// View Departments
const selectDepartments = () => {
  connection.query(
    'SELECT * FROM department;', 
    (err, results) => {
      console.table(results);
      promptMenu();
    });
};

// View Roles
const selectRoles = () => {
  connection.query(
      'SELECT * FROM role;',
      (err, results) => {
          console.table(results);
          promptMenu();
      });
};

// View Employees
const selectEmployees = () => {
  connection.query(
      "SELECT E.id, E.first_name, E.last_name, R.title, D.name AS department, R.salary, CONCAT(M.first_name,' ',M.last_name) AS manager FROM employee E JOIN role R ON E.role_id = R.id JOIN department D ON R.department_id = D.id LEFT JOIN employee M ON E.manager_id = M.id;",
      (err, results) => {
          console.table(results); 
          promptMenu();
      });
};

// Add Department 
const promptAddDepartment = () => {
  inquirer.prompt([{
      type: 'input',
      name: 'name',
      message: 'Which department you would like to add?',
      validate: departmentName => {
          if (departmentName) {
              return true;
          } else {
              console.log('Please enter the name of the new department.');
              return false;
          }
      }
  }
  ])
      .then(name => {
          connection.promise().query("INSERT INTO department SET ?", name);
          selectDepartments();
      })
}

// TODO: Add Role
const promptAddRole = () => {

  return connection.promise().query(
      "SELECT department.id, department.name FROM department;"
  )
      .then(([departments]) => {
          let departmentChoices = departments.map(({
              id,
              name
          }) => ({
              name: name,
              value: id
          }));

          inquirer.prompt(
              [{
                  type: 'input',
                  name: 'title',
                  message: 'Please enter the new role title.',
                  validate: titleName => {
                      if (titleName) {
                          return true;
                      } else {
                          console.log('This field is required. Please enter the new role title.');
                          return false;
                      }
                  }
              },
              {
                  type: 'list',
                  name: 'department',
                  message: 'To which department does this role belong?',
                  choices: departmentChoices
              },
              {
                  type: 'input',
                  name: 'salary',
                  message: 'Please enter the salary for this new role.',
                  validate: salary => {
                      if (salary) {
                          return true;
                      } else {
                          console.log('This field is required. Please enter the salary for this new role.');
                          return false;
                      }
                  }
              }
              ]
          )
              .then(({ title, department, salary }) => {
                  const query = connection.query(
                      'INSERT INTO role SET ?',
                      {
                          title: title,
                          department_id: department,
                          salary: salary
                      },
                      function (err, res) {
                          if (err) throw err;
                      }
                  )
              }).then(() => selectRoles())

      })
}

// TODO: Add Employee 

// TODO: Update Employee Role


// Initialize Inquirer
promptMenu();