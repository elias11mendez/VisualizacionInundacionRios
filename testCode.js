const map = L.map("map").setView([17.810782, -91.533937], 10);

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

var openstreetmap = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution: "&copy; OpenStreetMap contributors",
  }
);

var cartoLightLayer = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  }
);

var esriLayer = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
);

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

  map.dragging.disable();

  // Verificar si ya existe un control 'sideBySide'
  if (sideBySideControl) {
    map.removeControl(sideBySideControl);
  }

  // Activar el control lado a lado
  sideBySideControl = L.control.sideBySide(leftLayer, rightLayer).addTo(map);

  document.querySelector(".selector-container").style.display = "block";
}

// Función para desactivar la comparación lado a lado
function deactivateSideBySide() {
  if (leftLayer) map.removeLayer(leftLayer);
  if (rightLayer) map.removeLayer(rightLayer);

  map.dragging.enable();

  if (sideBySideControl) {
    map.removeControl(sideBySideControl);
    sideBySideControl = null;
  }

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
    const season = this.value;
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

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const histogramaArrow = document.getElementById("histogramaArrow");
  console.log("haciendo clic");

  histogramaArrow.classList.toggle("moved");

  sidebar.classList.toggle("open");
}

// Botón para activar la comparación lado a lado
document.getElementById("activateSide").addEventListener("click", function () {
  const selectorContainer = document.querySelector(".selector-container");
  const histogramaArrow = document.querySelector(".histogramaArrow");
  const sidebar = document.querySelector(".sidebar");
  const modal = document.querySelector(".modal");
  if (
    selectorContainer.style.display === "none" ||
    selectorContainer.style.display === ""
  ) {
    selectorContainer.style.display = "flex";
    histogramaArrow.style.display = "flex";
    sidebar.style.display = "block";

    alert("CARGUE LAS CAPAS PARA INICIAR LA COMPARACION Y VER LAS GRAFICAS");
  } else {
    selectorContainer.style.display = "none";
    histogramaArrow.style.display = "none";
    sidebar.style.display = "none";
    modal.style.display = 'none'
  }

  // Activar o desactivar el comparador
  if (sideBySideControl === null) {
    if (leftLayer && rightLayer) {
      activateSideBySide();
    }
  } else {
    deactivateSideBySide();
  }
});

/* -------------------------------------------------Graficas--------------------------------- */

let output = [];

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
      if (index === 0) return null;
      return row.reduce((acc, value, idx) => {
        acc[columns[idx]] = value;
        return acc;
      }, {});
    })
    .filter((item) => item !== null);
}

// Función para cargar el archivo
function loadFile(url) {
  fetch(url)
    .then((response) => response.arrayBuffer())
    .then((buffer) => {
      const decoder = new TextDecoder("utf-8");
      const text = decoder.decode(buffer);
      const lines = parseCSV(text);
      output = mapDataToObjects(lines);

      console.log("Datos cargados:", output);
    })
    .catch((error) => {
      console.error("Error al cargar el archivo:", error);
    });
}

loadFile("Agua_PermanteTemporal.csv");

let chartInstanceLeft = null;
let chartInstanceRight = null;
let chartInstanceTemporal = null;
let chartInstancePermanente = null;

let leftTemporalData = {
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
      data: [],
      backgroundColor: "blue",
      borderColor: "blue",
      borderWidth: 1,
      tension: 0.2,
    },
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
        title: {
          display: true,
          text: "Temporadas",
          color: "black",
          font: { weight: "bold" },
        },
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
      data: [],
      backgroundColor: "blue",
      borderColor: "blue",
      borderWidth: 1,
      tension: 0.2,
    },
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
        title: {
          display: true,
          text: "Temporadas",
          color: "black",
          font: { weight: "bold" },
        },
      },
    },
  },
};

// Función para actualizar las gráficas
function updateChart(selectedYear, chartSide) {
  const filteredData = output.filter((item) => item.Año === selectedYear);

  const areasTemporal = filteredData
    .filter((item) => item.Tipo_Agua === "Temporal")
    .map((item) => parseFloat(item.Area_km2));
  const areasPermanente = filteredData
    .filter((item) => item.Tipo_Agua === "Permanente")
    .map((item) => parseFloat(item.Area_km2));

  const manualLabels = ["Primavera", "Verano", "Otoño", "Invierno"];

  if (chartSide === "left") {
    leftTemporalData.labels = manualLabels;
    leftTemporalData.datasets[0].data = areasTemporal;
    leftTemporalData.datasets[1].data = areasPermanente;

    leftTemporalConfig.options.scales.x.title.text = `Temporada ${selectedYear}`;

    if (chartInstanceLeft) {
      chartInstanceLeft.destroy();
    }
    const ctxLeft = document
      .getElementById("histogramaLeftTemporal")
      .getContext("2d");
    chartInstanceLeft = new Chart(ctxLeft, leftTemporalConfig);
  } else if (chartSide === "right") {
    rightTemporalData.labels = manualLabels;
    rightTemporalData.datasets[0].data = areasTemporal;
    rightTemporalData.datasets[1].data = areasPermanente;

    rightTemporalConfig.options.scales.x.title.text = `Temporada ${selectedYear}`;

    if (chartInstanceRight) {
      chartInstanceRight.destroy();
    }
    const ctxRight = document
      .getElementById("histogramaRightTemporal")
      .getContext("2d");
    chartInstanceRight = new Chart(ctxRight, rightTemporalConfig);
  }
}

// Escuchar cambios en el selector de la izquierda
document
  .getElementById("leftYearSelector")
  .addEventListener("change", (event) => {
    const selectYearLeft = event.target.value;
    if (output.length > 0) {
      updateChart(selectYearLeft, "left");
    }
  });

// Escuchar cambios en el selector de la derecha
document
  .getElementById("rightYearSelector")
  .addEventListener("change", (event) => {
    const selectYearRight = event.target.value;
    if (output.length > 0) {
      updateChart(selectYearRight, "right");
    }
  });

// Datos para la tercera gráfica (2020 y 2021)
