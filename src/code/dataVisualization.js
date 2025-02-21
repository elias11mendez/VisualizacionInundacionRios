let output = [];
let selectedYearLeft = null;
let selectedSeasonLeft = null;
let selectedYearRight = null;
let selectedSeasonRight = null;

let chartInstanceLeft = null;
let chartInstanceRight = null;
let chartInstanceTemporal = null;
let chartInstancePermanente = null;

// Función para procesar el archivo CSV
function parseCSV(text) {
  let lines = text.replace(/\r/g, "").split("\n");
  return lines.map((line) => line.split(","));
}

function mapDataToObjects(data) {
  const columns = [
    "Año",
    "Temporada",
    "Tipo_Agua",
    "Area_km2",
    "Numero_de_cuerpos_de_agua",
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
    })
    .catch((error) => {
      console.error("Error al cargar el archivo:", error);
    });
}
loadFile("Agua_PermanteTemporal.csv");

/* -------------------------------------FUNCIONES PARA OBTENMER */

// Obtener referencias a elementos
const modal = document.getElementById("myModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModal = document.querySelector(".close");

// Abrir modal al hacer clic en el botón
openModalBtn.addEventListener("click", () => {
  modal.style.display = "block";
  //  window.location.href = "graficas.html";
  updateThirdChart();
});

if (chartInstanceLeft == null) {
} else {
  console.info("Los datos se han cargado correctamente");
}

// Cerrar modal al hacer clic en el botón de cerrar
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// Cerrar modal si se hace clic fuera del contenido del modal
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

let thirdTemporalData = {
  labels: [],
  datasets: [
    {
      label: "Agua Temporal 2019",
      data: [],
      backgroundColor: "black",
      borderColor: "black",
      borderWidth: 1,
      tension: 0.2,
    },
    {
      label: "Agua Temporal 2020",
      data: [],
      backgroundColor: "blue",
      borderColor: "blue",
      borderWidth: 1,
      tension: 0.2,
    },
    {
      label: "Agua Temporal 2021",
      data: [],
      backgroundColor: "green",
      borderColor: "green",
      borderWidth: 1,
      tension: 0.2,
    },
  ],
};

const thirdTemporalConfig = {
  type: "line",

  data: thirdTemporalData,
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "km2" },
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

let thirdPermanenteData = {
  labels: [],
  datasets: [
    {
      label: "Agua Permanente 2019",
      data: [],
      backgroundColor: "black",
      borderColor: "black",
      borderWidth: 1,
      tension: 0.2,
    },
    {
      label: "Agua Permanente 2020",
      data: [],
      backgroundColor: "blue",
      borderColor: "blue",
      borderWidth: 1,
      tension: 0.2,
    },
    {
      label: "Agua Permanente 2021",
      data: [],
      backgroundColor: "green",
      borderColor: "green",
      borderWidth: 1,
      tension: 0.2,
    },
  ],
};

const thirdPermanenteConfig = {
  type: "line",
  data: thirdPermanenteData,
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "km2" },
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
// Datos para la tercera gráfica (2020 y 2021)
function updateThirdChart() {
  const filteredTemporal2019 = output.filter(
    (item) => item.Año === "2019" && item.Tipo_Agua === "Temporal"
  );

  const filteredTemporal2020 = output.filter(
    (item) => item.Año === "2020" && item.Tipo_Agua === "Temporal"
  );

  const filteredTemporal2021 = output.filter(
    (item) => item.Año === "2021" && item.Tipo_Agua === "Temporal"
  );

  const filteredPermanente2019 = output.filter(
    (item) => item.Año === "2019" && item.Tipo_Agua === "Permanente"
  );

  const filteredPermanente2020 = output.filter(
    (item) => item.Año === "2020" && item.Tipo_Agua === "Permanente"
  );

  const filteredPermanente2021 = output.filter(
    (item) => item.Año === "2021" && item.Tipo_Agua === "Permanente"
  );

  const areasTemporal2019 = filteredTemporal2019.map((item) =>
    parseFloat(item.Area_km2)
  );

  const areasTemporal2020 = filteredTemporal2020.map((item) =>
    parseFloat(item.Area_km2)
  );

  const areasTemporal2021 = filteredTemporal2021.map((item) =>
    parseFloat(item.Area_km2)
  );

  const areasPermanente2019 = filteredPermanente2019.map((item) =>
    parseFloat(item.Area_km2)
  );

  const areasPermanente2020 = filteredPermanente2020.map((item) =>
    parseFloat(item.Area_km2)
  );

  const areasPermanente2021 = filteredPermanente2021.map((item) =>
    parseFloat(item.Area_km2)
  );
  /* 
  console.log("Areas Temporal 2021: ", areasPermanente2019);

  console.log("Areas Temporal 2020: ", areasPermanente2020);
  console.log("Areas Temporal 2021: ", areasPermanente2021); */

  if (areasTemporal2020.length === 0 || areasTemporal2021.length === 0) {
    console.error("No data available for the selected years");
  }

  const manualLabels = ["Primavera", "Verano", "Otoño", "Invierno"];

  thirdTemporalData.labels = manualLabels;
  thirdTemporalData.datasets[0].data = areasTemporal2019;
  thirdTemporalData.datasets[1].data = areasTemporal2020;
  thirdTemporalData.datasets[2].data = areasTemporal2021;

  thirdPermanenteData.labels = manualLabels;

  thirdPermanenteData.datasets[0].data = areasPermanente2019;
  thirdPermanenteData.datasets[1].data = areasPermanente2020;
  thirdPermanenteData.datasets[2].data = areasPermanente2021;

  thirdTemporalConfig.options.scales.x.title.text =
    "Temporadas (2019 - 2020 - 2021)";
  thirdPermanenteConfig.options.scales.x.title.text =
    "Temporadas (2019 - 2020 - 2021)";

  if (chartInstanceTemporal) {
    chartInstanceTemporal.destroy();
  }
  if (chartInstancePermanente) {
    chartInstancePermanente.destroy();
  }

  const ctxTemporal = document
    .getElementById("histogramaThirdTemporal")
    .getContext("2d");
  chartInstanceTemporal = new Chart(ctxTemporal, thirdTemporalConfig);

  const ctxPermanente = document
    .getElementById("histogramaThirdPermanente")
    .getContext("2d");
  chartInstancePermanente = new Chart(ctxPermanente, thirdPermanenteConfig);
}

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
    responsive: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Área (KM²)",
          font: {
            family: "'Montserrat', sans-serif",
            size: 16,
            weight: "bold",
          },
          color: "black", // Color del título
        },
        ticks: {
          font: {
            family: "'Montserrat', sans-serif",
            size: 12,
          },
          color: "black", // Color de las etiquetas
        },
      },
      x: {
        title: {
          display: true,
          text: "Temporadas",
          font: {
            family: "'Montserrat', sans-serif",
            size: 16,
            weight: "bold",
          },
          color: "black", // Color del título
        },
        ticks: {
          font: {
            family: "'Montserrat', sans-serif",
            size: 12,
          },
          color: "black", // Color de las etiquetas
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            family: "'Montserrat', sans-serif",
            size: 12,
          },
          color: "black", // Color de las leyendas
        },
      },
      title: {
        display: true,
        font: {
          family: "'Montserrat', sans-serif",
          size: 16,
          weight: "bold",
        },
        color: "black", // Color del título
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
    responsive: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Área (KM²)",
          font: {
            family: "'Montserrat', sans-serif",
            size: 16,
            weight: "bold",
          },
          color: "black", // Color del texto
        },
        ticks: {
          font: {
            family: "'Montserrat', sans-serif",
            size: 12,
          },
          color: "black", // Color de las etiquetas
        },
      },
      x: {
        title: {
          display: true,
          text: "Temporadas",
          color: "black",
          font: {
            family: "'Montserrat', sans-serif",
            weight: "bold",
            size: 16,
          },
        },
        ticks: {
          font: {
            family: "'Montserrat', sans-serif",
            size: 16,
          },
          color: "black", // Color de las etiquetas
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            family: "'Montserrat', sans-serif",
            size: 12,
          },
          color: "black", // Color de las leyendas
        },
      },
      title: {
        display: true,
        font: {
          family: "'Montserrat', sans-serif",
          size: 16,
          weight: "bold",
        },
        color: "black",
      },
    },
  },
};

