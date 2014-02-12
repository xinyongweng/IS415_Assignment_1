//global variables
var map; //map object

//begin script when window loads
window.onload = initialize(); //->

//the first function called once the html is loaded
function initialize(){
  //<-window.onload
  setMap(); //->
};


var population;
var testmap;
var lineMap;
var proportionSymbol_Layer;
var northSouthLine;
var northEastLine;
var eastWestLine;
var downTownLine;
var circleLine;

// Function for  add info when hover choropleth Map
var info = L.control();

		info.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'info');
			this.update();
			return this._div;
		};

		info.update = function (props) {
			this._div.innerHTML = '<h4>Singapore population density </h4>' +  (props ?
				'<b>'+ props.myData_AGE65_OVER + " people over 65" 
				: 'Hover over a state');
		};

		
//Function to highlight over choropleth Map
function highlightFeature(e) {
			var layer = e.target;

			layer.setStyle({
				weight: 5,
				color: '#666',
				dashArray: '',
				fillOpacity: 0.7
			});

			if (!L.Browser.ie && !L.Browser.opera) {
				layer.bringToFront();
			}

			info.update(layer.feature.properties);
		}

		

		function resetHighlight(e) {
			population.resetStyle(e.target);
			info.update();
		}
		
		// get color depending on population density value for choropleth Map
		function getColor(d) {
			return d > 4877 ? '#0B0B61' :
				   d > 2565  ? '#0404B4' :
				   d > 1547  ? '#5858FA' :
			       d > 589  ? '#8181F7' :
			                  '#E0E0F8';
		}
		
		function zoomToFeature(e) {
			map.fitBounds(e.target.getBounds());
		}

		function onEachFeature(feature, layer) {
			
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: zoomToFeature
			});
		}

		
var legend = L.control({position: 'bottomright'});

		legend.onAdd = function (map) {

			var div = L.DomUtil.create('div', 'info legend'),
				grades = [0, 600, 1500, 2500, 4800],
				labels = [],
				from, to;

			for (var i = 0; i < grades.length; i++) {
				from = grades[i];
				to = grades[i + 1];

				labels.push(
					'<i style="background:' + getColor(from + 1) + '"></i> ' +
					from + (to ? '&ndash;' + to : '+'));
			}

			div.innerHTML = labels.join('<br>');
			return div;
		};
		
		
		var poplegend2 = L.control({position: 'bottomright'});

		poplegend2.onAdd = function (map) {

			var div = L.DomUtil.create('div', 'info legend'),
				grades = [0, 10, 20, 50],
				labels = [],
				from, to;

			for (var i = 0; i < grades.length; i++) {
				from = grades[i];
				to = grades[i + 1];

				labels.push(
					'<i style="background:' + getColor(from + 1) + '"></i> ' +
					from + (to ? '&ndash;' + to : '+'));
			}

			div.innerHTML = labels.join('<br>');
			return div;
		};
		
function style(feature) {
//console.log(feature.properties["Population_data_over_55_Population_size"]);
			return {
				weight: 2,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.7,
				fillColor: getColor(feature.properties.myData_AGE65_OVER)
			};
		}
		
var baseballIcon = L.icon({
        iconUrl: 'images/elderly.png',
        iconSize: [32, 37],
        iconAnchor: [16, 37],
        popupAnchor: [0, -28]
    });

		
var geojsonMarkerOptions = {
				fillColor: "#FF4000",
				color: "#FF4000",
				weight: 1,
				opacity: 1,
				fillOpacity: 0.8
			};		
		

//Style for different LineMap
		
//NSLine
var northSouthStyle = {
				"color": "#FF0000",
				"weight": 3,
				"opacity": 0.75
			};
var eastWestStyle = {
				"color": "#088A08",
				"weight": 3,
				"opacity": 0.75
			};
var northEastStyle = {
				"color": "#A901DB",
				"weight": 3,
				"opacity": 0.75
			};
