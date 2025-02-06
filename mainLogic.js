let lat = 17.710782;
let long = -91.286937;
let initialZoom = 10;
let initialView;
let map = L.map("map").setView([lat, long], initialZoom);
let baseWMSUrl = "http://localhost:8080/geoserver/zonarios/wms";
let zIndexView = 2;
L.control
  .scale({
    position: "bottomright",
    maxWidth: 200,
    metric: true,
    imperial: true,
    updateWhenIdle: false,
  })
  .addTo(map);

const cartoblack = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  }
).addTo(map);

const esriLayer = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution: '&copy; <a href="https://www.esri.com/">ESRI</a>',
    maxZoom: 30,
  }
);
const openstreetmap = L.tileLayer(
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
);

console.log(zIndexView);

let iconoActivo = false;
let isVisible = true;
let iconoChange;
let allMunicipiosLayers = [];

const btnLayerView = document.getElementById("btn-layerView");

if (btnLayerView) {
  btnLayerView.addEventListener("click", () => {
    let capaModificada = false;

    if (isVisible) {
      if (zonaRiosFloods) {
        zonaRiosFloods.setOpacity(0);
        capaModificada = true;
      } else {
        console.warn("No hay capa de la zona de ríos");
      }

      if (zonaRiosDurante) {
        zonaRiosDurante.setOpacity(0);
        zonaRiosDespues.setOpacity(0);
        zonaRiosAntes.setOpacity(0);
        capaModificada = true;
      } else {
        console.warn("No hay capa de la zona de ríos");
      }

      if (municipioFloods) {
        municipioFloods.setOpacity(0);
        capaModificada = true;
      } else {
        console.warn("No hay capa de municipios seleccionada");
      }

      if (allMunicipiosLayers.length > 0) {
        allMunicipiosLayers[0].setOpacity(0);
        allMunicipiosLayers[1].setOpacity(0);
        allMunicipiosLayers[2].setOpacity(0);

        capaModificada = true;
      } else {
        console.warn("No hay capas de municipios disponibles.");
      }

      if (capaModificada) {
        console.log("Capas ocultas");
      }
    } else {
      if (zonaRiosFloods) {
        zonaRiosFloods.setOpacity(1);
        capaModificada = true;
      }
      if (municipioFloods) {
        municipioFloods.setOpacity(1);
        capaModificada = true;
      }

      if (zonaRiosDurante) {
        zonaRiosDurante.setOpacity(1);
        zonaRiosDespues.setOpacity(1);
        zonaRiosAntes.setOpacity(1);

        capaModificada = true;
      } else {
        console.warn("No hay capa de la zona de ríos");
      }

      if (allMunicipiosLayers.length > 0) {
        allMunicipiosLayers[0].setOpacity(1);
        allMunicipiosLayers[1].setOpacity(1);
        allMunicipiosLayers[2].setOpacity(1);

        capaModificada = true;
      } else {
        console.warn("No hay capas de municipios disponibles.");
      }

      if (capaModificada) {
        console.log("Capas mostradas");
      }
    }

    if (capaModificada) {
      iconoActivo = !iconoActivo;
      console.log(capaModificada, "CAPA MODIFICADA");

      iconoChange = document.getElementById("icono-change");
      if (iconoChange) {
        iconoChange.className = iconoActivo ? "bx bx-show" : "bx bx-low-vision";
      }

      isVisible = !isVisible;
    }
  });
} else {
  console.error("El botón btn-layerView no se encontró en el DOM");
}
const btnLayerSatelite = document.getElementById("btn-layer-satelite");
const btnLayerOpenstreet = document.getElementById("btn-layer-openstreetmap");
const btnLayerCartoblack = document.getElementById("btn-layer-cartoblack");
const optionMaps = document.querySelector(".map-layer-container");
const btnOptionsMap = document.getElementById("btn-option-maps");

btnOptionsMap.addEventListener("click", () => {
  if (optionMaps.style.display === "none") {
    optionMaps.style.display = "flex"
  }else{
    optionMaps.style.display = "none"
  }
});

let labelColorLayer;

btnLayerSatelite.addEventListener("click", () => {
  console.log("click");

  if (openstreetmap || cartoblack) {
    btnLayerSatelite.style.opacity = "0.5";
    btnLayerOpenstreet.style.opacity = "1";
    btnLayerCartoblack.style.opacity = "1";
  }
  if (cartoblack && openstreetmap) {
    if (map.hasLayer(cartoblack)) {
      map.removeLayer(cartoblack);
      map.removeLayer(openstreetmap);

      btnLayerSatelite.style.opacity = "0.5";

      esriLayer.addTo(map);
      labelColorLayer = document.querySelector(
        ".label-selected-area-container"
      );
      labelColorLayer.style.color = "white";
    } else {
      map.removeLayer(openstreetmap);
      esriLayer.addTo(map);
      labelColorLayer.style.color = "white";
    }
  }
});

