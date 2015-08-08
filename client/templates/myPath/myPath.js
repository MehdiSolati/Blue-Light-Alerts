

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
  
}});
