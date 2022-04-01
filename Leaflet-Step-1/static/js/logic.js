// Store our API endpoint as queryUrl.
//var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-01-01&endtime=2021-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
// Perform a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
  //console.log(data);
  console.log(data.features);
  // Using the features array sent back in the API data, create a GeoJSON layer, and add it to the map.
  let earthquakeData = data.features;
  // 1.
  // Pass the features to a createFeatures() function:
  createFeatures(earthquakeData);
});
// 2.
 // this function picks colors for the circle data points
 function getColor(depth)
 {
     if (depth > 90)
       return "#FC0505"
     else if(depth > 70)
       return "#FC7905"
     else if(depth > 50)
       return "#FCC705"
     else if(depth > 30)
       return "#9EFC05"
     else
       return "#FCFC05"
 }
function createFeatures(earthquakeData) {
  // make a function that binds the popups
  function onEachFeature(feature, layer)
  {
    layer.bindPopup(`<h2>${feature.properties.place}</h2>
                    <hr>
                    <p>${new Date(feature.properties.time)}</p>
                    <hr>
                    <b>Magnitude: </b> ${feature.properties.mag}<br>
                    <b>Depth: </b> ${feature.geometry.coordinates[2]}`);
  }
 
  // this function uses the magnitude to calculate the radius
  function getRadius(magnitude)
  {
      if (magnitude === 0)
        return 1;
      else
        return magnitude * 5;
  }
  // this function returns the style data based on the depth of the the earthquake
  function styleInfo(feature)
  {
      return {
        opacity: 1,
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: getColor(feature.geometry.coordinates[2]),
        radius: getRadius(feature.properties.mag),
        stroke: true
      };
  }
  // Save the earthquake data in a variable.
  // creates a GeoJSON layer that contains the features array
  var earthquakes = L.geoJSON(earthquakeData,
    {
        // turn each marker into a circle
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng);
        },
        // to adjust the style for each circle marker, do the following:
        style: styleInfo,
        onEachFeature: onEachFeature
    });
  // Pass the earthquake data to a createMap() function.
  createMap(earthquakes);
}
// 3.
// createMap() takes the earthquake data and incorporates it into the visualization:
function createMap(earthquakes) {
  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })
  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });
  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };
  // Creat an overlays object.
  var overlays = {
    "Earthquakes": earthquakes
  }
  // Create a new map.
  // Edit the code to add the earthquake data to the layers.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });
  // Create a layer control that contains our baseMaps.
  // Be sure to add an overlay Layer that contains the earthquake GeoJSON.
  L.control.layers(baseMaps, overlays, {
    collapsed: false
  }).addTo(myMap);

var legend = L.control({position:"bottomright"});
legend.onAdd=function(map) { 
  var div = L.DomUtil.create("div","info legend")
  var depth = [0,30,50,70,90];
  for (var i = 0; i < depth.length; i++) {
    div.innerHTML += `<i style="background:` + getColor(depth[i] + 1) + `"></i> ` + depth[i] + (depth[i + 1] ? `&ndash;` + depth[i + 1] + `<br>` : `+`);
    }
 
  return div



}

legend.addTo(myMap)


}