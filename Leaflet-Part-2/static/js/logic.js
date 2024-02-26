// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";

let tectonicPlatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
// perform a GET request to the tectonic plates url
d3.json(tectonicPlatesURL).then(function(plateData) {
  // create the tectonic plates layer
  let tectonicPlates = L.geoJSON(plateData, {
    color: "red",
    weight: 2
  });

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features, tectonicPlates);
});

function createFeatures(earthquakeData,tectonicPlates) {
  createMap(L.geoJSON(earthquakeData, {
    onEachFeature: function(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]} km<br>${new Date(feature.properties.time)}</p>`);
    },
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    }
  }), tectonicPlates);
}
  

function createMap(earthquakes, tectonicPlates) {


  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes,
    "Tectonic Plates": tectonicPlates
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3,
    layers: [street, earthquakes, tectonicPlates]
  });


  tectonicPlates.addTo(myMap);
}