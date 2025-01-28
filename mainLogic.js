let lat = 17.710782;
let long = -91.286937;
let initialZoom = 10;
let initialView;
let map = L.map("map").setView([lat, long], initialZoom);
let baseWMSUrl = "http://localhost:8080/geoserver/zonarios/wms";
L.control
  .scale({
    position: "bottomright",
    maxWidth: 200,
    metric: true,
    imperial: true,
    updateWhenIdle: false,
  })
  .addTo(map);
const osmLayer = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  }
).addTo(map);

// Variables
let leftLayers = { temporal: null, permanente: null };
let rightLayers = { temporal: null, permanente: null };

let leftLayerTemporal = null;
let rightLayerTemporal = null;
let leftLayerPermanente = null;
let rightLayerPermanente = null;
let sideBySideControl = null;
let municipioFloods = null;
let selectedPeriod = null;
let currentPeriod = "Durante";
let zonaRiosFloods = null;
let allLayers = [];
let selectedLayer = null;
let areaName = null;

function capasMunicipio(lat, long, baseWMSUrl) {
  function cargarZonaRios(layerName) {
    if (zonaRiosFloods) {
      map.removeLayer(zonaRiosFloods); // Remover la capa existente
    }

    zonaRiosFloods = L.tileLayer
      .wms(baseWMSUrl, {
        layers: layerName,
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        crs: L.CRS.EPSG3857,
        formatoptions: "antialiasing:off",
        tileSize: 256,
        tiled: true,
      })
      .addTo(map);
  }

  function cargarCapa(layerName) {
    if (municipioFloods) {
      map.removeLayer(municipioFloods); // Remover la capa existente
    }

    municipioFloods = L.tileLayer
      .wms(baseWMSUrl, {
        layers: layerName,
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        crs: L.CRS.EPSG3857,
        formatoptions: "antialiasing:off",
        tileSize: 256,
        tiled: true,
      })
      .addTo(map);
  }

  // Configurar el selector de período
  selectPeriodo = document.getElementById("SelectPeriodo");
  selectPeriodo.value = "Durante"; // Período inicial

  selectPeriodo.addEventListener("change", () => {
    const selectedPeriod = selectPeriodo.value;
    currentPeriod = selectedPeriod;

    // Actualizar la capa de Zona Ríos
    if (zonaRiosFloods) {
      const layerZonaRios = `ZonaRios${currentPeriod}2020`;
      cargarZonaRios(layerZonaRios);
    }

    // Actualizar la capa del área seleccionada
    if (areaName) {
      layerName = `${areaName}${currentPeriod}2020`;
      cargarCapa(layerName);
    } else {
      console.warn("No hay un área seleccionada para actualizar la capa.");
    }
  });

  // Cargar el archivo GeoJSON y configurar el mapa
  fetch("Tabasco.JSON")
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Error al cargar el archivo GeoJSON: ${response.statusText}`
        );
      }
      return response.json();
    })
    .then((data) => {
      // Para rastrear la capa seleccionada
      initialView = [lat, long]; // Coordenadas iniciales (centro del mapa)

      // Crear las capas del GeoJSON
      L.geoJSON(data, {
        style: {
          color: "white",
          weight: 0.5,
          opacity: 1,
          fillColor: "transparent",
          fillOpacity: 0,
        },
        onEachFeature: function (feature, layer) {
          allLayers.push(layer);

          layer.on({
            click: function () {
              selectedAreaName = feature.properties?.NOMGEO;
              if (selectedAreaName) {
                areaName = selectedAreaName; // Actualizar la variable global

                document.getElementById("zona-selected").innerHTML = areaName;

                const event = new CustomEvent("estoenviaelcambiodelmunicipio", {
                  detail: areaName,
                });
                window.dispatchEvent(event);

                if (zonaRiosFloods) {
                  map.removeLayer(zonaRiosFloods);
                  zonaRiosFloods = null;
                }

                // Restablecer estilos previos
                allLayers.forEach((lyr) =>
                  lyr.setStyle({
                    color: "white",
                    weight: 0.2,
                    fillOpacity: 0.1,
                  })
                );

                // Aplicar estilo al área seleccionada
                layer.setStyle({ color: "white", weight: 2, fillOpacity: 0.5 });

                // Guardar la capa seleccionada
                selectedLayer = layer;

                // Hacer zoom al área seleccionada
                map.fitBounds(layer.getBounds(), { padding: [50, 50] });

                // Cargar la capa correspondiente al área seleccionada y al período actual
                cargarCapa(`${areaName}${currentPeriod}2020`);
              } else {
                console.error("Propiedad NOMGEO no encontrada en el feature.");
              }
            },
          });
        },
      }).addTo(map);

      // Función para restablecer el mapa
      document.getElementById("btn-endClean").addEventListener("click", () => {
        activarEndClean();
      });

      // Función para restablecer el mapa
      function activarEndClean() {
        if (municipioFloods) {
          map.removeLayer(municipioFloods);
          municipioFloods = null;
        }

        if (leftLayerTemporal) map.removeLayer(leftLayerTemporal);
        if (leftLayerPermanente) map.removeLayer(leftLayerPermanente);
        if (rightLayerPermanente) map.removeLayer(rightLayerPermanente);
        if (rightLayerTemporal) map.removeLayer(rightLayerTemporal);

        if (sideBySideControl) {
          map.removeControl(sideBySideControl);
          sideBySideControl = null;
        }

        map.dragging.enable();

        // Restablecer el estilo de todas las capas
        allLayers.forEach((layer) => {
          layer.setStyle({
            color: "white",
            weight: 0.2,
            fillOpacity: 0.1,
          });
        });

        // Cambiar el municipio y notificar mediante un evento personalizado
        areaName = "Zona Rios";
        const event = new CustomEvent("estoenviaelcambiodelmunicipio", {
          detail: areaName,
        });
        window.dispatchEvent(event);

        document.getElementById("zona-selected").innerHTML = areaName;

        map.setView(initialView, initialZoom);

        const selectedPeriod = document.getElementById("SelectPeriodo").value;

        const layerZonaRios = `ZonaRios${selectedPeriod}2020`;

        if (zonaRiosFloods) {
          map.removeLayer(zonaRiosFloods);
        }

        // Añadir la nueva capa de Zona Rios al mapa
        zonaRiosFloods = L.tileLayer
          .wms(baseWMSUrl, {
            layers: layerZonaRios,
            format: "image/png",
            transparent: true,
            version: "1.1.0",
            crs: L.CRS.EPSG3857,
            formatoptions: "antialiasing:off",
            tileSize: 256,
            tiled: true,
          })
          .addTo(map);
      }

      // Cargar la capa inicial de Zona Ríos
      const initialLayerZonaRios = `ZonaRios${currentPeriod}2020`;
      cargarZonaRios(initialLayerZonaRios);
    })
    .catch((error) => {
      console.error("Error al cargar el archivo GeoJSON:", error);
    });
}
capasMunicipio(lat, long, baseWMSUrl);
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
        formatoptions: "antialiasing:off",
        tileSize: 256,
        tiled: true, // Activar teselas
      });
      leftLayerPermanente.addTo(map);
    } else {
      leftLayerTemporal = L.tileLayer.wms(baseWMSUrl, {
        layers: layerName,
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        crs: L.CRS.EPSG3857,
        formatoptions: "antialiasing:off",
        tileSize: 256,
        tiled: true, // Activar teselas
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
        formatoptions: "antialiasing:off",
        tileSize: 256,
        tiled: true, // Activar teselas
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
        formatoptions: "antialiasing:off",
        tileSize: 256,
        tiled: true, // Activar teselas
      });
      rightLayerTemporal.addTo(map);
    }
  }

  if (leftLayerTemporal && rightLayerTemporal) {
    activateSideBySide();
  }
}

let tooltip;

function activateSideBySide() {
  if (!leftLayerTemporal || !rightLayerTemporal) {
    console.error(
      "Ambas capas temporales deben estar configuradas antes de activar el comparador."
    );
    return;
  }

  if (!leftLayerPermanente || !rightLayerPermanente) {
    console.error(
      "Ambas capas permanentes deben estar configuradas antes de activar el comparador."
    );
    return;
  }

  // Eliminar las capas de zonariosFlood y municipioFloods si están activas
  if (zonaRiosFloods) {
    map.removeLayer(zonaRiosFloods);
    zonaRiosFloods = null;
  }

  if (municipioFloods) {
    map.removeLayer(municipioFloods);
    municipioFloods = null;
  }

  // Variables para los estados y cuerpos de agua
  let aguaIzquierda, aguaDerecha, estadoIzquierda, estadoDerecha;

  const checkboxLeft = document.getElementById("leftPermanentCheckbox");
  const checkboxRight = document.getElementById("rightPermanentCheckbox");
  if (leftLayerTemporal || rightLayerTemporal) {
    checkboxLeft.disabled = false;
    checkboxRight.disabled = false;
  }
  // Función para determinar el estado (Permanente o Temporal)
  const obtenerEstado = (isChecked) => (isChecked ? "Permanente" : "Temporal");

  // Función para actualizar los valores de agua y estado
  const actualizarValores = () => {
    estadoIzquierda = obtenerEstado(checkboxLeft.checked);
    estadoDerecha = obtenerEstado(checkboxRight.checked);

    aguaIzquierda = checkboxLeft.checked
      ? cuerpoAguaIzquierda[0]
      : cuerpoAguaIzquierda[1];
    aguaDerecha = checkboxRight.checked
      ? cuerpoAguaDerecha[0]
      : cuerpoAguaDerecha[1];
  };

  // Asignar valores iniciales y escuchar cambios en los checkboxes
  actualizarValores();
  checkboxLeft.addEventListener("change", actualizarValores);
  checkboxRight.addEventListener("change", actualizarValores);

  // Desactivar arrastre del mapa
  map.dragging.disable();

  // Eliminar el control sideBySide si ya existe
  if (sideBySideControl) {
    map.removeControl(sideBySideControl);
    sideBySideControl = null;
  }

  // Crear y agregar el nuevo control sideBySide
  sideBySideControl = L.control
    .sideBySide(
      [leftLayerPermanente, leftLayerTemporal],
      [rightLayerPermanente, rightLayerTemporal]
    )
    .addTo(map);

  // Mostrar el contenedor de selectores
  document.querySelector(".selector-container").style.display = "flex";
  console.log("Comparador lado a lado activado.");
}

const checkboxes = document.querySelectorAll('input[type="checkbox"]');

// Función para desactivar la comparación lado a lado
function deactivateSideBySide() {
  leftYearSelector.selectedIndex = 0;
  leftSeasonSelector.selectedIndex = 0;
  rightYearSelector.selectedIndex = 0;
  rightSeasonSelector.selectedIndex = 0;

  checkboxes.forEach((checkbox) => {
    if (!checkbox.disabled) {
      checkbox.checked = false;
    }
  });
  // Función para eliminar una capa si existe
  const removeLayerIfExists = (layer) => {
    if (layer) map.removeLayer(layer);
  };
  // Eliminar capas temporales y permanentes
  [
    leftLayerTemporal,
    rightLayerTemporal,
    leftLayerPermanente,
    rightLayerPermanente,
  ].forEach(removeLayerIfExists);

  // Eliminar el control Side-by-Side si existe
  if (sideBySideControl) {
    map.removeControl(sideBySideControl);
    sideBySideControl = null;
  }
  map.dragging.enable();
  location.reload();
  // Ocultar el contenedor del selector
  const selectorContainer = document.querySelector(".selector-container");

  if (selectorContainer) {
    selectorContainer.style.display = "none";
  }
}

// Función para manejar los cambios en los selectores de la capa izquierda
document
  .getElementById("leftYearSelector")
  .addEventListener("change", function () {
    const year = this.value;

    const season = document.getElementById("leftSeasonSelector").value;
    if (year && season) updateLayer(year, season, "left");
    
    
    if (municipioFloods) {
      map.removeLayer(municipioFloods);
      municipioFloods = null;
    }
  });

document
  .getElementById("leftSeasonSelector")
  .addEventListener("change", function () {
    const season = this.value;

    const year = document.getElementById("leftYearSelector").value;
    if (year && season) updateLayer(year, season, "left");
    if (municipioFloods) {
      map.removeLayer(municipioFloods);
      municipioFloods = null;
    }
  });

// Función para manejar los cambios en los selectores de la capa derecha
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
