var map = L.map("map").setView([17.810782, -91.533937], 10);

//--------------------------------------------------------CARGA LA CAPA INICIAL DEL MAPA----------------------------
var osmLayer = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution: "&copy; OpenStreetMap contributors",
  }
).addTo(map);

var capasDatos = {
  2018: L.tileLayer(
    "https://storage.googleapis.com/global-surface-water/tiles2018/transitions/{z}/{x}/{y}.png",
    {
      format: "image/png",
      maxZoom: 13,
      errorTileUrl:
        "https://storage.googleapis.com/global-surface-water/downloads_ancillary/blank.png",
      attribution: "2016 EC JRC/Google",
    }
  ),
  2019: L.tileLayer(
    "https://storage.googleapis.com/global-surface-water/tiles2019/transitions/{z}/{x}/{y}.png",
    {
      format: "image/png",
      maxZoom: 13,
      errorTileUrl:
        "https://storage.googleapis.com/global-surface-water/downloads_ancillary/blank.png",
      attribution: "2016 EC JRC/Google",
    }
  ),
  2020: L.tileLayer(
    "https://storage.googleapis.com/global-surface-water/tiles2020/transitions/{z}/{x}/{y}.png",
    {
      format: "image/png",
      maxZoom: 13,
      errorTileUrl:
        "https://storage.googleapis.com/global-surface-water/downloads_ancillary/blank.png",
      attribution: "2016 EC JRC/Google",
    }
  ),
  2021: L.tileLayer(
    "https://storage.googleapis.com/global-surface-water/tiles2021/transitions/{z}/{x}/{y}.png",
    {
      format: "image/png",
      maxZoom: 13,
      errorTileUrl:
        "https://storage.googleapis.com/global-surface-water/downloads_ancillary/blank.png",
      attribution: "2016 EC JRC/Google",
    }
  ),
};
//-----------------------------------LOGICA DE CARGA DE CAPAS DE INUNDACION----------------------------

var leftLayer, rightLayer; 

var sideBySideControl = null;

function activarSideBySide() {
  var leftYear = document.getElementById("leftLayer").value;
  var rightYear = document.getElementById("rightLayer").value;

  leftLayer = capasDatos[leftYear];
  rightLayer = capasDatos[rightYear];

  map.dragging.disable();

  for (var key in capasDatos) {
    map.removeLayer(capasDatos[key]);
  }

  osmLayer.addTo(map);
  leftLayer.addTo(map);
  rightLayer.addTo(map);

  if (sideBySideControl) {
    map.removeControl(sideBySideControl);
    sideBySideControl = null;
  }

  sideBySideControl = L.control.sideBySide(leftLayer, rightLayer).addTo(map);

  document.getElementById("activateSide");

  document.querySelector(".selector-container").style.display = "block";
}

function desactivarSideBySide() {
  if (leftLayer) map.removeLayer(leftLayer);
  if (rightLayer) map.removeLayer(rightLayer);

  map.dragging.enable();

  if (sideBySideControl) {
    map.removeControl(sideBySideControl);
    sideBySideControl = null;
  }

  osmLayer.addTo(map);

  document.getElementById("activateSide");

  document.querySelector(".selector-container").style.display = "none";
}

function manejarCambio() {
  var leftYear = document.getElementById("leftLayer").value;
  var rightYear = document.getElementById("rightLayer").value;

  if (leftYear && rightYear) {
    activarSideBySide();
  }
}

document.getElementById("activateSide").addEventListener("click", function () {
  if (sideBySideControl === null) {
    activarSideBySide();
  } else {
    desactivarSideBySide();
  }
});

document.getElementById("leftLayer").addEventListener("change", manejarCambio);
document.getElementById("rightLayer").addEventListener("change", manejarCambio);

osmLayer.addTo(map);
