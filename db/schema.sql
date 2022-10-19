DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;


CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE role (
  id INT AUTO_INCREMENT PRIMARY KEY, 
  title VARCHAR(50) NOT NULL, 
  salary INT NOT NULL, 
  department_id INT,
  CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

CREATE TABLE employee (
  id INT AUTO_INCREMENT PRIMARY KEY, 
  first_name VARCHAR(50) NOT NULL, 
  last_name VARCHAR(50) NOT NULL,
  role_id INT, 
  manager_id INT, 
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
  CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);