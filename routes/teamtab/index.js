var express = require('express');
var Team = require('../../controller/team')

var app = express.Router();

// TEAM TAB

// /v1/teamtab/ - Show team table data
app.route('/')
  .get(function(req, res) {
    res.status(200);
    res.render('teamtab');
  })

app.route("/team/:team")
  .get(function(req, res) {
    // check that team exists
    var team_id = parseInt(req.params.team)
    Team.findById(team_id, function(error, result) {
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
          res.render('team');
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
