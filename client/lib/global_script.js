// Lat & Lon
Session.set("lat", null);
Session.set("lng", null);
// Navbar Settings For Spacebars
Session.set("myMap", true);
Session.set("myPath", false);
Session.set("myFriends", false);
// Action Button Sessions
Session.set("safeWalk", false);
Session.set("followMe", false);

// sets your location as default
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var locationMarker = null;
    if (locationMarker){
      // return if there is a locationMarker bug
      return;
    }

    
    Session.set("lat", position.coords["latitude"]);
    Session.set("lng", position.coords["longitude"]);

   gmaps.initialize();
   gmaps.myLocation();
   
   setInterval(function(){
    Session.set("lat", position.coords["latitude"]);
    Session.set("lng", position.coords["longitude"]);
    
    if (Session.get("followMe") === true){
    gmaps.center();
    }
    
    gmaps.myLocation();
    }, 3000);

  },
  function(error) {
    console.log("Error: ", error);
  },
  {
    enableHighAccuracy: true
  }
  );
}