btnLayerOpenstreet.addEventListener("click", () => {
  console.log("click");

  if (esriLayer || cartoblack) {
    btnLayerSatelite.style.opacity = "1";
    btnLayerOpenstreet.style.opacity = "1";
    btnLayerCartoblack.style.opacity = "1";
  }

  if (openstreetmap) {
    btnLayerOpenstreet.style.opacity = "0.5";
  }
  if (cartoblack && esriLayer) {
    if (map.hasLayer(cartoblack)) {
      map.removeLayer(cartoblack);
      map.removeLayer(esriLayer);

      btnLayerOpenstreet.style.opacity = "0.5";
      btnLayerSatelite.style.opacity = "1";

      openstreetmap.addTo(map);
      labelColorLayer = document.querySelector(
        ".label-selected-area-container"
      );
      labelColorLayer.style.color = "#333";
    } else {
      map.removeLayer(esriLayer);
      openstreetmap.addTo(map);
      labelColorLayer.style.color = "#333";
    }
  }
});

btnLayerCartoblack.addEventListener("click", () => {
  console.log("click");
  if (esriLayer || openstreetmap) {
    btnLayerSatelite.style.opacity = "1";
    btnLayerOpenstreet.style.opacity = "1";
    btnLayerCartoblack.style.opacity = "0.5";
  }
  if (openstreetmap && esriLayer) {
    if (map.hasLayer(cartoblack)) {
      map.removeLayer(openstreetmap);
      cartoblack.addTo(map);
      labelColorLayer = document.querySelector(
        ".label-selected-area-container"
      );
      labelColorLayer.style.color = "#888";
    } else {
      map.removeLayer(esriLayer);
      cartoblack.addTo(map);
      labelColorLayer.style.color = "#888";
    }
  }
});

let capasActivas = false; // Inicia en falso para evitar problemas si lo pongo en true deja de funcionar
let zonaRiosAntes, zonaRiosDespues, zonaRiosDurante;

function allLayersZonaRios() {
  if (capasActivas) {
    zonaRiosDurante = L.tileLayer
      .wms(baseWMSUrl, {
        layers: "ZonaRiosDurante2020",
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        crs: L.CRS.EPSG3857,
        formatoptions: "antialiasing:off",
        tileSize: 256,
        tiled: true,
        zIndex: 2,
      })
      .addTo(map);

    zonaRiosDespues = L.tileLayer
      .wms(baseWMSUrl, {
        layers: "ZonaRiosDespues2020",
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        crs: L.CRS.EPSG3857,
        formatoptions: "antialiasing:off",
        tileSize: 256,
        tiled: true,
        zIndex: 4,
      })
      .addTo(map);

    zonaRiosAntes = L.tileLayer
      .wms(baseWMSUrl, {
        layers: "ZonaRiosAntes2020",
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        crs: L.CRS.EPSG3857,
        formatoptions: "antialiasing:off",
        tileSize: 256,
        tiled: true,
        zIndex: 3,
      })
      .addTo(map);
  }
}

const checkboxAllLayer = document.getElementById("Checkbox-all");

checkboxAllLayer.addEventListener("change", function () {
  capasActivas = this.checked;

  if (capasActivas) {
    allLayersZonaRios();
  } else {
    if (map.hasLayer(zonaRiosAntes)) {
      map.removeLayer(zonaRiosAntes);
    }
    if (map.hasLayer(zonaRiosDespues)) {
      map.removeLayer(zonaRiosDespues);
    }
    if (map.hasLayer(zonaRiosDurante)) {
      map.removeLayer(zonaRiosDurante);
    }
  }
});

// Variables
let leftLayers = { temporal: null, permanente: null };
let rightLayers = { temporal: null, permanente: null };

let leftLayerTemporal = null;
let rightLayerTemporal = null;
let leftLayerPermanente = null;
let rightLayerPermanente = null;
let sideBySideControl = null;
let municipioFloods = null;
let selectedPeriod = null;
let currentPeriod = "Durante";
let zonaRiosFloods = null;
let allLayers = [];
let selectedLayer = null;
let areaName = null;
let checkboxPermanent;
let zonaRiosPermanent = null;
let municipioPermanent = null;
checkboxPermanent = document.getElementById("Checkbox-Permanent");

