// Adapted from Lecture: https://oregonstate.instructure.com/courses/1825733/pages/learn-using-javascript-and-nodejs?module_item_id=20221781
// https://github.com/knightsamar/cs340_sample_nodejs_app/blob/master/people.js
module.exports = function () {
    var express = require('express');
    var router = express.Router();

    // Retrieve Responses to posts
    function getResponses(res, mysql, context, complete){
        var query = "SELECT * FROM Responses";
        mysql.pool.query(query, function (error, results, fields) {
            if (error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.responses = results;
            complete();
        });
    }

    router.get('/', function(req, res){
        var context = {};
        var callbackCount = 0;
        var mysql = req.app.get('mysql');
        // define complete function getting info and resumes
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {
                res.render('responses', context);
            }
        }
        getResponses(res, mysql, context, complete);

    });

    // return desired route path request
    return router;
}();