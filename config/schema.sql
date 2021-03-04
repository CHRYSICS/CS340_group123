-- Initialize the database

-- Drop Tables if existent
DROP TABLE IF EXISTS Responses;
DROP TABLE IF EXISTS Posts;
DROP TABLE IF EXISTS Employers;
DROP TABLE IF EXISTS Resumes;
DROP TABLE IF EXISTS Applicants;


-- Initialize Applicants table
CREATE TABLE Applicants(
    `applicantID` int(11) AUTO_INCREMENT,
    `firstName` varchar(100) NOT NULL,
    `lastName` varchar(100) NOT NULL,
    `email` varchar(100) NOT NULL,
    `phone` char(12),
    `address` varchar(256) NOT NULL,
    `city` varchar(100) NOT NULL,
    `state` char(2) NOT NULL,
    `country` char(2) NOT NULL, 
    `zipCode` varchar(16) NOT NULL,
    PRIMARY KEY(`applicantID`)
) ENGINE=InnoDB;

-- Initialize Resumes table
CREATE TABLE Resumes(
    `resumeID` int(11) NOT NULL AUTO_INCREMENT,
    `applicantID` int(11),
    `fileName` varchar(250) NOT NULL,
    PRIMARY KEY(`resumeID`),
    UNIQUE KEY `unique_fileName` (`applicantID`, `fileName`),
    FOREIGN KEY(`applicantID`) REFERENCES Applicants(`applicantID`)
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- Initialize Employers table
CREATE TABLE Employers(
    `employerID` INT NOT NULL AUTO_INCREMENT,
    `businessName` VARCHAR(255) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `phone` char(12),
    `address` VARCHAR(255) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `state` CHAR(2) NOT NULL, 
    `country` CHAR(2) NOT NULL,
    `zipCode` VARCHAR(16) NOT NULL,
    PRIMARY KEY(`employerID`)
) ENGINE=InnoDB;

-- Initialize Posts table
CREATE TABLE Posts(
    `postID` INT NOT NULL AUTO_INCREMENT,
    `description` varchar(150) NOT NULL,
    `employerID` INT NOT NULL,
    PRIMARY KEY(`postID`),
    FOREIGN KEY(`employerID`) REFERENCES Employers(`employerID`)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- -- Initialize Responses table
CREATE TABLE Responses(
    `postID` int(11) NOT NULL,
    `resumeID` int(11) NOT NULL,
    PRIMARY KEY (`postID`, `resumeID`),
    FOREIGN KEY (`postID`) REFERENCES Posts(`postID`)
    ON DELETE CASCADE,
    FOREIGN KEY (`resumeID`) REFERENCES Resumes(`resumeID`)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- Provide some Sample Data (need at least three for each)
-- Applicant Data
INSERT INTO Applicants (`firstName`, `lastName`, `email`, `phone`, `address`, `city`, `state`, `country`, `zipCode`)
VALUES ('Raven', 'Ishoff', 'ravenIshoff@example.com', '111-111-1111', '1234 SunnySide Up Dr', 'Waldport', 'OR', 'US', 97000),
        ('John', 'Smith', 'johnSmith@example.com', '222-222-2222', '4321 Omelette Ave', 'Fairbanks', 'AK', 'US', 99000),
        ('Hugo', 'Sloane', 'hugosloane@example.com', '333-333-3333', "2143 Scambled Loop", 'Lacey', 'WA', 'US', 98000);

-- Resumes Data
INSERT INTO Resumes(`applicantID`, `fileName`)
VALUES (1, 'RavenResume1.docx'),
       (2, 'JohnResume1.docx'),
       (3, 'HugoResume1.docx'),
       (1, 'RavenResume2.docx'),
       (2, 'JohnResume2.docx'),
       (3, 'HugoResume2.docx');

-- Employers Data
INSERT INTO Employers (`businessName`, `email`, `phone`, `address`, `city`, `state`, `country`, `zipCode`) 
VALUES ('Company1', 'company1@example.com', '444-444-4444', '1324 Deviled Way', 'Corvallis', 'OR', 'US', 95000),
       ('DinTaiFung', 'dtf@gmail.com', '777-777-7777', '123 La Jolla Dr', 'San Diego', 'CA', 'US', 92126),
       ('HDBio', 'hdbio@gmail.com', '888-888-8888', '123 Science St', 'San Diego', 'CA', 'US', 92126);


-- Posts Data
INSERT INTO Posts (`description`, `employerID`)
VALUES ("Don't miss this work opportunity!", 1),
       ("Seeking Servers!", 2),
       ("Looking for Qualified Scientists", 3);

-- Responses Data
INSERT INTO Responses(`postID`, `resumeID`)
VALUES (1, 1), (1, 4), (1, 3), (2, 3), (3,3);
