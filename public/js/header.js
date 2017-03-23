//Add Link to Home pages

document.addEventListener('DOMContentLoaded', addHeaderLinks);

function _createMenuDiv() {
  var div = document.createElement('div');
  div.style.display = 'inline-block';
  div.style.width = '150px';
  div.style.color = 'blue';
  div.style.background = 'silver';
  div.style.textAlign = 'center';
  div.style.borderColor = 'white';
  div.style.borderWidth = '5px';
  div.style.borderStyle = 'solid';
  div.style.padding = '10px';

  return div;
}
function addHeaderLinks() {
  var headerDiv = document.getElementById("header");
  headerDiv.style.width = '100%';
  headerDiv.style.textAlign = 'left';

  var pathArray = location.href.split( '/' );
  var protocol = pathArray[0];
  var host = pathArray[2];
  var url = protocol + '//' + host;


  var div = _createMenuDiv();
  var link = document.createElement("a");
  link.href = url;
  link.text = "HOME";
  div.appendChild(link);
  headerDiv.appendChild(div);

  div = _createMenuDiv();
  link = document.createElement("a");
  link.href = url + "/teamtab/";
  link.text = "TEAM TAB";
  div.appendChild(link);
  headerDiv.appendChild(div);

  div = _createMenuDiv();
  link = document.createElement("a");
  link.href = url + "/meetmarket/";
  link.text = "MEET MARKET";
  div.appendChild(link);
  headerDiv.appendChild(div);

  div = _createMenuDiv();
  link = document.createElement("a");
  link.href = url + "/lifterlist/";
  link.text = "LIFTER LIST";
  div.appendChild(link);
  headerDiv.appendChild(div);
}
