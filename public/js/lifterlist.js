// JS Controller for lifterlist
var host = "http://localhost:27027";

var objURL = host + "/v1/api/lifter/";
var teamURL = host + "/v1/api/team/";
var row_id = "lifter_id";

//
// DOMContentLoaded
//
document.addEventListener('DOMContentLoaded', bindAddFormContainerBtns);
document.addEventListener('DOMContentLoaded', bindAddFormBtns);
document.addEventListener('DOMContentLoaded', bindEditFormBtns);
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

      // Add Data Cells
      cell = document.createElement('td');
      if (x.first_name) cell.textContent = x.first_name;
      else cell.textContent = '-';
      row.appendChild(cell);

      cell = document.createElement('td');
      if (x.last_name) cell.textContent = x.last_name;
      else cell.textContent = '-';
      row.appendChild(cell);

      cell = document.createElement('td');
      if (x.gender) cell.textContent = x.gender;
      else cell.textContent = '-';
      row.appendChild(cell);

      cell = document.createElement('td');
      if (x.weight) cell.textContent = x.weight;
      else cell.textContent = '-';
      row.appendChild(cell);

      cell = document.createElement('td');
      if (x.grade) cell.textContent = x.grade;
      else cell.textContent = '-';
      row.appendChild(cell);

      var team_id = x.team_id;
      console.log("TEAM: " + team_id);
      cell = document.createElement('td');
      var link;
      if (x.name) {
        link = document.createElement('a');
        link.href = "/teamtab/team/" + team_id;
        link.text = x.name;
        cell.appendChild(link);
      }
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
            console.log("Edit Form Data: " + JSON.stringify(resData[0]));
            requestTeamNames("editForm", function() {
              displayEditForm();
              _loadEditForm(resData[0]);
            });

          }
        })
        req.send(JSON.stringify(reqData));
      }
    }
  }
}

function _loadEditForm(data) {
  // Enter data into form
  console.log("_loadEditForm");
  if (!(data[row_id])) console.log("No Id for Edit Form");
  else {
    // ID
    document.getElementById('edit-id').value = data[row_id];

    // FIRST NAME
    if (data.first_name) document.getElementById('edit-firstName').value = data.first_name;
    else document.getElementById('edit-firstName').value = "";

    // LAST NAME
    if (data.last_name) document.getElementById('edit-lastName').value = data.last_name;
    else document.getElementById('edit-lastName').value = "";

    // GENDER
    if (data.gender) {
      // set gender
      var genderRadios = document.getElementsByName("edit-gender-radio");
      var i;
      for (i = 0; i < genderRadios.length; i++) {
        if (genderRadios[i].value.toLowerCase() == data.gender) {
          genderRadios[i].checked = true;
        }
        else {
          genderRadios[i].checked = false;
        }
      }
    }
    else {
      var i;
      for (i = 0; i < genderRadios.length; i++) {
          genderRadios[i].checked = false;
          genderRadios[i].removeAttribute('checked');
      }
    }

    // WEIGHT
    if (data.weight) document.getElementById('edit-weight').value = data.weight;
    else document.getElementById('edit-weight').value = "";

    // GRADE  edit-grade-radio
    if (data.grade) {
      // set grade
      var gradeRadios = document.getElementsByName("edit-grade-radio");
      var i;
      for (i = 0; i < gradeRadios.length; i++) {
        if (gradeRadios[i].value.toLowerCase() == data.grade) {
          gradeRadios[i].checked = true;
        }
        else {
          gradeRadios[i].checked = false;
        }
      }
    }
    else {
      var i;
      for (i = 0; i < gradeRadios.length; i++) {
          gradeRadios[i].checked = false;
          gradeRadios[i].removeAttribute('checked');
      }
    }

    // TEAM ID (Hidden)
    if (data.team_id) {
      var teamSelect = document.getElementById("edit-team-select");
      var i;
      console.log("team options length: " + teamSelect.options.length);
      for (i = 0; i < teamSelect.options.length; i++) {
        if (teamSelect.options[i].value == data.team_id) {
          teamSelect.selectedIndex = i;
          console.log(teamSelect.selectedIndex);
        }
      }

    }
  }
}