checkboxPermanent.addEventListener("change", function () {
  if (checkboxPermanent.checked) {
    zonaRiosPermanent = L.tileLayer
      .wms(baseWMSUrl, {
        layers: "ZonaRios2020",
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        crs: L.CRS.EPSG3857,
        formatoptions: "antialiasing:off",
        tileSize: 256,
        tiled: true,
        zIndex: zIndexView,
      })
      .addTo(map);
  } else {
    // Si el checkbox se desmarca se elimina la capa
    if (zonaRiosPermanent) {
      zonaRiosPermanent.remove();
    }
  }
});

function capasMunicipio(lat, long, baseWMSUrl) {
  function cargarZonaRios(layerName) {
    if (zonaRiosFloods) {
      map.removeLayer(zonaRiosFloods);
    }

    if (zonaRiosAntes) {
      map.removeLayer(zonaRiosAntes);
      checkboxAllLayer.checked = false;
    }
    if (zonaRiosDespues) {
      map.removeLayer(zonaRiosDespues);
      checkboxAllLayer.checked = false;
    }
    if (zonaRiosDurante) {
      map.removeLayer(zonaRiosDurante);
      checkboxAllLayer.checked = false;
    }
    if (municipioPermanent) {
      map.removeLayer(municipioPermanent);
    }

    zonaRiosFloods = L.tileLayer
      .wms(baseWMSUrl, {
        layers: layerName,
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        crs: L.CRS.EPSG3857,
        formatoptions: "antialiasing:off",
        tileSize: 256,
        tiled: true,
        zIndex: zIndexView,
      })
      .addTo(map);
  }

  function cargarCapa(layerName) {
    if (municipioFloods) {
      map.removeLayer(municipioFloods);
    }

    allMunicipiosLayers.forEach((layer) => {
      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    });

    if (municipioPermanent) {
      map.removeLayer(municipioPermanent);
    }
    //-------------------------------------------------aqui se obtine la capa permanente de municipios--------
    const checkboxMunicipioPermanente =
      document.getElementById("Checkbox-Permanent");
    checkboxMunicipioPermanente.addEventListener("change", function () {
      if (zonaRiosPermanent) {
        map.removeLayer(zonaRiosPermanent);
      }
      if (municipioPermanent) {
        map.removeLayer(municipioPermanent);
      }

      if (checkboxMunicipioPermanente.checked) {
        municipioPermanent = L.tileLayer
          .wms(baseWMSUrl, {
            layers: `${selectedAreaName}Permanente2020`,
            format: "image/png",
            transparent: true,
            version: "1.1.0",
            crs: L.CRS.EPSG3857,
            formatoptions: "antialiasing:off",
            tileSize: 256,
            tiled: true,
            zIndex: zIndexView,
          })
          .addTo(map);
      } else {
        if (municipioPermanent) {
          municipioPermanent.remove();
        }
      }

      console.log(municipioPermanent);
    });

    checkboxAllLayer.checked = false;

    const allLayersMunicipio = document.getElementById("Checkbox-all");

    allLayersMunicipio.addEventListener("change", function () {
      [zonaRiosAntes, zonaRiosDespues, zonaRiosDurante].forEach((layer) => {
        if (layer && map.hasLayer(layer)) {
          map.removeLayer(layer);
        }
      });

      console.log("En municipios");

      if (allLayersMunicipio.checked) {
        const capasMunicipios = ["Antes2020", "Durante2020", "Despues2020"];

        allMunicipiosLayers.forEach((layer) => {
          if (map.hasLayer(layer)) {
            map.removeLayer(layer);
          }
        });

        allMunicipiosLayers = [];

        allMunicipiosLayers = capasMunicipios.map((capa) =>
          L.tileLayer
            .wms(baseWMSUrl, {
              layers: `${selectedAreaName}${capa}`,
              format: "image/png",
              transparent: true,
              version: "1.1.0",
              crs: L.CRS.EPSG3857,
              formatoptions: "antialiasing:off",
              tileSize: 256,
              tiled: true,
              zIndex: 3,
            })
            .addTo(map)
        );

        console.log("Capas agregadas:", allMunicipiosLayers);
      } else {
        allMunicipiosLayers.forEach((layer) => {
          if (map.hasLayer(layer)) {
            map.removeLayer(layer);
          }
        });

        allMunicipiosLayers = [];

        console.log("Capas eliminadas");
      }
    });

    municipioFloods = L.tileLayer
      .wms(baseWMSUrl, {
        layers: layerName,
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        crs: L.CRS.EPSG3857,
        formatoptions: "antialiasing:off",
        tileSize: 256,
        tiled: true,
        zIndex: zIndexView,
      })
      .addTo(map);
  }

  selectPeriodo = document.getElementById("SelectPeriodo");
  selectPeriodo.value = "Durante";

  selectPeriodo.addEventListener("change", () => {
    const selectedPeriod = selectPeriodo.value;
    currentPeriod = selectedPeriod;

    // Actualizar la capa de Zona Ríos
    if (zonaRiosFloods) {
      iconoActivo = !iconoActivo;

      if (iconoChange) {
        iconoChange.className = iconoActivo
          ? "bx bx-low-vision"
          : "bx bx-low-vision";
      }
      isVisible = !isVisible;
      const layerZonaRios = `ZonaRios${currentPeriod}2020`;
      cargarZonaRios(layerZonaRios);
    }

    if (areaName) {
      layerName = `${areaName}${currentPeriod}2020`;
      iconoActivo = !iconoActivo;

      if (iconoChange && layerName) {
        iconoChange.className = iconoActivo
          ? "bx bx-low-vision"
          : "bx bx-low-vision";
      }
      isVisible = !isVisible;
      cargarCapa(layerName);
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
      initialView = [lat, long];

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
          allLayers.push(layer);

          layer.on({
            click: function () {
              selectedAreaName = feature.properties?.NOMGEO;
              if (selectedAreaName) {
                areaName = selectedAreaName;

                document.getElementById("zona-selected").innerHTML = areaName;

                const event = new CustomEvent("estoenviaelcambiodelmunicipio", {
                  detail: areaName,
                });
                window.dispatchEvent(event);

                if (zonaRiosFloods) {
                  map.removeLayer(zonaRiosFloods);
                  zonaRiosFloods = null;
                }

                if (zonaRiosAntes) {
                  map.removeLayer(zonaRiosAntes);
                  checkboxAllLayer.checked = false;
                }
                if (zonaRiosDespues) {
                  map.removeLayer(zonaRiosDespues);
                  checkboxAllLayer.checked = false;
                }
                if (zonaRiosDurante) {
                  map.removeLayer(zonaRiosDurante);
                  checkboxAllLayer.checked = false;
                }

                if (zonaRiosPermanent) {
                  map.removeLayer(zonaRiosPermanent);
                  checkboxPermanent.checked = false;
                }

                allLayers.forEach((lyr) =>
                  lyr.setStyle({
                    color: "white",
                    weight: 0.2,
                    fillOpacity: 0.1,
                  })
                );

                layer.setStyle({ color: "white", weight: 2, fillOpacity: 0.5 });

                selectedLayer = layer;

                map.fitBounds(layer.getBounds(), { padding: [50, 50] });

                cargarCapa(`${areaName}${currentPeriod}2020`);
              } else {
                console.error("Propiedad NOMGEO no encontrada en el feature.");
              }
            },
          });
        },
      }).addTo(map);

      document.getElementById("btn-endClean").addEventListener("click", () => {
        activarEndClean();
      });
      // Función para restablecer el mapa
      function activarEndClean() {
        if (municipioFloods) {
          map.removeLayer(municipioFloods);
          municipioFloods = null;
        }

        if (leftLayerTemporal) map.removeLayer(leftLayerTemporal);
        if (leftLayerPermanente) map.removeLayer(leftLayerPermanente);
        if (rightLayerPermanente) map.removeLayer(rightLayerPermanente);
        if (rightLayerTemporal) map.removeLayer(rightLayerTemporal);

        if (sideBySideControl) {
          map.removeControl(sideBySideControl);
          sideBySideControl = null;
        }

        map.dragging.enable();

        allLayers.forEach((layer) => {
          layer.setStyle({
            color: "white",
            weight: 0.5,
            fillOpacity: 0.1,
          });
        });

        areaName = "Zona Rios";
        const event = new CustomEvent("estoenviaelcambiodelmunicipio", {
          detail: areaName,
        });
        window.dispatchEvent(event);

        document.getElementById("zona-selected").innerHTML = areaName;

        map.setView(initialView, initialZoom);

        const selectedPeriod = document.getElementById("SelectPeriodo").value;

        const layerZonaRios = `ZonaRios${selectedPeriod}2020`;

        if (zonaRiosFloods) {
          map.removeLayer(zonaRiosFloods);
        }

        // Segun a;ade la nueva capa de Zona Rios al mapa -----------------
        zonaRiosFloods = L.tileLayer
          .wms(baseWMSUrl, {
            layers: layerZonaRios,
            format: "image/png",
            transparent: true,
            version: "1.1.0",
            crs: L.CRS.EPSG3857,
            formatoptions: "antialiasing:off",
            tileSize: 256,
            tiled: true,
            zIndex: zIndexView,
          })
          .addTo(map);
      }

      // Cargar la capa inicial de Zona Ríos ASKMALKSDLASD;LAJSKD;LKAJSD;LKA-----------
      const initialLayerZonaRios = `ZonaRios${currentPeriod}2020`;

      cargarZonaRios(initialLayerZonaRios);
    })
    .catch((error) => {
      console.error("Error al cargar el archivo GeoJSON:", error);
    });
}
capasMunicipio(lat, long, baseWMSUrl);

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
      map.removeLayer(leftLayerTemporal);
    }
    if (leftLayerPermanente) {
      map.removeLayer(leftLayerPermanente);
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
        tiled: true,
        zIndex: zIndexView,
      });
      leftLayerPermanente.addTo(map);
    } else {
      leftLayerTemporal = L.tileLayer.wms(baseWMSUrl, {
        layers: layerName,
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        crs: L.CRS.EPSG3857,
        formatoptions: "antialiasing:off",
        tileSize: 256,
        tiled: true,
        zIndex: zIndexView,
      });
      leftLayerTemporal.addTo(map);
    }
  } else if (side === "right") {
    if (rightLayerTemporal) {
      map.removeLayer(rightLayerTemporal);
    }
    if (rightLayerPermanente) {
      map.removeLayer(rightLayerPermanente);
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
        tiled: true,
        zIndex: zIndexView,
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
        tiled: true,
        zIndex: zIndexView,
      });
      rightLayerTemporal.addTo(map);
    }
  }

  if (leftLayerTemporal && rightLayerTemporal) {
    activateSideBySide();
  }
}

