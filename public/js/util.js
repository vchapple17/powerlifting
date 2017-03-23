function clearTextInput() {
  // Citation: http://stackoverflow.com/questions/5897122/accessing-elements-by-type-on-javascript

  var inputs = document.getElementsByTagName('input');
  var i;
  for (i = 0; i < inputs.length; i++) {
    if (inputs[i].type.toLowerCase() == 'text') {
      inputs[i].value = "";
    }
    if (inputs[i].type.toLowerCase() == 'number') {
      inputs[i].value = "";
    }
  }
}

function clearRadioInput() {
  var inputs = document.getElementsByTagName('input');
  var i;
  for (i = 0; i < inputs.length; i++) {
    if (inputs[i].type.toLowerCase() == 'radio') {
      inputs[i].checked = false;
      inputs[i].removeAttribute('checked');
    }
  }
}


function getStateAbbreviationArray() {
  var array = []; array.push("AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY");
  return array;
}
