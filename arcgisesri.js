require([
    'esri/config',
    'esri/Map',
    'esri/views/MapView',
], function(
    esriConfig,
    Map,
    MapView,
) {
    let viewMap;
    // Función para inicializar la aplicación
    function initApp() {
        // Configura la clave de la API
        esriConfig.apiKey = 'AAPKee5e48ded1a54c3a969ca183ad3fe39bG6BDy8jzySt7T-Z7DjxOC4rj9910p7jpwLnxa8qKI9kWY5pNwR-o8tqyhh2ZEosK';

        // Construir mapa con el servicio de estilos base
        const map = createMap();
        // Cargar vista centrada en Colombia, Bogotá
        //const view = loadMapView(map);
        this.viewMap = loadMapView(map);
        //console.log(this.viewMap);

        // Configurar widget de BasemapGallery
        const wtBaseMapGallery = widgetBasemapGallery();
        const btBasemapGallery = btnBasemapGallery(wtBaseMapGallery);
        // Cargar widget de BasemapGallery
        loadBasemapGallery(btBasemapGallery);

        // Configurar widget de ScaleBar
        const wtScaleBar = widgetScaleBar();
        // Cargar widget de ScaleBar
        loadScaleBar(wtScaleBar);

        // Configurar widget de Search
        const wtSearch = widgetSearch();
        // Cargar widget de Search
        loadSearch(wtSearch);
    }
});