// Función para obtener el cuerpo de agua para el lado izquierdo
let cuerpoAguaIzquierda = null;
function getCuerpoAguaIzquierda() {
  const yearToUseLeft = selectedYearLeft;

  if (yearToUseLeft) {
    const loaderLeft = document.querySelector(".loader-container-left");
    loaderLeft.style.display = "none";
  }

  const seasonToUse = selectedSeasonLeft;
  // Filtrar los datos para el lado izquierdo
  const filteredCuerpoAgua = output.filter(
    (item) =>
      item.Año === yearToUseLeft &&
      item.Temporada === seasonToUse &&
      item.Tipo_Agua
  );
  // Obtener el número de cuerpos de agua
  cuerpoAguaIzquierda = filteredCuerpoAgua.map((item) =>
    parseFloat(item.Numero_de_cuerpos_de_agua)
  );
  return cuerpoAguaIzquierda; // Retorna el cuerpo de agua para el lado izquierdo
}

let cuerpoAguaDerecha = null;
function getCuerpoAguaDerecha() {
  const yearToUseRight = selectedYearRight;
  const seasonToUse = selectedSeasonRight;

  if (yearToUseRight) {
    const loaderRight = document.querySelector(".loader-container-right");
    loaderRight.style.display = "none";
  }

  const filteredCuerpoAgua = output.filter(
    (item) =>
      item.Año === yearToUseRight &&
      item.Temporada === seasonToUse &&
      item.Tipo_Agua
  );
  // Obtener el número de cuerpos de agua
  cuerpoAguaDerecha = filteredCuerpoAgua.map((item) =>
    parseFloat(item.Numero_de_cuerpos_de_agua)
  );

  return cuerpoAguaDerecha; // Retorna el cuerpo de agua para el lado derecho
}

