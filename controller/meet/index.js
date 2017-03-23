var mysql = require('../../mysql');

var meet = {
  // *
  // QUERY HELPER
  // *
  query: function(queryStr, input, callback) {
    var functName = "query()";
    // MySQL Query
    mysql.pool.query(queryStr, input, function (error, rows, fields) {
      if (!error) {
        var string = JSON.stringify(rows);
        console.log("Sending: " + string);
        callback(null,rows);
      }
      else {
        console.log(functName + " Error: " + error);
        callback(error);
      }
    });
  },


  // *
  // CREATE MEET
  // *
  // var meetJSON = {
  //   "name": req.body["name"], // required
  //   "city": req.body["city"],
  //   "state": req.body["state"],
  //   "zip": req.body["zip"],
  //   "team_id": req.body["team_id"],
  // };
  add: function (meetJSON, callback) {
    var functName = "queryInsert()"
    var errorMsg = "";

    // Validate meetJSON
    if (!meetJSON) {
      errorMsg = "No meet data passed.";
    }
    else if (!meetJSON["name"])  {
      errorMsg = "Meet name not provided";
    }

    if (errorMsg != "") {
      console.log(functName + " Error: " + errorMsg);
      callback(functName + " Error: " + errorMsg);
    }
    else {
      var queryStr = "INSERT INTO `meet`";
      queryStr += " (name, city, state, zip, team_id) VALUES (?,?,?,?,?)";
      var input = [
        meetJSON["name"],
        meetJSON["city"],
        meetJSON["state"],
        meetJSON["zip"],
        meetJSON["team_id"]
      ];
      mysql.pool.query(queryStr, input, function (error, rows, fields) {
        if (!error) {
          var string = JSON.stringify(rows);
          console.log("Sending: " + string);
          callback(null,rows);
        }
        else {
          console.log(functName + " Error: " + error);
          callback(error);
        }
      });
    }
  },


  // *
  // READ MEET(ES) QUERIES
  // *

  // Return JSON of Meet by Id - LIMIT 1
  findById: function (id, callback) {
    var functName = "findById()";
    var queryStr = "SELECT meet_id, name, city, state, zip, team_id FROM `meet` WHERE meet_id=? LIMIT 1";

    // console.log(queryStr);
    if (typeof id == "number") {
      var input = [id];
      meet.query(queryStr, input, callback);
    }
    else {
      callback(functName + " Error: 'id' is not a number'");
    }
  },

  // Return all meets
  find: function(callback) {
    var functName = "find";
    // var queryStr = "SELECT meet_id, name, city, state, zip FROM `meet`";
      var queryStr = "SELECT m.meet_id, m.name as 'meet_name', m.city, m.state, m.zip, t.team_id, t.name as 'team_name' FROM `meet` m LEFT JOIN `team` t ON t.team_id = m.team_id";
    var input = [];
    meet.query(queryStr, input, callback);
  },

  // *
  // UPDATE MEET
  // *

  update: function(meetJSON, callback) {
    console.log("update() called");
    var functName = "update()";
    if (meetJSON) {
      if (meetJSON["name"]) {
        if (typeof meetJSON["id"] == "number") {
          var input = [
            meetJSON["name"],
            meetJSON["city"],
            meetJSON["state"],
            meetJSON["zip"],
            meetJSON["team_id"],
            meetJSON["id"]
          ];
          var queryStr = "UPDATE `meet` SET name = ?, city = ?, state = ?, zip = ?, team_id = ? WHERE meet_id= ?";
          meet.query(queryStr, input, function(error, result) {
            if (error) callback(error);
            else {
              if (result["affectedRows"] != 0 ) {
                callback(null, result);
              }
              else callback(functName + " Error: No rows affected");
            }
          });
        }
        else callback(functName + " Error: \'id\' must be a number.");
      }
      else callback(functName + " Error: 'first_name' cannot be null.");
    }
    else callback(functName + " Error: No meet information provided.");
  },



  // *
  // DELETE MEET
  // *

  delete: function(meet_id, callback) {
    // DELETE MEET AND ALL ENTRIES
    console.log("delete() called");
    var functName = "delete()";
    if (!meet_id) callback(functName + " Error: No 'meet_id' provided.");
    else if (typeof meet_id != "number") {
      callback(functName + " Error: 'meet_id' must be a number.");
    }
    else {
      var input = [
        meet_id
      ];
      // EXAMPLE...
      // DELETE FROM lifter_meet WHERE meet_id = 1;
      // DELETE FROM `meet` WHERE meet_id = 1;
      var queryStr = "DELETE FROM lifter_meet WHERE meet_id = ?";
      meet.query(queryStr, input, function(error, result) {
        if (error) callback(error);
        else {
          queryStr = "DELETE FROM `meet` WHERE meet_id = ?";
          meet.query(queryStr, input, function(error, result) {
            if (error) callback(error);
            else {
              if (result["affectedRows"] != 0 ) {
                callback(null, result);
              }
              else callback(functName + " Error: No matching meet_id to delete.");
            }
          });
        }
      });
    }
  }

};
module.exports = meet;
