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
      document.getElementById("latLongDiv").innerHTML = pos;

      //Update users marker in collection for users friends to see
  if (Meteor.user().profile.marker === undefined) {
  
      Meteor.users.update({
        _id: Meteor.userId()
      }, {
        $set: {
          'profile.position': pos
        }
      });
        var markerId = Markers.insert({
          userId: (Meteor.user()._id),
          positionLat: position.coords.latitude,
          positionLon: position.coords.longitude,
          img: ('http://graph.facebook.com/' + (Meteor.user().services.facebook.id) + '/picture?type=square&height=160&width=160')
        });
        Meteor.users.update({
          _id: Meteor.userId()
        }, {
          $set: {
            'profile.marker': markerId
          }
        });
    
      
    } else {
      Markers.update({
          _id: Meteor.user().profile.marker
        }, {
          $set: {
          positionLat: position.coords.latitude,
          positionLon: position.coords.longitude
          }
        });
    }


    });

  },1000)


  var myPathCoordinates = [];

  for (var i = 2; i < Polylines.findOne({_id: Meteor.user().profile.polyline}).position.length; i++) {
    lat = Polylines.findOne({_id: Meteor.user().profile.polyline}).position[i][0];
    lon = Polylines.findOne({_id: Meteor.user().profile.polyline}).position[i][1];


myPathCoordinates.push(new google.maps.LatLng(lat, lon));
    }


  

  var myPath = new google.maps.Polyline({
    path: myPathCoordinates,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  myPath.setMap(map);







  for (var i = 0; i < friendList.findOne({ userId: Meteor.userId()}).friends.length; i++) {
      friendsId = friendList.findOne({ userId: Meteor.userId()}).friends[i];
      friendsPositionLat = Markers.findOne({ userId: friendsId}).positionLat;
      friendsPositionLon = Markers.findOne({ userId: friendsId}).positionLon;
      friendsPicture = Markers.findOne({ userId: friendsId}).img;


      icon = {
            url : friendsPicture, // url
            scaledSize: new google.maps.Size(40, 40)
          };


 marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        map: map,
        position: new google.maps.LatLng(friendsPositionLat, friendsPositionLon),
        icon: icon,
        title: ((Meteor.users.findOne({
              _id: friendsId
            }).profile.name) + ' is here!')
      });
    }


}
}