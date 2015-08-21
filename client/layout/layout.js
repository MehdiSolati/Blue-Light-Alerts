//refresh rates
Session.set('gpsRefresh',1000);

Session.set('routeStep', 0);
//current point difference set to less than 1 meter for idling. 
Session.set('speed', 5);
Session.set('idle', 0);
Session.set('offTrack', 0);
Session.set('start', false);
//hardcode testMode flag true or false, true will overwrite GPS to step north east by .00001 lat and long, or 1 m step lat and long
Session.set('testMode', false);
Session.set('trackRefresh',6000);
Session.set('idleAlert', false);
//hardcode start location here
Session.set('startLat', 41.053209);
Session.set('startLng', -73.539337);
//toggle tracking function
Session.set('trackSwitch',false);


Template.layout.events({
  'click #logout': function(event) {
    Meteor.logout(function(err) {
      if (err)
        throw new Meteor.Error("Logout failed");
    })
  },
  'click #myMapNav': function(event) {
    document.getElementById('myMap').style.display = 'block';
    document.getElementById('myPath').style.display = 'none';
    document.getElementById('myFriends').style.display = 'none';
  },
  // 'click #myPathNav': function(event) {
  //     },
  'click #myFriendsNav': function(event) {
    document.getElementById('myMap').style.display = 'none';
    document.getElementById('myPath').style.display = 'none';
    document.getElementById('myFriends').style.display = 'block';
  },
  'click #myPathNav': function(event) {
    
    document.getElementById('myMap').style.display = 'block';
    document.getElementById('myPath').style.display = 'block';
    document.getElementById('myFriends').style.display = 'none';
    try {
      var myPathCoordinates = [];
      console.log('clicked myPathNav');
      for (var i = 0; i < Polylines.findOne({_id: Meteor.user().profile.polyline}).position.length; i++) {
        lat = Polylines.findOne({_id: Meteor.user().profile.polyline}).position[i][0];
        lon = Polylines.findOne({_id: Meteor.user().profile.polyline}).position[i][1];
        myPathCoordinates.push(new google.maps.LatLng(lat, lon));
      }
      
      var myPath = new google.maps.Polyline({
        path: myPathCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 0.0,
        strokeWeight: 0
      });
      myPath.setMap(map);
      routeBoxer = new RouteBoxer();
      boxes = routeBoxer.box(myPathCoordinates, .02572);
      Session.set('boxRange', boxes);

      drawBoxes(boxes);

      //trackPath = setInterval(tracking, Session.get('trackRefresh'));

      function drawBoxes(boxes) {
        boxpolys = new Array(boxes.length);
        for (var i = 0; i < boxes.length; i++) {
          boxpolys[i] = new google.maps.Rectangle({
            bounds: boxes[i],
            fillOpacity: 0.7,
            fillColor: '#68a1b2',
            strokeOpacity: 0.0,
            strokeColor: '#000000',
            strokeWeight: 0,
            map: map
          });
        }
      }
    } catch (err) {
      //Block of code to handle errors
      console.log('error: ' + err);
    }
  },
});