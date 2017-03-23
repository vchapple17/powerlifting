INSERT INTO team (name, mascot) VALUES
("Lansing", "Lions"),
("Lawrence", "Lions"),
("Piper", "Pirates"),
("Olathe East", "Hawks"),
("Olathe West", "Owls"),
("Olathe South", "Falcons"),
("Olathe North", "Eagles"),
("Olathe Northwest", "Ravens");


INSERT INTO coach (first_name, last_name, team_id) VALUES
("Tom", "Smith", 1),
("Jane", "Bivens", 2),
("Henry", "Bivens", 2),
("Lily", "Gault", 3),
("Michael", "Coons", 4),
("Kareem", "Wasson", 5),
("Brady", "Williams", 6),
("Nifty", "Braden", 7);

INSERT INTO lifter (first_name, last_name, gender, weight, grade, team_id) VALUES
("Tom", "Dodo", "male", 150.1, "9th", 1),
("Jane", "Fonda", "female", 250, "10th", 2),
("Henry", "Fonda", "male", 350.0, "11th", 2),
("Lily", "Tomlin", "female", 450.0, "12th", 3),
("Michael", "Phelps", "male", 550.0, "9th", 4),
("Kareem", "Yolo", "male", 50.0, "10th", 5),
("Brady", "Bodar", "female", 75.0, "11th", 6),
("Nifty", "Nixon", "male", 200.0, "12th", 7);


INSERT INTO meet (name, city, state, zip, team_id) VALUES
("Lansing Meet", "Lansing", "KS", 66048, 1),
("Lawrence Meet", "Lawrence", "KS", 66205, 2),
("Piper Meet", "Piper", "KS", 66040, 3);

INSERT INTO lifter_meet (lifter_id, meet_id, gender, entry_weight, open_bench, open_clean, open_squat) VALUES
(1,1,"male", 150.1,100,120,140),
(2,1,"female", 200.1,150,170,190),
(1,2,"male", 155.0,105,125,145);


-- UPDATE `lifter` SET first_name = "John", last_name = "Dodo2", gender = "male", weight = 123, grade = "11th", team_id = 2 WHERE lifter_id = 1;
