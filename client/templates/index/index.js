Template.index.helpers(AccountsTemplates.atFormHelpers);

Template.index.events({
    'click #followMe': function(event) {
      if (Session.get("followMe")===false){
        Session.set("followMe", true);
        console.log("Follow Me True");
      } else {
        Session.set("followMe", false);
        console.log("Follow Me False");
      }
  },
  
    'click #safeWalk': function(event) {
      if (Session.get("safeWalk")===false){
        Session.set("safeWalk", true);
        console.log("Safe Walk True");
      } else {
        Session.set("safeWalk", false);
        console.log("Safe Walk False");
      }
  }
});

(function (global) {
    "use strict";
 
    function onDeviceReady () {
        document.addEventListener("online", onOnline, false);
        document.addEventListener("resume", onResume, false);
        loadMapsApi();
    }
 
    function onOnline () {
        loadMapsApi();
    }
 
    function onResume () {
        loadMapsApi();
    }
 
    function loadMapsApi () {
        if(navigator.connection.type === Connection.NONE || google.maps) {
            return;
        }
        $.getScript('https://maps.googleapis.com/maps/api/js?key=API_KEY&sensor=true&callback=onMapsApiLoaded');
    }
 
    global.onMapsApiLoaded = function () {
        // Maps API loaded and ready to be used.
        var map = new google.maps.Map(document.getElementById("map"), {});
    };
 
    document.addEventListener("deviceready", onDeviceReady, false);
})(window);