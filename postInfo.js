// Adapted from Lecture: https://oregonstate.instructure.com/courses/1825733/pages/learn-using-javascript-and-nodejs?module_item_id=20221781
// https://github.com/knightsamar/cs340_sample_nodejs_app/blob/master/people.js
module.exports = function () {
    var express = require('express');
    var router = express.Router();

    // Retrieve Post info based on id provided
    function getPostInfo(res, mysql, context, id, complete) {
        var query = "SELECT * FROM Posts JOIN Employers " +
                    "ON Posts.employerID=Employers.employerID " +
                    "WHERE `postID`=? LIMIT 1";
        mysql.pool.query(query, [id], function (error, result, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.info = result[0];
            complete();
        });
    }

    // Retrieve Responses to post based on provided post id
    function getResponses(res, mysql, context, id, complete){
        var query = "SELECT * FROM Responses WHERE postID=?";
        mysql.pool.query(query, [id], function (error, results, fields) {
            if (error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.responses = results;
            complete();
        });
    }

    // Retrieve filtered responses for post
    function getResponsesFiltered(res, mysql, context, id, num, complete){
        var query = "SELECT * FROM Responses WHERE postID=? AND resumeID=?";
        mysql.pool.query(query, [id, num], function(error, results, fields){
            if(error){
                console.log(error);
                res.write(JSON.stringify(error));
                res.end();
            }
            context.responses = results;
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

    // display post info and option to apply
    router.get('/:postID', function(req, res){
        var context = {};
        var callbackCount = 0;
        var id = req.params.postID;
        var mysql = req.app.get('mysql');
        // define complete function getting info and resumes
        function complete() {
            callbackCount++;
            if (callbackCount >= 3) {
                res.render('postInfo', context);
            }
        }
        if("idNum" in req.query){
            var num = req.query.idNum;
            getResponsesFiltered(res, mysql, context, id, num, complete);
        }
        else{
            getResponses(res, mysql, context, id, complete);
        }
        getPostInfo(res, mysql, context, id, complete);
        getResumes(res, mysql, context, complete);

    });

    // insert new response for post
    router.post("/:postID", function(req, res){
        var mysql = req.app.get('mysql');
        var query = "INSERT INTO Responses (postID, resumeID) VALUES (?, ?)";
        var input = [parseInt(req.params.postID), parseInt(req.body.resumeID)];
        mysql.pool.query(query, input, function(error, results, fields){
            if(error){
                console.log(error);
                res.write(JSON.stringify(error));
                res.end();
            }
            res.redirect("/postInfo/" + req.params.postID);
        });

    });

    // return desired route path request
    return router;
}();