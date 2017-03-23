var express = require('express');

var app = express.Router();

// LIFTER LIST
app.route('/')
  .get(function(req, res) {
    res.status(200);
    res.render('lifterlist');
  })

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