function createDeleteHandler(btn) {
  return function (e) {
    clearAlerts();
    clearTextInput();
    clearRadioInput();

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
  clearRadioInput();
  // Show Add New Object Form showing
  document.getElementById('showAddFormBtn').addEventListener('click', displayAddForm);

  // Assign Cancel Button to hideAddForm
  document.getElementById('cancelAddNewBtn').addEventListener('click', hideAddForm);
};
function displayAddForm() {
  clearAlerts();
  clearTextInput();
  clearRadioInput();
  hideEditForm();


  var addFormContainer = document.getElementById('addFormContainer');
  var showAddFormBtn = document.getElementById('showAddFormBtn')

  if ((showAddFormBtn) && (addFormContainer)){
    addFormContainer.style.display = "inline-block";
    showAddFormBtn.style.display = "none";
  }

  requestTeamNames("addForm", function() {
  });

}
function hideAddForm() {
  clearAlerts();
  clearTextInput();
  clearRadioInput();
  var addFormContainer = document.getElementById('addFormContainer');
  var showAddFormBtn = document.getElementById('showAddFormBtn')

  if ((showAddFormBtn) && (addFormContainer)){
    addFormContainer.style.display = "none";
    showAddFormBtn.style.display = "inline-block";
  }
}
function hideEditForm() {
  console.log("hideEditForm");
  clearAlerts();
  clearTextInput();
  clearRadioInput();
  displayAddFormBtn();
  hideAddForm();

  var editFormContainer = document.getElementById('editFormContainer');
  if (editFormContainer) {
    editFormContainer.style.display = "none";
    console.log(editFormContainer.style.display);
  }
}
function displayEditForm() {
  // console.log("hideEditForm");
  clearAlerts();
  clearTextInput();
  clearRadioInput();
  hideAddForm();
  hideAddFormBtn();

  var editFormContainer = document.getElementById('editFormContainer');
  if (editFormContainer) {
    editFormContainer.style.display = "block";
    // console.log(editFormContainer.style.display);
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
  var firstName = document.getElementById('firstName').value;
  var lastName = document.getElementById('lastName').value;
  var genderRadios = document.getElementsByName('gender-radio');
  var weight = document.getElementById('weight').value;
  var gradeRadios = document.getElementsByName('grade-radio');
  var teamSelect = document.getElementById('team-select');

  firstName = firstName.trim();
  lastName = lastName.trim();
  weight   = weight.trim();

  var validated = true;

  // Validate First Name
  if (firstName === "") {
    console.log("First Name is required");
    document.getElementById('first-name-required').style.display = 'inline-block';

    document.getElementById('added-alert').style.display = 'none';
    document.getElementById('updated-alert').style.display = 'none';

    validated = false;
  }

  // Validate Last Name
  if (lastName === "") {
    document.getElementById('last-name-required').style.display = 'inline-block';

    document.getElementById('added-alert').style.display = 'none';
    document.getElementById('updated-alert').style.display = 'none';

    validated = false;
  }

  // Validate Weight
  if (weight === "") {
    document.getElementById('weight-required').style.display = 'inline-block';

    document.getElementById('added-alert').style.display = 'none';
    document.getElementById('updated-alert').style.display = 'none';

    validated = false;
  }
  else if (typeof weight == 'string') {
    weight = parseFloat(weight);
    if (typeof weight != 'number') {
      document.getElementById('weight-required').style.display = 'inline-block';

      document.getElementById('added-alert').style.display = 'none';
      document.getElementById('updated-alert').style.display = 'none';
      validated = false;
    }
  }

  // Validate Gender
  var gender = null;
  var i;
  for (i = 0; i < genderRadios.length; i++) {
    if (genderRadios[i].checked == true) {
      gender = genderRadios[i].value;
    }
  }
  if (!gender) {
    validated = false;
    document.getElementById('gender-required').style.display = 'inline-block';

    document.getElementById('added-alert').style.display = 'none';
    document.getElementById('updated-alert').style.display = 'none';
  }

  // Validate Grade
  var grade = null;
  var i;
  for (i = 0; i < gradeRadios.length; i++) {
    if (gradeRadios[i].checked == true) {
      grade = gradeRadios[i].value;
    }
  }
  if (!grade) {
    document.getElementById('grade-required').style.display = 'inline-block';

    document.getElementById('added-alert').style.display = 'none';
    document.getElementById('updated-alert').style.display = 'none';

    validated = false;
  }

  // Team Id select
  var team_id = null;
  var index = teamSelect.selectedIndex;
  if ((index != null) && (index != 0))  {
    team_id = teamSelect.options[index].value;
    if (typeof team_id == 'string') {
      team_id = parseInt(team_id);
      if (typeof team_id != 'number') team_id = null;
    }
  }
  console.log(team_id);
  // If form is successfully validated, submit
  if (validated) {
    // Create JSON from form
    var reqData = {};
    reqData.action = action;
    reqData.first_name = firstName;
    reqData.last_name = lastName;
    reqData.gender = gender;
    reqData.weight = weight;
    reqData.grade = grade;
    reqData.team_id = team_id;

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
        clearRadioInput();
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
function bindEditFormBtns() {
    clearTextInput();
    clearRadioInput();
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
  if (typeof id == 'string') id = parseInt(id);

  // var team_id = document.getElementById('edit-team-id').value;
  // if (typeof team_id == 'string') team_id = parseInt(team_id);

  var firstName = document.getElementById('edit-firstName').value;
  var lastName = document.getElementById('edit-lastName').value;
  var genderRadios = document.getElementsByName('edit-gender-radio');
  var weight = document.getElementById('edit-weight').value;
  var gradeRadios = document.getElementsByName('edit-grade-radio');
  var teamSelect = document.getElementById('edit-team-select');

  firstName = firstName.trim();
  lastName = lastName.trim();
  weight   = weight.trim();

  var validated = true;

  // Validate First Name
  if (firstName === "") {
    console.log("First Name is required");
    document.getElementById('edit-first-name-required').style.display = 'inline-block';

    document.getElementById('added-alert').style.display = 'none';
    document.getElementById('updated-alert').style.display = 'none';

    validated = false;
  }

  // Validate Last Name
  if (lastName === "") {
    document.getElementById('edit-last-name-required').style.display = 'inline-block';

    document.getElementById('added-alert').style.display = 'none';
    document.getElementById('updated-alert').style.display = 'none';

    validated = false;
  }

  // Validate Weight
  if (weight === "") {
    document.getElementById('edit-weight-required').style.display = 'inline-block';

    document.getElementById('added-alert').style.display = 'none';
    document.getElementById('updated-alert').style.display = 'none';

    validated = false;
  }
  else if (typeof weight == 'string') {
    weight = parseFloat(weight);
    if (typeof weight != 'number') {
      document.getElementById('edit-weight-required').style.display = 'inline-block';

      document.getElementById('added-alert').style.display = 'none';
      document.getElementById('updated-alert').style.display = 'none';
      validated = false;
    }
  }

  // Validate Gender
  var gender = null;
  var i;
  for (i = 0; i < genderRadios.length; i++) {
    if (genderRadios[i].checked == true) {
      gender = genderRadios[i].value;
    }
  }
  if (!gender) {
    validated = false;
    document.getElementById('edit-gender-required').style.display = 'inline-block';

    document.getElementById('added-alert').style.display = 'none';
    document.getElementById('updated-alert').style.display = 'none';
  }

  // Validate Grade
  var grade = null;
  var i;
  for (i = 0; i < gradeRadios.length; i++) {
    if (gradeRadios[i].checked == true) {
      grade = gradeRadios[i].value;
    }
  }
  if (!grade) {
    document.getElementById('edit-grade-required').style.display = 'inline-block';

    document.getElementById('added-alert').style.display = 'none';
    document.getElementById('updated-alert').style.display = 'none';

    validated = false;
  }

  // Team Id select
  var team_id = null;
  var index = teamSelect.selectedIndex;
  if ((index != null) && (index != 0))  {
    team_id = teamSelect.options[index].value;
    if (typeof team_id == 'string') {
      team_id = parseInt(team_id);
      if (typeof team_id != 'number') team_id = null;
    }
  }

  console.log("Validated?" + validated);
  // If form is successfully validated, submit
  if (validated) {
    // Create JSON from form
    var reqData = {};
    reqData.action = action;
    reqData.id = id;
    reqData.first_name = firstName;
    reqData.last_name = lastName;
    reqData.gender = gender;
    reqData.weight = weight;
    reqData.grade = grade;
    reqData.team_id = team_id;

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
        clearRadioInput();
        clearAlerts();
      }
      else {
        var resData = JSON.parse(req.responseText);
        console.log("Response Data: " + resData);
        showUpdatedAlert();
        requestTableData();
      }
    })
    req.send(JSON.stringify(reqData));
    hideEditForm();
    hideAddForm();
    console.log("Submit Edit");
    requestTableData();
  }
}


//
// ALERTS DISPLAY
//

function clearAlerts() {
  document.getElementById('first-name-required').style.display = 'none';
  document.getElementById('last-name-required').style.display = 'none';
  document.getElementById('gender-required').style.display = 'none';
  document.getElementById('weight-required').style.display = 'none';
  document.getElementById('grade-required').style.display = 'none';

  document.getElementById('added-alert').style.display = 'none';
  document.getElementById('updated-alert').style.display = 'none';
}

function showAddedAlert() {
  clearAlerts();
  document.getElementById('added-alert').style.display = 'inline-block';
}

function showUpdatedAlert() {
  clearAlerts();
  document.getElementById('updated-alert').style.display = 'inline-block';
}
