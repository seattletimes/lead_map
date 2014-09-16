require([
  "pym",
  "leaflet",
  "text!_popupTemplate.html",
  "icanhaz"
], function(pym, L, template) {

  var child = new pym.Child({
    polling: 500
  });

  //hack hack hack
  child.id = "lead-map";

  console.log(window.location);

  ich.addTemplate("popup", template);

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

  var popup = L.popup();

  window.ranges.forEach(function(range) {
    var inspected = window.inspections[range.osha] || [];
    if (inspected && !(inspected instanceof Array)) {
      inspected = [inspected];
    }
    inspected.forEach(function(inspection) {
      if (inspection.currentPenalty != inspection.initialPenalty) {
        inspection.reduced = true;
      }
    });
    var marker = new L.Marker([range.lat, range.lng], {
      icon: new L.DivIcon({
        className: range.osha in window.inspections ? "range inspected" : "range",
        iconSize: [10, 10]
      }),
      zIndexOffset: inspected ? 1000 : undefined
    });
    marker.addTo(map);
    marker.data = {
      building: range,
      inspections: inspected,
      multiple: inspected.length > 1
    };
    marker.addEventListener("click", function(e) {
      var data = e.target.data;
      var templated = ich.popup(data);
      popup.setLatLng(e.target.getLatLng());
      popup.setContent(templated);
      popup.openOn(map);
    });
  });
  
});
