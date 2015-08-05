gmaps = {
    // map object
    map: null,
 
    // google markers objects
    markers: [],
 
    // google lat lng objects
    latLngs: [],
 
    // our formatted marker data objects
    markerData: [],

    
 
    // add a marker given our formatted marker data object
    addMarker: function(marker) {
        var gLatLng = new google.maps.LatLng(marker.lat, marker.lng);
        var gMarker = new google.maps.Marker({
            position: gLatLng,
            map: this.map,
            title: marker.title,
            // animation: google.maps.Animation.DROP,
            icon:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });
        this.latLngs.push(gLatLng);
        this.markers.push(gMarker);
        this.markerData.push(marker);
        return gMarker;
    },
 
    // calculate and move the bound box based on our markers
    calcBounds: function() {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, latLngLength = this.latLngs.length; i < latLngLength; i++) {
            bounds.extend(this.latLngs[i]);
        }
        this.map.fitBounds(bounds);
    },
 
    // check if a marker already exists
    markerExists: function(key, val) {
        _.each(this.markers, function(storedMarker) {
            if (storedMarker[key] == val)
                return true;
        });
        return false;
    },
 
    // intialize the map
    initialize: function() {
      var marker = null;
  var mapOptions = {
    zoom: 18
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);

var icon = {
            url : 'http://graph.facebook.com/' + (Meteor.user().services.facebook.id) + '/picture?type=square&height=160&width=160', // url
            scaledSize: new google.maps.Size(40, 40)
          };


 marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        map: map,
        position: pos,
        content: 'You are here.',
        icon: icon
      });
      map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });


    
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }



setInterval(function(){
  navigator.geolocation.getCurrentPosition(function(position) {
     var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);

var icon = {
            url : 'http://graph.facebook.com/' + (Meteor.user().services.facebook.id) + '/picture?type=square&height=160&width=160', // url
            scaledSize: new google.maps.Size(40, 40)
          };


  marker.setMap(null);

        marker = new google.maps.Marker({
        map: map,
        position: pos,
        content: 'You are here.',
        icon: icon
      });


      console.log(pos);
      document.getElementById("latLongDiv").innerHTML = pos;
    });
  },1000)



// document.getElementById("record").addEventListener("click", recordPolyline);

// function recordPolyline() {
//     document.getElementById("demo").innerHTML = "YOU CLICKED ME!";
// }



  var flightPlanCoordinates = [
    new google.maps.LatLng(37.772323, -122.214897),
    new google.maps.LatLng(21.291982, -157.821856),
    new google.maps.LatLng(-18.142599, 178.431),
    new google.maps.LatLng(-27.46758, 153.027892)
  ];
  var flightPath = new google.maps.Polyline({
    path: flightPlanCoordinates,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  flightPath.setMap(map);
}
}