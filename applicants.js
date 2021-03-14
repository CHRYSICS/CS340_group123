// Adapted from Lecture: https://oregonstate.instructure.com/courses/1825733/pages/learn-using-javascript-and-nodejs?module_item_id=20221781
// https://github.com/knightsamar/cs340_sample_nodejs_app/blob/master/people.js
module.exports = function () {
    var express = require('express');
    var fs = require('fs');
    var router = express.Router();

    // List of all Applicants (mysql query)
    function getApplicants(res, mysql, context, complete) {
        var query = "SELECT * FROM `Applicants`";
        mysql.pool.query(query, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.applicants = results;
            complete();
        });
    }

    // List all applicants based on filter (mysql query)
    function getApplicantsFiltered(res, mysql, context, filtertype, input, complete) {
        var query = "SELECT * FROM `Applicants`";
        // build query based on filter selection (this must be hardcoded to avoid injection)
        if (filtertype == 'firstName') {
            query += " WHERE `firstName` LIKE ?";
        } else if (filtertype == 'lastName') {
            query += " WHERE `lastName`` LIKE ?";
        } else if (filtertype == 'email') {
            query += " WHERE `email` LIKE ?";
        } else if (filtertype == 'phone') {
            query += " WHERE `phone`` LIKE ?";
        } else if (filtertype == 'address') {
            query += " WHERE `address`` LIKE ?";
        } else if (filtertype == 'city'){
            query += " WHERE `city`` LIKE ?";
        } else if (filtertype == 'state') {
            query += " WHERE `country` LIKE ?";
        } else if (filtertype == 'zipCode') {
            query += " WHERE `zipCode`` LIKE ?";
        } else {
            error = "Error: filtertype '" + filtertype + "' not allowed";
            console.log(error);
            res.write(JSON.stringify(error));
            res.end();
        }
        input = "%" + input + "%";
        // make conditional selection query
        mysql.pool.query(query, [input], function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.applicants = results;
            complete();
        });
    }

    // get resumes for applicant for file management
    function getResumes(res, mysql, context, applicantID, complete){
        var query = "SELECT * FROM Resumes WHERE applicantID=?";
        mysql.pool.query(query, [applicantID], function (error, results, fields) {
            if (error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.resumes = results;
            complete();
        });
    }

    // route to display applicants in database
    router.get('/', function (req, res) {
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        // define complete function for get request
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('applicants', context);
            }
        }
        // If filter was provided, select from applicant based on filtertype and input
        if ('filtertype' in req.query && 'input' in req.query) {
            var filtertype = req.query.filtertype;
            var input = req.query.input;
            // check if empty input before input
            if (input == '') {
                // just return all the applicants
                return getApplicants(res, mysql, context, complete);
            }
            // Otherwise log the filter request made
            console.log("Applicants Filter made!");
            console.log(req.query);
            // return filtered results from applicants
            return getApplicantsFiltered(res, mysql, context, filtertype, input, complete);
        }
        // just return all the applicants
        return getApplicants(res, mysql, context, complete);
    });

    // insert new applicant to Applicants table
    router.post('/', function (req, res) {
        var mysql = req.app.get('mysql');
        // create query string for mysql request
        var query = "INSERT INTO Applicants " +
            "(`firstName`, `lastName`, " +
            "`email`, `phone`, " +
            "`address`, `city`, " +
            "`state`, `country`, `zipCode`) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        // collect input values into a list
        var input = [req.body.firstName, req.body.lastName,
        req.body.email, req.body.phone,
        req.body.address, req.body.city,
        req.body.state, req.body.country, req.body.zipCode];
        // make sql request to insert new applicant
        mysql.pool.query(query, input, function (error, results, fields) {
            // log any error that occurs with insert request
            if (error) {
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            }
            // otherwise request complete, return to get route path
            else {
                res.redirect('./applicants');
            }
        });
    });

    // Route to handle deleting applicants, done with AJAX request
    router.delete('/:applicantID', function(req, res){
        var mysql = req.app.get('mysql');
        var query = "DELETE FROM Applicants WHERE applicantID = ?";
        var input = [req.params.applicantID];
        var context = {};
        callbackCount = 0;
        // Function to handle retrieving original resume information before deleting applicant
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                // once old resume info is retrieved, then process delete query
                // make sql request to delete applicant
                mysql.pool.query(query, input, function(error, results, fields){
                    // log any error that occurs with insert request
                    if(error){
                        console.log(error);
                        res.write(JSON.stringify(error));
                        res.end();
                    }else{
                        // sucess in delete, update actual file locations to "null" folder
                        // this location is for unclaimed resumes that exist without a connected applicant
                        console.log('Applicant Deleted: Transfer file location for associated resumes to null folder');
                        for(var i in context.resumes){
                            console.log('Move File From: ./uploads/' + req.params.applicantID + '/' + context.resumes[i].fileName,
                            'To: ./uploads/null/' + context.resumes[i].fileName);
                            fs.rename('./uploads/' + req.params.applicantID + '/' + context.resumes[i].fileName,
                                    './uploads/null/' + context.resumes[i].fileName, 
                                    function (err) {
                                        if ( err ) console.log('ERROR: ' + err);
                            });
                        }
                        res.status(200);
                        res.end();
                    }
                });
            }
        }
        // Retrieve original resume info for file management
        getResumes(res, mysql, context, input[0], complete);
    });

    // return desired route path request
    return router;
}();