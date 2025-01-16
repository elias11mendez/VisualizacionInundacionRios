const map = L.map("map").setView([17.710782, -91.286937], 11);
const baseWMSUrl = "http://localhost:8080/geoserver/ne/wms";
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
// JavaScript
let leftLayers = { temporal: null, permanente: null };
let rightLayers = { temporal: null, permanente: null };

let leftLayerTemporal = null;
let rightLayerTemporal = null;
let leftLayerPermanente = null;
let rightLayerPermanente = null;

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

// Función para actualizar la capa
function updateLayer(year, season, side, isPermanente = true) {
  const [temporalLayerName, permanenteLayerName] = getLayerName(year, season);

  const targetLayers = side === "left" ? leftLayers : rightLayers;
  const layerName = isPermanente ? permanenteLayerName : temporalLayerName;

  if (side === "left") {
    if (leftLayerTemporal) {
      map.removeLayer(leftLayerTemporal); // Eliminar la capa temporal si ya existe
    }
    if (leftLayerPermanente) {
      map.removeLayer(leftLayerPermanente); // Eliminar la capa permanente si ya existe
    }

    if (isPermanente) {
      leftLayerPermanente = L.tileLayer.wms(baseWMSUrl, {
        layers: layerName,
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        crs: L.CRS.EPSG3857,
      });
      leftLayerPermanente.addTo(map);
      console.log("capa izquierda permanente", leftLayerPermanente);
    } else {
      leftLayerTemporal = L.tileLayer.wms(baseWMSUrl, {
        layers: layerName,
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        crs: L.CRS.EPSG3857,
      });
      leftLayerTemporal.addTo(map);
    }
  } else if (side === "right") {
    if (rightLayerTemporal) {
      map.removeLayer(rightLayerTemporal); // Eliminar la capa temporal si ya existe
    }
    if (rightLayerPermanente) {
      map.removeLayer(rightLayerPermanente); // Eliminar la capa permanente si ya existe
    }

    if (isPermanente) {
      rightLayerPermanente = L.tileLayer.wms(baseWMSUrl, {
        layers: layerName,
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        crs: L.CRS.EPSG3857,
      });
      rightLayerPermanente.addTo(map);
      console.log(rightLayerPermanente);
    } else {
      rightLayerTemporal = L.tileLayer.wms(baseWMSUrl, {
        layers: layerName,
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        crs: L.CRS.EPSG3857,
      });
      rightLayerTemporal.addTo(map);
    }
  }

  // Activar la comparación lado a lado si ambas capas están listas
  if (leftLayerTemporal && rightLayerTemporal) {
    activateSideBySide();
  }
}

// Función para activar la comparación lado a lado
function activateSideBySide() {
  if (!leftLayerTemporal || !rightLayerTemporal) {
    console.error(
      "Ambas capas deben estar configuradas antes de activar el comparador."
    );
    return;
  }
  if (!leftLayerPermanente || !rightLayerPermanente) {
    console.error(
      "Ambas capas deben estar configuradas antes de activar el comparador."
    );
    return;
  }

  if (leftLayerTemporal) {
    console.log("datos aqui datos aqui");
    map.on("click", (e) => {
      const { lat, lng } = e.latlng; // Obtener coordenadas del clic

      // Crear un tooltip con información personalizada
      const tooltip = L.tooltip()
        .setLatLng([lat, lng]) // Establecer posición del tooltip
        .setContent(
          `
          <div class="popup-content">
            <div class="title">Cuerpos de agua en comparación</div>
            <div class="section">
              <div class="section-title">Lado Izquierdo:</div>
              <div class="section-value">${
                cuerpoAguaIzquierda ? cuerpoAguaIzquierda : "No disponible"
              }</div>
            </div>
            <div class="section">
              <div class="section-title">Lado Derecho:</div>
              <div class="section-value">${
                cuerpoAguaDerecha ? cuerpoAguaDerecha : "No disponible"
              }</div>
            </div>
          </div>
        `
        )
        .addTo(map); // Añadir tooltip al mapa

      // Opcional: Eliminar el tooltip después de un tiempo
      setTimeout(() => {
        map.removeLayer(tooltip);
      }, 3000);
    });
  } else {
    return false;
  }

  console.log(cuerpoAguaDerecha);
  console.log(cuerpoAguaIzquierda);

  map.dragging.disable();

  // Verificar si ya existe un control 'sideBySide'
  if (sideBySideControl) {
    map.removeControl(sideBySideControl);
  }

  // Activar el control lado a lado

  sideBySideControl = L.control
    .sideBySide(
      [leftLayerPermanente, leftLayerTemporal],
      [rightLayerPermanente, rightLayerTemporal]
    )
    .addTo(map);

  document.querySelector(".selector-container").style.display = "flex";
}

