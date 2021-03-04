var express = require('express');
// This includes credentials to access database 
// (for more information on the DB, look at the './config/schema.sql')
var mysql = require('./config/dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

// Files are uploaded on server local directory, not on database
// we will store the directory path into the database
var path = require('path');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '/public')));
app.set('views', path.join(__dirname, "views"));

app.set('mysql', mysql);
app.use('/employers', require('./employers.js'));
app.use('/employersInfo', require('./employers.js));
app.use('/posts', require('./posts.js'));
app.use('/applicants', require('./applicants.js'));
app.use('/applicantInfo', require('./applicantInfo.js'));
app.use('/resumes', require('./resumes.js'));
app.use('/responses', require('./responses.js'));
app.use('/post_responses', require('./post_responses.js'));

app.get('/',function(req,res){
  res.render('home');
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
