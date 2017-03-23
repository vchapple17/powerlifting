// JS Controller for team
var host = "http://localhost:27027";

var objURL = host + "/v1/api/coach/";
var teamURL = host + "/v1/api/team/";
var lifterURL = host + "/v1/api/lifter/";
var lifter_row_id = "lifter_id";
var row_id = "coach_id";
//
// DOMContentLoaded
//
document.addEventListener('DOMContentLoaded', setTeamName);
document.addEventListener('DOMContentLoaded', bindAddFormContainerBtns);
document.addEventListener('DOMContentLoaded', bindAddFormBtns);
document.addEventListener('DOMContentLoaded', bindEditFormBtns);
document.addEventListener('DOMContentLoaded', requestTableData);
document.addEventListener('DOMContentLoaded', requestLifterTableData);
document.addEventListener('DOMContentLoaded', bindAddLifterButton);



//
// TEAM INFO
//
function setTeamName() {
  var team_id = getTeamIdFromUrl();
  var url = teamURL;
  var method = 'POST';
  var action = 'read'

  var reqData = {};
  reqData.id = team_id;
  reqData.action = action;
  var req = new XMLHttpRequest();
  req.open(method, url, true);
  req.setRequestHeader('Content-Type', 'application/JSON');
  req.addEventListener('load', function() {
    // Handle response
    if ((req.status < 200) || (req.status >= 400)) {
      // Error
      console.log("Error in requesting team data.");
      console.log("Error: " + req.statusText);
    }
    else {
      var resData = JSON.parse(req.responseText);
      var teamData = resData[0];
      document.getElementById('teamName').textContent = teamData.name + " " + teamData.mascot;
    }
  })
  req.send(JSON.stringify(reqData));
}

function getTeamIdFromUrl() {
  var pathArray = window.location.pathname.split( '/' );
  var team_id = pathArray[pathArray.length - 1];
  team_id = parseInt(team_id);
  return team_id;
}
//
// TABLE DATA
//
function requestTableData() {
  // get team id from url
  var team_id = getTeamIdFromUrl();
  if (typeof team_id != 'number') {
    console.log(new Error("Team Id must be a number"));
  }
  else {
    var url = objURL + team_id;
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

      // Add Data Cells
      cell = document.createElement('td');
      if (x.first_name) cell.textContent = x.first_name;
      else cell.textContent = '-';
      row.appendChild(cell);

      cell = document.createElement('td');
      if (x.last_name) cell.textContent = x.last_name;
      else cell.textContent = '-';
      row.appendChild(cell);

      // Add Modify Cell with Form and Buttons
      if (!x[row_id]) console.log("Error: Row id");
      else {
        cell = document.createElement('td');
        row.appendChild(cell);

        var form = document.createElement('form');
        form.method = 'post';
        cell.appendChild(form);

        // Hidden element for ID
        var hidden = document.createElement('input');
        hidden.type = "hidden";
        hidden.name = "id";
        hidden.value = x[row_id];
        form.appendChild(hidden);

        // Edit button
        var btn = document.createElement('input');
        btn.type = "button";
        btn.name = "action";
        btn.value = "Edit";
        form.appendChild(btn);
        btn.addEventListener('click', createEditHandler(btn));

        // Delete button
        btn = document.createElement('input');
        btn.type = "button";
        btn.name = "action";
        btn.value = "Delete";
        form.appendChild(btn);
        btn.addEventListener('click', createDeleteHandler(btn));
      }
    });
  };
};

//
// TABLE BUTTONS
//
function createEditHandler(btn) {
  // Return Function Handler
  return function (e) {
    console.log(e);
    e.preventDefault();
    hideAddFormBtn();
    var target = e.target;

    if (target) {
      var action = "Edit"

      // Get ID of row
      var form = target.form;
      var childrenNodes = form.childNodes;
      var i;
      var id;
      for (i = 0; i < childrenNodes.length; i++) {
        if (childrenNodes[i].name === "id") {
          // save id of row
          id = childrenNodes[i].value;
          console.log(action + " id: " + id);
        }
      }

      // Get Specific Row's Data from Server (most up to date)
      if (id) {
        var url = objURL;
        var method = "POST";
        var reqData = {};
        reqData.id = id;
        reqData.action = "read";

        console.log(JSON.stringify(reqData));
        var req = new XMLHttpRequest();
        req.open(method, url, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load', function() {
          // Handle response
          if ((req.status < 200) || (req.status >= 400)) {
            // Error
            console.log("Error in requesting row with id = " + id);
            console.log("Error: " + req.statusText);
          }
          else {
            var resData = JSON.parse(req.responseText);
            console.log("Editing this data: " + JSON.stringify(resData));
            _loadEditForm(resData[0]);
          }
        })
        req.send(JSON.stringify(reqData));
      }
    }
  }
}

