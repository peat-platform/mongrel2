var typePatternMatch         = new RegExp(/^t_[a-z0-9]{32}-[0-9]{1,10000}$/);
var typePatternExtract       = new RegExp(/t_[a-z0-9]{32}-[0-9]{1,10000}/gm);

var objectPatternMatch       = new RegExp(/^0[a-f,0-9]{7}-[a-f,0-9]{4}-4[a-f,0-9]{3}-[a-f,0-9]{4}-[a-f,0-9]{12}$/);
var objectPatternExtract     = new RegExp(/0[a-f,0-9]{7}-[a-f,0-9]{4}-4[a-f,0-9]{3}-[a-f,0-9]{4}-[a-f,0-9]{12}/gm);

var entries                  = []
var subTypes                 = [];
var allowedTypes             = ['boolean', 'int', 'float', 'string', 'url', 'attachment', 'date', 'timestamp', 'gps', 'hexadecimal', 'base64'];


   var minify = function (json) {

      var tokenizer = /"|(\/\*)|(\*\/)|(\/\/)|\n|\r/g,
         in_string = false,
         in_multiline_comment = false,
         in_singleline_comment = false,
         tmp, tmp2, new_str = [], ns = 0, from = 0, lc, rc
         ;

      tokenizer.lastIndex = 0;

      while ( tmp = tokenizer.exec(json) ) {
         lc = RegExp.leftContext;
         rc = RegExp.rightContext;
         if (!in_multiline_comment && !in_singleline_comment) {
            tmp2 = lc.substring(from);
            if (!in_string) {
               tmp2 = tmp2.replace(/(\n|\r|\s)*/g,"");
            }
            new_str[ns++] = tmp2;
         }
         from = tokenizer.lastIndex;

         if (tmp[0] === "\"" && !in_multiline_comment && !in_singleline_comment) {
            tmp2 = lc.match(/(\\)*$/);
            if (!in_string || !tmp2 || (tmp2[0].length % 2) === 0) {    // start of string with ", or unescaped " character found to end string
               in_string = !in_string;
            }
            from--; // include " character in next catch
            rc = json.substring(from);
         }
         else if (tmp[0] === "/*" && !in_string && !in_multiline_comment && !in_singleline_comment) {
            in_multiline_comment = true;
         }
         else if (tmp[0] === "*/" && !in_string && in_multiline_comment && !in_singleline_comment) {
            in_multiline_comment = false;
         }
         else if (tmp[0] === "//" && !in_string && !in_multiline_comment && !in_singleline_comment) {
            in_singleline_comment = true;
         }
         else if ((tmp[0] === "\n" || tmp[0] === "\r") && !in_string && !in_multiline_comment && in_singleline_comment) {
            in_singleline_comment = false;
         }
         else if (!in_multiline_comment && !in_singleline_comment && !(/\n|\r|\s/.test(tmp[0]))) {
            new_str[ns++] = tmp[0];
         }
      }
      new_str[ns++] = rc;
      return new_str.join("");
   };



function _sort(json, depth, til) {
   if (depth > til) {
      throw new Error('Maximum object depth reached');
   }
   if (typeof json !== 'object' || Array.isArray(json)) {
      return json;
   }
   var r = {};
   Object.getOwnPropertyNames(json).sort().forEach(function(e) {
      r[e] = _sort(json[e], depth + 1, til);
   });
   return r;
}

function sort(json) {
   return _sort(json, 0, 4);
}

function norm(json) {
   return minify(JSON.stringify(sort(json)));
}

function hash(json) {
   var n = norm(json);
   return 't_' + $.md5(n) + '-' + n.length;
   //return require('crypto').createHash('md5').update(n).digest('hex') + '-' + n.length;
}

var isTypeId = function(path){
   return typePatternMatch.test(path);
};

