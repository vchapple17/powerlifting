var mysql = require('../../mysql');

var team = {
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
  // CREATE TEAM
  // *
  add: function (teamJSON, callback) {
    var functName = "queryInsert()"
    // Validate teamJSON
    if (teamJSON) {
      if (teamJSON["name"]) {
        var queryStr = "INSERT INTO `team`";
        queryStr += " (name, mascot) VALUES (?,?)";
        var input = [
          teamJSON["name"],
          teamJSON["mascot"]
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
      else {
        callback(functName + " Error: Team name not provided");
      }
    }
    else {
      var error = "No team data passed.";
      console.log(functName + " Error: " + error);
      callback(functName + " Error: " + error);
    }
  },

  // *
  // READ TEAM(s) QUERIES
  // *

  // Return JSON of Team by Id - LIMIT 1
  findById: function (id, callback) {
    var functName = "findById()";
    var queryStr = "SELECT team_id, name, mascot FROM `team` WHERE team_id=? LIMIT 1";

    // console.log(queryStr);
    if (typeof id == "number") {
      var input = [id];
      team.query(queryStr, input, callback);
    }
    else {
      callback(functName + " Error: 'id' is not a number'");
    }
  },

  // Return all teams
  find: function(callback) {
    var functName = "find";
    var queryStr = "SELECT team_id, name, mascot FROM `team`";
    var input = [];
    team.query(queryStr, input, callback);
    // team.querySelect(null, callback);
  },


  search: function (searchJSON, callback) {
    var functName = "search()";
    if (searchJSON) {
      var nameLike;
      if (searchJSON["name"]) {
        nameLike = searchJSON["name"] + "%";
      }
      var mascotLike;
      if (searchJSON["mascot"]) {
        mascotLike = searchJSON["mascot"] + "%";
      }

      var input = [
        nameLike,
        mascotLike
      ];
      var queryStr;
      console.log("input: " + input);
      if (searchJSON["AND"] == null) {
        queryStr = "SELECT team_id, name, mascot FROM `team` WHERE (name LIKE ? OR mascot LIKE ?)";
      }
      else {
        // Default is OR
        queryStr = "SELECT team_id, name, mascot FROM `team` WHERE (name LIKE ? AND mascot LIKE ?)";
      }
      team.query(queryStr, input, callback);
    }
    else callback(functName + " Error: No search items provided.");
  },


  // *
  // UPDATE TEAM
  // *

  update: function(teamJSON, callback) {
    console.log("update() called");
    var functName = "update()";
    if (teamJSON) {
      if (teamJSON["name"]) {
        var input = [
          teamJSON["name"],
          teamJSON["mascot"],
          teamJSON["id"]
        ]
        var queryStr = "UPDATE `team` SET name = ?, mascot = ? WHERE team_id= ?";
        team.query(queryStr, input, function(error, result) {
          if (error) callback(error);
          else {
            if (result["affectedRows"] != 0 ) {
              callback(null, result);
            }
            else callback(functName + " Error: No rows affected");
          }
        });
      }
      else callback(functName + " Error: 'name' cannot be null.");
    }
    else callback(functName + " Error: No team information provided.");
  },



  // *
  // DELETE TEAM
  // *

  delete: function(team_id, callback) {
    console.log("delete() called");
    var functName = "delete()";
    if (!team_id) callback(functName + " Error: No 'team_id' provided.");
    else if (typeof team_id != "number") {
      callback(functName + " Error: 'team_id' must be a number.");
    }
    else {
      var input = [
        team_id
      ];
      var queryStr = "DELETE FROM `team` WHERE team_id = ?";
      team.query(queryStr, input, function(error, result) {
        if (error) callback(error);
        else {
          if (result["affectedRows"] != 0 ) {
            callback(null, result);
          }
          else callback(functName + " Error: No matching team_id");
        }
      });
    }
  }
};




module.exports = team;
