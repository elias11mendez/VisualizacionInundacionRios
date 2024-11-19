var map = L.map("map").setView([17.810782, -91.533937], 10);

// Control de escala
L.control.scale({
  position: 'bottomright',
  maxWidth: 200,
  metric: true,
  imperial: true,
  updateWhenIdle: false
}).addTo(map);

// Capas base
var openstreetmap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors"
});

var cartoLightLayer = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
});

var esriLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var osmLayer = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
});

osmLayer.addTo(map);

// Capas de datos
var capasDatos = {
  "2018": L.tileLayer("https://storage.googleapis.com/global-surface-water/tiles2018/transitions/{z}/{x}/{y}.png", {
    format: "image/png",
    maxZoom: 19,
    errorTileUrl: "https://storage.googleapis.com/global-surface-water/downloads_ancillary/blank.png",
    attribution: "2016 EC JRC/Google"
  }),
  "2019": L.tileLayer("https://storage.googleapis.com/global-surface-water/tiles2019/transitions/{z}/{x}/{y}.png", {
    format: "image/png",
    maxZoom: 19,
    errorTileUrl: "https://storage.googleapis.com/global-surface-water/downloads_ancillary/blank.png",
    attribution: "2016 EC JRC/Google"
  }),
  "2020": L.tileLayer("https://storage.googleapis.com/global-surface-water/tiles2020/transitions/{z}/{x}/{y}.png", {
    format: "image/png",
    maxZoom: 19,
    errorTileUrl: "https://storage.googleapis.com/global-surface-water/downloads_ancillary/blank.png",
    attribution: "2016 EC JRC/Google"
  }),
  "2021": L.tileLayer("https://storage.googleapis.com/global-surface-water/tiles2021/transitions/{z}/{x}/{y}.png", {
    format: "image/png",
    maxZoom: 19,
    errorTileUrl: "https://storage.googleapis.com/global-surface-water/downloads_ancillary/blank.png",
    attribution: "2016 EC JRC/Google"
  })
};

// Lógica para Side-by-Side
var leftLayer, rightLayer;
var sideBySideControl = null;

function activarSideBySide() {
  var leftYear = document.getElementById("leftLayer").value;
  var rightYear = document.getElementById("rightLayer").value;

  leftLayer = capasDatos[leftYear];
  rightLayer = capasDatos[rightYear];

  map.dragging.disable();

  for (var key in capasDatos) {
    map.removeLayer(capasDatos[key]);
  }

  osmLayer.addTo(map);
  leftLayer.addTo(map);
  rightLayer.addTo(map);

  if (sideBySideControl) {
    map.removeControl(sideBySideControl);
    sideBySideControl = null;
  }

  sideBySideControl = L.control.sideBySide(leftLayer, rightLayer).addTo(map);
  document.getElementById("activateSide");

  document.querySelector(".selector-container").style.display = "block";
}

function desactivarSideBySide() {
  if (leftLayer) map.removeLayer(leftLayer);
  if (rightLayer) map.removeLayer(rightLayer);

  map.dragging.enable();

  if (sideBySideControl) {
    map.removeControl(sideBySideControl);
    sideBySideControl = null;
  }

  osmLayer.addTo(map);
  document.getElementById("activateSide");

  document.querySelector(".selector-container").style.display = "none";
}

document.getElementById("activateSide").addEventListener("click", function () {
  if (sideBySideControl === null) {
    activarSideBySide();
  } else {
    desactivarSideBySide();
  }
});

function manejarCambio() {
  var leftYear = document.getElementById("leftLayer").value;
  var rightYear = document.getElementById("rightLayer").value;

  if (leftYear && rightYear) {
    activarSideBySide();
  }
}

document.getElementById("leftLayer").addEventListener("change", manejarCambio);
document.getElementById("rightLayer").addEventListener("change", manejarCambio);

var baseLayers = {
  "Carto Dark": osmLayer,
  "Carto Light": cartoLightLayer,
  "ESRI World Imagery": esriLayer,
  "OpenStreetMap": openstreetmap
};

var overlayLayers = {
  "Datos 2018": capasDatos["2018"],
  "Datos 2019": capasDatos["2019"],
  "Datos 2020": capasDatos["2020"],
  "Datos 2021": capasDatos["2021"]
};

L.control.layers(baseLayers, overlayLayers ).addTo(map);