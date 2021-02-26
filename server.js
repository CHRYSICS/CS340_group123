var express = require('express');
// This includes credentials to access database 
// (for more information on the DB, look at the './config/schema.sql')
var mysql = require('./config/dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

// Files are uploaded on server local directory, not on database
// we will store the directory path into the database
var multer = require('multer');
var path = require('path');
var fs = require('fs');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '/public')));
app.set('views', path.join(__dirname, "views"));

app.use('/employers', require('./public/javascript/employers.js'));
app.use('/posts', require('./public/javascript/posts.js'));

// setup storage engine for uploading files
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    var userDir = './uploads/' + req.params.applicantID + '/';
    if (!fs.existsSync(userDir)){
      fs.mkdirSync(userDir);
    }
    cb(null, userDir);
  },
  filename: function(req, file, cb){
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
var upload = multer({storage: storage});

app.get('/',function(req,res){
  res.render('home');
});

// app.get('/employers', function(req, res){
//   res.render('employers');
// });

// app.get('/posts', function(req,res){
//   res.render('posts');
// });

// route to display applicants in database
app.get('/applicants', function(req, res, next){
  var content = {};
  var query = "SELECT * FROM `Applicants`";
  // If filter was provided, select from applicant based on filtertype and input
  if('filtertype' in req.query && 'input' in req.query){
    var filtertype = req.query.filtertype;
    var input = req.query.input;
    // check if empty input before input
    if (input == ''){
      // just return all the applicants
      return mysql.pool.query(query, function(err, rows){
        if(err){
          next(err);
          return;
        } else {
          content.rows = rows;
          res.render('applicants', content);
        }
      });
    }
    // Otherwise log the filter request made
    console.log("Applicants Filter made!");
    console.log(req.query);

    // build query based on filter selection (this must be hardcoded to avoid injection)
    if (filtertype == 'firstName'){
      query += " WHERE firstName = ?";
    } else if(filtertype == 'lastName'){
      query += " WHERE lastName = ?";
    } else if(filtertype == 'email'){
      query += " WHERE email = ?";
    } else if(filtertype == 'phone'){
      query += " WHERE phone = ?";
    } else if(filtertype == 'address'){
      query += " WHERE address = ?";
    } else {
      console.log("Error: filtertype '" + filtertype + "' not allowed");
      return;
    }
    // make conditional selection query
    return mysql.pool.query(query, [input], function(err, rows){
      if(err){
        next(err);
        return;
      } else{
        content.rows = rows;
        res.render('applicants', content);
      }
    });
  
  }
  // Otherwise select all applicants from sql table without filter
  return mysql.pool.query(query, function(err, rows){
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
  console.log(req.body);
  
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
app.post('/applicantInfo/:applicantID', upload.single('resume'), function(req, res){
  try {
    console.log(req.params);
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
