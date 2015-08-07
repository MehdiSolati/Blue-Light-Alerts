Template.myPath.rendered = function(){
	var recordPath;
    $('#go').click(function(){
      



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

  },2000)
      
    
  });

$('#stop').click(function(){
      clearInterval(recordPath);
      console.log("You stopped the button");
      window.location.reload();
    });

    };



    Template.myPath.events({
    'click #reset': function() {

      Polylines.update({_id : Meteor.user().profile.polyline}, {$unset: {position : null}});
      window.location.reload();
  
}});
