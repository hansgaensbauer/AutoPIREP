//Global for storing points
var points = [];

//Symbols
const pirep_light = L.icon({
    iconUrl: 'Graphics/light.png',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -20]
});

const pirep_moderate = L.icon({
    iconUrl: 'Graphics/moderate.png',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -20]
});

const pirep_severe = L.icon({
    iconUrl: 'Graphics/severe.png',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -20]
});

const pirep_light_small = L.icon({
    iconUrl: 'Graphics/light_small.png',
    iconSize: [10, 10],
    iconAnchor: [5, 5],
    popupAnchor: [0, -10]
});

const pirep_moderate_small = L.icon({
    iconUrl: 'Graphics/moderate_small.png',
    iconSize: [10, 10],
    iconAnchor: [5, 5],
    popupAnchor: [0, -10]
});

const pirep_severe_small = L.icon({
    iconUrl: 'Graphics/severe_small.png',
    iconSize: [10, 10],
    iconAnchor: [5, 5],
    popupAnchor: [0, -10]
});

var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
});

//Draw TAC lines
const tacline_color = "black";
const tacline_weight = 1;
var tac_klamath_falls = L.rectangle([[40, -125], [44.5, -117]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_seattle = L.rectangle([[44.5, -125], [49, -117]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_san_francisco = L.rectangle([[40, -125], [36, -118]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_los_angeles = L.rectangle([[32, -122], [36, -115]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_great_falls = L.rectangle([[44.5, -117], [49, -109]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_salt_lake_city = L.rectangle([[40, -117], [44.5, -109]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_las_vegas = L.rectangle([[36-(25/60), -118], [40, -111]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_phoenix = L.rectangle([[30, -116], [36-(25/60), -109]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_billings = L.rectangle([[44.5, -109], [49, -101]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_cheyenne = L.rectangle([[40, -109], [44.5, -101]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_denver = L.rectangle([[36-(25/60), -111], [40, -104]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_albuquerque = L.rectangle([[32, -109], [36, -102]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_el_paso = L.rectangle([[28, -109], [32, -103]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_twin_cities = L.rectangle([[44.5, -101], [49, -93]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_omaha = L.rectangle([[40, -101], [44.5, -93]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_wichita = L.rectangle([[36, -104], [40, -97]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_dallas_ft_worth = L.rectangle([[32, -102], [36, -95]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_san_antonio = L.rectangle([[28, -103], [32, -97]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_brownsville = L.rectangle([[24, -103], [28, -97]], {color: tacline_color, weight: tacline_weight, fill: false}), 
tac_green_bay = L.rectangle([[44, -93], [48+(20/60), -85]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_chicago = L.rectangle([[40, -93], [44, -85]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_kansas_city = L.rectangle([[36, -97], [40, -90]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_st_louis = L.rectangle([[36, -91], [40, -84]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_memphis = L.rectangle([[32, -95], [36, -88]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_houston = L.rectangle([[28, -97], [32, -91]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_new_orleans = L.rectangle([[28, -91], [32, -85]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_lake_huron = L.rectangle([[44, -85], [48, -77]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_detroit = L.rectangle([[40, -85], [44, -77]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_cincinnati = L.rectangle([[36, -85], [40, -78]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_atlanta = L.rectangle([[32, -88], [36, -81]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_jacksonville = L.rectangle([[28, -85], [32, -79]], {color: tacline_color, weight: tacline_weight, fill: false}), //Guess
tac_miami = L.rectangle([[24, -83], [28, -77]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_halifax = L.rectangle([[44, -69], [48, -61]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_montreal = L.rectangle([[44, -77], [48, -69]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_new_york = L.rectangle([[40, -77], [44, -69]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_washington = L.rectangle([[36, -79], [40, -72]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_charlotte = L.rectangle([[32, -82], [36, -75.5]], {color: tacline_color, weight: tacline_weight, fill: false});

tac_klamath_falls.bindTooltip("KLAMATH FALLS", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_seattle.bindTooltip("SEATTLE", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_san_francisco.bindTooltip("SAN FRANCISCO", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_los_angeles.bindTooltip("LOS ANGELES", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_great_falls.bindTooltip("GREAT FALLS", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_salt_lake_city.bindTooltip("SALT LAKE CITY", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_las_vegas.bindTooltip("LAS VEGAS", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_phoenix.bindTooltip("PHOENIX", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_billings.bindTooltip("BILLINGS", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_cheyenne.bindTooltip("CHEYENNE", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_denver.bindTooltip("DENVER", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_albuquerque.bindTooltip("ALBUQUERQUE", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_el_paso.bindTooltip("EL PASO", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_twin_cities.bindTooltip("TWIN CITIES", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_omaha.bindTooltip("OMAHA", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_wichita.bindTooltip("WICHITA", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_dallas_ft_worth.bindTooltip("DALLAS-FT WORTH", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_san_antonio.bindTooltip("SAN ANTONIO", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_brownsville.bindTooltip("BROWNSVILLE", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_green_bay.bindTooltip("GREEN BAY", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_chicago.bindTooltip("CHICAGO", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_kansas_city.bindTooltip("KANSAS CITY", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_st_louis.bindTooltip("ST LOUIS", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_memphis.bindTooltip("MEMPHIS", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_houston.bindTooltip("HOUSTON", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_new_orleans.bindTooltip("NEW ORLEANS", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_lake_huron.bindTooltip("LAKE HURON", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_detroit.bindTooltip("DETROIT", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_cincinnati.bindTooltip("CINCINNATI", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_atlanta.bindTooltip("ATLANTA", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_jacksonville.bindTooltip("JACKSONVILLE", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_miami.bindTooltip("MIAMI", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_halifax.bindTooltip("HALIFAX", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_montreal.bindTooltip("MONTREAL", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_new_york.bindTooltip("NEW YORK", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_washington.bindTooltip("WASHINGTON", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();
tac_charlotte.bindTooltip("CHARLOTTE", {permanent: true, direction: "center", className: 'tacregion', interactive: true}).openTooltip();

var taclines = L.layerGroup([
    tac_klamath_falls, 
    tac_seattle,
    tac_san_francisco,
    tac_los_angeles,
    tac_great_falls,
    tac_salt_lake_city,
    tac_las_vegas,
    tac_phoenix,
    tac_billings,
    tac_cheyenne,
    tac_denver,
    tac_albuquerque,
    tac_el_paso,
    tac_twin_cities,
    tac_omaha,
    tac_wichita,
    tac_dallas_ft_worth,
    tac_san_antonio,
    tac_brownsville,
    tac_green_bay,
    tac_chicago,
    tac_kansas_city,
    tac_st_louis,
    tac_memphis,
    tac_houston,
    tac_new_orleans,
    tac_lake_huron,
    tac_detroit,
    tac_cincinnati,
    tac_atlanta,
    tac_jacksonville,
    tac_miami,
    tac_halifax,
    tac_montreal,
    tac_new_york,
    tac_washington,
    tac_charlotte,
]);

taclines.eachLayer(function(layer){
    if (layer instanceof L.Rectangle) {
        layer.on('tooltipopen', function(e) {
            var tooltipElement = e.tooltip.getElement();
            if (tooltipElement) {
                tooltipElement.style.cursor = 'pointer';
                tooltipElement.onclick = function() {
                    map.fitBounds(layer.getBounds());
                    setSmallSymbols(false);
                    lastzoomLevel = map.getZoom();
                };
            }
        });
    }
});

var reports = L.layerGroup();

var map = L.map('map', {
    center: [37, -95],
    zoom: 5,
    layers: [CartoDB_Positron, reports, taclines]
});

var overlayMaps = {
    "PIREPS": reports,
    "TAC": taclines
};

var lastzoomLevel = 5

map.on('zoomend', function () {
    var zoomLevel = map.getZoom();
    console.log(zoomLevel);
    console.log(lastzoomLevel);
    console.log("\n");
    var elements = document.getElementsByClassName('leaflet-tooltip');
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if(zoomLevel >= 5){
            element.style.visibility = "visible";
            element.style.fontSize = "11pt";
        }else{
            element.style.visibility = "hidden";
        }
    }
    if(zoomLevel <= 6){//zoomLevel == 5 && lastzoomLevel == 6){
        setSmallSymbols(true);
    }
    if(zoomLevel > 6){//} && lastzoomLevel == 5){
        setSmallSymbols(false);
    }
    lastzoomLevel = zoomLevel;
});

document.addEventListener("DOMContentLoaded", function() {
    const start = Date.now();
    queryEvents("d", start - (24*60*60*1000), start);
    var layerControl = L.control.layers(null, overlayMaps).addTo(map);
});

function setSmallSymbols(small){
    if(small){
        reports.eachLayer(function(layer){
            switch(layer.severity){
                case "1": 
                    layer.setIcon(pirep_light_small);
                    break;
                case "3": 
                    layer.setIcon(pirep_moderate_small);
                    break;
                case "5": 
                    layer.setIcon(pirep_severe_small);
                    break;
                default:
                    console.log("default");
            }
        });
    } else {
        reports.eachLayer(function(layer){
            switch(layer.severity){
                case "1": 
                    layer.setIcon(pirep_light);
                    break;
                case "3": 
                    layer.setIcon(pirep_moderate);
                    break;
                case "5": 
                    layer.setIcon(pirep_severe);
                    break;
                default:
                    console.log("default");
            }
        });
    }
}

function queryEvents(geohash, startTime, endTime) {
    //request for d,9,c,and f to cover continental US
    const url = "https://zohmomjv73.execute-api.us-east-1.amazonaws.com/prod/turbulence"
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-Type", "application/json");
    const body_json = {
        "geohash": "",
        "start_timestamp": startTime,
        "end_timestamp": endTime
    }
    var body = JSON.stringify(body_json);

    body_json.geohash = "d";
    var body = JSON.stringify(body_json);
    xhr.send(body);
    console.log(body);
    var response = JSON.parse(xhr.response); 
    if(response.Count > 0){
        points = points.concat(response["Items"]);
    }

    body_json.geohash = "9";
    body = JSON.stringify(body_json);
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(body);
    response = JSON.parse(xhr.response);
    if(response.Count > 0){
        points = points.concat(response["Items"]);
    }

    body_json.geohash = "c";
    body = JSON.stringify(body_json);
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(body);
    response = JSON.parse(xhr.response);
    if(response.Count > 0){
        points = points.concat(response["Items"]);
    }

    body_json.geohash = "f";
    body = JSON.stringify(body_json);
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(body);
    response = JSON.parse(xhr.response);
    if(response.Count > 0){
        points = points.concat(response["Items"]);
    }

    addPointsToMap(); 

}

function timestampToZulu(timestamp){
    let date = new Date(parseInt(timestamp));
    let hours = date.getUTCHours();
    console.log(date);
    let minutes = date.getUTCMinutes();
    return(String(hours).padStart(2, '0') + String(minutes).padStart(2, '0') + "Z")
}

function addPointsToMap() {
    points.forEach(point => {
	var geohash = base32.charAt(~~(Math.random() * 32))
	console.log(geohash)
        var latlng = Geohash.decode(point.geohash.S + geohash);
	
        var marker = L.marker([latlng.lat, latlng.lon], { icon: pirep_severe });
        switch(point.severity.N){
            case "1": 
                marker = L.marker([latlng.lat, latlng.lon], {icon: pirep_light_small, className: 'report_marker', zIndexOffset: 0}); 
                marker.bindPopup("UA /TM. " + timestampToZulu(point.timestamp.N) + "/FL " + point.altitude.N + "/TP " + point.aircraft.S);
                break;
            case "3": 
                marker = L.marker([latlng.lat, latlng.lon], {icon: pirep_moderate_small, className: 'report_marker', zIndexOffset: 400}); 
                marker.bindPopup("UA /TM " + timestampToZulu(point.timestamp.N) + "/FL " + point.altitude.N + "/TP " + point.aircraft.S);
                break;
            case "5": 
                marker = L.marker([latlng.lat, latlng.lon], {icon: pirep_severe_small, className: 'report_marker', zIndexOffset: 800}); 
                marker.bindPopup("UUA /TM " + timestampToZulu(point.timestamp.N) + "/FL " + point.altitude.N + "/TP " + point.aircraft.S);
                break;
            default:
                console.log("default");
        }
        marker.severity = point.severity.N;
        marker.addTo(reports);
    });
}

//Show all functionality
var toggleButton = document.getElementById('show-all-button');
toggleButton.addEventListener('click', function() {
    map.removeLayer(taclines);
    reports.addTo(map);
    map.flyTo([37, -95], 5);
    reports.eachLayer(function(layer){
        switch(layer.severity){
            case "1": 
                layer.setIcon(pirep_light_small);
                break;
            case "3": 
                layer.setIcon(pirep_moderate_small);
                break;
            case "5": 
                layer.setIcon(pirep_severe_small);
                break;
            default:
                console.log("default");
        }
    });
    lastzoomLevel = 5
    });

  
