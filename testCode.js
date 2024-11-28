const map = L.map("map").setView([17.810782, -91.533937], 10);

const baseWMSUrl = "http://localhost:8080/geoserver/ne/wms";

// Capa base OSM
const osmLayer = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  }
).addTo(map); // Aseguramos que OSM siempre esté presente al inicio.

let leftLayer = null;
let rightLayer = null;
let sideBySideControl = null;

// Función para obtener el nombre de la capa basado en el año y la temporada
function getLayerName(year, season) {
  const seasonNames = {
    primavera: "PrimaveraT",
    verano: "VeranoT",
    otono: "OtonoT",
    invierno: "InviernoT",
  };
  return `ne:Agua${seasonNames[season]}${year}_1`;
}

// Función para actualizar la capa
function updateLayer(year, season, side) {
  const layerName = getLayerName(year, season);

  if (side === "left") {
    if (leftLayer) {
      map.removeLayer(leftLayer); // Eliminar la capa izquierda si ya existe
    }
    leftLayer = L.tileLayer.wms(baseWMSUrl, {
      layers: layerName,
      format: "image/png",
      transparent: true,
      version: "1.1.0",
      crs: L.CRS.EPSG3857,
    });
    leftLayer.addTo(map);
  } else if (side === "right") {
    if (rightLayer) {
      map.removeLayer(rightLayer); // Eliminar la capa derecha si ya existe
    }
    rightLayer = L.tileLayer.wms(baseWMSUrl, {
      layers: layerName,
      format: "image/png",
      transparent: true,
      version: "1.1.0",
      crs: L.CRS.EPSG3857,
    });
    rightLayer.addTo(map);
  }

  // Activar la comparación lado a lado si ambas capas están listas
  if (leftLayer && rightLayer) {
    activateSideBySide();
  }
}

// Función para activar la comparación lado a lado
function activateSideBySide() {
  if (!leftLayer || !rightLayer) {
    console.error(
      "Ambas capas deben estar configuradas antes de activar el comparador."
    );
    return;
  }

  // Añadir las capas a sus respectivos lados
  leftLayer.addTo(map);
  rightLayer.addTo(map);

  if (leftLayer) {
    console.log(leftLayer.options.layers, "capa izquierda");
  }
  if (rightLayer) {
    console.log(rightLayer, "capa derecha");
  }

  // Desactivar el arrastre del mapa
  map.dragging.disable();

  // Verificar si ya existe un control 'sideBySide'
  if (sideBySideControl) {
    map.removeControl(sideBySideControl); // Eliminar cualquier instancia previa
  }

  // Activar el control lado a lado
  sideBySideControl = L.control.sideBySide(leftLayer, rightLayer).addTo(map);

  // Mostrar el contenedor con los selectores
  document.querySelector(".selector-container").style.display = "block";
}

// Función para desactivar la comparación lado a lado
function deactivateSideBySide() {
  // Eliminar las capas de comparación
  if (leftLayer) map.removeLayer(leftLayer);
  if (rightLayer) map.removeLayer(rightLayer);

  // Reactivar el arrastre del mapa
  map.dragging.enable();

  // Eliminar el control de comparación lado a lado
  if (sideBySideControl) {
    map.removeControl(sideBySideControl);
    sideBySideControl = null;
  }

  // Volver a añadir la capa base OSM si no está visible
  if (!map.hasLayer(osmLayer)) {
    osmLayer.addTo(map);
  }

  // Ocultar el contenedor de los selectores
  document.querySelector(".selector-container").style.display = "none";
}

let selectYearLeft, selectYearRight;


// Función para manejar los cambios en los selectores de la capa izquierda
document
  .getElementById("leftYearSelector")
  .addEventListener("change", function () {
    const year = this.value;
    
    const season = document.getElementById("leftSeasonSelector").value;
    if (year && season) updateLayer(year, season, "left");
  });

console.log(selectYearLeft);

document
  .getElementById("leftSeasonSelector")
  .addEventListener("change", function () {
    const season = this.value
    const year = document.getElementById("leftYearSelector").value;
    if (year && season) updateLayer(year, season, "left");
  });

