-- Initialize the database

-- Drop Tables if existent
DROP TABLE IF EXISTS Responses;
DROP TABLE IF EXISTS Posts;
DROP TABLE IF EXISTS Employers;
DROP TABLE IF EXISTS Resumes;
DROP TABLE IF EXISTS Applicants;


-- Initialize Applicant table
CREATE TABLE Applicants(
    `applicantID` int(11) NOT NULL AUTO_INCREMENT,
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

-- Initialize Resume table
CREATE TABLE Resumes(
    `resumeID` int(11) NOT NULL AUTO_INCREMENT,
    `applicantID` int(11) NOT NULL,
    `fileName` varchar(250) not NULL,
    PRIMARY KEY(`resumeID`),
    FOREIGN KEY(`applicantID`) REFERENCES Applicants(`applicantID`)
) ENGINE=InnoDB;

-- Provide some Sample Data
-- Applicant Data
INSERT INTO Applicants (`firstName`, `lastName`, `email`, `phone`, `address`, `city`, `state`, `country`, `zipCode`)
VALUES ('Chris', 'Eckerson-Keith', 'eckersoc@oregonstate.edu', '999-999-9999', '1234 SunnySide Up Dr', 'Corvallis', 'OR', 'US', 98765);
-- Resumes Data
INSERT INTO Resumes(`applicantID`, `fileName`)
VALUES (1, 'testfile.docx');
