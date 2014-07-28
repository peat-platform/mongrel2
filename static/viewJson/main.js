var loadedJson;
var maxIndex = 0;
var content = document.getElementById('content');
var error = document.getElementById("error");

loadJson = function(url){
  $.ajax({
    dataType:'json',
    async:false,
    url:url,
    success:function(data){
      loadedJson = data;
    },
    error:function(err){
      error.innerHTML = "Could not load json : " + url;
    }
  });
  if(loadedJson) showElement(loadedJson);
}

showElement = function(obj){
  content.innerHTML = "";
  content.appendChild(createTable(obj));
}

createTable = function(data){
  var table = document.createElement('table');
  var header = table.createTHead();

  var headProp = document.createElement('th');
//  var headType = document.createElement('th');
  var headVal = document.createElement('th');

  headProp.innerHTML = 'Property';
//  headType.innerHTML = 'Expected Type';
  headVal.innerHTML = 'Value';

  header.appendChild(headProp);
//  header.appendChild(headType);
  header.appendChild(headVal);

  for(var i in data){

    var row = table.insertRow();
    var cellProp = row.insertCell(-1);
//    var cellType = row.insertCell(-1);
    var cellVal = row.insertCell(-1);

    if(data['@context']){
        cellProp.innerHTML = '<a target="_blank" href="' + data['@context'] + '/' + i + '">' + i + '</a>';
    } else {
        cellProp.innerHTML = i;
    }

//    if(schema.properties[i]){
//      var type = schema.properties[i].ranges[0];
//      cellType.innerHTML = '<a target="_blank" href="' + loadedJson['@context'] + '/' + type + '">' + type + '</a>';
//    } else {
//      cellType.innerHTML = "unknown";
//    }

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
