
const map = L.map('map').setView([30.886398, -87.636688], 10);

var points = [];

// Set up the OSM layer
document.addEventListener("DOMContentLoaded", function() {

    // var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    //     subdomains: 'abcd',
    //     maxZoom: 20
    // }).addTo(map);
    var wmsLayer = L.tileLayer.wms('https://geoint.nrlssc.navy.mil/nrltileserver/wms/?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=FAASectionals&TILED=true&WIDTH=512&HEIGHT=512&SRS=EPSG%3A4326&STYLES=&BBOX=-112.5%2C22.5%2C-90%2C45', {
        layers: 'FAASectionals',
        format: 'image/png',
        opacity: 0.6,
        attribution: '&copy; <a href="https://geoint.nrlssc.navy.mil/#/">NRL</a>'
    }).addTo(map);

    var toggleButton = document.getElementById('toggle-button');
    var sidePanel = document.getElementById('side-panel');

    toggleButton.addEventListener('click', function() {
    sidePanel.classList.toggle('hidden');
    });

    //Get the points
    //For now, let's just query all of the points in the US when we load
    const gh = new Geohash();
    const geohashPrefix = Geohash.encode(41.886, -87.636, 5).substring(0, 5);

    queryEvents("d", 0, 6000);

});

const pirep_light = L.icon({
    iconUrl: 'Graphics/light.png',
    iconSize: [35, 35],
    iconAnchor: [22, 38],
    popupAnchor: [-3, -76]
});

const pirep_moderate = L.icon({
    iconUrl: 'Graphics/moderate.png',
    iconSize: [35, 35],
    iconAnchor: [22, 38],
    popupAnchor: [-3, -76]
});

const pirep_severe = L.icon({
    iconUrl: 'Graphics/severe.png',
    iconSize: [35, 35],
    iconAnchor: [22, 38],
    popupAnchor: [-3, -76]
});



// Example usage:

// const startTime = Math.floor(Date.now() / 1000) - 3600;  // Last hour
// const endTime = Math.floor(Date.now() / 1000);

// queryEvents(geohashPrefix, startTime, endTime);
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
        console.log(points);
        addPointsToMap();
      } else {
        console.log(`Error: ${xhr.status}`);
      }
    };
    xhr.send(body);
}



// Function to add points to the map using the custom icon
function addPointsToMap() {
    console.log(points)
    const tableBody = document.getElementById('pointsTable').getElementsByTagName('tbody')[0];
    points.forEach(point => {

        // Add the point to the table
        const row = tableBody.insertRow();
        const cell = row.insertCell(0);
        
        var marker = L.marker([point.latitude.N, point.longitude.N], { icon: pirep_severe });
        console.log(point.severity.N)
        switch(point.severity.N){
            case "1": 
                marker = L.marker([point.latitude.N, point.longitude.N], { icon: pirep_light }); 
                cell.style.backgroundColor = "#b3ffca";
                cell.textContent = "UA /TM " + point.timestamp.N + "/FL " + point.altitude.N + "/TP " + point.aircraft.S;
                break;
            case "3": 
                marker = L.marker([point.latitude.N, point.longitude.N], { icon: pirep_moderate }); 
                cell.style.backgroundColor = "#ffc56f";
                cell.textContent = "UA /TM " + point.timestamp.N + "/FL " + point.altitude.N + "/TP " + point.aircraft.S;
                break;
            case "5": 
                marker = L.marker([point.latitude.N, point.longitude.N], { icon: pirep_severe }); 
                cell.style.backgroundColor = "#ffc6c6";
                cell.textContent = "UUA /TM " + point.timestamp.N + "/FL " + point.altitude.N + "/TP " + point.aircraft.S;
                break;
            default:
                console.log("default");
        }

        marker.bindPopup(cell.textContent);
        marker.addTo(map);
    });
}
