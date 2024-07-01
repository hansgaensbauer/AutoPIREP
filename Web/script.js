

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
tac_san_francisco = L.rectangle([[40, -125], [36, -118]], {color: tacline_color, weight: tacline_weight, fill: false}), //Guess
tac_los_angeles = L.rectangle([[32, -122], [36, -114]], {color: tacline_color, weight: tacline_weight, fill: false}), //Guess
tac_great_falls = L.rectangle([[44.5, -117], [49, -109]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_salt_lake_city = L.rectangle([[40, -117], [44.5, -109]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_las_vegas = L.rectangle([[35, -118], [40, -111]], {color: tacline_color, weight: tacline_weight, fill: false}), //Guess
tac_phoenix = L.rectangle([[30, -116], [35, -109]], {color: tacline_color, weight: tacline_weight, fill: false}), //Guess
tac_billings = L.rectangle([[44.5, -109], [49, -101]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_cheyenne = L.rectangle([[40, -109], [44.5, -101]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_denver = L.rectangle([[35, -111], [40, -104]], {color: tacline_color, weight: tacline_weight, fill: false}), //Guess
tac_albuquerque = L.rectangle([[32, -109], [36, -102]], {color: tacline_color, weight: tacline_weight, fill: false}), //Guess
tac_el_paso = L.rectangle([[28, -109], [32, -103]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_twin_cities = L.rectangle([[44.5, -101], [49, -93]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_omaha = L.rectangle([[40, -101], [44.5, -94]], {color: tacline_color, weight: tacline_weight, fill: false}), //Guess
tac_wichita = L.rectangle([[36, -104], [40, -97]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_dallas_ft_worth = L.rectangle([[32, -102], [36, -94]], {color: tacline_color, weight: tacline_weight, fill: false}), //Guess
tac_san_antonio = L.rectangle([[28, -103], [32, -97]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_brownsville = L.rectangle([[24, -103], [28, -97]], {color: tacline_color, weight: tacline_weight, fill: false}), 
tac_green_bay = L.rectangle([[44, -94], [48.5, -85]], {color: tacline_color, weight: tacline_weight, fill: false}), //Guess
tac_chicago = L.rectangle([[40, -94], [44, -85]], {color: tacline_color, weight: tacline_weight, fill: false}), //Guess
tac_kansas_city = L.rectangle([[36, -97], [40, -89]], {color: tacline_color, weight: tacline_weight, fill: false}), //Guess
tac_st_louis = L.rectangle([[36, -91], [40, -83]], {color: tacline_color, weight: tacline_weight, fill: false}), //Guess
tac_memphis = L.rectangle([[32, -94], [36, -87]], {color: tacline_color, weight: tacline_weight, fill: false}), //Guess
tac_houston = L.rectangle([[28, -97], [32, -91]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_new_orleans = L.rectangle([[28, -91], [32, -85]], {color: tacline_color, weight: tacline_weight, fill: false}), //Guess
tac_lake_huron = L.rectangle([[44, -85], [48, -77]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_detroit = L.rectangle([[40, -85], [44, -77]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_cincinnati = L.rectangle([[36, -85], [40, -78]], {color: tacline_color, weight: tacline_weight, fill: false}), //Guess
tac_atlanta = L.rectangle([[32, -87], [36, -81]], {color: tacline_color, weight: tacline_weight, fill: false}), //Guess
tac_jacksonville = L.rectangle([[28, -85], [32, -78]], {color: tacline_color, weight: tacline_weight, fill: false}), //Guess
tac_miami = L.rectangle([[24, -83], [28, -77]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_halifax = L.rectangle([[44, -69], [48, -61]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_montreal = L.rectangle([[44, -77], [48, -69]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_new_york = L.rectangle([[40, -77], [44, -69]], {color: tacline_color, weight: tacline_weight, fill: false}),
tac_washington = L.rectangle([[36, -79], [40, -72]], {color: tacline_color, weight: tacline_weight, fill: false}), //Guess
tac_charlotte = L.rectangle([[32, -82], [36, -75]], {color: tacline_color, weight: tacline_weight, fill: false}); //Guess

tac_klamath_falls.bindTooltip("KLAMATH FALLS", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_seattle.bindTooltip("SEATTLE", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_san_francisco.bindTooltip("SAN FRANCISCO", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_los_angeles.bindTooltip("LOS ANGELES", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_great_falls.bindTooltip("GREAT FALLS", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_salt_lake_city.bindTooltip("SALT LAKE CITY", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_las_vegas.bindTooltip("LAS VEGAS", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_phoenix.bindTooltip("PHOENIX", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_billings.bindTooltip("BILLINGS", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_cheyenne.bindTooltip("CHEYENNE", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_denver.bindTooltip("DENVER", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_albuquerque.bindTooltip("ALBUQUERQUE", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_el_paso.bindTooltip("EL PASO", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_twin_cities.bindTooltip("TWIN CITIES", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_omaha.bindTooltip("OMAHA", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_wichita.bindTooltip("WICHITA", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_dallas_ft_worth.bindTooltip("DALLAS-FT WORTH", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_san_antonio.bindTooltip("SAN ANTONIO", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_brownsville.bindTooltip("BROWNSVILLE", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_green_bay.bindTooltip("GREEN BAY", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_chicago.bindTooltip("CHICAGO", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_kansas_city.bindTooltip("KANSAS CITY", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_st_louis.bindTooltip("ST LOUIS", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_memphis.bindTooltip("MEMPHIS", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_houston.bindTooltip("HOUSTON", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_new_orleans.bindTooltip("NEW ORLEANS", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_lake_huron.bindTooltip("LAKE HURON", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_detroit.bindTooltip("DETROIT", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_cincinnati.bindTooltip("CINCINNATI", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_atlanta.bindTooltip("ATLANTA", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_jacksonville.bindTooltip("JACKSONVILLE", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_miami.bindTooltip("MIAMI", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_halifax.bindTooltip("HALIFAX", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_montreal.bindTooltip("MONTREAL", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_new_york.bindTooltip("NEW YORK", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_washington.bindTooltip("WASHINGTON", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();
tac_charlotte.bindTooltip("CHARLOTTE", {permanent: true, direction: "center", className: 'tacregion'}).openTooltip();

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

map.on('zoomend', function () {
    var zoomLevel = map.getZoom();
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
});



var points = [];

document.addEventListener("DOMContentLoaded", function() {
    queryEvents("d", 0, 6000);
    var layerControl = L.control.layers(null, overlayMaps).addTo(map);
});

const pirep_light = L.icon({
    iconUrl: 'Graphics/light.png',
    iconSize: [35, 35],
    iconAnchor: [22, 38],
    popupAnchor: [-5, -40]
});

const pirep_moderate = L.icon({
    iconUrl: 'Graphics/moderate.png',
    iconSize: [35, 35],
    iconAnchor: [22, 38],
    popupAnchor: [-5, -40]
});

const pirep_severe = L.icon({
    iconUrl: 'Graphics/severe.png',
    iconSize: [35, 35],
    iconAnchor: [22, 38],
    popupAnchor: [-5, -40]
});



async function queryEvents(geohash, startTime, endTime) {

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://zohmomjv73.execute-api.us-east-1.amazonaws.com/prod/turbulence");
    xhr.setRequestHeader("Content-Type", "application/json");
    const body = JSON.stringify({
        "geohash": geohash,
        "start_timestamp": startTime,
        "end_timestamp": endTime
    });
    xhr.onload = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        points = JSON.parse(xhr.response)["Items"];
        addPointsToMap();
      } else {
        console.log(`Error: ${xhr.status}`);
      }
    };
    xhr.send(body);
}



// Function to add points to the map using the custom icon
function addPointsToMap() {
    // const tableBody = document.getElementById('pointsTable').getElementsByTagName('tbody')[0];
    points.forEach(point => {

        // Add the point to the table
        // const row = tableBody.insertRow();
        // const cell = row.insertCell(0);
        
        var marker = L.marker([point.latitude.N, point.longitude.N], { icon: pirep_severe });
        // console.log(point.severity.N)
        switch(point.severity.N){
            case "1": 
                marker = L.marker([point.latitude.N, point.longitude.N], {icon: pirep_light, className: 'report_marker'}); 
                marker.bindPopup("UA /TM " + point.timestamp.N + "/FL " + point.altitude.N + "/TP " + point.aircraft.S);
                break;
            case "3": 
                marker = L.marker([point.latitude.N, point.longitude.N], {icon: pirep_moderate, className: 'report_marker'}); 
                marker.bindPopup("UA /TM " + point.timestamp.N + "/FL " + point.altitude.N + "/TP " + point.aircraft.S);
                break;
            case "5": 
                marker = L.marker([point.latitude.N, point.longitude.N], {icon: pirep_severe, className: 'report_marker'}); 
                marker.bindPopup("UUA /TM " + point.timestamp.N + "/FL " + point.altitude.N + "/TP " + point.aircraft.S);
                break;
            default:
                console.log("default");
        }

        // marker.bindPopup(cell.textContent);
        marker.addTo(reports);
        // reports.addTo(map);
    });
}
