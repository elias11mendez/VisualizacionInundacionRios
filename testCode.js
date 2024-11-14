var map = L.map("map").setView([17.810782, -91.533937], 12);

var osmLayer = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution: "&copy; OpenStreetMap contributors",
  }
).addTo(map);

/* ---------------------------------PETECIONES DE DATOS DE INUNDACIONES----------------------------------------------------------------------------- */
var datos2019 = new L.tileLayer(
  "https://storage.googleapis.com/global-surface-water/tiles2019/transitions/{z}/{x}/{y}.png",
  {
    format: "image/png",
    maxZoom: 13,
    errorTileUrl:
      "https://storage.googleapis.com/global-surface-water/downloads_ancillary/blank.png",
    attribution: "2016 EC JRC/Google",
  }
);

var datos2020 = new L.tileLayer(
  "https://storage.googleapis.com/global-surface-water/tiles2020/transitions/{z}/{x}/{y}.png",
  {
    format: "image/png",
    maxZoom: 13,
    errorTileUrl:
      "https://storage.googleapis.com/global-surface-water/downloads_ancillary/blank.png",
    attribution: "2016 EC JRC/Google",
  }
);

var datos2021 = new L.tileLayer(
  "https://storage.googleapis.com/global-surface-water/tiles2021/transitions/{z}/{x}/{y}.png",
  {
    format: "image/png",
    maxZoom: 13,
    errorTileUrl:
      "https://storage.googleapis.com/global-surface-water/downloads_ancillary/blank.png",
    attribution: "2016 EC JRC/Google",
  }
);
var datos2022 = new L.tileLayer(
  "https://storage.googleapis.com/global-surface-water/tiles2022/transitions/{z}/{x}/{y}.png",
  {
    format: "image/png",
    maxZoom: 13,
    errorTileUrl:
      "https://storage.googleapis.com/global-surface-water/downloads_ancillary/blank.png",
    attribution: "2016 EC JRC/Google",
  }
);



/* ---------------------------------PETECIONES DE DATOS DE INUNDACIONES----------------------------------------------------------------------------- */

var sideBySideControl = null;

function activarSideBySide() {
  osmLayer.addTo(map);
  datos2020.addTo(map);
  datos2021.addTo(map);

  sideBySideControl = L.control.sideBySide(datos2020, datos2021).addTo(map);

  map.dragging.disable();

  document.getElementById("activateSide").innerText = "Desactivar comparación";
}

function desactivarSideBySide() {
  map.removeLayer(datos2020);
  map.removeLayer(datos2021);

  map.dragging.enable();

  if (sideBySideControl) {
    map.removeControl(sideBySideControl);
    sideBySideControl = null;
  }

  document.getElementById("activateSide").innerText = "Activar comparación";
}

document.getElementById("activateSide").addEventListener("click", function () {
  if (sideBySideControl === null) {
    activarSideBySide();
  } else {
    desactivarSideBySide();
  }
});
