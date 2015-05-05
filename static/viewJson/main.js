var loadedJson;
var content = document.getElementById('content');
var error = document.getElementById("error");

loadJson = function(url){
  var obj;
  $.ajax({
    dataType:'json',
    async:false,
    url:url,
    success:function(data){
      obj = data;
    },
    error:function(err){
      error.innerHTML = "Could not load json : " + url;
    }
  });
  return obj;
}

showElement = function(obj){
  content.innerHTML = "";
  content.appendChild(createTable(obj));
}

createTable = function(data){
  var table = document.createElement('table');
  var header = table.createTHead();

  var headProp = document.createElement('th');
  var headVal = document.createElement('th');

  headProp.innerHTML = 'Property';
  headVal.innerHTML = 'Value';

  header.appendChild(headProp);
  header.appendChild(headVal);

  for(var i in data){

    var row = table.insertRow();
    var cellProp = row.insertCell(-1);
    var cellVal = row.insertCell(-1);

    cellProp.innerHTML = i;


    var valueType = Object.prototype.toString.call(data[i]);
    if(valueType === '[object Array]'){
      for(element in data[i]){
        cellVal.appendChild(createTable(data[i][element]));
      }
    } else if(valueType === '[object Object]'){
      cellVal.appendChild(createTable(data[i]));
    } else {
      if(i == "_id"){
        cellVal.innerHTML = '<a target="_blank" href="' + data[i] + '">' + data[i] + '</a>';
      }else{
        cellVal.innerHTML = data[i];
      }
    }
  }

  return table;
}

createObjectTable = function(data, type){
  var table = document.createElement('table');
  var header = table.createTHead();

  var headProp = document.createElement('th');
  var headId = document.createElement('th');
  var headType = document.createElement('th');
  var headVal = document.createElement('th');

  headProp.innerHTML = 'Property';
  headType.innerHTML = 'OPENi Type';
  headId.innerHTML = 'ID';
  headVal.innerHTML = 'Value';

  header.appendChild(headProp);
  header.appendChild(headType);
  header.appendChild(headId);
  header.appendChild(headVal);

  for(var i in type){
    var prop = type[i];
    var row = table.insertRow();
    var cellProp = row.insertCell(-1);
    var cellType = row.insertCell(-1);
    var cellId = row.insertCell(-1);
    var cellVal = row.insertCell(-1);

    cellProp.innerHTML = prop._property_name;
    cellType.innerHTML = prop._property_context['@openi_type'];
    cellId.innerHTML = '<a target="_blank" href="' + prop._property_context._id + '">' + prop._property_context._id + '</a>';
    cellVal.innerHTML = data[prop._property_name];

  }

  return table;
}

showJson = function(url){
  loadedJson = loadJson(url);
  if(loadedJson) showElement(loadedJson);
}

showType = function(url){
  //TODO load in the actual url
  loadedJson = loadJson(url);
  if(loadedJson){
    if(!loadedJson['@context'] || !loadedJson['@id']){
      error.innerHTML = "Not a valid type";
    } else {

      var refType = loadedJson['_reference'];
      var refurl = "<a href='" + refType + "'>" + refType + "</a>"

      content.innerHTML += "<h2>OPENi Type:</h2><p class='box'>" + loadedJson._id +
        "</p><br/><h2>Reference Type:</h2><p class='box'>" + refurl +
        "</p><br/><h2>Context:</h2>";
      for(var i in loadedJson['@context']){
        content.appendChild(createTable(loadedJson['@context'][i]));
      }

    }
  }
}

showObject = function(url){
  //TODO load in the actual url
  loadedJson = loadJson(url);
  var objectType = loadJson(loadedJson['@type_location']);
  if(loadedJson){
    content.innerHTML += "<h2>OPENi Object:</h2><p class='box'>" + url + "</p>";
    content.innerHTML += "<h2>OPENi Type:</h2><p class='box'><a target='_blank' href='" + loadedJson['@openi_type'] + "'>" + loadedJson['@openi_type'] + "</a></p>";
    content.innerHTML += "<h2>OPENi Revision:</h2><p class='box'>" + loadedJson['_revision'] + "</p>";

    content.innerHTML +=  "<br/><h2>Data:</h2>";
    content.appendChild(createObjectTable(loadedJson._data, objectType['@context']));
  }
}

document.getElementById("loadJsonButton").addEventListener("click", function(event){
  error.innerHTML = "";
  content.innerHTML = "";
  loadedJson = undefined;
  var url = document.getElementById("jsonLocation").value;

  if(url.indexOf("/api/v1/types/")>0){
    showType(url);
  }else if( url.indexOf("/api/v1/objects/") > 0){
    showObject(url);
  }else{
    showJson(url);
  }
});
