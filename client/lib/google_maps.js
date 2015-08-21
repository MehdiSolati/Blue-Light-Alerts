gmaps = {
    // map object
    map: null,
 
    // google markers objects
    markers: [],
 
    // google lat lng objects
    latLngs: [],
 
    // our formatted marker data objects
    markerData: [],

    // intialize the map
    initialize: function() {
      var marker = null;
  var mapOptions = {
    zoom: 18
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  var infowindow = new google.maps.InfoWindow();

  // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);

      if(Session.get('testMode')==true){
        console.log('raw vals below');
        console.log(Session.get('startLat'));
        console.log(Session.get('startLng'));
        
      }

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
    // if testmode is active overwrite locale data with dummy data

     if(Session.get('testMode')==true){
      lat=Session.get('startLat')-.00004;
      lng=Session.get('startLng')-.000002;

      // lat=Session.get('startLat');
      // lng=Session.get('startLng');
          
          Session.set('startLat',lat);
          Session.set('startLng',lng);
      pos = new google.maps.LatLng(Session.get('startLat'), Session.get('startLng'))
     }

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
    console.log("Marker undefined");
      Meteor.users.update({
        _id: Meteor.userId()
      }, {
        $set: {
          'profile.position': pos
        }
      });
        var markerId = Markers.insert({
          userId: (Meteor.user()._id),
          //switching to use session objects
          // positionLat: position.coords.latitude,
          // positionLon: position.coords.longitude,
          positionLat: pos.lat(),
          positionLon: pos.lng(),
          //comment out above code to switch back to using HTML location
          img: ('http://graph.facebook.com/' + (Meteor.user().services.facebook.id) + '/picture?type=square&height=160&width=160')
        });
        console.log('new marker');
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
          //switching to use session objects
          // positionLat: position.coords.latitude,
          // positionLon: position.coords.longitude,
          positionLat: pos.lat(),
          positionLon: pos.lng()
          //comment out above code to switch back to using HTML location
          }
        });
    }


    });

google.maps.event.addListener(marker, 'click', function() {
    map.setZoom(18);
    map.setCenter(marker.getPosition());
  });

  },1000)





  for (var i = 0; i < friendList.findOne({ userId: Meteor.userId()}).friends.length; i++) {
      friendsId = friendList.findOne({ userId: Meteor.userId()}).friends[i];
      friendsPositionLat = Markers.findOne({ userId: friendsId}).positionLat;
      friendsPositionLon = Markers.findOne({ userId: friendsId}).positionLon;
      friendsPicture = Markers.findOne({ userId: friendsId}).img;
      sms = Meteor.users.findOne({_id: friendsId}).profile.smsAddress;


      icon = {
            url : friendsPicture, // url
            scaledSize: new google.maps.Size(40, 40)
          };


 friend = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        map: map,
        lat: friendsPositionLat,
        lon: friendsPositionLon,
        position: new google.maps.LatLng(friendsPositionLat, friendsPositionLon),
        sms : sms,
        icon: icon,
        title: ((Meteor.users.findOne({
              _id: friendsId
            }).profile.name) + ' is here!')
      });


google.maps.event.addListener(friend, 'click', function() {
    map.setCenter(friend.getPosition());
    infowindow.setContent(this.title);
            infowindow.open(map, this);
  });

google.maps.event.addListener(friend, 'dblclick', function() {
             email = this.sms;
             message = (Meteor.user().services.facebook.first_name + " wants to meet up, here are some directions...https://www.google.com/maps/dir/" + (this.lat) + "," + (this.lon) + "/" + (Meteor.user().profile.position.G) + "," + (Meteor.user().profile.position.K));
            Meteor.call('sendEmail', email, message);
            window.alert('SMS sent.', 'success');
          });




    }


}
}