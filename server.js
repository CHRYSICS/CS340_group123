var express = require('express');
var mysql = require('./config/dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.use(express.static('public'))

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
  res.render('applicants');
});

app.post('/applicants', function(req,res){
  res.render('applicants');
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
