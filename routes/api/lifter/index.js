var express = require('express');
var Lifter = require('../../../controller/lifter');

var app = express.Router();

// LIFTER ENDPOINT

// Lifter first or last name
// app.route('/search?')
//   .get(function(req,res, next) {
//     console.log(req.query);
//     var searchQuery = {
//       "first_name": req.query.first_name,
//       "last_name": req.query.last_name,
//       "AND": req.query.AND,
//       "OR": req.query.OR
//     };
//     Lifter.search(searchQuery, function(error, result) {
//       if (error) next(error);
//       else {
//         res.status(200);
//         res.json(result);
//       }
//     });
//   });

app.route('/')
  // Return JSON of ALL Lifter data
  .get(function(req, res, next) {
    res.status(200);
    Lifter.find(function (error, result) {
      if (error) next(error);
      else {
        res.status(200);
        res.json(result);
      }
    })
  })
  // 1 Lifter: Create, Read, Update, Delete
  .post(function(req, res, next) {
    try {
      if (!req.body) next(new Error("No Body of Request."));
      else if (!req.body['action']) next(new Error("No 'action' Request Body"));
      else {

        var action = req.body['action'];
        switch (action) {
          // CREATE Lifter and Returns lifter added
          case 'create':
            var lifterJSON = {
              "first_name": req.body["first_name"],
              "last_name": req.body["last_name"],
              "gender": req.body["gender"],
              "weight": req.body["weight"],
              "grade": req.body["grade"],
              "team_id": req.body["team_id"]
            };
            console.log(lifterJSON);
            Lifter.add(lifterJSON, function (error, result) {
              if (error) next(error);
              else {
                // res.status(200);
                var id = result.insertId;
                Lifter.findById(id, function(error, result) {
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

          // READ Lifter: Need id, must be number.
            // Returns id, name, mascot of 1 LIFTER with given lifter_id)
            case 'read':
              var id = req.body["id"];
              if (!id) next(new Error("No 'id' in Body of Request."));
              else {
                id = parseInt(id);
                console.log(typeof id);
                if (typeof id !== 'number') {
                  next(new Error("'id' in Body of Request must be an integer"));
                }
                else {
                  Lifter.findById(id, function (error, result) {
                    if (error) next(error);
                    else {
                      res.status(200);
                      res.json(result);   // Team Data by Id
                    }
                  });
                }
              }
              break;


          // UPDATE Lifter: Need id, must be number, must have all column values.
            // Returns id, and select columns of 1 LIFTER with given lifter_id.
          case 'update':
            var id = req.body["id"];
            if (!id) next(new Error("No 'id' in Body of Request."));
            else {
              id = parseInt(id);

              if (typeof id !== 'number') {
                next(new Error("'id' in Body of Request must be an integer"));
              }
              else {
                var lifterJSON = {
                  "first_name": req.body["first_name"],
                  "last_name": req.body["last_name"],
                  "gender": req.body["gender"],
                  "weight": req.body["weight"],
                  "grade": req.body["grade"],
                  "lifter_id": id,
                  "team_id": req.body["team_id"]
                };
                console.log("lifterJSON: " + JSON.stringify(lifterJSON));
                Lifter.update(lifterJSON, function (error, result) {
                  if (error) next(error);
                  else {
                    Lifter.findById(req.body["id"], function (error, result) {
                      if (error) next(error);
                      else {
                        res.status(200);
                        res.json(result);   // Lifter Data by Id
                      }
                    });
                  }
                })
              }
            }
            break;

          // DELETE Lifter by id
          case 'delete':
            var id = req.body["id"];
            if (!id) next(new Error("No 'id' in Body of Request."));
            else {
              id = parseInt(id);
              if (typeof id !== 'number') {
                next(new Error("'id' in Body of Request must be an integer"));
              }
              else {
                Lifter.delete(id, function (error, result) {
                  if (error) next(error);
                  else {
                    res.status(200);
                    res.json(result);   // Lifter Data by Id
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
  app.route('/:team_id')
    // Return JSON of ALL Lifter data with team_id parameter
    .get(function(req, res, next) {
      console.log("get lifters from team id");
      var team_id = req.params.team_id;
      if (typeof team_id == 'string') team_id = parseInt(team_id);
      if (typeof team_id != 'number') {
        next(new Error("team_id param must be a number"));
      }
      res.status(200);
      Lifter.findByTeamId(team_id, function (error, result) {
        if (error) next(error);
        else {
          res.status(200);
          res.json(result);
        }
      })
    })

app.route("/available/:meet_id")
  .get(function(req, res, next) {
    console.log("get lifters not in meet id");
    var meet_id = req.params.meet_id;
    if (typeof meet_id == 'string') meet_id = parseInt(meet_id);
    if (typeof meet_id != 'number') {
      next(new Error("meet_id param must be a number"));
    }
    res.status(200);
    Lifter.getAllNotEntered(meet_id, function (error, result) {
      if (error) next(error);
      else {
        res.status(200);
        res.json(result);
      }
    })
  })
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
