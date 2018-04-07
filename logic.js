// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"      
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log(data);
  createFeatures(data.features);

});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place + 
      "</h3><hr><p>" + new Date(feature.properties.time) +
      " Magnitude: " + feature.properties.mag + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    // Create the circle marker with different colors and sizes based on the Magnitude
    pointToLayer: function (feature, latlng) {
      var color;
      var g = 255;
      var r = Math.floor(255-80*feature.properties.mag);
      var b = Math.floor(255-80*feature.properties.mag);
      color= "rgb("+r+" ,"+g+","+ b+")"
      
      var geojsonMarkerOptions = {
        radius: 4*feature.properties.mag,
        fillColor: color,
        color: "grey",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}


function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiYmVoZXNodGVoIiwiYSI6ImNqZm5heXd0djB0ajIzMG52Nmdpd3o4bDQifQ.tk-LiH5tznPhSnVjS7jsvg");

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiYmVoZXNodGVoIiwiYSI6ImNqZm5heXd0djB0ajIzMG52Nmdpd3o4bDQifQ.tk-LiH5tznPhSnVjS7jsvg"); 

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      35.689, 51.3890
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });
  //L.circle([50.5, 30.5], 200).addTo(myMap)
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  
// Create a color legend to display information about our marker
function getColor(d) {
  return d < 1 ? 'rgb(225,255,225)' :
        d < 2  ? 'rgb(225,255,225)' :
        d < 3  ? 'rgb(195,255,195)' :
        d < 4  ? 'rgb(165,255,165)' :
        d < 5  ? 'rgb(135,255,135)' :
        d < 6  ? 'rgb(105,255,105)' :
        d < 7  ? 'rgb(75,255,75)' :
        d < 8  ? 'rgb(45,255,45)' :
        d < 9  ? 'rgb(15,255,15)' :
                    'rgb(0,255,0)';
}

// Create a legend to display information about our map
var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
  grades = [0, 1, 2, 3, 4, 5, 6, 7, 8],
  labels = [];
  
  //Create the html option for legend

  div.innerHTML+='Magnitude<br><hr>'

  // loop through our density intervals and generate a label with a colored square for each marker
  for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
}

return div;
}; //legend

legend.addTo(myMap);

}
