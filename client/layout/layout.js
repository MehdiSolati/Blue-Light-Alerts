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
console.log('clicked myPathNav');
  for (var i = 0; i < Polylines.findOne({_id: Meteor.user().profile.polyline}).position.length; i++) {
    lat = Polylines.findOne({_id: Meteor.user().profile.polyline}).position[i][0];
    lon = Polylines.findOne({_id: Meteor.user().profile.polyline}).position[i][1];
    console.log('test polylines retrieval');
    console.log(lat);
    console.log(lon);

myPathCoordinates.push(new google.maps.LatLng(lat, lon));
    }

    console.log(myPathCoordinates);


  

  var myPath = new google.maps.Polyline({
    path: myPathCoordinates,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  myPath.setMap(map);


  routeBoxer = new RouteBoxer();
  boxes = routeBoxer.box(myPathCoordinates, .1);
  Session.set('boxRange', boxes);
  drawBoxes(boxes);

  trackPath = setInterval(function(){
    console.log("inside trackpath");
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var offtrack=false;
        var outcome="";
        for(var x=0;x<Session.get('boxRange').length && offtrack==false;x++){
          var thisBox = Session.get('boxRange')[x];

          var dr = new google.maps.LatLng(Session.get('boxRange')[x].Ca.j, Session.get('boxRange')[x].Ia.G);
          var ul = new google.maps.LatLng(Session.get('boxRange')[x].Ca.j, Session.get('boxRange')[x].Ia.G);
          var bounds = new google.maps.LatLngBounds(dr,ul);

          if(bounds.contains(pos)){
            //insert alert code here
            offtrack=true;
            outcome="I'm ok in step "+x+" of my trip.";
          }
        }
        if(offtrack){
            //insert alert code here
            console.log(outcome);
          }else{console.log("Off Track Place Call Here");}
      })

  },15000)

  function drawBoxes(boxes) {

      boxpolys = new Array(boxes.length);
      for (var i = 0; i < boxes.length; i++) {

        boxpolys[i] = new google.maps.Rectangle({
          bounds: boxes[i],
          fillOpacity: 0,
          strokeOpacity: 1.0,
          strokeColor: '#000000',
          strokeWeight: 3,
          map: map
        });
      }
    }
}
catch(err) {
    //Block of code to handle errors
    console.log('error: '+err);
}
},
});