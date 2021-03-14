// Adapted from Lecture: https://oregonstate.instructure.com/courses/1825733/pages/learn-using-javascript-and-nodejs?module_item_id=20221781
// https://github.com/knightsamar/cs340_sample_nodejs_app/blob/master/people.js
module.exports = function () {
    var express = require('express');
    var router = express.Router();

    // Retrieve Responses to posts and associated applicant IDs
    function getResponses(res, mysql, context, complete){
        var query = "SELECT r.postID, r.resumeID, applicantID FROM Responses r " +
                    "JOIN Resumes ON r.resumeID=Resumes.resumeID";
        mysql.pool.query(query, function (error, results, fields) {
            if (error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.responses = results;
            complete();
        });
    }

    // Retrieve reponses by ID of either resume or post
    function getResponseFiltered(res, mysql, context, filtertype, idNum, complete){
        // build sql query for filtered select
        var query = "SELECT r.postID, r.resumeID, applicantID FROM Responses r " +
                    "JOIN Resumes ON r.resumeID=Resumes.resumeID " +
                    "WHERE ";
        // convert input ID string into a number
        var id = parseInt(idNum);
        // complete rest of filter query based on filtertype
        if(filtertype == "postID"){
            query += "r.postID=?";
        }
        else if(filtertype == "resumeID"){
            query += "r.resumeID=?";
        } else {
            error = "Error: filtertype '" + filtertype + "' not allowed";
            console.log(error);
            res.write(JSON.stringify(error));
            res.end();
        }
        // make conditional selection query
        mysql.pool.query(query, [id], function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.responses = results;
            complete();
        });
    }

    // Retrieve all post ids
    function getPosts(res, mysql, context, complete){
        var query = "SELECT postID FROM Posts";
        mysql.pool.query(query, function(error, results, fields){
            if(error){
                console.log(error);
                res.write(JSON.stringify(error));
                res.end();
            }
            context.posts = results;
            complete();
        });
    }

    // Retrieve all resume ids and filenames
    function getResumes(res, mysql, context, complete){
        var query = "SELECT resumeID, fileName FROM Resumes";
        mysql.pool.query(query, function(error, results, fields){
            if(error){
                console.log(error);
                res.write(JSON.stringify(error));
                res.end();
            }
            context.resumes = results;
            complete();
        });
    }

    // display of response page
    router.get('/', function(req, res){
        var context = {};
        var callbackCount = 0;
        var mysql = req.app.get('mysql');
        // define complete function getting responses
        function complete() {
            callbackCount++;
            if (callbackCount >= 3) {
                res.render('responses', context);
            }
        }
        // get post and resume ids for adding new response
        getPosts(res, mysql, context, complete);
        getResumes(res, mysql, context, complete);
        // If filter was provided, select from applicant based on filtertype and id number given
        if ('filtertype' in req.query && 'idNum' in req.query) {
            var filtertype = req.query.filtertype;
            var idNum = req.query.idNum;
            // check if empty string for id number given
            if (idNum == '') {
                // just return all the applicants
                return getResponses(res, mysql, context, complete);
            }
            // Otherwise log the filter request made
            console.log("Responses Filter made!");
            console.log(req.query);
            // return filtered results from responses
            return getResponseFiltered(res, mysql, context, filtertype, idNum, complete);
        }
        // otherwise return all the responses
        return getResponses(res, mysql, context, complete);
    });

    // insert new response into Reponses table
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        // create query for insert query
        var query = "INSERT INTO Responses (postID, resumeID) VALUES (?, ?)";
        // collect input values for query
        var input = [parseInt(req.body.postID, 10), parseInt(req.body.resumeID)];
        mysql.pool.query(query, input, function(error, results, fields){
            // log any error that occurs with insert request
            if (error) {
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            }
            // otherwise request complete, return to get route path
            else {
                res.redirect('./responses');
            }
        });
    });

    // delete response from Responses table
    router.delete('/delete/:postID/:resumeID', function(req, res){
        var mysql = req.app.get('mysql');
        // create query for delete query
        var query = "DELETE FROM Responses WHERE postID = ? AND resumeID = ?";
        mysql.pool.query(query, [req.params.postID, req.params.resumeID], function(error, results, fields){
            // log any erro that occurs with deleting response
            if(error){
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            }
            // otherwise report status 200 success and end response
            console.log("Deleted Response pair: postID(" + req.params.postID + ") AND resumeID(" + req.params.resumeID + ")");
            res.status(200);
            res.end();
        });
    });
    // return desired route path request
    return router;
}();