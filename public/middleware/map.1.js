var confirmBtn = document.getElementById('confirmPosition');
      var onClickPositionView = document.getElementById('onClickPositionView');
      var map = document.getElementById('map');
      // Initialize LocationPicker plugin
      var lp = new locationPicker(map, {
      setCurrentPosition: true, // You can omit this, defaults to true
      lat: 43.7,
      lng: -79.5
      }, {
      zoom: 15 // You can set any google map options here, zoom defaults to 15
      });
      // Listen to button onclick event
      confirmBtn.onclick = function () {
      // Get current location and show it in HTML
      var location = lp.getMarkerPosition();
      onClickPositionView.innerHTML = 'The chosen location is ' + location.lat + ',' + location.lng;
      //get the input elements from HTML DOM
     
      var location = lp.getMarkerPosition();
      var jobLoc = "jobLat"
      function setInputValue(jobLoc,location) {
      document.getElementById(jobLoc).setAttribute('value', location)}
      setInputValue(jobLoc, location)
      
      }; 

//------------OG^^^^^^


   
      // Create the search box and link it to the UI element.
      



      // var map;
      // var myCenter = new google.maps.LatLng(51.508742, -0.120850);
      // function initialize() {
      // var mapProp = {
      // center: myCenter,
      // zoom: 5,
      // mapTypeId: google.maps.MapTypeId.ROADMAP
      // };
      // map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
      // google.maps.event.addListener(map, 'click', function(event) {
      // placeMarker(event.latLng);
      // });
      // }
      // function placeMarker(location) {
      // var marker = new google.maps.Marker({
      // position: location,
      // map: map,
      // draggable: true,
      // });
      // var infowindow = new google.maps.InfoWindow({
      // content: 'Latitude: ' + location.lat() + '<br>Longitude: ' + location.lng()
      // });
      // infowindow.open(map, marker);
      // }
      // google.maps.event.addDomListener(window, 'load', initialize);








      // function initialize() {

      // // var input = (/** @type {HTMLInputElement} */
      // // document.getElementById('pac-input'));
      // // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
      // // var searchBox = new google.maps.places.SearchBox(
      // // /** @type {HTMLInputElement} */
      // // (input));
      // // // [START region_getplaces]
      // // // Listen for the event fired when the user selects an item from the
      // // // pick list. Retrieve the matching places for that item.
      // // google.maps.event.addListener(searchBox, 'places_changed', function() {
      // // var places = searchBox.getPlaces();
      // // if (places.length == 0) {
      // // return}});

      // var map = new google.maps.Map(document.getElementById("googleMap"), {
      //       center: new google.maps.LatLng(51.508742, -0.120850),
      //       zoom: 5,
      //       noClear: true
      //     }),
      //     //this may be the stored data
      //     data = {
      //       "type": "FeatureCollection",
      //       "features": [{
      //         "type": "Feature",
      //         "geometry": {
      //           "type": "Point",
      //           "coordinates": [-0.120850, 51.508742]
      //         },
      //         "properties": {}
      //       }]
      //     },
      //     win = new google.maps.InfoWindow,
        
            
      //     //some buttons for interaction
      //     ctrl = document.getElementById('datactrl'),
      
      
      //     fx = {
      //       'data-save': {
      //         click: function() {
      //           //use this method to store the data somewhere,
      //           //e.g. send it to a server
      //           map.data.toGeoJson(function(json) {
      //             data = json;
      //           });
      
      //         }
      //       },
      //       'data-show': {
      //         click: function() {
      
      //           alert('you may send this JSON-string to a server and store it there:\n\n' +
      //             JSON.stringify(data))
      //         }
      //       },
      //       'data-load': {
      //         click: function() {
      //           //use this method to load the data from somwhere
      //           //e.g. from a server via loadGeoJson
      
      //           map.data.forEach(function(f) {
      //             map.data.remove(f);
      //           });
      //           map.data.addGeoJson(data)
      //         },
      //         init: true
      //       },
      //       'data-clear': {
      //         click: function() {
      //           //use this method to clear the data
      //           //when you also want to remove the data on the server 
      //           //send a geoJSON with empty features-array to the server
      
      //           map.data.forEach(function(f) {
      //             map.data.remove(f);
      //           });
      //           data = {
      //             type: "FeatureCollection",
      //             features: []
      //           };
      
      
      //         }
      //       }
      //     };
      
      
      //   for (var id in fx) {
      //     var o = ctrl.querySelector('input[id=' + id + ']');
      //     google.maps.event.addDomListener(o, 'click', fx[id].click);
      //     if (fx[id].init) {
      //       google.maps.event.trigger(o, 'click');
      //     }
      //   }
      
      
      
      
      //   map.controls[google.maps.ControlPosition.TOP_CENTER].push(ctrl);
      
      
        
      
      //   function placeMarker(location) {
      //     var feature = new google.maps.Data.Feature({
      //       geometry: location
      //     });
      //     map.data.add(feature);
      //   }
      //   google.maps.event.addListener(map, 'click', function(event) {
      //     placeMarker(event.latLng);
      //   });
      
      
      //   google.maps.event.addListener(map.data, 'click', function(e) {
      //     if (e.feature.getGeometry().getType() === 'Point') {
      
      //       win.setOptions({
      //         content: 'Latitude: ' + e.feature.getGeometry().get().lat() +
      //           '<br>Longitude: ' + e.feature.getGeometry().get().lng(),
      //         pixelOffset: new google.maps.Size(0, -40),
      //         map: map,
      //         position: e.feature.getGeometry().get()
      //       });
      //     }
      //   });
      // }
      
      
      
      // google.maps.event.addDomListener(window, 'load', initialize);