// JS Controller for meet tab
var host = "http://localhost:27027";

var currentURL = host + "/meetmarket/";
var objURL = host + "/v1/api/meet/";
var teamtabURL = host + "/teamtab/"
var row_id = "meet_id";

//
// DOMContentLoaded
//
document.addEventListener('DOMContentLoaded', bindAddFormContainerBtns);
document.addEventListener('DOMContentLoaded', bindAddFormBtns);
// document.addEventListener('DOMContentLoaded', bindEditFormBtns);
document.addEventListener('DOMContentLoaded', requestTableData);

//
// TABLE DATA
//
function requestTableData() {
  console.log("requestTableData");
  // AJAX Team ID, Name, and Mascot from Database
  var url = objURL;
  var method = 'GET';
  var req = new XMLHttpRequest();
  req.open(method, url, true);
  req.setRequestHeader('Content-Type', 'plain/text');
  req.addEventListener('load', function() {
    // Handle response
    if ((req.status < 200) || (req.status >= 400)) {
      // Error
      console.log("Error in requesting table data.");
      console.log("Error: " + req.statusText);
    }
    else {
      var resData = JSON.parse(req.responseText);
      console.log(resData);
      loadTableData(resData);
    }
  })
  req.send();
}

function loadTableData(data) {
  // parameter is array of JSON
  // get table element
  console.log('loadTableData');
  var table = document.getElementById('table');
  console.log(table);
  if (!table) {
    // Error... no table
    console.log("Error: No element by id of 'table'");
  }
  else if (table.tagName.toLowerCase() != 'table'){
    // Error... no table
    console.log("Error: id='table' is not a table");
  }
  else {
    var tbody = table.tBodies[0];
    if (!tbody) {
      tbody = document.createElement('tbody');
      table.appendChild(tbody);
    }
    // Add data to table
    tbody.textContent = ''
    var cell;
    var row;
    data.forEach( function(x) {
      // Add a row
      row = document.createElement('tr');
      tbody.appendChild(row);
      console.log(x);
      // Add Data Cells
      if (!x[row_id]) console.log("Error: Row id");
      else {
        var id = x[row_id];
        var team_id = x["team_id"];
        // Meet Name... link to meet entries
        cell = document.createElement('td');
        var link;
        if (x.meet_name) {
          link = document.createElement('a');
          link.href = currentURL + id;
          link.text = x.meet_name;
          cell.appendChild(link);
        }
        else cell.textContent = '-';
        row.appendChild(cell);

        // Host Team Name... Link to Team Page
        cell = document.createElement('td');
        if (x.team_name) {
          link = document.createElement("a");
          link.href = teamtabURL + "team/" +  team_id  ;
          link.text = x.team_name;
          cell.appendChild(link);
        }
        else cell.textContent = '-';
        row.appendChild(cell);

        // City, State, Zip Cells
        cell = document.createElement('td');
        if (x.city) cell.textContent = x.city;
        else cell.textContent = '-';
        row.appendChild(cell);

        cell = document.createElement('td');
        if (x.state) cell.textContent = x.state;
        else cell.textContent = '-';
        row.appendChild(cell);

        cell = document.createElement('td');
        if (x.zip) cell.textContent = x.zip;
        else cell.textContent = '-';
        row.appendChild(cell);


        // Add Modify Cell with Form and Buttons
        cell = document.createElement('td');
        row.appendChild(cell);
        //
        // var form = document.createElement('form');
        // form.method = 'post';
        // form.action = "/" + id;
        // cell.appendChild(form);

        // // Hidden element for ID
        // var hidden = document.createElement('input');
        // hidden.type = "hidden";
        // hidden.name = "id";
        // hidden.value = x[row_id];
        // form.appendChild(hidden);

        // // Edit button
        // var btn = document.createElement('input');
        // btn.type = "button";
        // btn.name = "action";
        // btn.value = "Edit";
        // form.appendChild(btn);
        // btn.addEventListener('click', createEditHandler(btn));

        // // Delete button
        // btn = document.createElement('input');
        // btn.type = "button";
        // btn.name = "action";
        // btn.value = "Delete";
        // form.appendChild(btn);
        // btn.addEventListener('click', createDeleteHandler(btn));

        // View Link
        var viewlink = document.createElement('a');
        viewlink.href = currentURL + id;
        viewlink.text = "View";
        cell.appendChild(viewlink);
      }
    });
  };
};


