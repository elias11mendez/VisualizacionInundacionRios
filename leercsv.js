// Crear el mapa
const map = L.map("map").setView([17.710782, -91.286937], 11);

const baseWMSUrl = "http://localhost:8080/geoserver/ne/wms";

// Escala del mapa
L.control
  .scale({
    position: "bottomright",
    maxWidth: 200,
    metric: true,
    imperial: true,
    updateWhenIdle: false,
  })
  .addTo(map);

// Capa base OSM
const osmLayer = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  }
).addTo(map);

// Variables para capas
let leftLayers = { temporal: null, permanente: null };
let rightLayers = { temporal: null, permanente: null };
let sideBySideControl = null;

// Función para obtener el nombre de la capa basado en el año y la temporada
function getLayerName(year, season) {
  const seasonTemporal = {
    primavera: "PrimaveraT",
    verano: "VeranoT",
    otono: "OtonoT",
    invierno: "InviernoT",
  };
  const seasonPermanente = {
    primavera: "PrimaveraP",
    verano: "VeranoP",
    otono: "OtonoP",
    invierno: "InviernoP",
  };

  return [
    `ne:Agua${seasonTemporal[season]}${year}_1`,
    `ne:Agua${seasonPermanente[season]}${year}_1`,
  ];
}

// Función para eliminar capas existentes
function removeLayers(targetLayers) {
  if (targetLayers.temporal) {
    map.removeLayer(targetLayers.temporal);
    targetLayers.temporal = null;
  }
  if (targetLayers.permanente) {
    map.removeLayer(targetLayers.permanente);
    targetLayers.permanente = null;
  }
}

// Función para actualizar las capas
function updateLayer(year, season, side) {
  const [temporalLayerName, permanenteLayerName] = getLayerName(year, season);

  const targetLayers = side === "left" ? leftLayers : rightLayers;

    // Eliminar capas actuales del mapa
  removeLayers(targetLayers);

  // Crear nuevas capas
  targetLayers.temporal = L.tileLayer.wms(baseWMSUrl, {
    layers: temporalLayerName,
    format: "image/png",
    transparent: true,
    version: "1.1.0",
  }).addTo(map);

  targetLayers.permanente = L.tileLayer.wms(baseWMSUrl, {
    layers: permanenteLayerName,
    format: "image/png",
    transparent: true,
    version: "1.1.0",
  });

  // Actualizar comparación lado a lado
  updateSideBySide();
}

// Función para actualizar la comparación lado a lado
function updateSideBySide() {
  if (sideBySideControl) {
    map.removeControl(sideBySideControl);
    sideBySideControl = null;
  }

  if (leftLayers.temporal && rightLayers.temporal) {
    sideBySideControl = L.control.sideBySide(
      L.layerGroup([leftLayers.temporal, leftLayers.permanente]),
      L.layerGroup([rightLayers.temporal, rightLayers.permanente])
    );
    sideBySideControl.addTo(map);
  }
}

// Función para manejar la visibilidad de las capas permanentes
function togglePermanentLayer(side, visible) {
  const targetLayers = side === "left" ? leftLayers : rightLayers;
  if (targetLayers.permanente) {
    if (visible) {
      targetLayers.permanente.addTo(map);
    } else {
      map.removeLayer(targetLayers.permanente);
    }
  }
}

// Configurar eventos
function setupEventListeners() {
  document
    .getElementById("leftYearSelector")
    .addEventListener("change", function () {
      const year = this.value;
      const season = document.getElementById("leftSeasonSelector").value;
      if (year && season) updateLayer(year, season, "left");
    });

  document
    .getElementById("leftSeasonSelector")
    .addEventListener("change", function () {
      const season = this.value;
      const year = document.getElementById("leftYearSelector").value;
      if (year && season) updateLayer(year, season, "left");
    });

  document
    .getElementById("rightYearSelector")
    .addEventListener("change", function () {
      const year = this.value;
      const season = document.getElementById("rightSeasonSelector").value;
      if (year && season) updateLayer(year, season, "right");
    });

  document
    .getElementById("rightSeasonSelector")
    .addEventListener("change", function () {
      const season = this.value;
      const year = document.getElementById("rightYearSelector").value;
      if (year && season) updateLayer(year, season, "right");
    });

  document
    .getElementById("leftPermanentCheckbox")
    .addEventListener("change", function () {
      togglePermanentLayer("left", this.checked);
    });

/*   document
    .getElementById("rightPermanentCheckbox")
    .addEventListener("change", function () {
      togglePermanentLayer("right", this.checked);
    }); */
}

// Inicializar eventos
setupEventListeners();