function updateCuerposAgua() {
  const cuerpoAguaIzquierda = getCuerpoAguaIzquierda();
  const cuerpoAguaDerecha = getCuerpoAguaDerecha();
}

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
    ctxLeft = document
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

// Lado izquierdo
document
  .getElementById("leftYearSelector")
  .addEventListener("change", (event) => {
    selectedYearLeft = event.target.value;
    updateChart(selectedYearLeft, "left");
    updateCuerposAgua();
  });

document
  .getElementById("leftSeasonSelector")
  .addEventListener("change", (event) => {
    selectedSeasonLeft = event.target.value;
    selectedSeasonLeft =
      selectedSeasonLeft.charAt(0).toUpperCase() + selectedSeasonLeft.slice(1);

    updateChart(selectedSeasonLeft, selectedYearLeft, "left");
    updateCuerposAgua();
  });

// Lado derecho
document
  .getElementById("rightYearSelector")
  .addEventListener("change", (event) => {
    selectedYearRight = event.target.value;
    updateChart(selectedYearRight, "right");
    updateCuerposAgua();
  });

document
  .getElementById("rightSeasonSelector")
  .addEventListener("change", (event) => {
    selectedSeasonRight = event.target.value;
    selectedSeasonRight =
      selectedSeasonRight.charAt(0).toUpperCase() +
      selectedSeasonRight.slice(1);

    updateChart(selectedSeasonRight, selectedYearRight, "right");
    updateCuerposAgua();
  });

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const histogramaArrow = document.getElementById("histogramaArrow");

  histogramaArrow.classList.toggle("moved");

  sidebar.classList.toggle("open");
}