let tooltip;

function activateSideBySide() {
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

  /* 
  if (map.hasLayer(leftLayerTemporal)) {
    console.log('La capa "leftLayerTemporal" ya está cargada en el mapa');
    document.querySelector(".loader-layer").style.display = 'none'
} else {
    console.log('La capa "leftLayerTemporal" NO está cargada en el mapa');
} */

  // Eliminar las capas de zonariosFlood y municipioFloods si están activas
  if (zonaRiosFloods) {
    map.removeLayer(zonaRiosFloods);
    zonaRiosFloods = null;
  }

  if (municipioFloods) {
    map.removeLayer(municipioFloods);
    municipioFloods = null;
  }

  // Variables para los estados y cuerpos de agua
  let aguaIzquierda, aguaDerecha, estadoIzquierda, estadoDerecha;

  const checkboxLeft = document.getElementById("leftPermanentCheckbox");
  const checkboxRight = document.getElementById("rightPermanentCheckbox");
  if (leftLayerTemporal || rightLayerTemporal) {
    checkboxLeft.disabled = false;
    checkboxRight.disabled = false;
  }
  const obtenerEstado = (isChecked) => (isChecked ? "Permanente" : "Temporal");

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

  map.dragging.disable();

  if (sideBySideControl) {
    map.removeControl(sideBySideControl);
    sideBySideControl = null;
  }

  sideBySideControl = L.control
    .sideBySide(
      [leftLayerPermanente, leftLayerTemporal],
      [rightLayerPermanente, rightLayerTemporal]
    )
    .addTo(map);

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
  const removeLayerIfExists = (layer) => {
    if (layer) map.removeLayer(layer);
  };
  [
    leftLayerTemporal,
    rightLayerTemporal,
    leftLayerPermanente,
    rightLayerPermanente,
  ].forEach(removeLayerIfExists);

  if (sideBySideControl) {
    map.removeControl(sideBySideControl);
    sideBySideControl = null;
  }
  map.dragging.enable();
  location.reload();

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

    if (municipioFloods) {
      map.removeLayer(municipioFloods);
      municipioFloods = null;
    }
  });

document
  .getElementById("leftSeasonSelector")
  .addEventListener("change", function () {
    const season = this.value;

    const year = document.getElementById("leftYearSelector").value;
    if (year && season) updateLayer(year, season, "left");
    if (municipioFloods) {
      map.removeLayer(municipioFloods);
      municipioFloods = null;
    }
  });

// Función para manejar los cambios en los selectores de la capa derecha
document
  .getElementById("rightYearSelector")
  .addEventListener("change", function () {
    const year = this.value;

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
