/* EmployersPosts Draft
   Name: Kenny Seng
   Date: 2/1/21
   Class: CS 340 
*/

var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 9714);

// connects to database
var mysql = require('mysql');
var pool = mysql.createPool({
  host  : 'classmysql.engr.oregonstate.edu',
  user  : 'cs340_sengk',
  password: '9714',
  database: 'cs340_sengk'
});

//initialize empty database
app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS employers", function(err){
    var createString = "CREATE TABLE employers(" +
    "employerID INT PRIMARY KEY AUTO_INCREMENT NOT_NULL," +
    "businessName VARCHAR(255) NOT NULL," +
    "email VARCHAR(100) NOT NULL," +
    "phone INT(11)," +
    "address VARCHAR(255) NOT NULL," +
    "city VARCHAR(100) NOT NULL," +
    "state CHAR(2) NOT NULL," + 
    "country CHAR(2) NOT NULL," +
    "zipCode VARCHAR(16) NOT NULL";
    pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home', context);
    })
  });
});

//get database via get
app.get('/',function(req,res,next){
    var context = {};
    if(req.query.generateTable){
      pool.query('SELECT employerID, businessName, email, phone, address, city, state, country, zipCode FROM employers', function(err, rows, fields){
        if(err){
          next(err);
          return;
        }
        res.send(JSON.stringify(rows));
      });
    }
    else{
        res.render('home');
    }
});


//post requests (insert, edit, delete)
app.post('/',function(req,res,next){
  var context = {};
  //add to database and return as JSON string
  if(req.body.addButton){
    // if name is empty, send error
    if(req.body.name == ""){
        var nameError = {badInput:true};
        res.send(JSON.stringify(nameError));
        return;
    }
    pool.query('INSERT INTO employers (employerID, businessName, email, phone, address, city, state, country, zipCode) VALUES (?,?,?,?,?,?,?,?,?)', [req.body.employerID, req.body.businessName, req.body.email, req.body.phone, req.body.address, req.body.city, req.body.state, req.body.country, req.body.zipCode], function(err,result){
        if(err){
            next(err);
            return;
        }
        else{
            pool.query('SELECT employerID, businessName, email, phone, address, city, state, country, zipCode FROM employers', function(err, rows, fields){
                if(err){
                    next(err);
                    return;
                }
                else{
                    res.send(JSON.stringify(rows));
                }
            });
        }
    });
  }
  //delete
  else if(req.body.deleteButton){
    pool.query('DELETE FROM employers WHERE employerID=?',[req.body.employerID], function(err, result){
        if(err){
            next(err);
            return;
        }
        else{
            pool.query('SELECT employerID, businessName, email, phone, address, city, state, country, zipCode FROM employers', function(err, rows, fields){
                if(err){
                    next(err);
                    return;
                }
                else{
                    res.send(JSON.stringify(rows));
                }
            });
        }
    });
  }
  //edit or update
  else if(req.body.updateButton){ // enter in from editing an entry
    pool.query('SELECT * FROM employers WHERE employerID = ?', [req.body.employerID], function(err, rows, fields){
        if(err){
            next(err);
            return;
        }
        else{
            context.updateForm = true;

            context.employerID = rows[0].employerID;
            context.businessName = rows[0].businessName;
            context.email = rows[0].email;
            context.phone = rows[0].phone;
            context.address = rows[0].address;
            context.city = rows[0].city;
            context.state = rows[0].state;
            context.country = rows[0].country;
            context.zipCode = rows[0].zipCode;
  
            res.render('home', context);
        }
    });
  }
  //doesn't work; after pressing button, no update is actually done
  else if(req.body.updateEmployerButton) {
    if(req.body.name == ""){

        context.updateError = "Failed to update; name not specified";
        res.render('home', context);
        return;
    }
    pool.query('UPDATE employers SET employerID = ?, businessName = ?, email = ?, phone = ?, address = ?, city = ?, state = ? , country = ?, zipCode = ? WHERE employerID=?', [req.body.employerID, req.body.businessName, req.body.email, req.body.phone, req.body.address, req.body.city, req.body.state, req.body.country, req.body.zipCode], function(err,result){
        if(err){
            next(err);
            return;
        }
        else{
            res.render('home');
        }
    });
  }
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://flip2.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});
