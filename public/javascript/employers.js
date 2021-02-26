// Adapted from Lecture: https://oregonstate.instructure.com/courses/1825733/pages/learn-using-javascript-and-nodejs?module_item_id=20221781
// https://github.com/knightsamar/cs340_sample_nodejs_app/blob/master/people.js
module.exports = function()
{
    var express = require('express');
    var router = express.Router();
    
    // List of all Employers
    function getEmployers(res, mysql, context, complete)
    {
      mysql.pool.query("SELECT * FROM Employers ORDER BY businessName, email, city, zipCode ASC|DESC", function(error, results, fields)
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
        context.employers = results[0];
        complete();
      });
    }
    
    //Displays all Employers
    router.get('/employers', function(req, res)
    {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteEmployersPosts.js"];
        var mysql = req.app.get('mysql');
        getEmployers(res, mysql, context, complete);

        function complete(){
            callbackCount ++;
            if(callbackCount >= 1){
                res.render('employers', context);
            }
        }
    });
    // Add an Employer
    router.post('/employers', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Employers (businessName, email, phone, address, city, state, country, zipCode)";
        var inserts = [req.body.businessName, req.body.email, req.body.phone, req.body.address, req.body.city, req.body.state, req.body.country, req.body.zipCode];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/Employers');
            }
        });
    });


    // Update Employer
    router.put('/employer/:employerID', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Employers SET businessName=?, email=?, phone=?, address=?, city = ?, state=?, country = ?, zipCode = ? WHERE employerID=?";
        var inserts = [req.body.businessName, req.body.email, req.body.phone, req.body.address, req.body.city, req.body.state, req.body.country, req.body.zipCode, reqs.param.employerID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/employer/:employerID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Employers WHERE employerID = ?";
        var inserts = [req.params.employerID];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;

}();
