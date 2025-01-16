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
      console.log("Datos cargados:", output);
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
  console.log("cargando datos");
} else {
  console.log("datos cargados correctamente");
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
  console.log("sdasdasdas", output);

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
  console.log(areasTemporal2020, "asdasd");

  const areasPermanente2021 = filteredPermanente2021.map((item) =>
    parseFloat(item.Area_km2)
  );

  console.log("Areas Temporal 2021: ", areasPermanente2019);

  console.log("Areas Temporal 2020: ", areasPermanente2020);
  console.log("Areas Temporal 2021: ", areasPermanente2021);

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
      y: { beginAtZero: true, title: { display: true, text: "km2" } },
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
// Función para obtener el cuerpo de agua para el lado izquierdo
let cuerpoAguaIzquierda = null
function getCuerpoAguaIzquierda() {
  const yearToUse = selectedYearLeft;
  const seasonToUse = selectedSeasonLeft;
  // Filtrar los datos para el lado izquierdo
  const filteredCuerpoAgua = output.filter(
    (item) =>
      item.Año === yearToUse &&
      item.Temporada === seasonToUse &&
      item.Tipo_Agua === "Temporal"
  );
  // Obtener el número de cuerpos de agua
    cuerpoAguaIzquierda = filteredCuerpoAgua.map((item) =>
    parseFloat(item.Numero_de_cuerpos_de_agua)
  );
  console.log(yearToUse, seasonToUse, cuerpoAguaIzquierda);
  return cuerpoAguaIzquierda; // Retorna el cuerpo de agua para el lado izquierdo
}

let cuerpoAguaDerecha = null
function getCuerpoAguaDerecha() {
  const yearToUse = selectedYearRight;
  const seasonToUse = selectedSeasonRight;
  // Filtrar los datos para el lado derecho
  const filteredCuerpoAgua = output.filter(
    (item) =>
      item.Año === yearToUse &&
      item.Temporada === seasonToUse &&
      item.Tipo_Agua === "Temporal"
  );
  // Obtener el número de cuerpos de agua
    cuerpoAguaDerecha = filteredCuerpoAgua.map((item) =>
    parseFloat(item.Numero_de_cuerpos_de_agua)
  );
  console.log(yearToUse,seasonToUse, cuerpoAguaDerecha);
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
    selectedYearLeft = event.target.value;
    if (output.length > 0) {
      updateChart(selectedYearLeft, "left");
    }
    updateCuerposAgua();
  });

document
  .getElementById("leftSeasonSelector")
  .addEventListener("change", (event) => {
    selectedSeasonLeft = event.target.value;

    // Hacer que la primera letra sea mayúscula
    selectedSeasonLeft =
      selectedSeasonLeft.charAt(0).toUpperCase() + selectedSeasonLeft.slice(1);

    console.log(
      "Temporada seleccionada en la izquierda:",
      selectedYearLeft,
      selectedSeasonLeft
    );

    if (output.length > 0) {
      updateChart(selectedSeasonLeft, "left");
    }
    updateCuerposAgua();
  });

document
  .getElementById("rightYearSelector")
  .addEventListener("change", (event) => {
    selectedYearRight = event.target.value;
    if (output.length > 0) {
      updateChart(selectedYearRight, "right");
    }
    updateCuerposAgua();
  });

document
  .getElementById("rightSeasonSelector")
  .addEventListener("change", (event) => {
    selectedSeasonRight = event.target.value;

    // Hacer que la primera letra sea mayúscula
    selectedSeasonRight =
      selectedSeasonRight.charAt(0).toUpperCase() +
      selectedSeasonRight.slice(1);

    console.log(
      "Temporada seleccionada en la izquierda:",
      selectedYearRight,
      selectedSeasonRight
    );

    if (output.length > 0) {
      updateChart(selectedSeasonRight, "right");
      updateCuerposAgua();

    }
  });

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const histogramaArrow = document.getElementById("histogramaArrow");
  console.log("haciendo clic");

  histogramaArrow.classList.toggle("moved");

  sidebar.classList.toggle("open");
}

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
    modal.style.display = "none";
  }

  // Activar o desactivar el comparador
  if (sideBySideControl === null) {
    if (leftLayerTemporal && rightLayerTemporal) {
      activateSideBySide();
    }
  } else {
    deactivateSideBySide();
  }
});
