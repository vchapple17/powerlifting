var mysql = require('../../mysql');

var lifter = {

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
  // CREATE LIFTER
  // *
  add: function (lifterJSON, callback) {
    var functName = "queryInsert()"
    var errorMsg = "";

    // Validate lifterJSON
    if (!lifterJSON) {
      errorMsg = "No lifter data passed.";
    }
    else if (!lifterJSON["first_name"])  {
      errorMsg = "Lifter first_name not provided";
    }
    else if (!(lifterJSON["last_name"]))  {
      console.log("3");
      errorMsg = "Lifter last_name not provided";
    }
    else if ((lifterJSON["gender"] != "female") && (lifterJSON["gender"] != "male")) {
      errorMsg = "Lifter's gender must be 'male' or 'female'.";
    }
    else if (typeof lifterJSON["weight"] != "number") {
      errorMsg = "Lifter's weight must be a number";
    }
    else if (typeof lifterJSON["grade"] != "string") {
      errorMsg = "Lifter's grade must be a string.";
    }
    else if ((typeof lifterJSON["team_id"] != "number") && (lifterJSON["team_id"])) {
      errorMsg = "Lifter's team_id must be a number or null";
    }

    if (errorMsg != "") {
      console.log(functName + " Error: " + errorMsg);
      callback(functName + " Error: " + errorMsg);
    }
    else {
      var queryStr = "INSERT INTO `lifter`";
      queryStr += " (first_name, last_name, gender, weight, grade, team_id) VALUES (?,?,?,?,?,?)";
      var input = [
        lifterJSON["first_name"],
        lifterJSON["last_name"],
        lifterJSON["gender"],
        lifterJSON["weight"],
        lifterJSON["grade"],
        lifterJSON["team_id"]
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
  // READ LIFTER(ES) QUERIES
  // *

  // Return JSON of Lifter by Id - LIMIT 1
  findById: function (id, callback) {
    var functName = "findById()";
    var queryStr = "SELECT lifter_id, first_name, last_name, gender, weight, grade, team_id FROM `lifter` WHERE lifter_id=? LIMIT 1";

    // console.log(queryStr);
    if (typeof id == "number") {
      var input = [id];
      lifter.query(queryStr, input, callback);
    }
    else {
      callback(functName + " Error: 'id' is not a number'");
    }
  },

  // Return all lifteres
  find: function(callback) {
    var functName = "find";
    // var queryStr = "SELECT lifter_id, first_name, last_name, gender, weight, grade, team_id FROM `lifter`";

    var queryStr = "SELECT lifter_id, first_name, last_name, gender, weight, grade, l.team_id, t.name FROM `lifter` l LEFT JOIN `team` t ON t.team_id = l.team_id";

    var input = [];
    lifter.query(queryStr, input, callback);
  },

  // Return JSON of lifters by team_Id
  findByTeamId: function (team_id, callback) {
    var functName = "findByTeamId()";
    var queryStr = "SELECT lifter_id, first_name, last_name, team_id FROM `lifter` WHERE team_id=?";

    if (typeof team_id == "number") {
      var input = [team_id];
      lifter.query(queryStr, input, callback);
    }
    else {
      callback(functName + " Error: 'team_id' is not a number'");
    }
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
        queryStr = "SELECT first_name, last_name FROM `lifter` WHERE (first_name= ? OR last_name = ?)";
      }
      else {
        // Default is OR
        queryStr = "SELECT lifter_id,  first_name, last_name FROM `lifter` WHERE (first_name= ? AND last_name = ?)";
      }
      lifter.query(queryStr, input, callback);
    }
    else callback(functName + " Error: No search items provided.");
  },


  // *
  // UPDATE LIFTER
  // *

  update: function(lifterJSON, callback) {

    console.log("update() called");
    var functName = "update()";
    var errorMsg = "";

    // Validate lifterJSON
    if (!lifterJSON) {
      errorMsg = "No lifter data passed.";
    }
    else if (!lifterJSON["first_name"])  {
      errorMsg = "Lifter first_name not provided";
    }
    else if (!(lifterJSON["last_name"]))  {
      errorMsg = "Lifter last_name not provided";
    }
    else if ((lifterJSON["gender"] != "female") && (lifterJSON["gender"] != "male")) {
      console.log(lifterJSON["gender"]);
      errorMsg = "Lifter's gender must be 'male' or 'female'.";
    }
    else if (typeof lifterJSON["weight"] != "number") {
      errorMsg = "Lifter's weight must be a number";
    }
    else if (typeof lifterJSON["grade"] != "string") {
      errorMsg = "Lifter's grade must be a string.";
    }
    else if ((typeof lifterJSON["team_id"] != "number") && (lifterJSON["team_id"])) {
      errorMsg = "Lifter's team_id must be a number or null";
    }
    else if ((typeof lifterJSON["lifter_id"] != "number") && (lifterJSON["lifter_id"])) {
      errorMsg = "Lifter's lifter_id must be a number or null";
    }

    if (errorMsg != "") {
      console.log(functName + " Error: " + errorMsg);
      callback(functName + " Error: " + errorMsg);
    }
    else {
      var queryStr = "UPDATE `lifter` SET first_name = ?, last_name = ?, gender = ?, weight = ?, grade = ?, team_id = ? WHERE lifter_id = ?";
      var input = [
        lifterJSON["first_name"],
        lifterJSON["last_name"],
        lifterJSON["gender"],
        lifterJSON["weight"],
        lifterJSON["grade"],
        lifterJSON["team_id"],
        lifterJSON["lifter_id"]
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
  // GET ALL LIFTERS NOT IN MEET
  // *
  getAllNotEntered: function(meet_id, callback) {
    console.log("getAllNotEntered() called");
    var functName = "getAllNotEntered()";

    if (!meet_id) callback(functName + "Error: No 'meet_id' provided.");
    else if (typeof meet_id != "number") {
      callback(functName + "Error: 'meet_id' must be a number.");
    }
    else {
      var input = [
        meet_id
      ];
      // var queryStr = "SELECT l.lifter_id, first_name, last_name FROM `lifter` l LEFT JOIN `lifter_meet` lm ON lm.lifter_id = l.lifter_id WHERE lm.meet_id <> ?";
      var queryStr = "SELECT l.lifter_id, l.first_name, l.last_name, tbl2.meet_id FROM `lifter` l LEFT OUTER JOIN (SELECT lm.lifter_id, lm.meet_id FROM lifter_meet lm WHERE lm.meet_id = ?) as tbl2 ON  l.lifter_id = tbl2.lifter_id WHERE tbl2.lifter_id IS NULL;"
      lifter.query(queryStr, input, callback);
    }
  },

  // *
  // DELETE LIFTER
  // *

  delete: function(lifter_id, callback) {
    console.log("delete() called");
    var functName = "delete()";
    if (!lifter_id) callback(functName + " Error: No 'lifter_id' provided.");
    else if (typeof lifter_id != "number") {
      callback(functName + " Error: 'lifter_id' must be a number.");
    }
    else {
      var input = [
        lifter_id
      ];
      var queryStr = "DELETE FROM `lifter` WHERE lifter_id = ?";
      lifter.query(queryStr, input, function(error, result) {
        if (error) callback(error);
        else {
          if (result["affectedRows"] != 0 ) {
            callback(null, result);
          }
          else callback(functName + " Error: No matching lifter_id");
        }
      });
    }
  }

};
module.exports = lifter;
