-- Query Manipulation

-- Select Display Queries:
SELECT * FROM Applicants;
SELECT * FROM Resumes;
SELECT * FROM Responses;
SELECT * FROM Employers;
SELECT * FROM Posts;

-- Select Displaying filtered Quieries:
-- Will try performing by form request where depending on selected filter, will append WHERE statement conditionally
SELECT * FROM Applicants WHERE ":selectedFilter_conditional"=":input";
-- Example: "SELECT * FROM Applicants " + route_conditional ("WHERE `firstName`=":formInput")
-- Else will select Applicants by order
SELECT * FROM Applicants ORDER BY firstName, lastName, email, city, state, country, zipCode ASC|DESC;

SELECT * FROM Resumes ORDER BY fileName ASC|DESC;
SELECT * FROM Employers ORDER BY businessName, email, city, zipCode ASC|DESC;
SELECT * FROM Posts ORDER BY description, employerID ASC|DESC;

-- Insert for every table:
-- Applicant values are gathered in post form
INSERT INTO Applicants (`firstName`, `lastName`, `email`, `phone`, `address`, `city`, `state`, `country`, `zipCode`)
VALUES (':firstName', ':lastName', ':email', ':phone', ':address', ':city', ':state', ':country', ':zipCodeNumber');
-- Resume values are gathered via applicant page routing (req.body) and an upload button 
INSERT INTO Resumes(`applicantID`, `fileName`) 
VALUES (':applicantID_from_req.Body', ':fileName_of_uploadedFile');

INSERT INTO Employers (`businessName`, `email`, `phone`, `address`, `city`, `state`, `country`, `zipCode`) 
VALUES (':BusinessNameInput', ':emailInput', ':phoneInput', ':AddressInput', ':cityInput', ':stateInput', ':coutryInput', ':zipcodeInput');

INSERT INTO Posts (`description`, `employerID`)
VALUES (':textInput', ':employerIDinput');

-- Not setup yet
INSERT INTO Responses(`postID`, `employerID`)
VALUES (':textInput?', ':textInput?');

-- Update for each table
-- Update will be redirect to an edit form page, then redirected back to applicantID
UPDATE Applicants SET `firstName`=":firstNameInput", 
                        `lastName`=":LastNameInput",
                        `email`=":emailInput",
                        `phone`=":phoneInput", 
                        `address`=":addressInput",
                        `city`= ":cityInput",
                        `state`=":stateInput",
                        `country`=":countryInput",
                        `zipCode`=":zipcodeNumber"
                        WHERE `applicantID`=":applicantID_from_req.Body";

UPDATE Employers SET `businessName`=':BusinessNameInput', 
                        `email`=':emailInput', 
                        `phone`=':phoneInput',
                        `address`=':AddressInput',
                        `city`=':cityInput',
                        `state`=':stateInput',
                        `country`=':coutryInput',
                        `zipCode`=':zipcodeInput'
                        WHERE `employerID`=":employerInput";
-- Resumes will update existing file in selected row (still pending)
UPDATE Resumes SET `fileName`=":newFileName_of_FileUploaded" WHERE `resumeID`=":resumeID_RowSelection_updateButton";

UPDATE Posts SET `description`=":newTextInput", `employerID`=":employerIDInput" WHERE `postID`=":postInput";

-- Delete for each table:
DELETE FROM Applicants WHERE `applicantID`=":applicantID_rowSelection_DeleteButton";
DELETE FROM Resumes WHERE `resumeID`=":resumeID_RowSelection_DeleteButton";
DELETE FROM Employers WHERE `employerID`=":employerID_deleteButton";
DELETE FROM Posts WHERE `postID`=":postID_deleteButton";