function _loadEditForm(data) {
  // Enter data into form
  // Get Name box
  displayEditForm();
  if (!(data[row_id])) console.log("No Id for Edit Form");
  else {
    // ID
    document.getElementById('edit-id').value = data[row_id];

    // Team Id
    if (data.team_id) document.getElementById('edit-team-id').value = data.team_id;
    // First Name
    if (data.first_name) document.getElementById('edit-first-name').value = data.first_name;
    else document.getElementById('edit-first-name').value = "";
    // Last Name
    if (data.last_name) document.getElementById('edit-last-name').value = data.last_name;
    else document.getElementById('edit-last-name').value = "";
  }
}

function createDeleteHandler(btn) {
  return function (e) {
    clearAlerts();
    clearTextInput();

    e.preventDefault();
    var target = e.target;
    if (target) {
      var action =  'Delete'  // Delete
      // Get form of target to find hidden ID
      var form = target.form;
      var childrenNodes = form.childNodes;
      var i;
      var id;
      for (i = 0; i < childrenNodes.length; i++) {
        if (childrenNodes[i].name === "id") {
          id = childrenNodes[i].value;
          console.log(action + " id: " + id);

        }
      }

      // Request Delete AJAX with ID
      if (id) {
        var url = objURL;
        var method = "POST";

        var data = {
          action: "delete",
          id: id
        }
        console.log(typeof data.id);
        if ((url) && (data)) {
            var req = new XMLHttpRequest();
            req.open(method, url, true);
            req.setRequestHeader('Content-Type', 'application/json'); // type sent
            req.addEventListener('load', function() {
              // Handle copmletion of request
              if (req.status >= 200 && req.status < 400) {
                var response = JSON.parse(req.responseText);
                // Deleted
                requestTableData();
              }
              else {
                console.log("Error in Delete request: " + req.statusText);
              }
            });
            console.log('sent: ' + JSON.stringify(data));
            req.send(JSON.stringify(data));
        }
        else {
          console.log('Error with URL or Data.')
        }
      }
    }
  }
}

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
function hideEditForm() {
  clearAlerts();
  clearTextInput();
  displayAddFormBtn();
  hideAddForm();

  var editFormContainer = document.getElementById('editFormContainer');
  if (editFormContainer) {
    editFormContainer.style.display = "none";
  }
}
function displayEditForm() {
  clearAlerts();
  clearTextInput();
  hideAddForm();
  hideAddFormBtn();

  var editFormContainer = document.getElementById('editFormContainer');
  if (editFormContainer) {
    editFormContainer.style.display = "block";
    console.log(editFormContainer.style.display);
  }
}

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
  var team_id = getTeamIdFromUrl();
  var firstName = document.getElementById('first-name').value;
  var lastName = document.getElementById('last-name').value;
  firstName = firstName.trim();
  lastName  = lastName.trim();

  var validated = true;

  // First Name IS REQUIRED
  if (firstName === "") {
    console.log("First Name is required");
    document.getElementById('first-name-required').style.display = 'inline-block';
    document.getElementById('added-alert').style.display = 'none';
    document.getElementById('updated-alert').style.display = 'none';
    validated = false;
  }
  // Last Name IS REQUIRED
  if (lastName === "") {
    console.log("Last Name is required");
    document.getElementById('last-name-required').style.display = 'inline-block';
    document.getElementById('added-alert').style.display = 'none';
    document.getElementById('updated-alert').style.display = 'none';
    validated = false;
  }

  if (typeof team_id != 'number') {
    console.log(new Error("Team Id must be a number"));
  }
  else if (validated) {
    // Create JSON from form
    var reqData = {};
    reqData.first_name = firstName;
    reqData.last_name = lastName;
    reqData.team_id = team_id;
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
  else {
    console.log(new Error("Coach JSON not valid."));
  }
}

//
// FORM BUTTONS: EDIT
//
function bindEditFormBtns() {
    clearTextInput();
    // Edit Form Buttons
    document.getElementById('submitEditBtn').addEventListener('click', submitEditOnClick);
    document.getElementById('cancelEditBtn').addEventListener('click', cancelEditOnClick);
}

function cancelEditOnClick(e) {
  // Cancel Edit Button
  e.preventDefault();
  hideEditForm();
  hideAddForm();
  console.log("cancel Edit");
}

