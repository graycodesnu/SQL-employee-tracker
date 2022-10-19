const inquirer = require('inquirer');
const fs = require("fs");
const mysql = require('mysql2');
const { exit } = require('process');
require('console.table');

// create the connection to database
var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  database: 'employee_db',
  password: ''
})
console.log(connection, 'Connected!');


// Menu 
const promptMenu = () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'menu',
      message: 'Please select an action.',
      choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add employee', 'update employee role', 'exit']
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
        case 'add employee':
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

// Add Role
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

// Add Employee 
const promptAddEmployee = () => {

  return connection.promise().query(
    "SELECT R.id, R.title FROM role R;"
  )
    .then(([employees]) => {
      let titleOptions = employees.map(({
        id,
        title
      }) => ({
        value: id,
        name: title
      }))

      connection.promise().query(
        "SELECT E.id, CONCAT(E.first_name,' ',E.last_name) AS manager FROM employee E;"
        ) .then(([managers]) => {
          let managerOptions = managers.map(({
            id, 
            manager
          }) => ({
            value: id, 
            name: manager
          }));
          
          inquirer.prompt(
            [{
              type: 'input',
              name: 'firstName',
              message: 'Please enter the employees first name.',
              validate: firstName => {
                if (firstName) {
                  return true;
                } else {
                  console.log('This field is required. Please enter the employees first name.')
                }
              }
            },
            {
              type: 'input',
              name: 'lastName',
              message: 'Please enter the employees last name.',
              validate: lastName => {
                if (lastName) {
                  return true;
                } else {
                  console.log('This field is required. Please enter the employees last name.')
                }
              }
            },
            {
              type: 'list',
              name: 'role',
              message: 'Please select the new employees role.',
              choices: titleOptions
            },
            {
              type: 'list',
              name: 'manager',
              message: 'Please select the new employees manager.',
              choices: managerOptions
            }
          ])
          .then(({ firstName, lastName, role, manager }) => {
            const query = connection.query(
              "INSERT INTO employee SET ?", 
              {
              first_name: firstName,
              last_name: lastName,
              role_id: role, 
              manager_id: manager
              },
              function (err, res) {
                if (err) throw err;
                console.log({ role, manager }, 'Employee add error!')
              }
            )
          }).then(() => selectEmployees())
      })
    })
}

// TODO: Update Employee Role
const promptUpdateRole = () => {
  return connection.promise().query(
    "SELECT R.id, R.title, R.salary, R.department_id FROM role R;"
)
    .then(([roles]) => {
        let roleOptions = roles.map(({
            id,
            title

        }) => ({
            value: id,
            name: title
        }));
        
        inquirer.prompt(
            [
                {
                    type: 'list',
                    name: 'role',
                    message: 'Please select the role you want to update.',
                    choices: roleOptions
                },
            ]
        )
            .then(role => {
                console.log(role);
                inquirer.prompt(
                    [{
                        type: 'input',
                        name: 'title',
                        message: 'Please enter the roles new title.',
                        validate: titleName => {
                            if (titleName) {
                                return true;
                            } else {
                                console.log('This field is required. Please enter the roles new title.');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'Enter your salary',
                        validate: salary => {
                            if (salary) {
                                return true;
                            } else {
                                console.log('This field is required. Please enter the roles new salary.');
                                return false;
                            }
                        }
                    }]
                )
                    .then(({ title, salary }) => {
                        const query = connection.query(
                            'UPDATE role SET title = ?, salary = ? WHERE id = ?',
                            [
                                title,
                                salary
                                ,
                                role.role
                            ],
                            function (err, res) {
                                if (err) throw err;
                            }
                        )
                    })
                    .then(() => promptMenu())
            })
    }
  );
};

// Initialize 
promptMenu();