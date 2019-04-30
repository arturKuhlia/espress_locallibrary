function getLatLong(){ var geo = new google.maps.Geocoder; 
  //value comes from textarea called location 
  var address = $('#location').val(); 
  var user = $('#user').val(); 
  
  geo.geocode({'address':address},function(results, status){ 
    if (status == google.maps.GeocoderStatus.OK) { 
      var lat = results[0].geometry.location.lat(); 
      var lng = results[0].geometry.location.lng(); 
      var latlng = new google.maps.LatLng(lat,lng); 
      var mapProp = { center:latlng, zoom:18, mapTypeId:google.maps.MapTypeId.ROADMAP, mapTypeControl: false }; 
      var map=new google.maps.Map(document.getElementById("googleMap"),mapProp); 
      var marker = new google.maps.Marker({ 
        position: latlng, 
        map: map, 
        title:name }); 
      $.get( "http://localhost:1346?nome="+user+"&lat="+lat+"&lon="+lng, null); } 
      else {
         alert("Geocoder failed: " + status); 
        } 
    });
  }

