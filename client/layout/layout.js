Template.layout.events({
'click #logout': function(event) {
        Meteor.logout(function(err){
            if (err) {
                throw new Meteor.Error("Logout failed");
            }
        })
    }
});

Template.layout.events({
'click #myMapNav': function(event) {
    document.getElementById('myMap').style.display = 'block';
    document.getElementById('myPath').style.display = 'none';
    document.getElementById('myFriends').style.display = 'none';

    }
});

Template.layout.events({
'click #myPathNav': function(event) {
    document.getElementById('myMap').style.display = 'block';
    document.getElementById('myPath').style.display = 'block';
    document.getElementById('myFriends').style.display = 'none';

    }
});

Template.layout.events({
'click #myFriendsNav': function(event) {
    document.getElementById('myMap').style.display = 'none';
    document.getElementById('myPath').style.display = 'none';
    document.getElementById('myFriends').style.display = 'block';

    }
});


Template.layout.events({
    'click #myPathNav': function(event) {
  try {
    var myPathCoordinates = [];

  for (var i = 0; i < Polylines.findOne({_id: Meteor.user().profile.polyline}).position.length; i++) {
    lat = Polylines.findOne({_id: Meteor.user().profile.polyline}).position[i][0];
    lon = Polylines.findOne({_id: Meteor.user().profile.polyline}).position[i][1];


myPathCoordinates.push(new google.maps.LatLng(lat, lon));
    }


  

  var myPath = new google.maps.Polyline({
    path: myPathCoordinates,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  myPath.setMap(map);
}
catch(err) {
    //Block of code to handle errors
}
},
});