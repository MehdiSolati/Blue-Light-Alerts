//refresh rates
Session.set('gpsRefresh',1000);

Session.set('routeStep', 0);
//current point difference set to less than 1 meter for idling. 
Session.set('speed', 1);
Session.set('idle', 0);
Session.set('start', false);
//hardcode testMode flag true or false, true will overwrite GPS to step north east by .00001 lat and long, or 1 m step lat and long
Session.set('testMode', false);
Session.set('trackRefresh',5000);
Session.set('idleAlert', false);
//hardcode start location here
Session.set('startLat', 41.0528);
Session.set('startLng', -73.5398);
Session.set('latOffset',0);
Session.set('lngOffset',0);
Session.set('step',0.0000089552);
Session.set('meterStep',1);
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
    console.log("clicked on mypath");
    document.getElementById('myMap').style.display = 'block';
    document.getElementById('myPath').style.display = 'block';
    document.getElementById('myFriends').style.display = 'none';
    try {
      var myPathCoordinates = [];
      console.log('clicked myPathNav');
      for (var i = 0; i < Polylines.findOne({_id: Meteor.user().profile.polyline}).position.length; i++) {
        lat = Polylines.findOne({_id: Meteor.user().profile.polyline}).position[i][0];
        lon = Polylines.findOne({_id: Meteor.user().profile.polyline}).position[i][1];
        console.log('test polylines retrieval');
        console.log(lat);
        console.log(lon);
        myPathCoordinates.push(new google.maps.LatLng(lat, lon));
      }
      console.log(myPathCoordinates);
      var myPath = new google.maps.Polyline({
        path: myPathCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 0.0,
        strokeWeight: 0
      });
      myPath.setMap(map);
      routeBoxer = new RouteBoxer();
      boxes = routeBoxer.box(myPathCoordinates, .04572);
      Session.set('boxRange', boxes);
      console.log("prior to drawBoxes");
      drawBoxes(boxes);
      console.log('after drawBoxes');
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