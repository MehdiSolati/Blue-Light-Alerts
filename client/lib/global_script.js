tracking = function() {
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
           //console.log("dist between last point curr point: "+google.maps.geometry.spherical.computeDistanceBetween(Session.get('lastPos'),pos));
          if (google.maps.geometry.spherical.computeDistanceBetween(Session.get('lastPos'), pos) > Session.get('speed')) {
            Session.set('start', true);
            Session.set('lastPos', pos);
            Session.set('idle', 0);
            Session.set('idleAlert', false);
            var offtrack = false;
            var outcome = "I'm Off Track";
            var boxes = Session.get('boxRange');
            //traverse next two bounding boxes to check for location
            if (Session.get('routeStep') < Session.get('boxRange').length){
              console.log(Session.get('boxRange').length);
              for (var x = 0; x < Session.get('boxRange').length /*&& x < Session.get('routeStep') + 2*/ && offtrack == false; x++) {
                //routeboxer returns CA Objects are long max and min, IA Objects are the Lat max and min, not latlngbounds objects
                var ne = new google.maps.LatLng(Session.get('boxRange')[x].Ia.j, Session.get('boxRange')[x].Ca.G);
                var sw = new google.maps.LatLng(Session.get('boxRange')[x].Ia.G, Session.get('boxRange')[x].Ca.j);
                var bounds = new google.maps.LatLngBounds(sw, ne);
                if (bounds.contains(pos)) {
                  Session.set('routeStep', x);
                  //insert code here if on track
                  offtrack = true;
                  outcome = "I'm ok, in step " + Session.get('routeStep') + " of my trip.";
                }
              }
            }else {
              $("#myPathText").text("End of path at box " + Session.get('routeStep'));
            }
            if (offtrack == false){
              //insert code here if off track
            }
              $("#myPathText").text(outcome);
            Session.set('lastPos', pos);
          }
          //fire if less than min distance from previous pos
          else {
            if(Session.get('idle')!=0){
              $("#myPathText").hide().text("You haven't moved in " + ((Session.get('idle')) * 0.5) + " minute(s).").fadeIn('fast').css('color', '#f0ad4e');
            }
            navigator.vibrate(1000);
            var counter = Session.get('idle') + 1;
            Session.set('idle', counter);
            //fire idle responses for 1 minute if user has stopped, 2 minutes if user has
            if (Session.get('idle') >= 4 && Session.get('idleAlert') == false) {
              if (Session.get('start')==true) {
                //insert idle alert for 4 clicks
                $("#myPathText").text('Person has idled for 1 minute, insert panic code here, continue tracking idle time');
                Session.set('idleAlert', true);
              } else if (Session.get('idle') >= 8) {
                //insert idle alert for 8 clicks, user hasn't started yet
                $("#myPathText").text('Person has idled for 2 minutes at start, insert panic code here, continue tracking idle time');
                Session.set('idleAlert', true);
              }
            }
          }
        })
      }

recording = function() {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = new google.maps.LatLng(position.coords.latitude,
            position.coords.longitude);
          //if testmode is active overwrite locale data with dummy data
          if (Session.get('testMode') == true) {
            pos = new google.maps.LatLng(Session.get('startLat'), Session.get('startLng'))
          }
          console.log(pos.lat() + " : lng " + pos.lng());
          Polylines.update({
            _id: Meteor.user().profile.polyline
          }, {
            $addToSet: {
              'position': [pos.lat(), pos.lng()]
            }
          });
          console.log(pos);
        })
      }


