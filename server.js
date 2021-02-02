var express = require('express');
var mysql = require('./config/dbcon.js');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.use(express.json());
app.use(express.static('public'))

// Demo Data (to be replaced with backend)
var AppRows = [{"applicantID":1, "firstName":"Chris", "lastName":"Eckerson-Keith", "email": "eckersoc@oregonstate.edu", "phone":9871234567, "address": "The Good Place", "city":"Jacksonville", "state":"FL", "country":"US","zipCode":12345}];
var ResRows = [{"resumeID":1, "applicantID": 1, "fileLocation": "Should be downloadable (soon to come)"}];

app.get('/',function(req,res){
  res.render('home');
});

app.get('/employers', function(req, res){
  res.render('employers');
});

app.get('/posts', function(req,res){
  res.render('posts');
});

app.get('/applicants', function(req,res){
  var content = {};
  // insert sql query here as "AppRows"
  content.rows = AppRows;
  //console.log(content);
  res.render('applicants', content);
});

app.post('/applicants', function(req,res){
  res.render('applicants');
});

app.get('/applicantInfo/:applicantID', function(req, res){
  var id = req.params.applicantID;
  var content = {};
  // insert select sqlquery by applicantID
  for (i in AppRows){
    if(AppRows[i].applicantID == id){
      content.info = AppRows[i];
      console.log(content);
      break;
    }
  }
  // insert select sqlquery for applicant resumes
  var count = 0;
  content.resumes = [];
  for (i in ResRows){
    if(ResRows[i].applicantID == id){
      content.resumes[count] = ResRows[i];
      count++; 
    }
  }
  res.render('applicantInfo', content);
})

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
