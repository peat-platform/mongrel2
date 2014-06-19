var schema;
var loadedJson;
var maxIndex = 0;
var content = document.getElementById('content');
var error = document.getElementById("error");

//Load schema
$.ajax({
  type:'GET',
  dataType:'json',
  async:false,
  url:'schema.json',
  success:function(data){
    schema = data;
  }
});

loadJson = function(url){
  $.ajax({
    dataType:'json',
    async:false,
    url:url,
    success:function(data){
      loadedJson = data;
    }
  });
  if(loadedJson["@graph"]) maxIndex = loadedJson["@graph"].length - 1;
}

showElement = function(obj){
  content.innerHTML = "";
  content.appendChild(createTable(obj));
}

createTable = function(data){
  var table = document.createElement('table');
  var header = table.createTHead();
  var headRow = header.insertRow();

  var headProp = document.createElement('th');
  var headType = document.createElement('th');
  var headVal = document.createElement('th');
  headProp.innerHTML = 'Property';
  headType.innerHTML = 'Expected Type';
  headVal.innerHTML = 'Value';

  header.appendChild(headProp);
  header.appendChild(headType);
  header.appendChild(headVal);

  for(var i in data){
    //if(i.substr(0,1) == '@') continue;

    var row = table.insertRow();
    var cellProp = row.insertCell(-1);
    var cellType = row.insertCell(-1);
    var cellVal = row.insertCell(-1);

    cellProp.innerHTML = '<a target="_blank" href="' + loadedJson['@context'] + '/' + i + '">' + i + '</a>';

    if(schema.properties[i]){
      var type = schema.properties[i].ranges[0];
      cellType.innerHTML = '<a target="_blank" href="' + loadedJson['@context'] + '/' + type + '">' + type + '</a>';
    } else {
      cellType.innerHTML = "unknown";
    }

    var valueType = Object.prototype.toString.call(data[i]);
    if(valueType === '[object Array]'){
      for(element in data[i]){
        cellVal.appendChild(createTable(data[i][element]));
      }
    } else if(valueType === '[object Object]'){
      cellVal.appendChild(createTable(data[i]));
    } else {
      cellVal.innerHTML = data[i];
    }
  }

  return table;
}

document.getElementById("loadJsonButton").addEventListener("click", function(event){
  error.innerHTML = "";
  var url = document.getElementById("jsonLocation").value;
  loadJson(url);
});

document.getElementById("showElementButton").addEventListener("click", function(event){
  error.innerHTML = "";
  if(!loadedJson){
    error.innerHTML = "No Json Loaded";
  }
  else {
    if(loadedJson["@graph"]){
      var index = document.getElementById("elementIndex").value;
      index = parseInt(index);
      if(index < 0 || index > maxIndex){
        error.innerHTML = "Please only enter an integer in range 0 - " + maxIndex + " inclusively.";
      } else {
        showElement(loadedJson["@graph"][index]);
      }
    } else {
      showElement(loadedJson);
    }
  }
});

function digitsOnly(obj) {
  obj.value = obj.value.replace(/\D/g, "");
}