let lat = 17.710782;
let long = -91.286937;
let initialZoom = 10;
let initialView;
let zIndexView = 2;
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
let map = L.map("map").setView([lat, long], initialZoom);
let coords = L.CRS.EPSG3857;
let baseWMSUrl =
  "https://geoserver.computodistribuido.org/geoserver/zonarios/wms?=service";

/* let baseWMSUrl =
  "http://localhost:8080/geoserver/zonarios/wms?=service";
 */

L.control
  .scale({
    position: "bottomright",
    maxWidth: 200,
    metric: true,
    imperial: true,
    updateWhenIdle: false,
  })
  .addTo(map);

const btnUbication = document.getElementById("btn-location");

if ("geolocation" in navigator) {
  btnUbication.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        map.locate({ setView: true, maxZoom: 16 });

        function onLocationFound(event) {
          var radius = event.accuracy;
          L.marker(event.latlng)
            .addTo(map)
            .bindPopup(
              "Estás a " + radius.toFixed(2) + " metros de esta ubicación."
            )
            .openPopup();

          L.circle(event.latlng, radius).addTo(map);
        }

        function onLocationError(event) {
          alert("No se pudo obtener tu ubicación: " + event.message);
        }

        map.off("locationfound", onLocationFound);
        map.off("locationerror", onLocationError);

        map.on("locationfound", onLocationFound);
        map.on("locationerror", onLocationError);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          alert(
            "Has denegado los permisos de ubicación. Para continuar, habilita los permisos en la configuración del navegador."
          );
        } else {
          alert("Error al obtener la ubicación: " + error.message);
        }
      }
    );
  });
} else {
  alert("La geolocalización no está disponible en tu navegador.");
}

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
  }
);
const openstreetmap = L.tileLayer(
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
);

let allMunicipiosLayers = [];

let isVisible = true;

const btnLayerView = document.getElementById("btn-layerView");
const iconoChange = document.getElementById("icono-change");

// Función para alternar visibilidad de capas
function toggleLayerVisibility(layers, visibility) {
  layers.forEach((layer) => {
    if (layer?.setOpacity) {
      layer.setOpacity(visibility);
    }
  });
}

btnLayerView.addEventListener("click", () => {
  isVisible = !isVisible;
  const newOpacity = isVisible ? 1 : 0;
  const newIconClass = isVisible ? "bx bx-show" : "bx bx-low-vision";

  const layers = [
    zonaRiosAntes,
    zonaRiosDespues,
    zonaRiosDurante,
    zonaRiosFloods,
    municipioFloods,
    allMunicipiosLayers[0],
    allMunicipiosLayers[1],
    allMunicipiosLayers[2],
  ];

  toggleLayerVisibility(layers, newOpacity);

  if (iconoChange) iconoChange.className = newIconClass;
});

const optionMaps = document.querySelector(".map-layer-container");
const btnOptionsMap = document.getElementById("btn-option-maps");

var mapsDisplay = window.getComputedStyle(optionMaps).display;

btnOptionsMap.addEventListener("click", () => {
  var mapsDisplay = window.getComputedStyle(optionMaps).display;

  if (mapsDisplay === "none") {
    optionMaps.style.display = "flex";
  } else {
    optionMaps.style.display = "none";
  }
});

let labelColorLayer;
const btnLayerSatelite = document.getElementById("btn-layer-satelite");
const btnLayerOpenstreet = document.getElementById("btn-layer-openstreetmap");
const btnLayerCartoblack = document.getElementById("btn-layer-cartoblack");

const layers = {
  esri: esriLayer,
  openstreet: openstreetmap,
  cartoBlack: cartoblack,
};

const buttons = {
  esri: btnLayerSatelite,
  openstreet: btnLayerOpenstreet,
  cartoBlack: btnLayerCartoblack,
};

function setActiveLayer(activeLayerKey, labelColor) {
  Object.keys(layers).forEach((key) => {
    if (map.hasLayer(layers[key])) {
      map.removeLayer(layers[key]);
    }
  });

  if (layers[activeLayerKey]) {
    layers[activeLayerKey].addTo(map);
  }

  Object.keys(buttons).forEach((key) => {
    buttons[key].style.opacity = key === activeLayerKey ? "0.5" : "1";
  });

  labelColorLayer = document.querySelector(".label-selected-area-container");
  if (labelColorLayer) {
    labelColorLayer.style.color = labelColor;
  }
}

