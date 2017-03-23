var express = require('express');
var Meet = require('../../../controller/meet')
var Lifter = require('../../../controller/lifter')
var Lifter_Meet = require('../../../controller/lifter_meet')
var app = express.Router();

// MEET ENDPOINT

// /v1/api/meet/

app.route('/')
  // Return JSON of ALL Meet data
  .get(function(req, res, next) {
    Meet.find(function (error, result) {
      if (error) next(error);
      else {
        console.log(result);
        res.status(200);
        res.json(result);
      }
    })
  })
  // 1 Meet: Create, Read, Update, Delete
  .post(function(req, res, next) {
    try {
      if (!req.body) next(new Error("No Body of Request."));
      else if (!req.body['action']) next(new Error("No 'action' Request Body"));
      else {

        var action = req.body['action'];
        switch (action) {
          // CREATE Meet: Need name and mascot sent in body
              // Returns meet added
          case 'create':
            var meetJSON = {
              "name": req.body["name"],
              "city": req.body["city"],
              "state": req.body["state"],
              "zip": req.body["zip"],
              "team_id": req.body["team_id"],
            };
            Meet.add(meetJSON, function (error, result) {
              if (error) next(error);
              else {
                // res.status(200);
                var id = result.insertId;
                Meet.findById(id, function(error, result) {
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


          // READ Meet: Need id, must be number.
            // Returns id, and select columns of 1 MEET with given meet_id)
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
                  Meet.findById(id, function (error, result) {
                    if (error) next(error);
                    else {
                      res.status(200);
                      res.json(result);   // Team Data by Id
                    }
                  });
                }
              }
              break;


          // UPDATE Meet: Need id, must be number, must have all column values.
            // Returns id, and select columns of 1 MEET with given meet_id.
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
                var meetJSON = {
                  "id": req.body["id"],
                  "name": req.body["name"],
                  "city": req.body["city"],
                  "state": req.body["state"],
                  "zip": req.body["zip"],
                  "team_id": req.body["team_id"],
                };
                Meet.update(meetJSON, function (error, result) {
                  if (error) next(error);
                  else {
                    Meet.findById(req.body["id"], function (error, result) {
                      if (error) next(error);
                      else {
                        res.status(200);
                        res.json(result);   // Meet Data by Id
                      }
                    });
                  }
                })
              }
            }
            break;

          // DELETE Meet by id
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
                Meet.delete(req.body["id"], function (error, result) {
                  if (error) next(error);
                  else {
                    res.status(200);
                    res.json(result);   // Meet Data by Id
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

  app.route('/add/:meet_id/:lifter_id')
  // app.route('/add/')
    // Add lifter to meet
    // Body has opening lifts
    .post(function(req, res, next) {
      var errorMsg = ""

      var meet_id = req.params.meet_id;
      var lifter_id = req.params.lifter_id;

      if (typeof meet_id == 'string') meet_id = parseInt(meet_id);
      if (typeof lifter_id == 'string') lifter_id = parseInt(lifter_id);
      var open_bench = req.body["open_bench"];
      var open_clean = req.body["open_clean"];
      var open_squat = req.body["open_squat"];

      // Validate Params and Body
      if (!open_bench) next(new Error("No 'open_bench' provided."));
      else if (typeof open_bench == 'string') {
        open_bench = parseInt(open_bench);
        if (typeof open_bench != 'number') {
          next(new Error("'open_bench' must be a number."));
        }
      }

      if (!open_clean) next(new Error("No 'open_clean' provided."));
      else if (typeof open_clean == 'string') {
        open_clean = parseInt(open_clean);
        if (typeof open_clean != 'number') {
          next(new Error("'open_clean' must be a number."));
        }
      }

      if (!open_squat) next(new Error("No 'open_squat' provided."));
      else if (typeof open_squat == 'string') {
        open_squat = parseInt(open_squat);
        if (typeof open_squat != 'number') {
          next(new Error("'open_squat' must be a number."));
        }
      }

      // Validate Meet Id exists
      Meet.findById(meet_id, function (error, meet) {
        if (error) next(error);
        else {
          // Validate Lifter Id exists
          Lifter.findById(lifter_id, function (error, lifter) {
            if (error) next(error);
            else {
              // Validate pairing does not already exists
              var entry_weight = lifter[0].weight;
              var gender = lifter[0].gender;
              // console.log (lifter[0]);
              var keys = {
                "meet_id": meet_id,
                "lifter_id": lifter_id
              }
              Lifter_Meet.findByIds(keys, function(error, rows) {
                if (error) next(error);
                else {
                  console.log(rows);
                  if (rows.length > 1) {
                    res.statusText = "Lifter already entered into meet";
                    next("Error: Lifter already entered meet more than once.");
                  }
                  else if (rows.length == 1) {
                    res.statusText = "Lifter already entered into meet";
                    next("Error: Lifter already entered meet.");
                  }
                  else {
                    // Lifter is not entered into meet
                    // Add lifter_id and meet_id to relationship
                    // Add lifter's current weight to list
                    // Add lifter's opening lifts
                    console.log("Lifter_Meet.add()")
                    var data = {
                      "lifter_id": lifter_id,
                      "meet_id": meet_id,
                      "gender": gender,
                    	"entry_weight": entry_weight,
                      "open_bench": open_bench,
                      "open_clean": open_clean,
                      "open_squat": open_squat
                    }
                    Lifter_Meet.add(data, function(error, result) {
                      if (error) next(error);
                      else {
                        res.status(200);
                        res.send(result);
                      }
                    })
                  }

                }
              })

            }
          })
        }
      })
    })

  app.route("/:meet_id")
    .get(function(req, res, next) {
      console.log("get lifters from meet id");
      var meet_id = req.params.meet_id;
      if (typeof meet_id == 'string') meet_id = parseInt(meet_id);
      if (typeof meet_id != 'number') {
        next(new Error("meet_id param must be a number"));
      }
      res.status(200);
      Lifter_Meet.findByMeetId(meet_id, function (error, result) {
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