//
// TABLE BUTTONS
//
// function createEditHandler(btn) {
//   // Return Function Handler
//   return function (e) {
//     console.log(e);
//     e.preventDefault();
//     hideAddFormBtn();
//     var target = e.target;
//
//     if (target) {
//       var action = "Edit"
//
//       // Get ID of row
//       var form = target.form;
//       var childrenNodes = form.childNodes;
//       var i;
//       var id;
//       for (i = 0; i < childrenNodes.length; i++) {
//         if (childrenNodes[i].name === "id") {
//           // save id of row
//           id = childrenNodes[i].value;
//           console.log(action + " id: " + id);
//         }
//       }
//
//       // Get Specific Row's Data from Server (most up to date)
//       if (id) {
//         var url = objURL;
//         var method = "POST";
//         var reqData = {};
//         reqData.id = id;
//         reqData.action = "read";
//
//         console.log(JSON.stringify(reqData));
//         var req = new XMLHttpRequest();
//         req.open(method, url, true);
//         req.setRequestHeader('Content-Type', 'application/json');
//         req.addEventListener('load', function() {
//           // Handle response
//           if ((req.status < 200) || (req.status >= 400)) {
//             // Error
//             console.log("Error in requesting row with id = " + id);
//             console.log("Error: " + req.statusText);
//           }
//           else {
//             var resData = JSON.parse(req.responseText);
//             console.log(resData);
//             _loadEditForm(resData[0]);
//           }
//         })
//         req.send(JSON.stringify(reqData));
//       }
//     }
//   }
// }
//
// function _loadEditForm(data) {
//   // Enter data into form
//   // Get Name box
//   displayEditForm();
//   if (!(data[row_id])) console.log("No Id for Edit Form");
//   else {
//     // ID
//     document.getElementById('edit-id').value = data[row_id];
//     // NAME
//     if (data.name) document.getElementById('edit-name').value = data.name;
//     else document.getElementById('edit-name').value = "Name";
//     // MASCOT
//     if (data.mascot) document.getElementById('edit-mascot').value = data.mascot;
//     else document.getElementById('edit-mascot').value = "";
//   }
// }
//
// function createDeleteHandler(btn) {
//   return function (e) {
//     clearAlerts();
//     clearTextInput();
//
//     e.preventDefault();
//     var target = e.target;
//     if (target) {
//       var action =  'Delete'  // Delete
//       // Get form of target to find hidden ID
//       var form = target.form;
//       var childrenNodes = form.childNodes;
//       var i;
//       var id;
//       for (i = 0; i < childrenNodes.length; i++) {
//         if (childrenNodes[i].name === "id") {
//           id = childrenNodes[i].value;
//           console.log(action + " id: " + id);
//
//         }
//       }
//
//       // Request Delete AJAX with ID
//       if (id) {
//         var url = objURL;
//         var method = "POST";
//
//         var data = {
//           action: "delete",
//           id: id
//         }
//         console.log(typeof data.id);
//         if ((url) && (data)) {
//             var req = new XMLHttpRequest();
//             req.open(method, url, true);
//             req.setRequestHeader('Content-Type', 'application/json'); // type sent
//             req.addEventListener('load', function() {
//               // Handle copmletion of request
//               if (req.status >= 200 && req.status < 400) {
//                 var response = JSON.parse(req.responseText);
//                 // Deleted
//                 requestTableData();
//               }
//               else {
//                 console.log("Error in Delete request: " + req.statusText);
//               }
//             });
//             console.log('sent: ' + JSON.stringify(data));
//             req.send(JSON.stringify(data));
//         }
//         else {
//           console.log('Error with URL or Data.')
//         }
//       }
//     }
//   }
// }


//
// DISPLAY SETTINGS
//
function hideAddFormBtn() {
  var showAddFormBtn = document.getElementById('showAddFormBtn');
  showAddFormBtn.style.display = "none";
}
function displayAddFormBtn() {
  var showAddFormBtn = document.getElementById('showAddFormBtn');
  showAddFormBtn.style.display = "inline-block";
}
function bindAddFormContainerBtns() {
  clearTextInput();
  // Show Add New Object Form showing
  document.getElementById('showAddFormBtn').addEventListener('click', displayAddForm);

  // Assign Cancel Button to hideAddForm
  document.getElementById('cancelAddNewBtn').addEventListener('click', hideAddForm);
};
function displayAddForm() {
  clearAlerts();
  clearTextInput();
  var addFormContainer = document.getElementById('addFormContainer');
  var showAddFormBtn = document.getElementById('showAddFormBtn')

  if ((showAddFormBtn) && (addFormContainer)){
    addFormContainer.style.display = "inline-block";
    showAddFormBtn.style.display = "none";
  }
  requestTeamNames("addForm", function() {
  });

  _loadStateAbbrev();
}