$('#setPermissions2').click(function(){
   var data = [ { "ref": "t_e782776271a49e49d1e1dc3f32ee59b1-535", "type": "type", "access_level": "APP", "access_type": "CREATE" }, { "ref": "t_e782776271a49e49d1e1dc3f32ee59b1-535", "type": "type", "access_level": "APP", "access_type": "READ" }, { "ref": "t_e782776271a49e49d1e1dc3f32ee59b1-535", "type": "type", "access_level": "APP", "access_type": "UPDATE" }, { "ref": "t_e782776271a49e49d1e1dc3f32ee59b1-535", "type": "type", "access_level": "APP", "access_type": "DELETE" }, { "ref": "t_57281a30ce2684932c5810e3d2884be5-247", "type": "type", "access_level": "APP", "access_type": "READ" }, { "ref": "t_57281a30ce2684932c5810e3d2884be5-247", "type": "type", "access_level": "APP", "access_type": "CREATE" }, { "ref": "t_a2c029fe882b2ad2fa630fc9f4556f32-259", "type": "type", "access_level": "APP", "access_type": "READ" }, { "ref": "t_a2c029fe882b2ad2fa630fc9f4556f32-259", "type": "type", "access_level": "APP", "access_type": "CREATE" }, { "ref": "t_11fe95b730bd42950e6b12208a25fe89-341", "type": "type", "access_level": "APP", "access_type": "READ" }, { "ref": "t_11fe95b730bd42950e6b12208a25fe89-341", "type": "type", "access_level": "APP", "access_type": "CREATE" }, { "ref": "00000001-5203-4f5b-df3e-7f06c795775d", "type": "object", "access_level": "CLOUDLET", "access_type": "READ" } ]

   $("#inputData").val(JSON.stringify(data, undefined, 2));
})


$('#setPermissions1').click(function(){
   var data = "t_e782776271a49e49d1e1dc3f32ee59b1-535  t_11fe95b730bd42950e6b12208a25fe89-341"

   $("#inputData").val(data);
})


$('#copyPermissions').click(function(){

   var filename = 'permissions.json'
   var text     = $("#outputData").text()
   var pom      = document.createElement('a');

   pom.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
   pom.setAttribute('download', filename);
   pom.click();

})


var typeToDiv = function(context){

   var html = '<div class="contextInstance">'

   for ( var i in context){
      html += '<div  class="nvp"><span class="nvp_name">' + i + '</span><span class="nvp_value"  nvp_name="' + i + '">: ' + context[i] + '</span></div>'
   }

   html += '</div>'

   return html
}


$('#editContainer').on('click', 'input', function() {

   var element = $(this)

   var checked = element.prop('checked')

   if (checked){
      var name    = element.prop('name')
      var level   = name.split('_')[0]
      var action  = name.split('_')[1]

      var new_level = ('app' === level) ? 'cloudlet' : 'app'
      var new_name  = new_level + '_' + action

      var other_element = element.parents(".permInstance").find("input[name='" + new_name + "']")

      if (other_element.prop('checked')){
         other_element.prop('checked', false)
      }
   }

   parseType()

});


$('#editContainer').on('click', 'span.removeFromPerms', function() {
   $(this).parents(".permInstance").remove();
   parseType()
})


$('#editContainer').on('click', 'span.loadTypeDetails', function() {

   var element = $( this )
   var id      = element.parents(".permInstance").prop('id').replace('instance_', '')

   var typeURL = '/api/v1/types/' + id

   $.get( typeURL, function( data ) {

      $("#dialog-modal").html('<pre>' + JSON.stringify(data, undefined, 2) + '</pre>');
      $("#dialog-modal").dialog( { "title" : id + ' details' } );
      $("#dialog-modal").dialog("open");
   })

})


var getMockEntry = function(type, pos){

   switch(type['@type']){
   case "string" :
      var prop = type['@property_name']
      return (pos > 0 ) ? "mock " + prop + " " + pos : "mock " + prop
      break
   case "int":
      return (pos > 0 ) ? pos : 1
      break
   case "boolean":
      if (pos > 0){
         return (pos % 2 == 0)
      }
      return true
   case "":

   }

}


var generateMockData = function(context){

   if (true === context['@multiple']){

      var arr = []

      for (var i = 1; i <= 3; i++){
         arr.push(getMockEntry(context, i))
      }

      return arr
   }

   return getMockEntry(context)
}


