-- Query Manipulation
-- From ApplicantInfo page, adding resume file for applicant to database
INSERT INTO `Resumes`(`applicantID`, `fileName`) VALUES (:applicantIDInput, :fileName_uploadedInput);
-- From ApplicantInfo page, retrieving data about applicant
SELECT * FROM Applicants WHERE applicantID=":applicantIDInput" LIMIT 1;
-- From ApplicantInfo page, retrieving resumes for givien applicant
SELECT * FROM Resumes WHERE applicantID=":applicantIDInput";
