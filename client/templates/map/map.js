Template.map.rendered = function() {
  if (!Session.get('map'))
    gmaps.initialize();
}
Template.map.destroyed = function() {
  Session.set('map', false);
}

function detectBrowser() {
  var useragent = navigator.userAgent;
  var mapdiv = document.getElementById("map-canvas");
  if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1) {
    mapdiv.style.width = '100%';
    mapdiv.style.height = '100%';
  } else {
    mapdiv.style.width = '600px';
    mapdiv.style.height = '800px';
  }
}