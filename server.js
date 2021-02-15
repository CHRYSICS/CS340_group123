var express = require('express');
// This includes credentials to access database 
// (for more information on the DB, look at the './config/schema.sql')
var mysql = require('./config/dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

// Files are uploaded on server local directory, not on database
// we will store the directory path into the database
const multer = require('multer');
const path = require('path');
const fs = require('fs');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
// location where uploaded files will be stored
//app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// setup storage engine for uploading files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    var userDir = './uploads/' + req.params.applicantID + '/';
    if (!fs.existsSync(userDir)){
      fs.mkdirSync(userDir);
    }
    cb(null, userDir);
  },
  filename: (req, file, cb) =>{
    console.log(file);
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
const upload = multer({storage: storage});

app.get('/',function(req,res){
  res.render('home');
});

app.get('/employers', function(req, res){
  res.render('employers');
});

app.get('/posts', function(req,res){
  res.render('posts');
});

// route to display applicants in database
app.get('/applicants', function(req, res, next){
  var content = {};
  // retrieve all applicants from database
  mysql.pool.query("SELECT * FROM `Applicants`", function(err, rows, fields){
    if(err){
      next(err);
      return;
    } else {
      content.rows = rows;
      res.render('applicants', content);
    }
  });
});

app.post('/applicants', function(req,res){
  res.render('applicants');
});

// route to display applicant info and their resumes
app.get('/applicantInfo/:applicantID', function(req, res , next){
  var id = req.params.applicantID;
  var content = {};
  // select applicant info for applicant with id retrieved, limit to one result returned
  mysql.pool.query("SELECT * FROM Applicants WHERE applicantID=? LIMIT 1", [id], function(err, result){
    if(err){
        next(err);
        return;
    }
    else{
      console.log(result);
      content.info = result[0];
      // retrieve applicant resumes
      mysql.pool.query("SELECT * FROM Resumes WHERE applicantID=?", [id], function(err, rows, fields){
        if(err){
          next(err);
          return;
        } else {
          console.log(rows);
          content.resumes = rows;
          res.render('applicantInfo', content);
        }
      });
    }
  });
});

// upload resume route
app.post('/applicantInfo/:applicantID', upload.single('resume'), (req, res, next) => {
  try {
    console.log(req.file);
    console.log(req);
    mysql.pool.query("INSERT INTO `Resumes`(`applicantID`, `fileName`) VALUES (?, ?)", [req.params.applicantID, req.file.filename]);
    res.redirect('back');
  } catch (error){
    console.log(error);
  }
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
