var express = require('express');

// Main Router
var app = express.Router();

// Routes
var api = require('./api');
var lifterlist = require('./lifterlist');
var teamtab = require('./teamtab');
var meetmarket = require('./meetmarket');

// HOME PAGE
app.route('/')
  .get(function(req, res) {
    res.status(200);
    res.render('home');
  })

app.use('/v1/api', api);
app.use('/lifterList', lifterlist);
app.use('/teamtab', teamtab);
app.use('/meetmarket', meetmarket);


app.use(function(req, res) {
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
