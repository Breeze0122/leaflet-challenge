// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Function to do the marker size based on the magnitud (2.1.1)
  function markerSize(magnitude) {
    return magnitude * 4;
  }
  // Function to do the marker color (2.1.1 )
  function markerColor(depth) {
    if (depth > 100) return '#d73027';
    else if (depth > 80) return '#fc8d59';
    else if (depth > 60) return '#fee08b';
    else if (depth > 40) return '#d9ef8b';
    else if (depth > 200) return '#91cf60';
    else return '#1a9850';
  }

  // create the layer with each feature (2.2 popups with info additional)

  let earthquakes = L.geoJSON(earthquakeData, {
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
  });  
  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers (2.3 Create a title)
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Global Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  legend.onAdd = function(map) {
    let div = L.DomUtil.create('div', 'info legend'),
    depths = [-10, 10, 30, 50, 70, 90],
    labels = [];

    // Interance to go for each depths
    for (let i = 0; i < depths.length; i++) {
      div.innerHTML +=
        '<i style="background:' + markerColor(depths[i] + 1) + '"></i> ' +
        depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
    }

    return div;
  };

  legend.addTo(myMap);
}