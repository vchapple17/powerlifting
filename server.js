var logfile = require('./logfile');
logfile('./status.log');

var express = require('express');
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
var bodyParser = require('body-parser');
var mysql = require('./mysql.js');
var config = require('./config');

var app = express();
var route = require('./routes/index.js');

// Set Port
var port = process.env.PORT || 27027;
app.listen(port, function() {
  console.log('Express started on localhost port: ' + port);
})

// Configure bodyParser
app.use(bodyParser.json({
  limit: config.bodyLimit
}));
app.use(bodyParser.urlencoded({extended: false}));

// Configure handlebars
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

// Main Route
app.use('', route);
