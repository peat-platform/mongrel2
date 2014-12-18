var typePatternMatch         = new RegExp(/^t_[a-z0-9]{32}-[0-9]{1,10000}$/);
var typePatternExtract       = new RegExp(/t_[a-z0-9]{32}-[0-9]{1,10000}/gm);

var objectPatternMatch       = new RegExp(/^0[a-f,0-9]{7}-[a-f,0-9]{4}-4[a-f,0-9]{3}-[a-f,0-9]{4}-[a-f,0-9]{12}$/);
var objectPatternExtract     = new RegExp(/0[a-f,0-9]{7}-[a-f,0-9]{4}-4[a-f,0-9]{3}-[a-f,0-9]{4}-[a-f,0-9]{12}/gm);


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


var typeToDiv = function(p){

   var html = '<div class="permInstance" id="instance_' + p.ref + '">'

   if ( typePatternMatch.test( p.ref ) ){
      html += '<div class="headingType">Type <span class="removeFromPerms">Remove</span></div>'
   }
   else if (objectPatternMatch.test( p.ref )){
      html += '<div class="headingObject">Object <span class="removeFromPerms">Remove</span></div>'
   }

   if ( objectPatternMatch.test( p.ref ) ){
      html += '<div class="immutable"> ID: ' + p.ref + '</div>'
      html += '<div><input type="checkbox" name="cloudlet_read" value="READ"> read <input type="checkbox" name="cloudlet_update" value="UPDATE"> update <input type="checkbox" name="cloudlet_delete" value="DELETE"> delete</div>'
   }
   else{
      html += '<div class="immutable"> ID: ' + p.ref + ' <span  class="loadTypeDetails">Details</span></div>'
      html += '<div>App level <span class="help" title="Requesting app level permissions means that your application will be restricted Cloudlet objects created by that application. It cannot access objects of the same type created by other applications.">?</span></div>'
      html += '<div><input type="checkbox" name="app_create" value="CREATE"> create <input type="checkbox" name="app_read" value="READ"> read <input type="checkbox" name="app_update" value="UPDATE"> update <input type="checkbox" name="app_delete" value="DELETE"> delete</div>'

      html += '<div>Cloudlet level <span class="help" title="Requesting cloudlet level permissions means that your application will have access to all objects of this type in a users Cloudlet, even objects created by other applications. Warning: users are more likely to reject requests for Cloudlet level access.">?</span></div>'
      html += '<div><input type="checkbox" name="cloudlet_create" value="CREATE"> create <input type="checkbox" name="cloudlet_read" value="READ"> read <input type="checkbox" name="cloudlet_update" value="UPDATE"> update <input type="checkbox" name="cloudlet_delete" value="DELETE"> delete</div>'
   }
   html += '</div>'

   return html
}


var applyAccessValues = function(p){
   var inst         = $('#instance_' + p.ref )
   var name_prepend = p.access_level.toLowerCase()
   var name_append  = p.access_type.toLowerCase()

   inst.find("input[name='" + name_prepend + '_' + name_append + "']").prop('checked', true);
}


$('#startEditing').click(function(){

   var raw = $("#inputData").val()

   try {
      var perms = JSON.parse(raw)

      if (Array.isArray(perms)){
         for (var p in perms){
            if ( typePatternMatch.test(perms[p].ref ) || objectPatternMatch.test(perms[p].ref )){
               if ($('#instance_' + perms[p].ref ).length === 0) {
                  $('#editContainer').append(typeToDiv(perms[p]))
               }
               applyAccessValues(perms[p])
            }
         }

         $("#inputData").text('')
         parsePermissions()
      }
      else{
         //is object
         if ( typePatternMatch.test(perms.ref ) || objectPatternMatch.test(perms.ref )){
            if ($('#instance_' + perms.ref ).length === 0) {
               $('#editContainer').append(typeToDiv(perms))
            }
            applyAccessValues(perms)
            $("#inputData").text('')
            parsePermissions()
         }
      }
   } catch (e) {

      var match;

      while ((match = typePatternExtract.exec(raw)) != null) {

         if (match.index === typePatternExtract.lastIndex) {
            typePatternExtract.lastIndex++;
         }

         var id = match[0]

         var perm = {
            ref  : id,
            type : 'type'
         }

         if ($('#instance_' + id ).length === 0) {
            $('#editContainer').append(typeToDiv(perm))
         }
      }


      while ((match = objectPatternExtract.exec(raw)) != null) {

         if (match.index === typePatternExtract.lastIndex) {
            typePatternExtract.lastIndex++;
         }

         var id = match[0]

         var perm = {
            ref  : id,
            type : 'object'
         }

         if ($('#instance_' + id ).length === 0) {
            $('#editContainer').append(typeToDiv(perm))
         }
      }

      parsePermissions()
   }
})


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

   parsePermissions()

});


$('#editContainer').on('click', 'span.removeFromPerms', function() {
   $(this).parents(".permInstance").remove();
   parsePermissions()
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


var parsePermissions = function(){

   var perms = []

   $("#editContainer .permInstance").each(function( index ) {

      var element = $( this )
      var id      = element.prop('id').replace('instance_', '')
      var type    = ( typePatternMatch.test(id ) ) ? 'type' : 'object'

      element.find('input:checked').each(function(){
         var input = $( this )
         var name  = input.prop('name')

         var aLevel = name.split('_')[0].toUpperCase()
         var aType  = name.split('_')[1].toUpperCase()

         var perm   = {
            ref          : id,
            type         : type,
            access_level : aLevel,
            access_type  : aType
         }

         perms.push( perm )
      })

   })

   document.getElementById("outputData").innerHTML = JSON.stringify(perms, undefined, 2);
}


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