function hideAddForm() {
  clearAlerts();
  clearTextInput();
  var addFormContainer = document.getElementById('addFormContainer');
  var showAddFormBtn = document.getElementById('showAddFormBtn')

  if ((showAddFormBtn) && (addFormContainer)){
    addFormContainer.style.display = "none";
    showAddFormBtn.style.display = "inline-block";
  }
}
// function hideEditForm() {
//   console.log("hideEditForm");
//   clearAlerts();
//   clearTextInput();
//   displayAddFormBtn();
//   hideAddForm();
//
//   var editFormContainer = document.getElementById('editFormContainer');
//   if (editFormContainer) {
//     editFormContainer.style.display = "none";
//     console.log(editFormContainer.style.display);
//   }
// // }
// function displayEditForm() {
//   console.log("hideEditForm");
//   clearAlerts();
//   clearTextInput();
//   hideAddForm();
//   hideAddFormBtn();
//
//   var editFormContainer = document.getElementById('editFormContainer');
//   if (editFormContainer) {
//     editFormContainer.style.display = "block";
//     console.log(editFormContainer.style.display);
//   }
// }

//
// FORM BUTTONS: ADD
//
function bindAddFormBtns() {
  //Bind add button function
  document.getElementById('submitAddNewBtn').addEventListener('click', addNewOnClick)
}


function addNewOnClick(e) {
  var url = objURL;
  var method = "POST";
  var action = "create";
  e.preventDefault();
  clearAlerts();
  // FORM DATA
  var name = document.getElementById('name').value;
  var teamSelect = document.getElementById('team-select');
  var city = document.getElementById('city').value;
  var stateSelect = document.getElementById('state-select');
  var zip = document.getElementById('zip').value;

  name = name.trim();
  city = city.trim();
  zip = zip.trim();

  var team_id = null;
  var index = teamSelect.selectedIndex;
  if ((index != null) && (index != 0))  {
    team_id = teamSelect.options[index].value;
    if (typeof team_id == 'string') {
      team_id = parseInt(team_id);
      if (typeof team_id != 'number') team_id = null;
    }
  }
  console.log("team_id:" + team_id);
  var state = null;
  var index = stateSelect.selectedIndex;
  if ((index != null) && (index != 0))  {
    state = stateSelect.options[index].value;
    if (typeof state == 'string') {
      if (state == "") state = null;
    }
  }
  console.log("state:" + state);

  var validated = true;

  // Validate Name
  if (name === "") {
    console.log("Name is required");
    document.getElementById('name-required').style.display = 'inline-block';

    document.getElementById('added-alert').style.display = 'none';
    document.getElementById('updated-alert').style.display = 'none';

    validated = false;
  }

  if (validated) {
    // Create JSON from form
    var reqData = {};
    reqData.name = name;
    reqData.team_id = team_id;
    reqData.city = city;
    reqData.state = state;
    reqData.zip = zip;

    reqData.action = action;
    console.log("To Server: " + JSON.stringify(reqData));

    var req = new XMLHttpRequest();
    req.open(method, url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function() {
      // Handle response
      if ((req.status < 200) || (req.status >= 400)) {
        // Error
        console.log("Error in adding entry.");
        console.log("Error: " + req.statusText);
        clearTextInput();
        clearAlerts();
      }
      else {
        var resData = JSON.parse(req.responseText);
        console.log("Response Data: " + resData);
        requestTableData();
        hideAddForm();
        showAddedAlert();
      }
    })
    req.send(JSON.stringify(reqData));
  }
}

//
// FORM BUTTONS: EDIT
//
// function bindEditFormBtns() {
//     clearTextInput();
//     // Edit Form Buttons
//     document.getElementById('submitEditBtn').addEventListener('click', submitEditOnClick);
//     document.getElementById('cancelEditBtn').addEventListener('click', cancelEditOnClick);
// }

// function cancelEditOnClick(e) {
//   // Cancel Edit Button
//   e.preventDefault();
//   hideEditForm();
//   hideAddForm();
//   console.log("cancel Edit");
// }

