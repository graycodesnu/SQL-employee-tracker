INSERT INTO department (name) 
VALUES 
  ('Legal'),
  ('Engineering'),
  ('Catering'),
  ('Recreation'),
  ('Human Resources');

INSERT INTO role 
  (title, salary, department_id)
VALUES 
  ('Family Lawyer', 5, 1),
  ('Software Engineer', 3, 2),
  ('Expert Chef', 100, 3),
  ('Professional Sunbather', 500, 4),
  ('Expert Goofball', 100, 5);

INSERT INTO employee
  (first_name, last_name, role_id, manager_id)
VALUES 
  ('Ana', 'Garduno', 1, NULL),
  ('Grayson', 'Harvey', 2, NULL), 
  ('Malcolm', 'Harvey', 3, NULL),
  ('Alfie', 'Harvey', 4, NULL),
  ('Frankie', 'Harvey', 5, NULL),
  ('Lightning', 'McQueen', 1, 1),
  ('Tow', 'Mater', 1, 1),
  ('Beckett', 'Costello', 2, 2),
  ('Susie', 'Sorensen', 2, 2),
  ('Stinky', 'Jones', 3, 3),
  ('Guy', 'Fieri', 4, 4), 
  ('Fred', 'Flinstone', 4, 4),
  ('Clayton', 'Kershaw', 5, 5),
  ('Mookie', 'Betts', 4, 4);