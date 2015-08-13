if (Meteor.isClient) {
  Template.index.rendered = function() {
    if (Polylines.findOne({
        _id: Meteor.user().profile.polyline
      }).position === undefined) {
      document.getElementById("recordPath").style.display = "block";
      document.getElementById("resetPath").style.display = "none";
    } else {
      document.getElementById("recordPath").style.display = "none";
      document.getElementById("resetPath").style.display = "block";
    }
  };
  Template.myPath.rendered = function() {
    var recordPath;
    $('#go').click(function() {
      $("#myPathText").hide().text("We're recording your path now! (Hit 'Stop' when done)").fadeIn('fast').css('color', '#62c462');
      navigator.vibrate(1000);
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude,
          position.coords.longitude);
        if (Meteor.user().profile.polyline === undefined) {
          var polylinesId = Polylines.insert({
            userId: (Meteor.user()._id)
          });
          Meteor.users.update({
            _id: Meteor.userId()
          }, {
            $set: {
              'profile.polyline': polylinesId
            }
          });
        }
      })
      recordPath = setInterval(function() {
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
      }, 
      //15000)
      3000)
    });
    $('#stop').click(function() {
      clearInterval(recordPath);
      navigator.vibrate(1000);
      $("#myPathText").hide().text("We stopped your recording! Hold on for refresh.").fadeIn('fast').css('color', '#d9534f');
      window.setTimeout(function() {
        window.location.reload();
      }, 3000);
    });
  };
  Template.myPath.events({
    'click #reset': function() {
      Polylines.update({
        _id: Meteor.user().profile.polyline
      }, {
        $unset: {
          position: null
        }
      });
      navigator.vibrate(1000);
      $("#myPathText").hide().text("Poooof, your path is gone! Hold on for refresh.").fadeIn('fast').css('color', '#f0ad4e');
      window.setTimeout(function() {window.location.reload();}, 3000);
    },
    'click #activateTest':function(){
      Session.set('testMode',true);
      console.log('trigger testmode switch'+Session.get('testMode'));
    },
    'click #toggleTrack':function(){
      
      if(Session.get('trackSwitch')==true){
        Session.set('trackSwitch',false);
        $('#toggleTrack').text('Start Track');
        clearInterval(trackPath);
      }else{
        Session.set('trackSwitch',true);
        trackPath=setInterval(tracking,Session.get('trackRefresh'))
        $('#toggleTrack').text('Stop Track');
      }
    },
    'click #test': function(){
      if (Meteor.user().profile.polyline == undefined) {
        var polylinesId = Polylines.insert({
          userId: (Meteor.user()._id)
          });
        
        Meteor.users.update({
          _id: Meteor.userId()
        }, {
          $set: {
            'profile.polyline': polylinesId
          }
        });
  }

        //hard coded route locations for test
        var flightPlanCoordinates = [
          {'lat':41.304797, 'lng':-72.922947},
          {'lat':41.304610, 'lng':-72.922488},
          {'lat':41.304298, 'lng':-72.921681},
          {'lat':41.303456, 'lng':-72.922043},
          {'lat':41.302731, 'lng':-72.922622}
        ];

        

        //write test route to polylines table
        for(var x=0;x<flightPlanCoordinates.length;x++)
        {
          Polylines.update({
            _id: Meteor.user().profile.polyline
          }, {$addToSet: {
            'position': [41.304987, -72.923408]
          }
        });

          Polylines.update(
            {_id : Meteor.user().profile.polyline}, 
            {$addToSet: {
              'position': [
              flightPlanCoordinates[x].lat, 
              flightPlanCoordinates[x].lng
              ]
            }
          });
          console.log('insert'+flightPlanCoordinates[x].lat +":"+flightPlanCoordinates[x].lng);
        }
    }
  });
}