document.getElementById("activateSide").addEventListener("click", function () {
  // Alternar la visibilidad de la vista lateral
  toggleSidebarVisibility();

  // Alternar entre zona Rios y temporal
  toggleZonaRiosTemporal();

  // Desactivar clics en las capas
  disableLayerClicks();

  // Restablecer la vista inicial del mapa
  resetMapView();

  // Eliminar capas existentes
  removeExistingLayers();

  // Deseleccionar cualquier área previamente seleccionada
  deselectArea();

  // Limpiar el nombre del área seleccionada
  clearAreaName();

  // Mostrar u ocultar elementos del UI
  toggleUIElements();

  // Activar o desactivar el comparador (side-by-side)

  toggleSideBySideControl();
  // Desactivar el boton End Clean
  disableBtnEndClean();
  //Alterna entre leyenda inicio y leyenda comparador
  legendLabel();
});

const legendComparador = document.querySelector(".legend-comparadora");
const legendInicio = document.querySelector(".legend");

function legendLabel() {
  if (
    legendInicio.style.display === "flex" ||
    legendInicio.style.display === ""
  ) {
    legendInicio.style.display = "none";
    legendComparador.style.display = "flex";
  } else {
    legendInicio.style.display = "flex";
    legendComparador.style.display = "none";
  }
}

let isDisabled = false;

function disableBtnEndClean() {
  const btnEndClean = document.getElementById("btn-endClean");
  if (isDisabled) {
    btnEndClean.disabled = false;
    btnEndClean.style.backgroundColor = "";
    btnEndClean.style.color = "";
    btnEndClean.style.opacity = "";
    btnEndClean.style.cursor = "";
    capasMunicipio(lat, long, baseWMSUrl);
  } else {
    btnEndClean.disabled = true;
    btnEndClean.style.color = "#999";
    btnEndClean.style.opacity = 0.7;
    btnEndClean.style.cursor = "not-allowed";
  }
  isDisabled = !isDisabled;
}

function toggleSidebarVisibility() {
  var labelSelectedArea = document.querySelector(
    ".label-selected-area-container"
  );
  var currentDisplay = window.getComputedStyle(labelSelectedArea).display;

  if (currentDisplay === "flex") {
    labelSelectedArea.style.display = "none";
  } else {
    labelSelectedArea.style.display = "flex";
  }
}

function toggleZonaRiosTemporal() {
  var zonaRiosMunicipio = document.getElementById("zonaRiosMunicipio");
  var temporal = document.getElementById("temporal");

  if (zonaRiosMunicipio.style.display === "none") {
    zonaRiosMunicipio.style.display = "block";
    temporal.style.display = "none";
  } else {
    zonaRiosMunicipio.style.display = "none";
    temporal.style.display = "block";
  }
}

function disableLayerClicks() {
  allLayers.forEach((layer) => {
    layer.off("click");
    layer.setStyle({ pointerEvents: "none" });
  });
}

function resetMapView() {
  map.setView([lat, long], initialZoom);
  console.warn("Restableciendo vista del mapa.");
}

function removeExistingLayers() {
  if (leftLayerTemporal) map.removeLayer(leftLayerTemporal);
  if (rightLayerTemporal) map.removeLayer(rightLayerTemporal);
  if (leftLayerPermanente) map.removeLayer(leftLayerPermanente);
  if (rightLayerPermanente) map.removeLayer(rightLayerPermanente);
  if (zonaRiosPermanent) {
    map.removeLayer(zonaRiosPermanent);
    checkboxPermanent.checked = false;
  }
  if (zonaRiosFloods) {
    map.removeLayer(zonaRiosFloods);
    zonaRiosFloods = null;
  }
  if (municipioFloods) {
    map.removeLayer(municipioFloods);
    municipioFloods = null;
  }

  allMunicipiosLayers.forEach((layer) => {
    if (map.hasLayer(layer)) {
      map.removeLayer(layer);
    }
  });
  if (zonaRiosAntes) map.removeLayer(zonaRiosAntes);
  if (zonaRiosDurante) map.removeLayer(zonaRiosDurante);
  if (zonaRiosDespues) map.removeLayer(zonaRiosDespues);

  if (municipioPermanent) {
    map.removeLayer(municipioPermanent);
  }
}

function deselectArea() {
  if (selectedLayer) {
    selectedLayer.setStyle({
      color: "white",
      weight: 0.2,
      fillOpacity: 0.1,
    });
    selectedLayer = null;
  }
}

