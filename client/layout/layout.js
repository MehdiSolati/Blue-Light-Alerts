Session.set('routeStep', 0);
//current point difference set to less than 1 meter for idling. 
Session.set('speed', 1);
Session.set('idle', 0);
Session.set('start', false);
//hardcode testMode flag true or false, true will overwrite GPS to step north east by .00001 lat and long, or 1 m step lat and long
Session.set('testMode', true);
Session.set('idleAlert', false);
//hardcode start location here
Session.set('startLat', 41.173);
Session.set('startLng', -73.226);
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
      boxes = routeBoxer.box(myPathCoordinates, .02286);
      Session.set('boxRange', boxes);
      drawBoxes(boxes);
      trackPath = setInterval(function() {
        navigator.geolocation.getCurrentPosition(function(position) {
          //if test mode is active, adjust dummy locale data by .01
          if (Session.get('testMode') == true) {
            pos = new google.maps.LatLng(Session.get('startLat'), Session.get('startLng'));
          } else
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          if (Session.get('lastPos') == undefined) {
            Session.set('lastPos', pos);
          }
          //fire if greater than min distance from previous pos
          // console.log(Session.get('lastPos'));
          // console.log(pos);
          // console.log("greater than min speed: "+google.maps.geometry.spherical.computeDistanceBetween(Session.get('lastPos'),pos));
          if (google.maps.geometry.spherical.computeDistanceBetween(Session.get('lastPos'), pos) > Session.get('speed')) {
            Session.set('start', true);
            Session.set('lastPos', pos);
            Session.set('idle', 0);
            Session.set('idleAlert', false);
            var offtrack = false;
            var outcome = "I'm Off Track";
            var boxes = Session.get('boxRange');
            //traverse next two bounding boxes to check for location
            if (Session.get('routeStep') < Session.get('boxRange').length)
              for (var x = Session.get('routeStep'); x < Session.get('boxRange').length && x < Session.get('routeStep') + 2 && offtrack == false; x++) {
                //routeboxer returns CA Objects are long max and min, IA Objects are the Lat max and min, not latlngbounds objects
                var ne = new google.maps.LatLng(Session.get('boxRange')[x].Ia.j, Session.get('boxRange')[x].Ca.G);
                var sw = new google.maps.LatLng(Session.get('boxRange')[x].Ia.G, Session.get('boxRange')[x].Ca.j);
                var bounds = new google.maps.LatLngBounds(sw, ne);
                if (bounds.contains(pos)) {
                  Session.set('routeStep', x);
                  //insert alert code here
                  offtrack = true;
                  outcome = "I'm ok, in step " + Session.get('routeStep') + " of my trip.";
                }
              } else {
              $("#myPathText").text("End of path at box " + Session.get('routeStep'));
            }
            if (offtrack == false)
              $("#myPathText").text(outcome);
            Session.set('lastPos', pos);
          }
          //fire if less than min distance from previous pos
          else {
            $("#myPathText").hide().text("You haven't moved in " + ((Session.get('idle')) * 0.5) + " minute(s).").fadeIn('fast').css('color', '#f0ad4e');
            navigator.vibrate(1000);
            var counter = Session.get('idle') + 1;
            Session.set('idle', counter);
            //fire idle responses for 1 minute if user has stopped, 2 minutes if user has
            if (Session.get('idle') >= 4 && Session.get('idleAlert') == false) {
              if (Session.get('start')) {
                $("#myPathText").text('Person has idled for 1 minute, insert panic code here, continue tracking idle time');
                Session.set('idleAlert', true);
              } else if (Session.get('idle') >= 8) {
                $("#myPathText").text('Person has idled for 2 minutes at start, insert panic code here, continue tracking idle time');
                Session.set('idleAlert', true);
              }
            }
          }
        })
      }, 30000)

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