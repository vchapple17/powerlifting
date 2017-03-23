var express = require('express');
var Meet = require('../../controller/meet');

var app = express.Router();

// MEET MARKET
app.route('/')
  .get(function(req, res) {
    res.status(200);
    res.render('meetmarket');
  })

app.route("/:meet")
  .get(function(req, res) {
    // check that meet exists
    var meet_id = parseInt(req.params.meet)
    Meet.findById(meet_id, function(error, result) {
      if (error) {
        console.log(error);
        res.status(500);
        res.render('500');
      }
      else {
        if (result.length == 0) {
          console.log(error);
          res.status(404);
          res.render('404');
        }
        else {
          res.status(200);
          res.render('meet');
        }
      }
    })
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
