// API ROUTER

var express = require('express');

// Main Router
var app = express.Router();

// Routes
var coach = require('./coach');
var lifter = require('./lifter');
var meet = require('./meet');
var team = require('./team');

// API GET NOT VALID
app.route('/')
  .get(function(req, res) {
    res.status(200);
    res.redirect('../');
  })

app.use('/coach', coach);
app.use('/lifter', lifter);
app.use('/team', team);
app.use('/meet', meet);

app.use(function(req, res) {
  // res.type('text/plain');
  res.status(404);
  res.render('404')
})

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.type = ('text/plain');
  res.status(500);
  res.render('500')
})

module.exports = app;