btnLayerSatelite.addEventListener("click", () => {
  setActiveLayer("esri", "white");
});

btnLayerOpenstreet.addEventListener("click", () => {
  setActiveLayer("openstreet", "#333");
});

btnLayerCartoblack.addEventListener("click", () => {
  setActiveLayer("cartoBlack", "#888");
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
        crs: coords,
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
        crs: coords,
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
        crs: coords,
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

checkboxPermanent = document.getElementById("Checkbox-Permanent");

checkboxPermanent.addEventListener("change", function () {
  if (checkboxPermanent.checked) {
    zonaRiosPermanent = L.tileLayer
      .wms(baseWMSUrl, {
        layers: "ZonaRios2020",
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        crs: coords,
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

if (currentPeriod) {
  iconoChange.className = "bx bx-show";
} else {
  iconoChange.className = "bx bx-show";
}
if (currentPeriod) {
  iconoChange.className = "bx bx-show";
} else {
}
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
        crs: coords,
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
            crs: coords,
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
    });

    checkboxAllLayer.checked = false;

    const allLayersMunicipio = document.getElementById("Checkbox-all");

    allLayersMunicipio.addEventListener("change", function () {
      [zonaRiosAntes, zonaRiosDurante, zonaRiosDespues].forEach((layer) => {
        if (layer && map.hasLayer(layer)) {
          map.removeLayer(layer);
        }
      });

      if (allLayersMunicipio.checked) {
        const capasMunicipios = [
          { name: "Antes2020", zIndex: 3 },
          { name: "Durante2020", zIndex: 2 },
          { name: "Despues2020", zIndex: 4 },
        ];

        allMunicipiosLayers.forEach((layer) => {
          if (map.hasLayer(layer)) {
            map.removeLayer(layer);
          }
        });

        allMunicipiosLayers = [];

        allMunicipiosLayers = capasMunicipios.map(({ name, zIndex }) =>
          L.tileLayer
            .wms(baseWMSUrl, {
              layers: `${selectedAreaName}${name}`,
              format: "image/png",
              transparent: true,
              version: "1.1.0",
              crs: coords,
              formatoptions: "antialiasing:off",
              tileSize: 256,
              tiled: true,
              zIndex: zIndex,
            })
            .addTo(map)
        );
      } else {
        allMunicipiosLayers.forEach((layer) => {
          if (map.hasLayer(layer)) {
            map.removeLayer(layer);
          }
        });

        allMunicipiosLayers = [];
      }
    });

    municipioFloods = L.tileLayer
      .wms(baseWMSUrl, {
        layers: layerName,
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        crs: coords,
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
    currentPeriod = selectPeriodo.value;

    if (zonaRiosFloods) {
      const layerZonaRios = `ZonaRios${currentPeriod}2020`;
      cargarZonaRios(layerZonaRios);
    }
    //============================================================

    iconoChange.className = "bx bx-show";
    isVisible = zonaRiosFloods || municipioFloods;

    //============================================================

    if (areaName) {
      const layerName = `${areaName}${currentPeriod}2020`;
      cargarCapa(layerName);
    } else {
      console.warn("No hay un área seleccionada para actualizar la capa.");
    }
  });

  // Cargar el archivo GeoJSON y configurar el mapa
  fetch("Tabasco.json")
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

        if (municipioPermanent) map.removeLayer(municipioPermanent);

        allMunicipiosLayers.forEach((layer) => {
          if (map.hasLayer(layer)) {
            map.removeLayer(layer);
          }
        });

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
            crs: coords,
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
        crs: L.CRS.EPSG4326,
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
        crs: L.CRS.EPSG4326,
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
        crs: L.CRS.EPSG4326,
        formatoptions: "antialiasing:off",
        tileSize: 256,
        tiled: true,
        zIndex: zIndexView,
      });
      rightLayerPermanente.addTo(map);
    } else {
      rightLayerTemporal = L.tileLayer.wms(baseWMSUrl, {
        layers: layerName,
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        crs: L.CRS.EPSG4326,
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