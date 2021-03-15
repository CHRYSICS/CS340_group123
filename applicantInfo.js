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
      var userDir = './uploads/' + req.params.applicantID + '/';
      if (!fs.existsSync(userDir)){
        fs.mkdirSync(userDir);
      }
      console.log("Resume Saved To:", userDir + file.originalname);
      cb(null, userDir);
    },
    filename: function(req, file, cb){
      cb(null, file.originalname);
    }
  });
  
  // // file filter (by type: current only docx & pdf)
  // const fileFilter = (req, file, cb) =>{
  //   if(file.mimetype == 'application/msword' || file.mimetype == 'application/pdf'){
  //     cb(null, true);
  //   } else{
  //     cb(null, false);
  //   }
  // }
  // set up upload function

  // set up upload function
  var upload = multer({storage: storage});
  
  // Retrieve Applicant info based on id provided
  function getApplicant(res, mysql, context, id, complete) {
    var query = "SELECT * FROM Applicants WHERE `applicantID`=? LIMIT 1";
    mysql.pool.query(query, [id], function (error, result, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.info = result[0];
      complete();
    });
  }

  // List all resumes for given Applicant (mysql query)
  function getApplicantResumes(res, mysql, context, id, complete) {
    var query = "SELECT * FROM Resumes WHERE applicantID=?";
    mysql.pool.query(query, [id], function (error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.resumes = results;
      complete();
    });
  }
  
  // Get resumes based on resume id order for given Applicant (mysql query)
  function getApplicantResumesByOrder(res, mysql, context, id, order, complete) {
    var query = "SELECT * FROM Resumes WHERE applicantID=? ORDER BY resumeID " + order;
    mysql.pool.query(query, [id], function(error, results, fields){
      if (error){
        res.write(JSON.stringify(error));
        res.end();
      }
      context.resumes = results;
      complete();
    });
  }

  // Get resume based on filter for given Applicant (mysql query)
  function getApplicantResume(res, mysql, context, id, fileName, complete) {
    var query = "SELECT * FROM Resumes WHERE `applicantID`=? AND `fileName`=?";
    mysql.pool.query(query, [id, fileName], function (error, results, fields) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      }
      context.resumes = results;
      complete();
    });
  }

  // route to display applicant info and their resumes
  router.get('/:applicantID', function (req, res) {
    var callbackCount = 0;
    var id = req.params.applicantID;
    var context = {};
    var mysql = req.app.get('mysql');
    // define complete function getting info and resumes
    function complete() {
      callbackCount++;
      if (callbackCount >= 2) {
        res.render('applicantInfo', context);
      }
    }
    getApplicant(res, mysql, context, id, complete);
    // if order provided, select from resumes based on order
    if('order' in req.query){
      console.log("Resume Filter made!");
      console.log(req.query);
      return getApplicantResumesByOrder(res, mysql, context, id, req.query.order, complete);
    }
    // If filter provided, select from resumes based on filter
    if('fileName' in req.query){
      // check if input is empty
      if(req.query.fileName == ''){
        // instead return all resumes
        return getApplicantResumes(res, mysql, context, id, complete);
      }
      // log filter results
      console.log("Resume Filter made!");
      console.log(req.query);
      // return filtered results
      return getApplicantResume(res, mysql, context, id, req.query.fileName, complete);
    }
    // otherwise return all resumes for applicant
    return getApplicantResumes(res, mysql, context, id, complete);
  });

  // upload resume route
  router.post('/:applicantID', upload.single('resume'), function (req, res)
  {
    var mysql = req.app.get('mysql');
    var query = "INSERT INTO `Resumes`(`applicantID`, `fileName`) VALUES (?, ?)";
    var input = [req.params.applicantID, req.file.filename];
    // make sql request to insert new resume
    mysql.pool.query(query, input, function(error, results, fields)
    {
      // log any error that occurs with insert request
      if(error)
      {
        console.log(JSON.stringify(error));
        res.status(422).send('Unprocessable Entity: Duplicate file name');
        res.end();
      }
      // otherwise request completed, return to get route path
      else
      {
        res.redirect('./' + req.params.applicantID);
      }
    });
  });

  // get update applicant route
  router.get('/:applicantID/update', function(req, res)
  {
    var callbackCount = 0;
    var id = req.params.applicantID;
    var context = {};
    var mysql = req.app.get('mysql');
    // define complete function getting info and resumes
    function complete() {
      callbackCount++;
      if (callbackCount >= 1) {
        res.render('update-applicant', context);
      }
    }
    getApplicant(res, mysql, context, id, complete);
  });

  // make update of applicant
  router.put('/:applicantID/update', function(req,res){
    var mysql = req.app.get('mysql');
    var query = "UPDATE Applicants SET " +
                "firstName=?, lastName=?, email=?, phone=?, address=?, city=?, state=?, country=?, zipCode=? " +
                "WHERE applicantID=?";
    var input = [req.body.firstName, req.body.lastName, req.body.email, req.body.phone, req.body.address,
                 req.body.city, req.body.state, req.body.country, req.body.zipCode, req.params.applicantID];
    // make sql request to update applicant
    mysql.pool.query(query, input, function(error, results, fields)
    {
      // log any error that occurs with insert request
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
  
  // return desired route path request
  return router;
}();