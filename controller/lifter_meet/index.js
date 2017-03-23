var mysql = require('../../mysql');

var lifter_meet = {
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
  // CREATE lifter_meet relationship
  // *
  add: function (lifter_meetJSON, callback) {
    var functName = "queryInsert()"
    var errorMsg = "";

    // Validate lifter_meetJSON
    if (!lifter_meetJSON) {
      errorMsg = "No lifter_meet data passed.";
    }
    else if (!lifter_meetJSON["meet_id"])  {
      errorMsg = "lifter_meet table: 'meet_id' not provided";
    }
    else if (typeof lifter_meetJSON["meet_id"] != "number") {
      errorMsg = "lifter_meet table: 'meet_id' not a number";
    }
    else if (!(lifter_meetJSON["lifter_id"]))  {
      errorMsg = "lifter_meet table: 'lifter_id' not provided";
    }
    else if (typeof lifter_meetJSON["lifter_id"] != "number") {
      errorMsg = "lifter_meet table: 'lifter_id' not a number";
    }

    else if (!(lifter_meetJSON["entry_weight"]))  {
      errorMsg = "lifter_meet table: 'entry_weight' not provided";
    }
    else if (typeof lifter_meetJSON["entry_weight"] != "number") {
      errorMsg = "lifter_meet table: 'entry_weight' not a number";
    }

    else if (!(lifter_meetJSON["open_bench"]))  {
      errorMsg = "lifter_meet table: 'open_bench' not provided";
    }
    else if (typeof lifter_meetJSON["open_bench"] != "number") {
      errorMsg = "lifter_meet table: 'open_bench' not a number";
    }
    else if (!(lifter_meetJSON["open_clean"]))  {
      errorMsg = "lifter_meet table: 'open_clean' not provided";
    }
    else if (typeof lifter_meetJSON["open_clean"] != "number") {
      errorMsg = "lifter_meet table: 'open_clean' not a number";
    }
    else if (!(lifter_meetJSON["open_squat"]))  {
      errorMsg = "lifter_meet table: 'open_squat' not provided";
    }
    else if (typeof lifter_meetJSON["open_squat"] != "number") {
      errorMsg = "lifter_meet table: 'open_squat' not a number";
    }

    if (errorMsg != "") {
      console.log(functName + " Error: " + errorMsg);
      callback(functName + " Error: " + errorMsg);
    }
    else {
      var queryStr = "INSERT INTO `lifter_meet`";
      queryStr += " (lifter_id, meet_id, gender, entry_weight, open_bench, open_clean, open_squat) VALUES (?, ?, ?, ?, ?, ?, ?)";
      var input = [
        lifter_meetJSON["lifter_id"],
        lifter_meetJSON["meet_id"],
        lifter_meetJSON["gender"],
        lifter_meetJSON["entry_weight"],
        lifter_meetJSON["open_bench"],
        lifter_meetJSON["open_clean"],
        lifter_meetJSON["open_squat"]
      ];

      mysql.pool.query(queryStr, input, function (error, rows, fields) {
        if (!error) {
          var string = JSON.stringify(rows);
          console.log("Sending: " + string);
          if (rows["affectedRows"] != 0 ) {
            callback(null,rows);
          }
          else callback(functName + " Error: No rows affected");
        }
        else {
          console.log(functName + " Error: " + error);
          callback(error);
        }
      });
    }
  },


  // *
  // READ lifter_meet(ES) QUERIES
  // *

  // Return JSON of lifter_meet by meet and lifter_id - LIMIT 1
  findByIds: function (ids, callback) {
    var functName = "findById()";
    var errorMsg = "";

    // Validate parameter
    if (!ids) {
      errorMsg = "No 'ids' json passed.";
    }
    else if (!ids["meet_id"])  {
      errorMsg = "'meet_id' not provided";
    }
    else if (typeof ids["meet_id"] != "number") {
      errorMsg = "'meet_id' not a number";
    }
    else if (!ids["lifter_id"])  {
      errorMsg = "'lifter_id' not provided";
    }
    else if (typeof ids["lifter_id"] != "number") {
      errorMsg = "'lifter_id' not a number";
    }

    if (errorMsg != "") {
      console.log(functName + " Error: " + errorMsg);
      callback(functName + " Error: " + errorMsg);
    }
    else {
      var queryStr = "SELECT lifter_id, meet_id, entry_weight, open_bench, open_clean, open_squat FROM `lifter_meet` WHERE lifter_id = ? AND meet_id = ? LIMIT 1";
      var input = [
        ids["lifter_id"],
        ids["meet_id"]
      ];
      lifter_meet.query(queryStr, input, callback);
    }
  },

  // Return all lifter_meets
  find: function(callback) {
    var functName = "find";
    var queryStr = "SELECT lifter_id, meet_id FROM `lifter_meet`";
    var input = [];
    lifter_meet.query(queryStr, input, callback);
  },

  // Return all lifter_meets
  findByMeetId: function(meet_id, callback) {
    var functName = "findByMeetId()";
    var errorMsg = "";

    // Validate parameter
    if (!meet_id) {
      errorMsg = "No 'meet_id' passed.";
    }
    else if (typeof meet_id == 'string') {
      meet_id = parseInt(meet_id);
      if (typeof meet_id != 'number') errorMsg = "meet_id is not an integer"
    }

    if (errorMsg != "") {
      console.log(functName + " Error: " + errorMsg);
      callback(functName + " Error: " + errorMsg);
    }
    else {
      var queryStr = "SELECT lm.lifter_id, l.first_name, l.last_name, lm.entry_weight, l.gender, lm.open_bench, lm.open_clean, lm.open_squat FROM `lifter_meet` lm INNER JOIN `meet` m ON m.meet_id = lm.meet_id INNER JOIN `lifter` l ON l.lifter_id = lm.lifter_id WHERE lm.meet_id = ?";
      var input = [meet_id];
      lifter_meet.query(queryStr, input, callback);
    }
  },

  // findByKeys: function(lifter_id, meet_id, callback) {
  //   var functName = "findByKeys";
  //   var queryStr = "SELECT lifter_meet_id, first_name, last_name, team_id FROM `lifter_meet`";
  //   var input = [];
  //   lifter_meet.query(queryStr, input, callback);
  // }

  search: function (searchJSON, callback) {
    var functName = "search()";
    if (searchJSON) {
      var input = [
        searchJSON["first_name"],
        searchJSON["last_name"],
      ];
      var queryStr;
      if (searchJSON["AND"] == null) {
        queryStr = "SELECT first_name, last_name FROM `lifter_meet` WHERE (first_name= ? OR last_name = ?)";
      }
      else {
        // Default is OR
        queryStr = "SELECT first_name, last_name FROM `lifter_meet` WHERE (first_name= ? AND last_name = ?)";
      }
      lifter_meet.query(queryStr, input, callback);
    }
    else callback(functName + " Error: No search items provided.");
  },


  // // *
  // // UPDATE lifter_meet
  // // *
  //
  // update: function(lifter_meetJSON, callback) {
  //   console.log("update() called");
  //   var functName = "update()";
  //   if (lifter_meetJSON) {
  //     if (lifter_meetJSON["first_name"]) {
  //       if (lifter_meetJSON["last_name"]) {
  //         if (typeof lifter_meetJSON["team_id"] == "number") {
  //           var input = [
  //             lifter_meetJSON["first_name"],
  //             lifter_meetJSON["last_name"],
  //             lifter_meetJSON["team_id"],
  //             lifter_meetJSON["id"]
  //           ]
  //           var queryStr = "UPDATE `lifter_meet` SET first_name = ?, last_name = ?, team_id = ? WHERE lifter_meet_id= ?";
  //           lifter_meet.query(queryStr, input, function(error, result) {
  //             if (error) callback(error);
  //             else {
  //               if (result["affectedRows"] != 0 ) {
  //                 callback(null, result);
  //               }
  //               else callback(functName + " Error: No rows affected");
  //             }
  //           });
  //         }
  //         else callback(functName + " Error: \'team_id\' must be a number.");
  //       }
  //       else callback(functName + " Error: 'last_name' cannot be null.");
  //     }
  //     else callback(functName + " Error: 'first_name' cannot be null.");
  //   }
  //   else callback(functName + " Error: No lifter_meet information provided.");
  // },
  //


  // *
  // DELETE lifter_meet
  // *

  delete: function(lifter_meet_id, callback) {
    console.log("delete() called");
    var functName = "delete()";
    if (!lifter_meet_id) callback(functName + " Error: No 'lifter_meet_id' provided.");
    else if (typeof lifter_meet_id != "number") {
      callback(functName + " Error: 'lifter_meet_id' must be a number.");
    }
    else {
      var input = [
        lifter_meet_id
      ];
      var queryStr = "DELETE FROM `lifter_meet` WHERE lifter_meet_id = ?";
      lifter_meet.query(queryStr, input, function(error, result) {
        if (error) callback(error);
        else {
          if (result["affectedRows"] != 0 ) {
            callback(null, result);
          }
          else callback(functName + " Error: No matching lifter_meet_id");
        }
      });
    }
  }

};
module.exports = lifter_meet;
