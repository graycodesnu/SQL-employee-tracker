INSERT INTO department
(name)

VALUES 
  ('Legal'),
  ('Engineering'),
  ('Catering'),
  ('Recreation'),
  ('Human Resources');

INSERT INTO role 
  (title, salary, department_id)

VALUES 
  ('Family Lawyer', '$5', 1),
  ('Software Engineer' '$3', 2),
  ('Chef / Expert Meower', '$100', 3),
  ('Professional Sunbather', '$500', 4),
  ('Expert Goofball', '$100', 5);

INSERT INTO employee
  (first_name, last_name, role_id, manager_id)

VALUES 
  ('Ana', 'Garduno', 1, NULL),
  ('Grayson', 'Harvey', 2, NULL), 
  ('Malcolm', 'Harvey', 3, NULL),
  ('Alfie', 'Harvey', 4, NULL),
  ('Frankie', 'Harvey', 5, NULL),
  ('Lightning', 'McQueen', 6, 1),
  ('Tow', 'Mater', 7, 1),
  ('Beckett', 'Costello', 8, 1),
  ('Susie', 'Sorensen', 9, 2),
  ('Stinky', 'Jones', 10, 2),
  ('Guy', 'Fieri', 11, 3), 
  ('Fred', 'Flinstone', 12, 4),
  ('Clayton', 'Kershaw', 13, 5),
  ('Mookie', 'Betts', 14, 5);
