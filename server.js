const inquirer = require('inquirer');
const fs = require("fs");
const mysql = require('mysql2');
require('console.table');
const express = require('express');

const app = express();

// create the connection to database
var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  database: 'employee_db',
  password: ''
})
console.log(connection, 'Connected!');

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
          selectEmployess();
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

const selectDepartments = () => {
  connection.query(
    'SELECT * FROM department;', 
    (err, results) => {
      console.log(results);
      promptMenu();
    });
};

const selectRoles = () => {
  connection.query(
      'SELECT * FROM role;',
      (err, results) => {
          console.table(results);
          promptMenu();
      });
};

const selectEmployees = () => {
  connection.query(
      "SELECT E.id, E.first_name, E.last_name, R.title, D.name AS department, R.salary, CONCAT(M.first_name,' ',M.last_name) AS manager FROM employee E JOIN role R ON E.role_id = R.id JOIN department D ON R.department_id = D.id LEFT JOIN employee M ON E.manager_id = M.id;",
      (err, results) => {
          console.table(results); // results contains rows returned by server
          promptMenu();
      });
};

const promptAddDepartment = () => {
  inquirer.prompt([{
      type: 'input',
      name: 'name',
      message: 'Name the department you would like to add?',
      validate: departmentName => {
          if (departmentName) {
              return true;
          } else {
              console.log('Please enter the name of your department!');
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