function clearAreaName() {
  areaName = null;
  document.getElementById("zona-selected").innerHTML = "Zona Rios";
}

function toggleUIElements() {
  const selectorContainer = document.querySelector(".selector-container");
  const histogramaArrow = document.querySelector(".histogramaArrow");
  const modal = document.querySelector(".modal");
  const legend = document.querySelector(".legend");

  legend.style.display = "flex";

  if (
    selectorContainer.style.display === "none" ||
    selectorContainer.style.display === ""
  ) {
    selectorContainer.style.display = "flex";
    histogramaArrow.style.display = "flex";
    alert(
      "Por favor, cargue las capas para iniciar la comparación y visualizar las gráficas."
    );
  } else {
    selectorContainer.style.display = "none";
    histogramaArrow.style.display = "flex";
    modal.style.display = "none";
    legend.style.display = "none";
  }
}
function toggleSideBySideControl() {
  if (sideBySideControl === null) {
    if (leftLayerTemporal && rightLayerTemporal) {
      activateSideBySide();
    }
  } else {
    deactivateSideBySide();
  }
}

//=--=0=-=-=-----------Graficasandlogicaofdeend----------------------------------------------------------------------
let areaSeleccionada = null;
let histogramaZonaRios = null;
window.addEventListener("estoenviaelcambiodelmunicipio", function (event) {
  areaSeleccionada = event.detail;

  document.getElementById("zona-selected").innerHTML = areaName;
  document.getElementById(
    "label-selected-area"
  ).innerHTML = `<span>${areaName} </span> `;
  document.getElementById("zona-selected-down").innerHTML = areaName;
  document.getElementById(
    "label-selected-area"
  ).innerHTML = `<span>${areaName} </span> `;

  actualizarGrafica(areaSeleccionada);
});

