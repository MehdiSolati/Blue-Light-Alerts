Session.set('routeStep',"not found");
Session.set('speed',1);
Session.set('idle',0);
Session.set('testMode',true);

Session.set('startLat',11.1723);
Session.set('startLng',-93.22823);

Template.layout.events({
'click #logout': function(event) {
        Meteor.logout(function(err){
            if (err) 
                throw new Meteor.Error("Logout failed");
            
        })
    },
'click #myMapNav': function(event) {
    document.getElementById('myMap').style.display = 'block';
    document.getElementById('myPath').style.display = 'none';
    document.getElementById('myFriends').style.display = 'none';

    },
// 'click #myPathNav': function(event) {


//     },
'click #myFriendsNav': function(event) {
    document.getElementById('myMap').style.display = 'none';
    document.getElementById('myPath').style.display = 'none';
    document.getElementById('myFriends').style.display = 'block';

    },
'click #myPathNav': function(event) {
  console.log("clicked on mypath");
          document.getElementById('myMap').style.display = 'block';
    document.getElementById('myPath').style.display = 'block';
    document.getElementById('myFriends').style.display = 'none';

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
        //if test mode is active, adjust dummy locale data by .01
        if(Session.get('testMode')){
          pos = new google.maps.LatLng(lat, lng);
        }else
          var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        if(Session.get('start')===undefined)
          Session.set('start',pos);
        else
          Session.set('lastPos',pos);
        //fire if minimal start distance away from start.
        if(google.maps.geometry.spherical.computeDistanceBetween(Session.get('start'),pos)>Session.get('speed')){
          //fire if greater than min distance from previous pos
          if(google.maps.geometry.spherical.computeDistanceBetween(Session.get('start'),pos)<Session.get('speed')){
            Session.set('idle',0);
            var offtrack=false;
            var outcome="I'm Off Track";
            var boxes = Session.get('boxRange');

            for(var x=0;x<Session.get('boxRange').length && offtrack==false;x++){
              //routeboxer returns CA Objects are long max and min, IA Objects are the Lat max and min, not latlngbounds objects
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
          }
          //fire if less than min distance from previous pos
          else{
            var counter = Session.get('idle');
            Session.set('idle',counter++);
            if(Session.get('idle')>=4){
              console.log('Person has idled for 1 minute, insert panic code here, continue tracking idle time');
            }
          }//end if less than min distance from previous pos
        }//end if greater than min distance from start
        else{
          console.log('you havent moved');
        }
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