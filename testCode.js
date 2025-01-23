let lat = 17.710782;
let log = -91.286937;
let initialZoom = 10;
let map = L.map("map").setView([lat, log], initialZoom);
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
// Capa base OSM
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
let generalFloods = null;

function configurarMapaYCapas(lat, log, baseWMSUrl) {
  let areaName = null; // Variable global para almacenar el área seleccionada
  let currentPeriod = "Durante"; // Período por defecto
  
  // Función para cargar la capa WMS
  function cargarCapa(layerName) {
    if (generalFloods) {
      map.removeLayer(generalFloods); // Remover la capa existente
    }

    generalFloods = L.tileLayer
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

    console.log(`Capa cargada: ${layerName}`);
  }

  // Configurar el selector de período
  const selectPeriodo = document.getElementById("SelectPeriodo");
  selectPeriodo.value = "Durante"; // Período inicial

  selectPeriodo.addEventListener("change", () => {
    console.log(`Área actual seleccionada: ${areaName}`);

    const selectedPeriod = selectPeriodo.value;

    if (areaName) {
      currentPeriod = selectedPeriod; // Actualizar el período actual
      const layerName = `${areaName}${currentPeriod}2020`; // Generar el nombre de la capa
      cargarCapa(layerName); // Cargar la nueva capa
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
      let allLayers = [];
      let selectedLayer = null; // Para rastrear la capa seleccionada
      const initialView = [lat, log]; // Coordenadas iniciales (centro del mapa)
      const initialZoom = 10; // Nivel de zoom inicial

      // Crear el mapa

      // Agregar una capa base al mapa

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
          allLayers.push(layer); // Agregar la capa a la lista

          layer.on({
            click: function () {
              const selectedAreaName = feature.properties?.NOMGEO;

              if (selectedAreaName) {
                areaName = selectedAreaName; // Actualizar la variable global
                document.getElementById("zona-selected").innerHTML = areaName;

                console.log(`Zona seleccionada: ${areaName}`);

                // Restablecer estilos previos
                allLayers.forEach((lyr) =>
                  lyr.setStyle({ color: "white", weight: 0.2, fillOpacity: 0.1 })
                );

                // Aplicar estilo al área seleccionada
                layer.setStyle({ color: "blue", weight: 2, fillOpacity: 0.5 });

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
      document.getElementById("compare").addEventListener("click", () => {
        console.log("clickckckkc");

        selectPeriodo.selectedIndex = 0;

        if (generalFloods) {
          map.removeLayer(generalFloods);
          generalFloods = null;
        }
        // Restablecer estilos de todas las capas
        allLayers.forEach((layer) =>
          layer.setStyle({ color: "white", weight: 0.2, fillOpacity: 0.1 })
        );

        // Limpiar selección
        selectedLayer = null;
        areaName = null;
        document.getElementById("zona-selected").innerHTML = "Zona Rios";

        // Restablecer la vista inicial del mapa
        map.setView(initialView, initialZoom);
        console.log("Mapa restablecido a su estado inicial.");
      });
    })
    .catch((error) => {
      console.error("Error al cargar el archivo GeoJSON:", error);
    });
}

// Llamar a la función con parámetros específicos
configurarMapaYCapas(lat, log, baseWMSUrl);


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
      console.log("capa izquierda permanente", leftLayerPermanente);
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

  // Activar la comparación lado a lado si ambas capas están listas
  if (leftLayerTemporal && rightLayerTemporal) {
    activateSideBySide();
  }
}

let tooltip;

function activateSideBySide() {
  // Verificar si las capas necesarias están configuradas
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

  // Variables para los estados y cuerpos de agua
  let aguaIzquierda, aguaDerecha, estadoIzquierda, estadoDerecha;

  const checkboxLeft = document.getElementById("leftPermanentCheckbox");
  const checkboxRight = document.getElementById("rightPermanentCheckbox");

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

  // Añadir evento al mapa para mostrar tooltip al hacer clic
  map.on("click", (e) => {
    const { lat, lng } = e.latlng;

    // Crear tooltip con la información actual
    tooltip = L.tooltip()
      .setLatLng([lat, lng])
      .setContent(
        `
        <div class="popup-content" id = 'popup-content'>
          <div class="title">Cuerpos de agua en comparación</div>
          <div class="section">
            <div class="section-title" style="color: ${
              estadoIzquierda === "Permanente" ? "blue" : "#16a085"
            };">
              Lado Izquierdo: ${estadoIzquierda}
            </div>
            <div class="section-value">${aguaIzquierda || "No disponible"}</div>
          </div>
          <div class="section">
            <div class="section-title" style="color: ${
              estadoDerecha === "Permanente" ? "blue" : "#16a085"
            };">
              Lado Derecho: ${estadoDerecha}
            </div>
            <div class="section-value">${aguaDerecha || "No disponible"}</div>
          </div>
        </div>
        `
      )
      .addTo(map);

    // Eliminar el tooltip automáticamente después de 3 segundos
    setTimeout(() => {
      if (tooltip) {
        map.removeLayer(tooltip);
      }
    }, 3000);
  });

  leftLayerTemporal.on("load", function () {
    console.log("La capa de izquierda temporal ya esta cargada .");
  });

  rightLayerTemporal.on("load", function () {
    console.log("La capa de derecga temporal ya esta cargada .");
    document.getElementById("loader-layer").style.display = "none";
  });

  leftLayerPermanente.on("error", function () {
    console.log("Error al cargar la capa WMS.");
  });
  // Desactivar arrastre del mapa
  map.dragging.disable();

  // Eliminar el control sideBySide si ya existe
  if (sideBySideControl) {
    map.removeControl(sideBySideControl);
    sideBySideControl = null;
  }
  if (generalFloods) {
    map.removeLayer(generalFloods);
    generalFloods = null;
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
    if (season === season) {
      document.getElementById("loader").style.display = "none";
    }
    if (generalFloods) {
      map.removeLayer(generalFloods)
      generalFloods= null
    }
  });

document
  .getElementById("leftSeasonSelector")
  .addEventListener("change", function () {
    const season = this.value;

    const year = document.getElementById("leftYearSelector").value;
    if (year && season) updateLayer(year, season, "left");
    if (generalFloods) {
      map.removeLayer(generalFloods)
      generalFloods= null
    }
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