function actualizarGrafica(municipio) {
  fetch("zonarios2020.json")
    .then((response) => response.json())
    .then((datos) => {
      const municipioData = datos.zonarios[municipio];
      const zonaRiosData = datos.zonarios;
      const kmMunicipio = municipioData.km;
      const kmAffected = municipioData.Durante;

      let porcentajeAffected = (kmAffected / kmMunicipio) * 100;

      document.getElementById(
        "label-periodo"
      ).innerHTML = ` ${kmMunicipio.toFixed(1)}km²`;
      document.getElementById(
        "label-selected-area-affected"
      ).innerHTML = `${porcentajeAffected.toFixed(1)}%`;

      if (!municipioData) {
        console.warn(`Datos no encontrados para el municipio: ${municipio}`);
        return;
      }

      const etiquetas = [municipio];
      const antes = [municipioData.Antes];
      const durante = [municipioData.Durante];
      const despues = [municipioData.Despues];

      // Datos estructurados
      const etiquetasPeriodo = ["Antes", "Durante", "Después"];
      const datosTenosique = [
        zonaRiosData.Tenosique.Antes,
        zonaRiosData.Tenosique.Durante,
        zonaRiosData.Tenosique.Despues,
      ];
      const datosBalancan = [
        zonaRiosData.Balancan.Antes,
        zonaRiosData.Balancan.Durante,
        zonaRiosData.Balancan.Despues,
      ];
      const datosZapata = [
        zonaRiosData.EmilianoZapata.Antes,
        zonaRiosData.EmilianoZapata.Durante,
        zonaRiosData.EmilianoZapata.Despues,
      ];
      if (histogramaZonaRios) {
        histogramaZonaRios.data.labels = etiquetas;
        histogramaZonaRios.data.datasets[0].data = antes;
        histogramaZonaRios.data.datasets[1].data = durante;
        histogramaZonaRios.data.datasets[2].data = despues;
        histogramaZonaRios.update();
      } else {
        const ctxMunicipios = document
          .getElementById("histogramaMunicipio")
          .getContext("2d");
        const histogramaMunicipio = new Chart(ctxMunicipios, {
          type: "line",
          data: {
            labels: etiquetasPeriodo,
            datasets: [
              {
                label: "Tenosique",
                data: datosTenosique,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 0.5,
                tension: 0.2,
              },
              {
                label: "Balancán",
                data: datosBalancan,
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 0.5,

                tension: 0.2,
              },
              {
                label: "Emiliano Zapata",
                data: datosZapata,
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 0.5,
                tension: 0.2,
              },
            ],
          },
          options: {
            responsive: false,
            maintainAspectRatio: false,
            aspectRatio: 1,
            plugins: {
              legend: {
                display: true,
                position: "top",
                labels: {
                  font: {
                    family: "'Montserrat', sans-serif",
                    size: 16,
                  },
                  color: "#000000",
                },
              },
              title: {
                display: true,
                font: {
                  family: "'Montserrat', sans-serif",
                  size: 2,
                  weight: "bold",
                },
                color: "#000000",
                padding: {
                  top: 10,
                  bottom: 20,
                },
              },
            },
            scales: {
              y: {
                barPercentage: 0.5,
                categoryPercentage: 0.8,
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Área (KM²)",
                  font: {
                    family: "'Montserrat', sans-serif",
                    size: 16,
                    weight: "bold",
                  },
                  color: "#000000",
                },
                ticks: {
                  font: {
                    family: "'Montserrat', sans-serif",
                    size: 16,
                  },
                  color: "#000000",
                },
              },
              x: {
                barPercentage: 0.5,
                categoryPercentage: 0.8,
                title: {
                  display: true,
                  text: "Comparacion municipal",
                  font: {
                    family: "'Montserrat', sans-serif",
                    size: 16,
                    weight: "bold",
                  },
                  color: "#000000",
                },
                ticks: {
                  font: {
                    family: "'Montserrat', sans-serif",
                    size: 16,
                  },
                  color: "#000000",
                },
              },
            },
          },
        });

        const ctx = document
          .getElementById("histogramaZonaRios")
          .getContext("2d");

        histogramaZonaRios = new Chart(ctx, {
          type: "bar",

          data: {
            labels: etiquetas,
            datasets: [
              {
                label: "Antes",
                data: antes,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
              {
                label: "Durante",
                data: durante,
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
              },
              {
                label: "Después",
                data: despues,
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: false,
            maintainAspectRatio: false,
            aspectRatio: 1,
            barPercentage: 0.5,
            categoryPercentage: 0.8,
            plugins: {
              legend: {
                display: true,
                position: "top",
                labels: {
                  font: {
                    family: "'Montserrat', sans-serif",
                    size: 16,
                  },
                  color: "#000000",
                },
              },
              title: {
                display: true,
                color: "#000000",
                font: {
                  size: 2,
                  family: "'Montserrat', sans-serif",
                  weight: "bold",
                },
              },
            },
            scales: {
              y: {
                linePercentage: 0.5,
                categoryPercentage: 0.8,
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Área (KM²)",
                  color: "#000000",
                  font: {
                    size: 16,
                    family: "'Montserrat', sans-serif",
                    weight: "bold",
                  },
                },
                ticks: {
                  font: {
                    family: "'Montserrat', sans-serif",
                    size: 16,
                  },
                  color: "#000000",
                },
              },
              x: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Gráfica regional",
                  color: "#000000",
                  font: {
                    size: 16,
                    family: "'Montserrat', sans-serif",
                    weight: "bold",
                  },
                },
                ticks: {
                  font: {
                    family: "'Montserrat', sans-serif",
                    size: 16,
                  },
                  color: "#000000",
                },
              },
            },
          },
        });
      }
    })
    .catch((error) =>
      console.error("Error al cargar el JSON o datos no encontrados:", error)
    );
}
actualizarGrafica("Zona Rios");

//---------------------------------Controlador de modal informacio -----------------------

const btnInfo = document.getElementById("info-side");
const modalInfo = document.getElementById("modal-info");
const closeBtn = document.querySelector(".close");
const closeInfo = document.querySelector(".close-info");

btnInfo.addEventListener("click", () => {
  modalInfo.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  modalInfo.style.display = "none";
});

closeInfo.addEventListener("click", () => {
  modalInfo.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === modalInfo) {
    modalInfo.style.display = "none";
  }
});
