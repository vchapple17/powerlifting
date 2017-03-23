SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS `coach`;
DROP TABLE IF EXISTS `team`;
DROP TABLE IF EXISTS `lifter_meet`;
DROP TABLE IF EXISTS `lifter`;
DROP TABLE IF EXISTS `meet`;
SET FOREIGN_KEY_CHECKS=1;

CREATE TABLE `team` (
  team_id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  mascot VARCHAR(255),
  CONSTRAINT pk_team PRIMARY KEY (team_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `coach` (
  coach_id INT(11) NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  team_id int(11),
  CONSTRAINT pk_coach PRIMARY KEY (coach_id),
  CONSTRAINT fk_coach_team_id FOREIGN KEY (team_id) REFERENCES team (team_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `lifter` (
  lifter_id INT(11) NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  gender ENUM('female', 'male') NOT NULL,
  weight NUMERIC(4,1) NOT NULL,
  grade ENUM('9th', '10th', '11th', '12th') NOT NULL,
  team_id int(11),
  CONSTRAINT pk_lifter PRIMARY KEY (lifter_id),
  CONSTRAINT fk_lifter_team_id FOREIGN KEY (team_id) REFERENCES team (team_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE meet (
  meet_id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(255),
  state VARCHAR(255),
  ZIP INT(5),
  team_id int(11),
  CONSTRAINT pk_meet PRIMARY KEY (meet_id),
  CONSTRAINT fk_meet_team_id FOREIGN KEY (team_id) REFERENCES team (team_id)
  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE lifter_meet (
  lifter_id INT(11) NOT NULL,
  meet_id INT(11) NOT NULL,
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_on TIMESTAMP,
  gender ENUM('female', 'male') NOT NULL,
  open_bench INT(3) NOT NULL,
  open_clean INT(3) NOT NULL,
  open_squat INT(3) NOT NULL,
  entry_weight NUMERIC(4,1) NOT NULL,
  CONSTRAINT pk_lifter_meet PRIMARY KEY (lifter_id, meet_id),
  CONSTRAINT fk_lifter_meet_lifter_id FOREIGN KEY (lifter_id) REFERENCES lifter (lifter_id) ON DELETE CASCADE,
  CONSTRAINT fk_lifter_meet_meet_id FOREIGN KEY (meet_id) REFERENCES meet (meet_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