// function submitEditOnClick(e) {
//   e.preventDefault();
//
//   // Save Edit
//   var url = objURL;
//   var method = "POST";
//   var action = "update";
//   e.preventDefault();
//   clearAlerts();
//
//   // FORM DATA
//   var id = document.getElementById('edit-id').value;
//   var name = document.getElementById('edit-name').value;
//   var mascot = document.getElementById('edit-mascot').value;
//   name = name.trim();
//   mascot   = mascot.trim();
//
//   // NAME IS REQUIRED
//   if (name === "") {
//     console.log("Name is required");
//     document.getElementById('edit-name-required').style.display = 'inline-block';
//     document.getElementById('added-alert').style.display = 'none';
//     document.getElementById('updated-alert').style.display = 'none';
//   }
//   else {
//     // Create JSON from form
//     var reqData = {};
//     reqData.id = id;
//     reqData.name = name;
//     reqData.mascot = mascot;
//     reqData.action = action;
//     console.log("To Server: " + JSON.stringify(reqData));
//
//     var req = new XMLHttpRequest();
//     req.open(method, url, true);
//     req.setRequestHeader('Content-Type', 'application/json');
//     req.addEventListener('load', function() {
//       // Handle response
//       if ((req.status < 200) || (req.status >= 400)) {
//         // Error
//         console.log("Error in updating entry.");
//         console.log("Error: " + req.statusText);
//         clearTextInput();
//         clearAlerts();
//       }
//       else {
//         var resData = JSON.parse(req.responseText);
//         console.log("Response Data: " + resData);
//         showUpdatedAlert();
//         requestTableData();
//       }
//     })
//     req.send(JSON.stringify(reqData));
//     hideEditForm();
//     hideAddForm();
//     console.log("Submit Edit");
//     requestTableData();
//   }
// }

//
function requestTeamNames(formtype, callback) {
  console.log("requestTeamNames");
  var url = host + "/v1/api/team/";
  var method = "GET";

  var req = new XMLHttpRequest();
  req.open(method,url, true);
  req.setRequestHeader('Content-Type', 'plain/text');
  req.addEventListener('load', function() {
    // Handle response
    if ((req.status < 200) || (req.status >= 400)) {
      // Error
      console.log("Error in requesting team names");
      console.log("Error: " + req.statusText);
    }
    else {
      var resData = JSON.parse(req.responseText);
      _loadTeamNames(resData, formtype, callback)
    }
  })
  req.send();
}

function _loadTeamNames(data, formtype, callback) {
  var teamSelect;
  if (formtype == "addForm") teamSelect = document.getElementById("team-select");
  else if (formtype == "editForm") teamSelect = document.getElementById("edit-team-select");

  //http://stackoverflow.com/questions/3364493/how-do-i-clear-all-options-in-a-dropdown-box
  if (teamSelect.options) {
    var i;
    for(i = teamSelect.options.length - 1 ; i >= 0 ; i--) {
          teamSelect.remove(i);
    }
  }
  var blank_option = document.createElement("option");
  blank_option.value = "";
  blank_option.text = "NONE";
  teamSelect.appendChild(blank_option);

  if (data) {
    data.forEach( function(x) {
      // Get All Team Names
      if (x) {
        if ((x["team_id"]) && (typeof x["name"] == 'string')){
          var option = document.createElement("option");
          option.value = x["team_id"];
          option.text = x["name"];
          if (typeof x["mascot"] == 'string') {
            option.text += " - " + x["mascot"];
          }
          teamSelect.appendChild(option);
        }
      }
    })
  }
  callback();
}


function _loadStateAbbrev() {
  var data = getStateAbbreviationArray();
  stateSelect = document.getElementById('state-select');

  //http://stackoverflow.com/questions/3364493/how-do-i-clear-all-options-in-a-dropdown-box
  if (stateSelect.options) {
    var i;
    for(i = stateSelect.options.length - 1 ; i >= 0 ; i--) {
          stateSelect.remove(i);
    }
  }
  var blank_option = document.createElement("option");
  blank_option.value = "";
  blank_option.text = "NONE";
  stateSelect.appendChild(blank_option);

  if (data) {
    data.forEach( function(x) {
      var option = document.createElement("option");
      option.value = x;
      option.text = x;
      stateSelect.appendChild(option);
    })
  }
}
//
// ALERTS DISPLAY
//
function clearAlerts() {
  document.getElementById('name-required').style.display = 'none';
  // document.getElementById('edit-name-required').style.display = 'none';
  document.getElementById('added-alert').style.display = 'none';
  document.getElementById('updated-alert').style.display = 'none';
}
function showAddedAlert() {
  document.getElementById('name-required').style.display = 'none';
  document.getElementById('added-alert').style.display = 'inline-block';
  document.getElementById('updated-alert').style.display = 'none';
}
function showUpdatedAlert() {
  document.getElementById('name-required').style.display = 'none';
  document.getElementById('added-alert').style.display = 'none';
  document.getElementById('updated-alert').style.display = 'inline-block';
}
