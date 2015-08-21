if (Meteor.isClient) {
  // Template.index.rendered = function() {
  //   if (Polylines.findOne({
  //       _id: Meteor.user().profile.polyline
  //     }).position === undefined) {
  //     document.getElementById("recordPath").style.display = "block";
  //     document.getElementById("resetPath").style.display = "none";
  //   } else {
  //     document.getElementById("recordPath").style.display = "none";
  //     document.getElementById("resetPath").style.display = "block";
  //   }
  // };
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
    'click #activateTest':function(){
      Session.set('testMode',true);
      console.log('trigger testmode switch'+Session.get('testMode'));
    },
    'click #track':function(){
      
      if(Session.get('trackSwitch')==true){
        Session.set('trackSwitch',false);
        $('#track').text('Start Track');
        clearInterval(trackPath);
      }else{
        Session.set('trackSwitch',true);
        trackPath=setInterval(tracking,Session.get('trackRefresh'))
        $('#track').text('Stop Track');
      }
    },
    'click #test': function(){
      Polylines.update({
        _id: Meteor.user().profile.polyline
      }, {
        $unset: {
          position: null
        }
      });
      
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
          {'lat':41.053041, 'lng':-73.539436},
          {'lat':41.052576, 'lng':-73.539466},
          {'lat':41.053167, 'lng':-73.540681},
          {'lat':41.053217, 'lng':-73.540093},
          {'lat':41.053199, 'lng':-73.539452}
        ];

        

        //write test route to polylines table
        for(var x=0;x<flightPlanCoordinates.length;x++)
        {
          Polylines.update({
            _id: Meteor.user().profile.polyline
          }, {$addToSet: {
            'position': [41.053199, -73.539452]
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