function submitEditOnClick(e) {
  e.preventDefault();

  // Save Edit
  var url = objURL;
  var method = "POST";
  var action = "update";
  e.preventDefault();
  clearAlerts();

  // FORM DATA
  var id = document.getElementById('edit-id').value;
  var team_id = document.getElementById('edit-team-id').value;
  var firstName = document.getElementById('edit-first-name').value;
  var lastName = document.getElementById('edit-last-name').value;

  firstName = firstName.trim();
  lastName  = lastName.trim();

  var validated = true;

  // First Name IS REQUIRED
  if (firstName === "") {
    console.log("First Name is required");
    document.getElementById('edit-first-name-required').style.display = 'inline-block';
    document.getElementById('added-alert').style.display = 'none';
    document.getElementById('updated-alert').style.display = 'none';
    validated = false;
  }
  // Last Name IS REQUIRED
  if (lastName === "") {
    console.log("Last Name is required");
    document.getElementById('edit-last-name-required').style.display = 'inline-block';
    document.getElementById('added-alert').style.display = 'none';
    document.getElementById('updated-alert').style.display = 'none';
    validated = false;
  }

  if (team_id === "") {
    team_id = null;
  }
  if (validated) {
    // Create JSON from form
    var reqData = {};
    reqData.id = id;
    reqData.first_name = firstName;
    reqData.last_name = lastName;
    reqData.team_id = team_id;
    reqData.action = action;
    console.log("To Server: " + JSON.stringify(reqData));

    var req = new XMLHttpRequest();
    req.open(method, url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function() {
      // Handle response
      if ((req.status < 200) || (req.status >= 400)) {
        // Error
        console.log("Error in updating entry.");
        console.log("Error: " + req.statusText);
        clearTextInput();
        clearAlerts();
      }
      else {
        var resData = JSON.parse(req.responseText);
        console.log("Response Data: " + resData);
        requestTableData();
        showUpdatedAlert();
      }
    })
    req.send(JSON.stringify(reqData));
    hideEditForm();
    hideAddForm();
  }
}


//
// ALERTS DISPLAY
//
function clearAlerts() {
  document.getElementById('first-name-required').style.display = 'none';
  document.getElementById('last-name-required').style.display = 'none';
  document.getElementById('edit-first-name-required').style.display = 'none';
  document.getElementById('edit-last-name-required').style.display = 'none';

  document.getElementById('added-alert').style.display = 'none';
  document.getElementById('updated-alert').style.display = 'none';
}
function showAddedAlert() {
  document.getElementById('first-name-required').style.display = 'none';
  document.getElementById('last-name-required').style.display = 'none';
  document.getElementById('edit-first-name-required').style.display = 'none';
  document.getElementById('edit-last-name-required').style.display = 'none';

  document.getElementById('added-alert').style.display = 'inline-block';
  document.getElementById('updated-alert').style.display = 'none';
}
function showUpdatedAlert() {
  document.getElementById('first-name-required').style.display = 'none';
  document.getElementById('last-name-required').style.display = 'none';
  document.getElementById('edit-first-name-required').style.display = 'none';
  document.getElementById('edit-last-name-required').style.display = 'none';

  document.getElementById('added-alert').style.display = 'none';
  document.getElementById('updated-alert').style.display = 'inline-block';
}






//
// LIFTER INFORMATION
//

//
// TABLE
//
function requestLifterTableData() {
  // get team id from url
  var team_id = getTeamIdFromUrl();
  if (typeof team_id != 'number') {
    console.log(new Error("Team Id must be a number"));
  }
  else {
    var url = lifterURL + team_id;
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
        loadLifterTableData(resData);
      }
    })
    req.send();
  }
}


function loadLifterTableData(data) {
  // parameter is array of JSON
  // get table element
  console.log('loadTableData');
  var table = document.getElementById('lifter-table');
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

      // Add Data Cells
      cell = document.createElement('td');
      if (x.first_name) cell.textContent = x.first_name;
      else cell.textContent = '-';
      row.appendChild(cell);

      cell = document.createElement('td');
      if (x.last_name) cell.textContent = x.last_name;
      else cell.textContent = '-';
      row.appendChild(cell);

      // Add Modify Cell with Form and Buttons
      // if (!x[lifter_row_id]) console.log("Error: Lifter row id");
      // else {
      //   cell = document.createElement('td');
      //   row.appendChild(cell);
      //
      //   var form = document.createElement('form');
      //   form.method = 'post';
      //   cell.appendChild(form);
      //
      //   // Hidden element for ID
      //   var hidden = document.createElement('input');
      //   hidden.type = "hidden";
      //   hidden.name = "id";
      //   hidden.value = x[row_id];
      //   form.appendChild(hidden);

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
      // }
    });
  };
};


//
// ADD LIFTER BUTTTON
//
function bindAddLifterButton() {
  document.getElementById('addLifter').addEventListener('click', addLifterOnClick);

}

function addLifterOnClick() {
  window.location.href = host + "/lifterlist";
}