var parseType = function(){

   var context_arr = []
   var mock_data   = {}

   $("#contextContainer .contextInstance").each(function( index ) {

      var element = $( this )
      var context = {}

      element.find('.nvp').each(function(){

         var input = $( this )

         var name  = input.find('.nvp_name').html()
         var value = input.find('.nvp_value').html().replace(': ', '')

         if ('@multiple' === name || '@required' === name ){
            value = ('true' === value)
         }

         context[name] = value

      })

      mock_data[context['@property_name']] = generateMockData(context)

      context_arr.push( context )
   })

   var type = {
      "@reference" : $('#inputReference').val(),
      "@context"   : context_arr,
   }

   //console.log(JSON.stringify(type))

   var mock_obj = {
      '@type' : hash(type),
      '@data'       : mock_data
   }

   $("#outputDataObject").html(JSON.stringify(mock_obj, undefined, 2));
   $("#outputDataType").html(  JSON.stringify(type,     undefined, 2));
}


var validateTypeEntry = function(entry){

   if ( $("#inputReference").val() === '' || $("#inputReference").val() === undefined ) {
      alert('Required property @reference is missing.');
      $("#inputReference").focus()
      return false;
   }

   if (undefined !== entries[entry["@property_name"]]){
      alert('Property already exists')
      return false
   }

   var errs  = []
   var name  = entry['@property_name'];

   if ( !('@property_name' in  entry) || '' === entry['@property_name']) {
      errs.push('In \'' + name + '\' required parameter @property_name is missing.');
   }
   if ( !('@context' in  entry) || '' === entry['@context']) {
      errs.push('In \'' + name + '\' required parameter @context is missing.');
   }
   if ( !( '@type' in entry) ) {
      errs.push('In \'' + name + '\' required parameter @type is missing.');
   }
   if ( !( '@required' in entry) ) {
      errs.push('In \'' + name + '\' required parameter @required is missing.');
   }
   if ( !( '@multiple' in entry) ) {
      errs.push('In \'' + name + '\' required parameter @multiple is missing.');
   }
   if ( '@allowed_values' in entry ) {
      if ( Object.prototype.toString.call( entry['@allowed_values'] ) !== '[object Array]' || 0 === entry['@allowed_values'].length ){
         errs.push('In \'' + name + '\' @allowed_values array is empty');
      }
   }
   if (undefined === entry['@type'] || -1 === allowedTypes.indexOf(entry['@type'].toLowerCase())) {

      if ( isTypeId(entry["@type"])){
         subTypes.push(entry["@type"]);
      }
      else{
         errs.push(entry['@type'].toLowerCase() + ' is not a valid type.');
      }
   }

   if (0 == errs.length){
      return true
   }
   else{
      alert(errs.join(" \n"))
      return false
   }
}



$('#inputReference').change(function() {
   parseType()
});


$('#clearContext').click(function(){
   $('#property_name').val('')
   $('#type').val('string')
   $('#multiple').prop('checked', false)
   $('#required').prop('checked', 'checked')
   $('#context_id').val('')
})

$('#type').change(function(){
   if ("type" === $('#type').val()) {
      $('#type_id').show();
   }
   else{
      $('#type_id').hide();
   }
})

$('#addUpdateContext').click(function(){

   $("#introText").remove()

   var entry = {
      "@property_name" : $('#property_name').val(),
      "@type"          : $('#type').val(),
      "@multiple"      : $('#multiple').prop('checked'),
      "@required"      : $('#required').prop('checked'),
      "@context"       : $('#context').val()
   }


   if ("type" === entry["@type"]){
      entry["@type"] = $('#type_id').val();
   }


   if (validateTypeEntry(entry)){
      entries[entry["@property_name"]] = entry
      $('#contextContainer').append(typeToDiv(entry))
      parseType()
      $('#property_name').val('')
      $('#context_id').val('')
   }

})


$(function() {
   $( document ).tooltip();
   $("#dialog-modal").dialog(
      {
         width: 600,
         height: 400,
         autoOpen: false,
         buttons: {
            "Close": function() {
               $(this).dialog("close");
            }
         }
      })
});

