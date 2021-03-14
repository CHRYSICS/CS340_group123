// Adapted from Lecture: https://oregonstate.instructure.com/courses/1825733/pages/learn-using-javascript-and-nodejs?module_item_id=20221781
// https://github.com/knightsamar/cs340_sample_nodejs_app/blob/master/people.js
module.exports = function()
{
    var express = require('express');
    var router = express.Router();

    // List of all Employers
    function getEmployers(res, mysql, context, complete)
    {
      mysql.pool.query("SELECT * FROM Employers", function(error, results, fields)
      {
        if(error)
        {
          res.write(JSON.stringify(error));
          res.end();
        }
        context.employers = results;
        complete();
      });
    }
    
    // List all employers based on filter (mysql query)
    function getEmployersFiltered(res, mysql, context, filtertype, input, complete){
        var query = "SELECT * FROM `Employers`";
        // build query based on filter selection (this must hardcoded to avoid injection)
        if (filtertype == 'businessName'){
            query += " WHERE `businessName` = ?";
        } else if (filtertype == 'email'){
            query += " WHERE `email` = ?";
        } else if (filtertype == 'phone'){
            query += " WHERE `phone` = ?";
        } else if (filtertype == 'address'){
            query += " WHERE `address` = ?";
        } else if (filtertype == 'city'){
            query += " WHERE `city` = ?";
        } else if (filtertype == 'state'){
            query += " WHERE `state` = ?";
        } else if (filtertype == 'country'){
            query += " WHERE `country` = ?";
        } else if (filtertype == 'zipCode'){
            query += " WHERE `zipCode` = ?";
        } else {
            error = "Error: filtertype '" + filtertype + "' not allowed";
            console.log(error);
            res.write(JSON.stringify(error));
            res.end(); 
        }
        // make conditional selection query
        mysql.pool.query(query, [input], function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.employers = results;
            complete();
        });
    }

    // Singular Employer
    function getEmployer(res, mysql, context, employerID, complete)
    {
      var sql = "SELECT * FROM Employers WHERE employerID = ?";
      var inserts = [employerID];
      mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
          res.write(JSON.stringify(error));
          res.end();
        }
        context.employer = results[0];
        complete();
      });
    }
    
    // get posts for employer
    function getEmployerPosts(res, mysql, context, employerID, complete){
        var query = "SELECT * FROM Posts WHERE employerID=?";
        mysql.pool.query(query, [employerID], function(error, results, fields){
            if (error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.posts = results;
            complete();
        });
    }

    //route to display employers in database
    router.get('/', function(req, res)
    {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteEmployersPosts.js",
                            "employersSearchInput.js"];
        var mysql = req.app.get('mysql');
        
        // define complete function for get request
        function complete(){
            callbackCount ++;
            if(callbackCount >= 1){
                res.render('employers', context);
            }
        }

        // If filter was provided, select employers based o filtertype and input
        if ('filtertype' in req.query && 'input' in req.query){
            var filtertype = req.query.filtertype;
            var input = req.query.input;
            // check if empty input before input
            if (input == ''){
                // just return all employers
                return getEmployers(res, mysql, context, complete);
            }
            // otherwise log the filter request made
            console.log("Employers Filter made!");
            console.log(req.query);
            // return filtered results from employers
            return getEmployersFiltered(res, mysql, context, filtertype, input, complete);
        }
        // just return all the employers
        return getEmployers(res, mysql, context, complete);
    });

    // Add an Employer
    router.post('/', function(req, res){
        console.log(req.body);
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Employers (businessName, email, phone, address, city, state, country, zipCode) VALUES (?,?,?,?,?,?,?,?)";
        var inserts = [req.body.businessName, req.body.email, req.body.phone, req.body.address, req.body.city, req.body.state, req.body.country, req.body.zipCode];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('./employers');
            }
        });
    });

    // display employer detailed info
    router.get('/:employerID', function(req, res){
        var callbackCount = 0;
        var id = req.params.employerID;
        var context = {};
        context.jsscripts = ["deleteEmployersPosts.js"];
        var mysql = req.app.get('mysql');
        // define complete funciton getting info and posts
        function complete(){
            callbackCount++;
            if (callbackCount >= 2){
                res.render('employersInfo', context);
            }
        }
        getEmployer(res, mysql, context, id, complete);
        getEmployerPosts(res, mysql, context, id, complete);
    });

    // Display employer for update
    router.get('/:employerID/update', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateEmployer.js"];
        var mysql = req.app.get('mysql');
        getEmployer(res, mysql, context, req.params.employerID, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-employer', context);
            }

        }
    });

    // Update Employer
    router.put('/:employerID/update', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body);
        console.log(req.params.employerID);
        var sql = "UPDATE Employers SET businessName=?, email=?, phone=?, address=?, city = ?, state=?, country = ?, zipCode = ? WHERE employerID=?";
        var inserts = [req.body.businessName, req.body.email, req.body.phone, req.body.address, req.body.city, req.body.state, req.body.country, req.body.zipCode, req.params.employerID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error);
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:employerID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Employers WHERE employerID = ?";
        var inserts = [req.params.employerID];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error);
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        });
    });

    return router;

}();
