require([
  "leaflet"
], function(L) {

  var waBounds = [
    [49.01, -124.90],
    [45.54, -116.84]
  ];
  
  var map = L.map("map", {
    maxBounds: waBounds,
    minZoom: 6
  });
  window.map = map;

  var tiles = L.tileLayer(
    "http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png",
    {
      subdomains: "abcd".split(""),
      scheme: "xyz"
    }
  );

  tiles.addTo(map);

  map.fitBounds(waBounds);

  window.addEventListener("resize", function() {
    map.fitBounds(waBounds)
  });

  window.ranges.forEach(function(range) {
    var marker = new L.Marker([range.lat, range.lng], {
      icon: new L.DivIcon({
        className: range.osha in window.inspections ? "range inspected" : "range",
        iconSize: [10, 10]
      }),
      zIndexOffset: range.osha in window.inspections ? 1000 : undefined
    });
    marker.addTo(map);
    marker.data = range;
    marker.addEventListener("click", function(e) { console.log(e.target.data) });
  });
  
});
