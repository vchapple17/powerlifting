// JS Controller for team tab
var host = "http://localhost:27027";

var current = host + "/teamtab/"
var objURL = host + "/v1/api/team/";
var row_id = "team_id";

//
// DOMContentLoaded
//
document.addEventListener('DOMContentLoaded', bindAddFormContainerBtns);
document.addEventListener('DOMContentLoaded', bindAddFormBtns);
document.addEventListener('DOMContentLoaded', bindEditFormBtns);
document.addEventListener('DOMContentLoaded', requestTableData);
document.addEventListener('DOMContentLoaded', bindSearchForm);


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
      if (!x[row_id]) console.log("Error: Row id");
      else {
        var id = x[row_id];
        cell = document.createElement('td');
        var link;
        if (x.name) {
          link = document.createElement('a');
          link.href = current + "team/" + id;
          link.text = x.name;
          cell.appendChild(link);
        }
        else cell.textContent = '-';
        row.appendChild(cell);

        cell = document.createElement('td');
        if (x.mascot) {
          link = document.createElement("a");
          link.href = current + "team/" + id;
          link.text = x.mascot;
          cell.appendChild(link);
        }
        else cell.textContent = '-';
        row.appendChild(cell);

        // Add Modify Cell with Form and Buttons
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
            console.log(resData);
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
    // NAME
    if (data.name) document.getElementById('edit-name').value = data.name;
    else document.getElementById('edit-name').value = "Name";
    // MASCOT
    if (data.mascot) document.getElementById('edit-mascot').value = data.mascot;
    else document.getElementById('edit-mascot').value = "";
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
  console.log("hideEditForm");
  clearAlerts();
  clearTextInput();
  displayAddFormBtn();
  hideAddForm();

  var editFormContainer = document.getElementById('editFormContainer');
  if (editFormContainer) {
    editFormContainer.style.display = "none";
    console.log(editFormContainer.style.display);
  }
}
function displayEditForm() {
  console.log("hideEditForm");
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
  var name = document.getElementById('name').value;
  var mascot = document.getElementById('mascot').value;
  name = name.trim();
  mascot   = mascot.trim();
  // NAME IS REQUIRED
  if (name === "") {
    console.log("Name is required");
    document.getElementById('name-required').style.display = 'inline-block';
    document.getElementById('added-alert').style.display = 'none';
    document.getElementById('updated-alert').style.display = 'none';
  }
  else {
    // Create JSON from form
    var reqData = {};
    reqData.name = name;
    reqData.mascot = mascot;
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
  var name = document.getElementById('edit-name').value;
  var mascot = document.getElementById('edit-mascot').value;
  name = name.trim();
  mascot   = mascot.trim();

  // NAME IS REQUIRED
  if (name === "") {
    console.log("Name is required");
    document.getElementById('edit-name-required').style.display = 'inline-block';
    document.getElementById('added-alert').style.display = 'none';
    document.getElementById('updated-alert').style.display = 'none';
  }
  else {
    // Create JSON from form
    var reqData = {};
    reqData.id = id;
    reqData.name = name;
    reqData.mascot = mascot;
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
// FORM BUTTONS: search
//

function bindSearchForm() {
  document.getElementById('searchSubmit').addEventListener('click', searchClick)
}

function searchClick(e) {
  e.preventDefault();
  var searchText = document.getElementById('search').value;
  console.log("Search Text: " + searchText);
  if (searchText != "") {
    var req = new XMLHttpRequest();
    var method = 'GET'
    var searchURL = objURL + "search?name=" + encodeURIComponent(searchText);
    console.log("searchURL: " + searchURL);
    req.open(method, searchURL, true);
    req.setRequestHeader('Content-Type', "plain/text");
    req.addEventListener('load', function() {
      if ((req.status < 200) || (req.status >= 400)) {
        // Error
        console.log("Error in requesting search data.");
        console.log("Error: " + req.statusText);
      }
      else {
        var resData = JSON.parse(req.responseText);
        console.log("search data: " + JSON.stringify(resData));
        loadTableData(resData);
      }
    })
    req.send();

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
