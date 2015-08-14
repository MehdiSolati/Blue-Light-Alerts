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
      recordPath = setInterval(recording, 15000)
    });
    $('#stop').click(function() {
      clearInterval(recordPath);
      navigator.vibrate(1000);
      $("#myPathText").hide().text("We stopped your recording! Hold on for refresh.").fadeIn('fast').css('color', '#d9534f');
      window.setTimeout(function() {
        window.location.reload();
      }, 3000);
    });
    $('#testModeControls').hide();
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
      if(Session.get('testMode')==false){
      Session.set('testMode',true);
        navigator.geolocation.getCurrentPosition(function(position) {
           var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
          Session.set('startLat',pos.lat());
          Session.set('startLng',pos.lng());
        });
      console.log('trigger testmode switch'+Session.get('testMode'));
      $('#testModeControls').show();
      $('#activateTest').text('deactivate test mode');
    }else{
      Session.set('testMode',false);
      $('#testModeControls').hide();
    }
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

    /*'click #test': function(){
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
          {'lat':41.053096, 'lng':-73.539518},
          {'lat':41.051974, 'lng':-73.539572},
          {'lat':41.052038, 'lng':-73.542020}
        ];

        //write test route to polylines table
        for(var x=0;x<flightPlanCoordinates.length;x++)
        {
          Polylines.update({
            _id: Meteor.user().profile.polyline
          }, {$addToSet: {
            'position': [41.0531, -73.53983]
          }
        });

          Polylines.update(
            {_id : Meteor.user().profile.polyline}, 
            {$addToSet: {
              'position': [
              flightPlanCoordinates[x].lat, 
              flightPlanCoordinates[x].lng]
              }
            });
          console.log('insert'+flightPlanCoordinates[x].lat +":"+flightPlanCoordinates[x].lng);
        }
    },*/
    'click #incLat':function(){
      Session.set('latOffset',Session.get('latOffset')+Session.get('step'));
      $('#latOffset').val(latOffset);
    },
    'click #decLat':function(){
      Session.set('latOffset',Session.get('latOffset')-Session.get('step'));
      $('#latOffset').val(Session.get('latOffset'));
    },
    'click #incLng':function(){
      var lngOffset = Session.get('lngOffset');
      Session.set('lngOffset',Session.get('lngOffset')+Session.get('step'));
    },
    'click #decLng':function(){
      var lngOffset = Session.get('lngOffset');
      Session.set('lngOffset',lngOffset-Session.get('step'));
    },
    'click #manualLoc':function(event,template){
      event.preventDefault();
      Session.set('step',((template.find('#step').value/111666.615)*(Session.get('gpsRefresh')/1000)).toFixed(10));
      Session.set('meterStep',template.find('#step').value);
      Session.set('startLat',template.find('#testLat').value);
      Session.set('startLng',template.find('#testLng').value);
    },
    'click #zero':function(){
      Session.set('latOffset',0);
      Session.set('lngOffset',0)
      Session.set('step',0.0000089552);
      Session.set('meterStep',1);
    },
  });
}

Template.myPath.helpers({
    'step':function(){
      return Session.get('meterStep');
    },
    'startLat':function(){
      return Session.get('startLat');
    },
    'startLng':function(){
      return Session.get('startLng');
    },
    'latOffset':function(){
      return Session.get('latOffset');
    },
    'lngOffset':function(){
      return Session.get('lngOffset');
    }
})