// Obtener referencias a elementos
const modal = document.getElementById("myModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModal = document.querySelector(".close");

// Abrir modal al hacer clic en el botón
openModalBtn.addEventListener("click", () => {
  modal.style.display = "block";
  updateThirdChart();
});

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
  console.log("sdasdasdas", output);

  const filteredPermanente2021 = output.filter(
    (item) => item.Año === "2021" && item.Tipo_Agua === "Permanente"
  );

  const areasTemporal2019 = filteredTemporal2019.map((item) =>
    parseFloat(item.Area_km2)
  );

  const areasTemporal2020 = filteredTemporal2020.map((item) =>
    parseFloat(item.Area_km2)
  );
  console.log(areasTemporal2020, "asdasd");

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

