var map = L.map("map").setView([17.810782, -91.533937], 12);

var osmLayer = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

/* var satelliteLayer = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "&copy; Esri &copy; OpenStreetMap contributors"
  });
 */

  var satelliteLayer = new L.tileLayer(
    "https://storage.googleapis.com/global-surface-water/tiles2020/transitions/{z}/{x}/{y}.png", {
      format: "image/png",
      maxZoom: 13,
      errorTileUrl: "https://storage.googleapis.com/global-surface-water/downloads_ancillary/blank.png",
      attribution: "2016 EC JRC/Google"
    });

var transitions = new L.tileLayer(
  "https://storage.googleapis.com/global-surface-water/tiles2021/transitions/{z}/{x}/{y}.png", {
    format: "image/png",
    maxZoom: 13,
    errorTileUrl: "https://storage.googleapis.com/global-surface-water/downloads_ancillary/blank.png",
    attribution: "2016 EC JRC/Google"
  });

/* var marker = L.marker([17.810782, -91.533937]).addTo(map);
marker.bindPopup("<b>HOLA!</b><br>AQUI ESTOY YO.").openPopup();
 */
/* var circle = L.circle([17.810782, -91.533937], {
  color: "red",
  fillColor: "#f03",
  fillOpacity: 0.5,
  radius: 500,
}).addTo(map);
circle.bindPopup("I am a circle.");
 */
var popup = L.popup();
function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);
}
map.on("click", onMapClick);

var sideBySideControl = null;

function activarSideBySide() {
  osmLayer.addTo(map);
  satelliteLayer.addTo(map);
  transitions.addTo(map);

  sideBySideControl = L.control.sideBySide(satelliteLayer, transitions).addTo(map);

  map.dragging.disable();

  document.getElementById("activateSide").innerText = "Desactivar comparación";
}

function desactivarSideBySide() {
  map.removeLayer(satelliteLayer);
  map.removeLayer(transitions);

  map.dragging.enable();

  if (sideBySideControl) {
    map.removeControl(sideBySideControl);
    sideBySideControl = null;
  }

  document.getElementById("activateSide").innerText = "Activar comparación";
}

document.getElementById("activateSide").addEventListener("click", function () {
  if (sideBySideControl === null) {
    activarSideBySide();
  } else {
    desactivarSideBySide();
  }
});
