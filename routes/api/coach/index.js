var express = require('express');
var Coach = require('../../../controller/coach')
var app = express.Router();

// COACH ENDPOINT

app.route('/')
  // Return JSON of ALL Coach data
  .get(function(req, res, next) {
    res.status(200);
    Coach.find(function (error, result) {
      if (error) next(error);
      else {
        res.status(200);
        res.json(result);
      }
    })
  })
  // 1 Coach: Create, Read, Update, Delete
  .post(function(req, res, next) {
    try {
      if (!req.body) next(new Error("No Body of Request."));
      else if (!req.body['action']) next(new Error("No 'action' Request Body"));
      else {
        var action = req.body['action'];
        switch (action) {
          // CREATE Coach: Returns coach added
          case 'create':
            var coachJSON = {
              "first_name": req.body["first_name"],
              "last_name": req.body["last_name"],
              "team_id": req.body["team_id"]
            };
            console.log(coachJSON);
            Coach.add(coachJSON, function (error, result) {
              if (error) next(error);
              else {
                // res.status(200);
                var id = result.insertId;
                Coach.findById(id, function(error, result) {
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

          // READ Coach: Need id, must be number.
            // Returns id, and select columns of 1 COACH with given coach_id)
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
                  Coach.findById(id, function (error, result) {
                    if (error) next(error);
                    else {
                      res.status(200);
                      res.json(result);   // Team Data by Id
                    }
                  });
                }
              }
              break;


          // UPDATE Coach: Need id, must be number, must have all column values.
            // Returns id, and select columns of  1 COACH with given coach_id.
          case 'update':
            var team_id = req.body["team_id"];
            var id = req.body["id"];
            if (!id) next(new Error("No 'id' in Body of Request."));
            else {
              id = parseInt(id);
              if (typeof id !== 'number') {
                next(new Error("'id' in Body of Request must be an integer"));
              }
              else {
                if (team_id) {
                  if (typeof team_id == 'string') {
                    team_id = parseInt(team_id);
                  }
                  if (typeof team_id != 'number') {
                    next(new Error("'team_id' must be an integer"));
                  }
                }
                var coachJSON = {
                  "id": id,
                  "first_name": req.body["first_name"],
                  "last_name": req.body["last_name"],
                  "team_id": team_id
                }
                Coach.update(coachJSON, function (error, result) {
                  if (error) next(error);
                  else {
                    Coach.findById(id, function (error, result) {
                      if (error) next(error);
                      else {
                        res.status(200);
                        res.json(result);   // Coach Data by Id
                      }
                    });
                  }
                })
              }
            }
            break;

          // DELETE Coach by id
          case 'delete':
            var id = req.body["id"];
            if (!id) next(new Error("No 'id' in Body of Request."));
            else {
              id = parseInt(id);
              if (typeof id !== 'number') {
                next(new Error("'id' in Body of Request must be an integer"));
              }
              else {
                Coach.delete(id, function (error, result) {
                  if (error) next(error);
                  else {
                    res.status(200);
                    res.json(result);   // Coach Data by Id
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
  // Return JSON of ALL Coach data with team_id parameter
  .get(function(req, res, next) {
    console.log("get coaches from team id");
    var team_id = req.params.team_id;
    if (typeof team_id == 'string') team_id = parseInt(team_id);
    if (typeof team_id != 'number') {
      next(new Error("team_id param must be a number"));
    }
    res.status(200);
    Coach.findByTeamId(team_id, function (error, result) {
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