var circleLineStyle = {
				"color": "#DBA901",
				"weight": 3,
				"opacity": 0.75
			};
var downtownLineStyle = {
				"color": "#08088A",
				"weight": 3,
				"opacity": 0.75
			};			


		
//set basemap parameters
function setMap() {
  //<-initialize()
  
  //create  the map and set its initial view
  map = L.map('map', { zoomControl: false }).setView([1.355312,103.827068], 11);
  
  //add the tile layer to the map
  var layer = L.tileLayer(
    'http://{s}.tile.osm.org/{z}/{x}/{y}.png', 
    {
		  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	  }).addTo(map);
    };
	
	var zoomFS = new L.Control.ZoomFS();
	// add custom zoom control
	map.addControl(zoomFS);
    lc = L.control.locate({
	follow: true
}).addTo(map);

 var loadedStyle = {color:'red', opacity: 1.0, fillOpacity: 1.0, weight: 2, clickable: false};
        L.Control.FileLayerLoad.LABEL = '<i class="fa fa-folder-open"></i>';
        L.Control.fileLayerLoad({
            fitBounds: true,
            layerOptions: {style: loadedStyle,
                           pointToLayer: function (data, latlng) {
                              return L.circleMarker(latlng, {style: style});
                           }},
        }).addTo(map);


map.on('startfollowing', function() {
    map.on('dragstart', lc.stopFollowing);
}).on('stopfollowing', function() {
    map.off('dragstart', lc.stopFollowing);
});
map.on('enterFullscreen', function(){
if(window.console) window.console.log('enterFullscreen');
});
map.on('exitFullscreen', function(){
if(window.console) window.console.log('exitFullscreen');
});

map.on('overlayremove', function (eventLayer) {
			if (eventLayer.name === 'population census') {
				console.log("remove");
				legend.removeFrom(map);
				info.removeFrom(map);
			}
		});
		
		map.on('overlayadd', function (eventLayer) {
			if (eventLayer.name === 'population census') {
				console.log("add");
				legend.addTo(map);
				info.addTo(map);
			}
		});
//Layer for Mrt LineMap

northSouthLine = L.geoJson(nSLine, {
				style: northSouthStyle
			});
			
northEastLine = L.geoJson(northEastLine, {
				style: northEastStyle
			});
eastWestLine = L.geoJson(eastWestLine, {
				style: eastWestStyle
			});
downTownLine = L.geoJson(downTownLine, {
				style: downtownLineStyle
			});
circleLine = L.geoJson(circleLine, {
				style: circleLineStyle
			});

lineMap = L.layerGroup([northSouthLine, northEastLine, eastWestLine, downTownLine, circleLine]);




proportionSymbol_Layer = L.geoJson(hospital, {
				pointToLayer: function (feature, latlng) {
					console.log("test");
					var value = parseInt(feature.properties['Ward_A']);
					if (value == 0){
						value = 0;
					}
					return L.circleMarker(latlng, geojsonMarkerOptions).setRadius(Math.sqrt(value/ 40000) * 150 + 7)
							.bindPopup("<B>Hospital: </B>" + feature.properties['Hospital_Name'] + "<br /><B>Price: $</B>" + feature.properties['Ward_A']
							);
				}
			})
			
population = new L.geoJson(population, {
    style: style,
    onEachFeature: onEachFeature
})

			
elderlyCentre = new L.geoJson(elderlyCareCentre, {
    pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: baseballIcon});
        }, onEachFeature: function (feature, layer) { layer.bindPopup(feature.properties.Name); }
})
	

	console.log("My first geoweb mapping application")

var markers = L.markerClusterGroup({ showCoverageOnHover: false });
markers.addLayer(elderlyCentre);

map.addLayer(markers);
map.fitBounds(markers.getBounds());

var overlayMaps = {
    "population census": population,
    "Elderly Centre": markers,
	"Mrt Price": lineMap,
	"Hospital Prices": proportionSymbol_Layer
};
L.control.layers(null,overlayMaps).addTo(map);

