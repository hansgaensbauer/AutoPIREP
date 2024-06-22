// Initialize the map
const map = L.map('map').setView([41.886398, -87.636688], 10); // Initial view set to a default location

// Set up the OSM layer
var wmsLayer = L.tileLayer.wms('https://geoint.nrlssc.navy.mil/nrltileserver/wms/?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=FAASectionals&TILED=true&WIDTH=512&HEIGHT=512&SRS=EPSG%3A4326&STYLES=&BBOX=-112.5%2C22.5%2C-90%2C45', {
    layers: 'FAASectionals',
    format: 'image/png',
    attribution: '&copy; <a href="https://geoint.nrlssc.navy.mil/#/">NRL</a>'
}).addTo(map);

// Define the custom icon
const customIcon = L.icon({
    iconUrl: 'symbol.png', // Path to your custom icon
    iconSize: [38, 38], // Size of the icon
    iconAnchor: [22, 38], // Point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // Point from which the popup should open relative to the iconAnchor
});

// Hardcoded points for testing
const points = [
    { lat: 41.886, lon: -87.636, severity: 'Light', altitude: 6000, time: 4234, airframe: "Cessna 152"},
    { lat: 41.886, lon: -87.736, severity: 'Light', altitude: 5600, time: 2334, airframe: "Cessna 172"  },
    { lat: 41.685398, lon: -86.636288, severity: 'Med', altitude: 5600, time: 5634, airframe: "Cessna 172"  },
    { lat: 41.7, lon: -88, severity: 'Light', altitude: 6100, time: 2343, airframe: "Piper J-3"  },
];

// Function to fetch points from the server
async function fetchPoints() {
    const response = await fetch('http://localhost:3000/api/points');
    const points = await response.json();
    return points;
}

// Function to add points to the map using the custom icon
function addPointsToMap() {
    const tableBody = document.getElementById('pointsTable').getElementsByTagName('tbody')[0];
    points.forEach(point => {
        // Create a marker with the custom icon
        const marker = L.marker([point.lat, point.lon], { icon: customIcon });
        
        // Bind a popup to the marker with additional information
        marker.bindPopup(`
            <b>Location:</b> ${point.lat}, ${point.lon}<br>
            <b>Severity:</b> ${point.severity}
        `);

        // Add the marker to the map
        marker.addTo(map);

        // Add the point to the table
        const row = tableBody.insertRow();
        const cell_time = row.insertCell(0);
        const cell_altitude = row.insertCell(1);
        const cell_severity = row.insertCell(2);
        const cell_airframe = row.insertCell(3);
        cell_time.textContent = point.time;
        cell_altitude.textContent = point.altitude;
        cell_severity.textContent = point.severity;
        cell_airframe.textContent = point.airframe;
    });
}

// Add points to the map
addPointsToMap();