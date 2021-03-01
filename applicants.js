// Adapted from Lecture: https://oregonstate.instructure.com/courses/1825733/pages/learn-using-javascript-and-nodejs?module_item_id=20221781
// https://github.com/knightsamar/cs340_sample_nodejs_app/blob/master/people.js
module.exports = function () {
    var express = require('express');
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
            query += " WHERE `firstName` = ?";
        } else if (filtertype == 'lastName') {
            query += " WHERE `lastName` = ?";
        } else if (filtertype == 'email') {
            query += " WHERE `email` = ?";
        } else if (filtertype == 'phone') {
            query += " WHERE `phone` = ?";
        } else if (filtertype == 'address') {
            query += " WHERE `address` = ?";
        } else if (filtertype == 'city'){
            query += " WHERE `city` = ?";
        } else if (filtertype == 'state') {
            query += " WHERE `country` = ?";
        } else if (filtertype == 'zipCode') {
            query += " WHERE `zipCode` = ?";
        } else {
            error = "Error: filtertype '" + filtertype + "' not allowed";
            console.log(error);
            res.write(JSON.stringify(error));
            res.end();
        }
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

    // return desired route path request
    return router;
}();