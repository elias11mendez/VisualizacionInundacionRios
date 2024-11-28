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
      s = "2020";
      // Llamar a la función para actualizar la gráfica después de que los datos estén listos
      updateChart(s); // Llamamos a updateChart con el año que queremos (por ejemplo, 2019)
    })
    .catch((error) => {
      console.error("Error al cargar el archivo:", error);
    });
}

// Llamamos a la función para cargar el archivo
loadFile("Agua_PermanteTemporal.csv");

// Datos para la gráfica inicial
let datosInundacion = {
  labels: [], // Aquí irán las temporadas
  datasets: [
    {
      label: "Agua temporal",
      data: [], // Aquí irán los datos de "Area_km2"
      backgroundColor: "cyan", // Esto da el color de relleno bajo la línea
      borderColor: "blue", // Esto da el color de la línea
      borderWidth: 1, // Esto da el grosor de la línea
      fill: true, // Rellenar debajo de la línea
      tension: 0.2,
    },
  ],
};

// Configuración de la gráfica
const config = {
  type: "line", // Cambiar de 'bar' a 'line'
  data: datosInundacion,
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "km2 Afectados",
        },
      },
      x: {
        title: {
          display: true,
          text: "Temporadas", // Título inicial
          color: "black",
          font: {
            weight: "bold",
          },
        },
      },
    },
  },
};

// Función para actualizar la gráfica
function updateChart(selectedYear) {
  // Filtramos los datos para el año seleccionado y donde Tipo_Agua es "Temporal"
  const filteredData = output.filter(
    (item) => item.Año === selectedYear && item.Tipo_Agua === "Temporal"
  );

  // Extraemos las temporadas y áreas afectadas para el año seleccionado
  const temporadas = filteredData.map((item) => item.Temporada); // Extraemos las temporadas
  const areas = filteredData.map((item) => parseFloat(item.Area_km2)); // Extraemos las áreas (convertimos a número)

  // Actualizamos las etiquetas (x) y los datos (y) de la gráfica
  datosInundacion.labels = temporadas; // Asignamos las temporadas a las etiquetas del eje X
  datosInundacion.datasets[0].data = areas; // Asignamos las áreas al conjunto de datos

  // Actualizamos el título del eje X con el año seleccionado
  config.options.scales.x.title.text = `Temporadas ${selectedYear}`;

  // Renderizamos la gráfica con los nuevos datos
  const ctx = document.getElementById("histogramaCanvas").getContext("2d");
  new Chart(ctx, config); // Vuelve a crear la gráfica con los datos actualizados
}

// Ejemplo de cómo cambiar el año seleccionado y actualizar la gráfica
document.getElementById("selectYear").addEventListener("change", (event) => {
  updateChart(event.target.value); // Actualiza la gráfica cuando se seleccione un nuevo año
});
