if (Meteor.isClient) {

Template.index.rendered = function(){
if(Polylines.findOne({_id : Meteor.user().profile.polyline}).position === undefined){

document.getElementById("recordPath").style.display = "block";
document.getElementById("resetPath").style.display = "none";

} else {

document.getElementById("recordPath").style.display = "none";
document.getElementById("resetPath").style.display = "block";

}

    };



Template.myPath.rendered = function(){
	var recordPath;
    $('#go').click(function(){
      alert("We're recording your path now! Just hit 'Stop' to stop the recording.");



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

  }})
    
recordPath = setInterval(function(){
  navigator.geolocation.getCurrentPosition(function(position) {
     var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
//if testmode is active overwrite locale data with dummy data
     if(Session.get('testMode')){
      pos = new google.maps.LatLng(Session.get('startLat'), Session.get('startLng'))
     }

     console.log(pos.lat()+" : lng "+pos.lng());
      Polylines.update({
          _id: Meteor.user().profile.polyline
        }, {$addToSet: {
          'position': [pos.lat(), pos.lng()]

        }
          
        });
    })

  },15000)
      
    
  });

$('#stop').click(function(){
      clearInterval(recordPath);
      alert("We stopped your recording! Get ready to see your path!!!");
      window.location.reload();
    });

    };



    Template.myPath.events({
    'click #reset': function() {

      Polylines.update({_id : Meteor.user().profile.polyline}, {$unset: {position : null}});
      alert("Poooof, your path is gone! You can record a new path now.");
      window.location.reload();  
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
          {'lat':42.0531,'lng':-73.53983},
          {'lat':42.0531,'lng':-74.53983}
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
              flightPlanCoordinates[x].lng
              ]
            }
          });
          console.log('insert'+flightPlanCoordinates[x].lat +":"+flightPlanCoordinates[x].lng);
        }
    },
    'click #testLocation': function(){
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        //if testmode is active overwrite locale data with dummy data
        if(Session.get('testMode')){
          pos = new google.maps.LatLng(Session.get('startLat'), Session.get('startLng'))
        }
        var offtrack=false;
        var outcome="";
            for(var x=Session.get('routeStep');x<Session.get('boxRange').length&&x<Session.get('routeStep')+2 && offtrack==false;x++){
              //routeboxer returns CA Objects are long max and min, IA Objects are the Lat max and min, not latlngbounds objects
              console.log("iterations "+x)
              var ne = new google.maps.LatLng(Session.get('boxRange')[x].Ia.j, Session.get('boxRange')[x].Ca.G);
              var sw = new google.maps.LatLng(Session.get('boxRange')[x].Ia.G, Session.get('boxRange')[x].Ca.j);
              var bounds = new google.maps.LatLngBounds(sw,ne);

              if(bounds.contains(pos)){
                Session.set('routeStep',x);
                //insert alert code here
                offtrack=true;
                outcome="I'm ok, in step "+Session.get('routeStep')+" of my trip.";
              }
            }
            console.log(outcome);
      });

    }
});
  }
