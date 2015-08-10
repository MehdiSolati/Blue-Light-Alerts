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

      Polylines.update({
          _id: Meteor.user().profile.polyline
        }, {$addToSet: {
          'position': [position.coords.latitude, position.coords.longitude]
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
        console.log('polyLinesId');
        Meteor.users.update({
          _id: Meteor.userId()
        }, {
          $set: {
            'profile.polyline': polylinesId
          }
        });

  }

        var flightPlanCoordinates = [
          {'lat':40.1,'lng':-72.2},
          {'lat':41.17231789,'lng':-73.228},
          {'lat':42.1,'lng':-73.2}
        ];

        for(var x=0;x<flightPlanCoordinates.length;x++){
                Polylines.update({
          _id: Meteor.user().profile.polyline
        }, {$addToSet: {
          'position': [39.1, -72.2]
        }});

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
        var offtrack=false;
        var outcome="";
        for(var x=0;x<Session.get('boxRange').length && offtrack==false;x++){
          var thisBox = Session.get('boxRange')[x];
          //console.log(thisBox.contains(pos));
          console.log('full item');
          var dr = new google.maps.LatLng(Session.get('boxRange')[x].Ca.j, Session.get('boxRange')[x].Ia.G);
          var ul = new google.maps.LatLng(Session.get('boxRange')[x].Ca.j, Session.get('boxRange')[x].Ia.G);
          var bounds = new google.maps.LatLngBounds(dr,ul);
          var center = bounds.getCenter();
          console.log('center test'+bounds.contains(pos));
          if(bounds.contains(pos)){
            //insert alert code here
            offtrack=true;
            outcome="I'm ok in step "+x+" of my trip.";
          }
          //delete dummy test code and draws
          var center = bounds.getCenter();
          console.log(Session.get('boxRange')[x]);
          console.log('custom bounds below');
          console.log(bounds);
          console.log(bounds.contains(pos));
          console.log('center test'+bounds.contains(center));

        }
        //end silly for loop, actually do stuff here
        if(offtrack){
            //insert alert code here
            console.log("I'm ok in box"+x);
          }else{
            console.log("Off Track Place Call Here");
          }
      });

    }
});
  }
