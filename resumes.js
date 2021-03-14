// Adapted from Lecture: https://oregonstate.instructure.com/courses/1825733/pages/learn-using-javascript-and-nodejs?module_item_id=20221781
// https://github.com/knightsamar/cs340_sample_nodejs_app/blob/master/people.js
module.exports = function () {
    var express = require('express');
    var multer = require('multer');
    var fs = require('fs');

    var router = express.Router();

    
    // setup storage engine for uploading files
    var storage = multer.diskStorage({
        destination: function(req, file, cb) {
        var userDir = './uploads/' + req.body.applicantID + '/';
        if (!fs.existsSync(userDir)){
            fs.mkdirSync(userDir);
        }
        console.log("Resume Saved To:", userDir + file.originalname);
        cb(null, userDir);
        },
        filename: function(req, file, cb){
        req.body.fileName = file.originalname;
        cb(null, file.originalname);
        }
    });

    // set up upload function
    var upload = multer({storage: storage});

    // Retrieve Resumes
    function getResumes(res, mysql, context, complete){
        var query = "SELECT * FROM Resumes";
        mysql.pool.query(query, function (error, results, fields) {
            if (error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.resumes = results;
            complete();
        });
    }

    // Retrieve Resume by resumeID
    function getResume(res, mysql, context, id, complete){
        var query = "SELECT * FROM Resumes WHERE resumeID=?";
        mysql.pool.query(query, [id], function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.info = results[0];
            complete();
        });
    }

    // List of all Applicants (mysql query)
    function getApplicants(res, mysql, context, complete) {
        var query = "SELECT applicantID, firstName, lastName FROM `Applicants`";
        mysql.pool.query(query, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.applicants = results;
            complete();
        });
    }

    // Display all resumes in database
    router.get('/', function(req, res){
        var context = {};
        var callbackCount = 0;
        var mysql = req.app.get('mysql');
        // define complete function getting info and resumes
        function complete() {
            callbackCount++;
            if (callbackCount >= 2) {
                res.render('resumes', context);
            }
        }
        getResumes(res, mysql, context, complete);
        getApplicants(res, mysql, context, complete);
    });

    // Insert new resume into database
    router.post('/', upload.single('fileName'), function(req, res){
        var mysql = req.app.get('mysql');
        var query = "INSERT INTO `Resumes`(`applicantID`, `fileName`) VALUES (?, ?)";
        console.log(req.body, req.file);
        var input = [req.body.applicantID, req.file.filename];
        // make sql request to insert new resume
        mysql.pool.query(query, input, function(error, results, fields){
            // log any error that occurs with insert request
            if(error){
                console.log(JSON.stringify(error));
                res.status(422).send('SQL RESTRICTION ERROR');
                res.end();
            }
            // otherwise request completed, return to get route path
            else{
                res.redirect('./resumes');
            }
        });
    });
    
    // get update resume route
    router.get('/:resumeID/update', function(req, res){
        var callbackCount = 0;
        var id = req.params.resumeID;
        var context = {};
        var mysql = req.app.get('mysql');
        // define complete function getting info and resumes
        function complete() {
        callbackCount++;
            if (callbackCount >= 2) {
                res.render('update-resumes', context);
            }
        }
        getResume(res, mysql, context, id, complete);
        getApplicants(res, mysql, context, complete);
    });

    // make update of applicant
    router.put('/:resumeID/update', function(req,res){
        var context = {};
        callbackCount = 0;
        var mysql = req.app.get('mysql');
        var query = "UPDATE Resumes SET " +
                    "applicantID=?, fileName=? " +
                    "WHERE resumeID=?";
        var input = [req.body.applicantID, req.body.fileName, req.params.resumeID];
        // Function to handle retriecing original resume information before updating
        function complete() {
            callbackCount++;
                if (callbackCount >= 1) {
                    // once old resume info is retrieved, then process insert query
                    // make sql request to update applicant
                    mysql.pool.query(query, input, function(error, results, fields){
                        // log any error that occurs with insert request
                        if(error){
                            console.log(error);
                            res.write(JSON.stringify(error));
                            res.end();
                        }else{
                            oldResume = context.info;
                            // check if user has folder yet
                            var userDir = './uploads/' + req.body.applicantID + '/';
                            if (!fs.existsSync(userDir)){
                                fs.mkdirSync(userDir);
                            }
                            // sucess in update, update actual file
                            fs.rename('./uploads/' + oldResume.applicantID + '/' + oldResume.fileName,
                                        './uploads/' + req.body.applicantID + '/' + req.body.fileName, 
                                        function(err) {
                                            if ( err ) console.log('ERROR: ' + err);
                                        });
                            res.status(200);
                            res.end();
                        }
                    });
                }
            }
        // Retrieve original resume info for file management
        getResume(res, mysql, context, input[2], complete);
    });

    // Route to handle deleting resumes, done with AJAX request
    router.delete('/:resumeID', function(req, res){
        var mysql = req.app.get('mysql');
        var query = "DELETE FROM Resumes WHERE resumeID = ?";
        var input = [req.params.resumeID];
        var context = {};
        callbackCount = 0;
        // Function to handle retrieving original resume information before deleting resume
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                // once old resume info is retrieved, then process delete query
                // make sql request to delete resume
                mysql.pool.query(query, input, function(error, results, fields){
                    // log any error that occurs with insert request
                    if(error){
                        console.log(error);
                        res.write(JSON.stringify(error));
                        res.end();
                    }else{
                        // sucess in delete, remove actual file locations
                        console.log('Deleting File: ./uploads/' + context.info.applicantID + '/' + context.info.fileName);
                        fs.unlink('./uploads/' + context.info.applicantID + '/' + context.info.fileName, function(err) {
                            if (err){
                                console.log('ERROR: ' + err);
                            } else{
                                res.status(200);
                                res.end();
                            }
                        });
                    }
                });
            }
        }
        // Retrieve original resume info for file management
        getResume(res, mysql, context, input[0], complete);
    });

    // provide a get method to download the given resume
    router.get("/:resumeID/download", function(req, res){
        var mysql=req.app.get('mysql');
        var query = "SELECT * FROM Resumes WHERE resumeID=?";
        mysql.pool.query(query, [req.params.resumeID], function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            var resumeInfo = results[0];
            var filePath = "uploads/" + resumeInfo.applicantID + "/" + resumeInfo.fileName;
            res.download(filePath);
        });
    });

    // return desired route path request
    return router;
}();