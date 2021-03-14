// Adapted from Lecture: https://oregonstate.instructure.com/courses/1825733/pages/learn-using-javascript-and-nodejs?module_item_id=20221781
// https://github.com/knightsamar/cs340_sample_nodejs_app/blob/master/people.js

module.exports = function()
{
    var express = require('express');
    var router = express.Router();
    
    // List of all Posts
    function getPosts(res, mysql, context, complete)
    {
      mysql.pool.query("SELECT * FROM Posts", function(error, results, fields)
      {
        if(error)
        {
          res.write(JSON.stringify(error));
          res.end();
        }
        context.posts = results;
        complete();
      });
    }
    // Get employer ID and business names for selection
    function getEmployers(req, mysql, context, complete){
        var sql = "SELECT employerID, businessName FROM Employers";
        mysql.pool.query(sql, function(error, results, fields){
            if (error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.employers = results;
            complete();
        });
    }
    // Singular Post
    function getPost(res, mysql, context, postID, complete)
    {
      var sql = "SELECT * FROM Posts WHERE postID = ?";
      var inserts = [postID];
      mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
          res.write(JSON.stringify(error));
          res.end();
        }
        context.post = results[0];
        complete();
      });
    }
    
    //Displays all Posts
    router.get('/', function(req, res)
    {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteEmployersPosts.js"];
        var mysql = req.app.get('mysql');
        getPosts(res, mysql, context, complete);
        getEmployers(req, mysql, context, complete);
        function complete(){
            callbackCount ++;
            if(callbackCount >= 2){
                res.render('posts', context);
            }
        }
    });
    // Add a Post
    router.post('/', function(req, res){
        console.log(req.body);
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Posts (description, employerID) VALUES (?,?)";
      
        var inserts = [req.body.description, req.body.employerID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/posts');
            }
        });
    });

    // Display post for update
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updatePost.js"];
        var mysql = req.app.get('mysql');
        getPost(res, mysql, context, req.params.id, complete);
        getEmployers(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-post', context);
            }

        }
    });

    // Update Post
    router.put('/:postID', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body);
        console.log(req.params.postID);
        var sql = "UPDATE Posts SET description=?, employerID=? WHERE postID =?";
        var inserts = [req.body.description, req.body.employerID, req.params.postID];
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

    /* Route to delete a post, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:postID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Posts WHERE postID = ?";
        var inserts = [req.params.postID];
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