// Función para manejar los cambios en los selectores de la capa derecha
document
  .getElementById("rightYearSelector")
  .addEventListener("change", function () {
    const year = this.value;
    selectYearRight = year;
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

// Activar la comparación lado a lado si las capas ya están configuradas
if (leftLayer && rightLayer) {
  activateSideBySide();
}

// Botón para activar la comparación lado a lado
document.getElementById("activateSide").addEventListener("click", function () {
  const selectorContainer = document.querySelector(".selector-container");

  // Mostrar u ocultar el contenedor con los selectores
  if (
    selectorContainer.style.display === "none" ||
    selectorContainer.style.display === ""
  ) {
    selectorContainer.style.display = "block";
    alert("CARGUE LAS CAPAS PARA INICIAR LA COMPARACION Y VER LAS GRAFICAS");
  } else {
    selectorContainer.style.display = "none";
  }

  // Activar o desactivar el comparador
  if (sideBySideControl === null) {
    // Verificar si ambas capas están configuradas antes de activar
    if (leftLayer && rightLayer) {
      activateSideBySide();
    }
  } else {
    deactivateSideBySide();
  }
});


/* -------------------------------------------------Graficas--------------------------------- */

let output = []; // Variable global para almacenar los datos procesados

// Función para procesar el archivo CSV
function parseCSV(text) {
  let lines = text.replace(/\r/g, "").split("\n");
  return lines.map((line) => line.split(","));
}

// Mapea los datos del CSV a un objeto con las columnas correspondientes
function mapDataToObjects(data) {
  const columns = [
    "Año",
    "Temporada",
    "Tipo_Agua",
    "Area_km2",
    "Número de cuerpos de agua",
  ];
  return data
    .map((row, index) => {
      if (index === 0) return null; // Ignoramos la primera línea (encabezado)
      return row.reduce((acc, value, idx) => {
        acc[columns[idx]] = value; // Asignamos valores a las claves correspondientes
        return acc;
      }, {});
    })
    .filter((item) => item !== null); // Eliminamos el encabezado
}

// Función para cargar el archivo
function loadFile(url) {
  fetch(url)
    .then((response) => response.arrayBuffer())
    .then((buffer) => {
      const decoder = new TextDecoder("utf-8");
      const text = decoder.decode(buffer);
      const lines = parseCSV(text);
      output = mapDataToObjects(lines); // Asignamos los datos a la variable global
      
      console.log("Datos cargados:", output); // Verificamos que los datos se hayan cargado


    })
    .catch((error) => {
      console.error("Error al cargar el archivo:", error);
    });
}

// Llamamos a la función para cargar el archivo
loadFile("Agua_PermanteTemporal.csv");

let chartInstanceLeft = null;
let chartInstanceRight = null;

// Datos para la gráfica inicial
let leftTemporalData = {
  labels: [], // Aquí irán las temporadas
  datasets: [
    {
      label: "Agua temporal",
      data: [], // Aquí irán los datos de "Area_km2"
      backgroundColor: "cyan", // Esto da el color de relleno bajo la línea
      borderColor: "cyan", // Esto da el color de la línea
      borderWidth: 1, // Esto da el grosor de la línea
      tension: 0.2,
    },
    {
      label: "Agua permanente",
      data: [], // Los datos de "Area_km2" para Agua Permanente
      backgroundColor: "blue", // Color de relleno para Agua Permanente
      borderColor: "blue", // Color de línea para Agua Permanente
      borderWidth: 1,
      tension: 0.2,
    }
  ],
};

const leftTemporalConfig = {
  type: "line",
  data: leftTemporalData,
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "km2 Afectados" },
      },
      x: {
        title: { display: true, text: "Temporadas", color: "black", font: { weight: "bold" } }, ticks:{
          autoSkip:true,
        }
      },
    },
  },
};

// Datos para la gráfica derecha
let rightTemporalData = {
  labels: [],
  datasets: [
    {
      label: "Agua temporal",
      data: [],
      backgroundColor: "cyan",
      borderColor: "cyan",
      borderWidth: 1,
      tension: 0.2,
    },
    {
      label: "Agua permanente",
      data: [], // Los datos de "Area_km2" para Agua Permanente
      backgroundColor: "blue", // Color de relleno para Agua Permanente
      borderColor: "blue", // Color de línea para Agua Permanente
      borderWidth: 1,
      tension: 0.2,
    }
  ],
};

