var mysql = require('../../mysql');

var coach = {
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
  // CREATE COACH
  // *
  add: function (coachJSON, callback) {
    var functName = "queryInsert()"
    var errorMsg = "";

    // Validate coachJSON
    if (!coachJSON) {
      errorMsg = "No coach data passed.";
    }
    else if (!coachJSON["first_name"])  {
      errorMsg = "Coach first_name not provided";
    }
    else if (!(coachJSON["last_name"]))  {
      console.log("3");
      errorMsg = "Coach last_name not provided";
    }
    else if (typeof coachJSON["team_id"] != "number") {
      errorMsg = "Coach's team_id not provided";
    }

    if (errorMsg != "") {
      console.log(functName + " Error: " + errorMsg);
      callback(functName + " Error: " + errorMsg);
    }
    else {
      var queryStr = "INSERT INTO `coach`";
      queryStr += " (first_name, last_name, team_id) VALUES (?,?,?)";
      var input = [
        coachJSON["first_name"],
        coachJSON["last_name"],
        coachJSON["team_id"]
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
  // READ COACH(ES) QUERIES
  // *

  // Return JSON of Coach by Id - LIMIT 1
  findById: function (id, callback) {
    var functName = "findById()";
    var queryStr = "SELECT coach_id, first_name, last_name, team_id FROM `coach` WHERE coach_id=? LIMIT 1";

    // console.log(queryStr);
    if (typeof id == "number") {
      var input = [id];
      coach.query(queryStr, input, callback);
    }
    else {
      callback(functName + " Error: 'id' is not a number'");
    }
  },

  // Return JSON of Coaches by team_Id
  findByTeamId: function (team_id, callback) {
    var functName = "findByTeamId()";
    var queryStr = "SELECT coach_id, first_name, last_name, team_id FROM `coach` WHERE team_id=?";

    if (typeof team_id == "number") {
      var input = [team_id];
      coach.query(queryStr, input, callback);
    }
    else {
      callback(functName + " Error: 'team_id' is not a number'");
    }
  },

  // Return all coaches
  find: function(callback) {
    var functName = "find";
    var queryStr = "SELECT coach_id, first_name, last_name, team_id FROM `coach`";
    var input = [];
    coach.query(queryStr, input, callback);
  },


  search: function (searchJSON, callback) {
    var functName = "search()";
    if (searchJSON) {
      var input = [
        searchJSON["first_name"],
        searchJSON["last_name"],
      ];
      var queryStr;
      if (searchJSON["AND"] == null) {
        queryStr = "SELECT first_name, last_name FROM `coach` WHERE (first_name= ? OR last_name = ?)";
      }
      else {
        // Default is OR
        queryStr = "SELECT first_name, last_name FROM `coach` WHERE (first_name= ? AND last_name = ?)";
      }
      coach.query(queryStr, input, callback);
    }
    else callback(functName + " Error: No search items provided.");
  },


  // *
  // UPDATE COACH
  // *

  update: function(coachJSON, callback) {
    console.log("update() called");
    var functName = "update()";
    var errorMsg = "";

    // Validate coachJSON
    if (!coachJSON) errorMsg = "No coach data passed.";
    else if (!coachJSON["first_name"]) {
      errorMsg = "Coach first_name not provided";
    }
    else if (!coachJSON["last_name"]) {
      errorMsg = "Coach last_name not provided";
    }
    else if ((typeof coachJSON["team_id"] != "number") && (coachJSON["team_id"])) {
      errorMsg = "Coach team_id must be a number or null";
    }

    // Handle Any Errors
    if (errorMsg != "") {
      console.log(functName + " Error: " + errorMsg);
      callback(functName + " Error: " + errorMsg);
    }
    else {
      var input = [
        coachJSON["first_name"],
        coachJSON["last_name"],
        coachJSON["team_id"],
        coachJSON["id"]
      ]
      var queryStr = "UPDATE `coach` SET first_name = ?, last_name = ?, team_id = ? WHERE coach_id= ?";
      coach.query(queryStr, input, function(error, result) {
        if (error) callback(error);
        else {
          if (result["affectedRows"] != 0 ) {
            callback(null, result);
          }
          else callback(functName + " Error: No rows affected");
        }
      });
    }
  },



  // *
  // DELETE COACH
  // *

  delete: function(coach_id, callback) {
    console.log("delete() called");
    var functName = "delete()";
    if (!coach_id) callback(functName + " Error: No 'coach_id' provided.");
    else if (typeof coach_id != "number") {
      callback(functName + " Error: 'coach_id' must be a number.");
    }
    else {
      var input = [
        coach_id
      ];
      var queryStr = "DELETE FROM `coach` WHERE coach_id = ?";
      coach.query(queryStr, input, function(error, result) {
        if (error) callback(error);
        else {
          if (result["affectedRows"] != 0 ) {
            callback(null, result);
          }
          else callback(functName + " Error: No matching coach_id");
        }
      });
    }
  }

};
module.exports = coach;
