var express = require('express');
var Team = require('../../../controller/team')
var app = express.Router();

// TEAM ENDPOINT

// Team Name or Mascot
app.route('/search?')
  .get(function(req,res, next) {
    console.log(req.query);
    var searchQuery = {
      "name": req.query.name,
      "mascot": req.query.mascot,
      "AND": req.query.AND,
      "OR": req.query.OR
    };
    Team.search(searchQuery, function(error, result) {
      if (error) next(error);
      else {
        res.status(200);
        res.json(result);
      }
    });
  });

app.route('/')
  // Return JSON of ALL Team data
  .get(function(req, res, next) {
    res.status(200);
    Team.find(function (error, result) {
      if (!error) next(error);
      else {
        res.status(200);
        res.json(result);
      }
    })
  })
  // 1 Team: Create, Read, Update, Delete
  .post(function(req, res, next) {
    try {
      if (!req.body) next(new Error("No Body of Request."));
      else if (!req.body['action']) next(new Error("No 'action' Request Body"));
      else {

        var action = req.body['action'];
        switch (action) {
          // CREATE Team: Need name and mascot sent in body
              // Returns team added
          case 'create':
            var teamJSON = {
              "name": req.body["name"],
              "mascot": req.body["mascot"]
            };
            Team.add(teamJSON, function (error, result) {
              if (error) next(error);
              else {
                // res.status(200);
                var id = result.insertId;
                Team.findById(id, function(error, result) {
                  if (error) next(error);
                  else {
                    res.status(200);
                    res.json(result);
                  }
                }
              )
              };
            });
            break;


          // READ Team: Need id, must be number.
            // Returns id, and select columns of 1 TEAM with given team_id)
          case 'read':
            var id = req.body["id"];
            if (!req.body['id']) next(new Error("No 'id' in Body of Request."));
            else {
              id = parseInt(id);
              console.log(typeof id);
              if (typeof id !== 'number') {
                next(new Error("'id' in Body of Request must be an integer"));
              }
              else {
                Team.findById(id, function (error, result) {
                  if (error) next(error);
                  else {
                    res.status(200);
                    res.json(result);   // Team Data by Id
                  }
                });
              }
            }
            break;


          // UPDATE Team: Need id, must be number, must have all column values.
            // Returns id, and select columns of 1 TEAM with given team_id.
          case 'update':
            var id = req.body["id"];
            if (!req.body['id']) next(new Error("No 'id' in Body of Request."));
            else {
              console.log(typeof id);
              id = parseInt(id);
              if (typeof id !== 'number') {
                next(new Error("'id' in Body of Request must be an integer"));
              }
              else {
                var teamJSON = {
                  "id": req.body["id"],
                  "name": req.body["name"],
                  "mascot": req.body["mascot"]
                }
                Team.update(teamJSON, function (error, result) {
                  if (error) next(error);
                  else {
                    Team.findById(id, function (error, result) {
                      if (error) next(error);
                      else {
                        res.status(200);
                        res.json(result);   // Team Data by Id
                      }
                    });
                  }
                })
              }
            }
            break;

          // DELETE Team by id
          case 'delete':
            var id = req.body["id"];
            if (!req.body['id']) next(new Error("No 'id' in Body of Request."));
            else {
              id = parseInt(id);
              console.log("id is of type: " + typeof id);
              if (typeof id !== 'number') {
                next(new Error("'id' in Body of Request must be an integer"));
              }
              else {
                Team.delete(id, function (error, result) {
                  if (error) next(error);
                  else {
                    res.status(200);
                    res.json(result);   // Team Data by Id
                  }
                });
              }
            }
          break;
          default:
            next(new Error("Invalid 'action' in Body of Request."));
            break;
        }
      }
    }
    catch(e) {
      console.log("Unknown exception");
      next(new Error(e));
    }
  }, function(req, res) {     // Handle Error/Result
      if (!error) {
        res.status(200);
        res.json(result);
      }
      else {
        res.status(400);
        res.send(error);
      }
    }
  )

// Error Handling
app.use(function(req, res) {
  res.status(404);
  res.render('404')
})

app.use(function(err, req, res, next) {
  console.log(err);
  console.error(err.stack);
  res.status(500);
  var context = {};
  context.errorMessage = err;
  res.render('500', context)
})

module.exports = app;