const rightTemporalConfig = {
  type: "line",
  data: rightTemporalData,
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "km2 Afectados" } },
      x: {
        title: { display: true, text: "Temporadas", color: "black", font: { weight: "bold" } },
      },
    },
  },
};

// Función para actualizar las gráficas
function updateChart(selectedYear, chartSide) {
  // Filtrar los datos según el año seleccionado
  const filteredData = output.filter(
    (item) => item.Año === selectedYear
  );

  // Obtener las áreas afectadas para cada tipo de agua
  const areasTemporal = filteredData.filter(item => item.Tipo_Agua === "Temporal").map((item) => parseFloat(item.Area_km2));
  const areasPermanente = filteredData.filter(item => item.Tipo_Agua === "Permanente").map((item) => parseFloat(item.Area_km2));

  // Definir manualmente las etiquetas para el eje X
  const manualLabels = ['Primavera', 'Verano', 'Otoño', 'Invierno']; // Ejemplo de etiquetas manuales

  // Actualizamos los datos de la gráfica izquierda o derecha según el "chartSide"
  if (chartSide === "left") {
    leftTemporalData.labels = manualLabels; // Usamos las etiquetas manuales para el eje X
    leftTemporalData.datasets[0].data = areasTemporal; // Datos para "Agua Temporal"
    leftTemporalData.datasets[1].data = areasPermanente; // Datos para "Agua Permanente"

    leftTemporalConfig.options.scales.x.title.text = `Temporadas ${selectedYear}`;

    // Destruir y volver a crear el gráfico izquierdo
    if (chartInstanceLeft) {
      chartInstanceLeft.destroy();
    }
    const ctxLeft = document.getElementById("histogramaLeftTemporal").getContext("2d");
    chartInstanceLeft = new Chart(ctxLeft, leftTemporalConfig); // Crear la nueva gráfica
  } else if (chartSide === "right") {
    rightTemporalData.labels = manualLabels; // Usamos las etiquetas manuales para el gráfico derecho
    rightTemporalData.datasets[0].data = areasTemporal; // Datos para "Agua Temporal"
    rightTemporalData.datasets[1].data = areasPermanente; // Datos para "Agua Permanente"

    rightTemporalConfig.options.scales.x.title.text = `Temporadas ${selectedYear}`;

    // Destruir y volver a crear el gráfico derecho
    if (chartInstanceRight) {
      chartInstanceRight.destroy();
    }
    const ctxRight = document.getElementById("histogramaRightTemporal").getContext("2d");
    chartInstanceRight = new Chart(ctxRight, rightTemporalConfig); // Crear la nueva gráfica
  }
}

// Escuchar cambios en el selector de la izquierda
document
  .getElementById('leftYearSelector')
  .addEventListener("change", (event) => {
    const selectYearLeft = event.target.value; // Año seleccionado en el lado izquierdo
    if (output.length > 0) {
      updateChart(selectYearLeft, "left"); // Actualizar la gráfica izquierda
    }
  });

// Escuchar cambios en el selector de la derecha
document
  .getElementById('rightYearSelector')
  .addEventListener("change", (event) => {
    const selectYearRight = event.target.value; // Año seleccionado en el lado derecho
    if (output.length > 0) {
      updateChart(selectYearRight, "right"); // Actualizar la gráfica derecha
    }
  });

// Función para cargar el archivo CSV y procesar los datos
function loadFile(url) {
  fetch(url)
    .then((response) => response.arrayBuffer())
    .then((buffer) => {
      const decoder = new TextDecoder("utf-8");
      const text = decoder.decode(buffer);
      const lines = parseCSV(text);
      output = mapDataToObjects(lines); // Asignamos los datos a la variable global

      // Inicializamos la gráfica con el primer año después de cargar los datos
    
    })
    .catch((error) => {
      console.error("Error al cargar el archivo:", error);
    });
}

// Llamada para cargar el archivo CSV
loadFile("Agua_PermanteTemporal.csv");

