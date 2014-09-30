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

  var isMobile = window.matchMedia && window.matchMedia("(max-width: 480px)").matches;

  ich.addTemplate("popup", template);

  var waBounds = [
    [49.01, -124.90],
    [45.54, -116.84]
  ];

  var limits = [
    [52, -127],
    [43, -114]
  ];
  
  var map = L.map("map", {
    minZoom: 5,
    zoomControl: isMobile ? false : true
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
  map.setMaxBounds(limits);

  window.addEventListener("resize", function() {
    map.fitBounds(waBounds)
  });

  var popup = L.popup({
    //maxWidth: 200
  });

  window.ranges.sort(function(a, b) {
    var inspectable = ~~a.inspectable - ~~b.inspectable;
    return inspectable || (~~a.osha - ~~b.osha);
  });

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
    if (range.type.toLowerCase() == "both") {
      range.type = "Indoor and outdoor";
    }
    var className = "range";
    var z = 0;
    if (range.inspectable) {
      className += " inspectable";
      z = 1000;
      if (range.osha in window.inspections) {
        className += " inspected";
        z = 2000;
      }
    }
    var marker = new L.Marker([range.lat, range.lng], {
      icon: new L.DivIcon({
        className: className,
        iconSize: isMobile? [20, 20] : [13, 13]
      }),
      zIndexOffset: z
    });
    marker.addTo(map);
    marker.data = {
      building: range,
      inspectable: !!range.inspectable,
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