// Función para desactivar la comparación lado a lado
function deactivateSideBySide() {
  if (leftLayerTemporal) map.removeLayer(leftLayerTemporal);
  if (rightLayerTemporal) map.removeLayer(rightLayerTemporal);

  map.dragging.enable();

  if (sideBySideControl) {
    map.removeControl(sideBySideControl);
    sideBySideControl = null;
  }

  document.querySelector(".selector-container").style.display = "none";
}

// Función para manejar los cambios en los selectores de la capa izquierda
document
  .getElementById("leftYearSelector")
  .addEventListener("change", function () {
    const year = this.value;

    const season = document.getElementById("leftSeasonSelector").value;
    if (year && season) updateLayer(year, season, "left");
    if (season === season) {
      document.getElementById("loader").style.display = "none";
    }
  });

document
  .getElementById("leftSeasonSelector")
  .addEventListener("change", function () {
    const season = this.value;

    const year = document.getElementById("leftYearSelector").value;
    if (year && season) updateLayer(year, season, "left");
  });

// Función para manejar los cambios en los selectores de la capa derecha
document
  .getElementById("rightYearSelector")
  .addEventListener("change", function () {
    const year = this.value;

    const season = document.getElementById("rightSeasonSelector").value;
    if (year && season) updateLayer(year, season, "right");

    if (season === season) {
      document.getElementById("loader").style.display = "none";
    }
  });

document
  .getElementById("rightSeasonSelector")
  .addEventListener("change", function () {
    const year = document.getElementById("rightYearSelector").value;
    const season = this.value;
    if (year && season) updateLayer(year, season, "right");
  });

document.addEventListener("DOMContentLoaded", function () {
  // Seleccionar los checkboxes
  const leftPermanentCheckbox = document.getElementById(
    "leftPermanentCheckbox"
  );
  const rightPermanentCheckbox = document.getElementById(
    "rightPermanentCheckbox"
  );

  // Selectores para el año y la temporada
  const leftYearSelector = document.getElementById("leftYearSelector");
  const leftSeasonSelector = document.getElementById("leftSeasonSelector");
  const rightYearSelector = document.getElementById("rightYearSelector");
  const rightSeasonSelector = document.getElementById("rightSeasonSelector");

  // Función para actualizar las capas basadas en el checkbox y selectores
  function updateLayersWithCheckbox(side) {
    const year =
      side === "left" ? leftYearSelector.value : rightYearSelector.value;
    const season =
      side === "left" ? leftSeasonSelector.value : rightSeasonSelector.value;
    const isPermanentChecked =
      side === "left"
        ? leftPermanentCheckbox.checked
        : rightPermanentCheckbox.checked;

    if (year && season) {
      updateLayer(year, season, side, isPermanentChecked);
    }
  }

  // Listeners para los checkboxes
  if (leftPermanentCheckbox) {
    leftPermanentCheckbox.addEventListener("change", function () {
      updateLayersWithCheckbox("left");
    });
  }

  if (rightPermanentCheckbox) {
    rightPermanentCheckbox.addEventListener("change", function () {
      updateLayersWithCheckbox("right");
    });
  }

  // Listeners para los selectores de año y temporada
  if (leftYearSelector && leftSeasonSelector) {
    leftYearSelector.addEventListener("change", function () {
      updateLayersWithCheckbox("left");
    });

    leftSeasonSelector.addEventListener("change", function () {
      updateLayersWithCheckbox("left");
    });
  }

  if (rightYearSelector && rightSeasonSelector) {
    rightYearSelector.addEventListener("change", function () {
      updateLayersWithCheckbox("right");
    });

    rightSeasonSelector.addEventListener("change", function () {
      updateLayersWithCheckbox("right");
    });
  }
});
