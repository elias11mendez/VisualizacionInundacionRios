

// Configuración del mapa
let config = {
  minZoom: 2,
  maxZoom: 18,
};
// Zoom inicial
const zoom = 10;
// Coordenadas iniciales
const lat = 17.7;
const lng = -91.4;

// Inicialización del mapa
const map = L.map("map", config).setView([lat, lng], zoom);

const osmLayer = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  }
).addTo(map);

let currentZone = null; // Zona seleccionada actualmente
let leftLayer = null;
let rightLayer = null;
let sideBySideControl = null;

// Referencias a los selectores
const leftYearSelector = document.getElementById("leftYearSelector");
const leftSeasonSelector = document.getElementById("leftSeasonSelector");
const rightYearSelector = document.getElementById("rightYearSelector");
const rightSeasonSelector = document.getElementById("rightSeasonSelector");

// Cargar el GeoJSON y configurar el mapa
fetch("tabasco.JSON")
  .then((response) => response.json())
  .then((data) => {
    L.geoJSON(data, {
      style: function () {
        return {
          color: "blue",
          weight: 2,
          opacity: 1,
          fillColor: "transparent",
          fillOpacity: 0,
        };
      },
      onEachFeature: function (feature, layer) {
        layer.on({
          mouseover: function () {
            layer.setStyle({
              color: "green",
              weight: 3,
              fillColor: "transparent",
              fillOpacity: 0.6,
            });
          },
          mouseout: function () {
            layer.setStyle({
              color: "blue",
              weight: 2,
              fillColor: "red",
              fillOpacity: 0,
            });
          },
          click: function () {
            const areaName = feature.properties.NOMGEO; // Nombre de la zona
            if (areaName) {
              currentZone = areaName; // Actualizar zona seleccionada
              const bounds = layer.getBounds(); // Obtener los límites de la zona
              map.fitBounds(bounds); // Ajustar el mapa
              console.log(`Zona seleccionada: ${areaName}`);
            } else {
              console.error("No se pudo determinar la zona seleccionada.");
            }
          },
        });
      },
    }).addTo(map);
  })
  .catch((error) =>
    console.error("Error al cargar el archivo GeoJSON:", error)
  );

// Función para actualizar las capas de comparación
function updateComparisonLayers(leftLayerName, rightLayerName) {
  const wmsBaseUrl = "http://localhost:8080/geoserver/zonarios";

  // Configurar la capa izquierda
  if (leftLayer) {
    map.removeLayer(leftLayer);
  }
  leftLayer = L.tileLayer
    .wms(`${wmsBaseUrl}/wms`, {
      layers: leftLayerName,
      format: "image/png",
      transparent: true,
      attribution: "Fuente: GeoServer",
    })
    .addTo(map);

  // Configurar la capa derecha
  if (rightLayer) {
    map.removeLayer(rightLayer);
  }
  rightLayer = L.tileLayer
    .wms(`${wmsBaseUrl}/wms`, {
      layers: rightLayerName,
      format: "image/png",
      transparent: true,
      attribution: "Fuente: GeoServer",
    })
    .addTo(map);

  console.log(
    `Capas para comparación actualizadas: ${leftLayerName} vs ${rightLayerName}`
  );
}

// Función para activar el comparador lado a lado
function activateSideBySide() {
  if (!leftLayer || !rightLayer) {
    console.error(
      "Ambas capas deben estar configuradas antes de activar el comparador."
    );
    return;
  }

  // Eliminar el control anterior si existe
  if (sideBySideControl) {
    map.removeControl(sideBySideControl);
    sideBySideControl = null;
  }
  map.dragging.disable();

  // Crear el nuevo control de comparación lado a lado
  sideBySideControl = L.control.sideBySide(leftLayer, rightLayer).addTo(map);
 
  

  console.log("Comparador lado a lado activado.");
}

function desactivateSideBySide() {
  // Restablecer los selectores a sus valores iniciales
  leftYearSelector.selectedIndex = 0;
  leftSeasonSelector.selectedIndex = 0;
  rightYearSelector.selectedIndex = 0;
  rightSeasonSelector.selectedIndex = 0;

  // Remover capas del mapa si están definidas
  if (leftLayer) {
    map.removeLayer(leftLayer);
    leftLayer = null;
  }
  if (rightLayer) {
    map.removeLayer(rightLayer);
    rightLayer = null;
  }

  // Remover el control del comparador lado a lado si está activo
  if (sideBySideControl) {
    map.removeControl(sideBySideControl);
    sideBySideControl = null;
  }

  // Ocultar el contenedor de los selectores
  const contenedor = document.querySelector(".selector-container");
  if (contenedor) {
    contenedor.style.display = "none";
  } else {
    console.warn("El contenedor no existe o no se encuentra en el DOM.");
  }

  // Confirmar la desactivación en la consola
  console.log("Comparador desactivado y todos los elementos reiniciados.");
}


// Escuchar cambios en los selectores y actualizar dinámicamente las capas
[
  leftYearSelector,
  leftSeasonSelector,
  rightYearSelector,
  rightSeasonSelector,
].forEach((selector) => {
  selector.addEventListener("change", () => {
    if (!currentZone) {
      console.error(
        "Por favor, selecciona una zona en el mapa antes de actualizar las capas."
      );
      return;
    }

    // Construir los nombres de las capas
    const leftLayerName = `Agua${leftSeasonSelector.value}T${leftYearSelector.value}${currentZone}`;
    const rightLayerName = `Agua${rightSeasonSelector.value}T${rightYearSelector.value}${currentZone}`;

    // Validar que no sean las mismas capas
    if (leftLayerName === rightLayerName) {
      alert("Por favor, selecciona combinaciones diferentes para comparar.");
      return;
    }

    // Actualizar las capas y activar el comparador
    updateComparisonLayers(leftLayerName, rightLayerName);
    activateSideBySide();
  });
});

// Botón de comparación manual (opcional)
document.getElementById("compare-button").addEventListener("click", () => {
  if (!currentZone) {
    alert("Por favor, selecciona una zona en el mapa antes de comparar capas.");
    return;
  }

  // Mostrar el contenedor de selección si está oculto
  const contenedor = document.querySelector(".selector-container");
  if (contenedor) {
    contenedor.style.display = "flex";
  } else {
    console.error("No se encontró el contenedor de selección.");

    return;
  }

  // Generar los nombres de las capas basados en los valores seleccionados
  const leftLayerName = `Agua${leftSeasonSelector.value}T${leftYearSelector.value}${currentZone}`;
  const rightLayerName = `Agua${rightSeasonSelector.value}T${rightYearSelector.value}${currentZone}`;

  // Validar que las capas no sean las mismas
  if (leftLayerName === rightLayerName) {
    alert("Por favor, selecciona combinaciones diferentes para comparar.");
    return;
  }

  // Actualizar las capas de comparación
  updateComparisonLayers(leftLayerName, rightLayerName);

  // Manejar la activación/desactivación del comparador lado a lado
  if (sideBySideControl === null) {
    if (leftLayer && rightLayer) {
      activateSideBySide();
    } else {
      console.error("Las capas izquierda o derecha no están definidas.");
    }
  } else {
    desactivateSideBySide();
  }
});

