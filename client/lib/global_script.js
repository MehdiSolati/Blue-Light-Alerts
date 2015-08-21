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
            var outcome = "You're off track! (We're getting ready to send an alert)";
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
                  outcome = "You're on track!";
                }
              }
            }else {
              $("#myPathText").text("End of path at box " + Session.get('routeStep'));
            }
            if (offtrack == false){
              //insert code here if off track
              if (Session.get('offTrack') == 0) {
              $("#myPathText").text(outcome).fadeIn('fast').css('color', '#f0ad4e');
              Session.set('offTrack', (Session.get('offTrack')+1));
              console.log("gonna send text in 30");
            } else if (Session.get('offTrack') == 1) {
                var alertMessage = ("Your friend "+Meteor.user().profile.name+" has deviated from their safe path! You should check on them.");
                console.log("gonna send text now");
                  // sendAlert(alertMessage);
                  console.log("sent text");
                  $("#myPathText").text("You've deviated from your path, we're texting your friends!").fadeIn('fast').css('color', '#d9534f');
              Session.set('offTrack', (Session.get('offTrack')+1));
              } else{
$("#myPathText").text("You've deviated from your path, we're texting your friends!").fadeIn('fast').css('color', '#d9534f');
              Session.set('offTrack', (Session.get('offTrack')+1));
              }
              

            } else {
              $("#myPathText").text(outcome).fadeIn('fast').css('color', '#62c462');
              Session.set('offTrack', 0);
            }
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
            if (Session.get('idle') > 4) {

                $("#myPathText").text("You haven't moved in two minutes, we're texting your friends!").css('color', '#d9534f');
                Session.set('idleAlert', true);
              if (Session.get('idle') == 5) {
                var alertMessage = ("Your friend "+Meteor.user().profile.name+" has stalled on their safe path! You should check on them.");
                  // sendAlert(alertMessage);
              }
            }
          }
        })
      }

      sendAlert = function(message) {
  for (i = 0; i< friendList.findOne({userId : Meteor.userId()}).friends.length; i++) {
    var friend = friendList.findOne({userId : Meteor.userId()}).friends[i];
    var number = Meteor.users.findOne({_id : friend}).profile.smsAddress;
    Meteor.call('sendEmail', number, message);
  }
}