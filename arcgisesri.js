require([
    'esri/config',
    'esri/Map',
    'esri/views/MapView',

	'esri/widgets/BasemapGallery',
	'esri/widgets/Expand',
	'esri/widgets/ScaleBar',
	'esri/widgets/Search',
], function(
    esriConfig,
    Map,
    MapView,

	BasemapGallery,
	Expand,
	ScaleBar,
	Search,
) {
    let viewMap;
    // Función para inicializar la aplicación
    function initApp() {
        // Configura la clave de la API
        esriConfig.apiKey = 'AAPKee5e48ded1a54c3a969ca183ad3fe39bG6BDy8jzySt7T-Z7DjxOC4rj9910p7jpwLnxa8qKI9kWY5pNwR-o8tqyhh2ZEosK';

        // Construir mapa con el servicio de estilos base
        const map = createMap();
        // Cargar vista centrada en Colombia, Bogotá
        this.viewMap = loadMapView(map);

        // Widget de Search
        configSearch();
        // Widget de BasemapGallery
        configBasemapGallery();
        // Widget de ScaleBar
        configScaleBar();
    }

    // Configurar widget de BasemapGallery
    function configBasemapGallery() {
        // Configurar widget de BasemapGallery
        const wtBaseMapGallery = widgetBasemapGallery();
        const btBasemapGallery = btnBasemapGallery(wtBaseMapGallery);
        // Cargar widget de BasemapGallery
        loadBasemapGallery(btBasemapGallery);
    }

    // Configurar widget de ScaleBar
    function configScaleBar() {
        // Configurar widget de ScaleBar
        const wtScaleBar = widgetScaleBar();
        // Cargar widget de ScaleBar
        loadScaleBar(wtScaleBar);
    }

    // Configurar widget de Search
    function configSearch() {
        // Configurar widget de Search
        const wtSearch = widgetSearch();
        // Cargar widget de Search
        loadSearch(wtSearch);
    }


    // Funciones para crear elementos
    function createMap() {
        return new Map({
            // basemap styles service
            basemap: 'arcgis/topographic',
        });
    }
    
    function loadMapView(map) {
        return new MapView({
            map: map,
            center: [-74.0808, 4.6097],
            zoom: 10,
            container: 'viewDiv',
            constraints: {
                snapToZoom: false,
            },
        });
    }

    // Configurar widget ScaleBar
    function widgetScaleBar() {
        return new ScaleBar({
            view: this.viewMap,
            // Valores: 'metric' o 'non-metric'
            unit: 'dual',
            // Valores: 'ruler' o 'line'
            style: 'line', 
            // ID del contenedor
            container: 'customScaleBarContainer',
            // Color de la barra de escala
            color: 'blue',
            // Color de fondo de la barra de escala
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
        });
    }
    
    // Cargar widget ScaleBar
    function loadScaleBar(widget) {
        this.viewMap.ui.add(widget, {
            position: 'bottom-left',
        });
    }

    // Configurar widget BasemapGallery
    function widgetBasemapGallery() {
        return new BasemapGallery({
            view: this.viewMap,
            source: {
                portal: {
                    url: 'https://www.arcgis.com',
                    // Estilos base vectoriales para mejor rendimiento
                    useVectorBasemaps: true
                }
            },
        });
    }
        
    // Crear botón personalizado para abrir y cerrar
    function btnBasemapGallery(widget) {
        return new Expand({
            view: this.viewMap,
            content: widget,
            // Tooltip para expandir el widget
            expandTooltip: 'Mostrar estilos base',
            // Tooltip para contraer el widget
            collapseTooltip: 'Ocultar estilos base',
        });
    }
        
    // Cargar widget BasemapGallery
    function loadBasemapGallery(widget) {
        this.viewMap.ui.add(widget, {
            position: 'top-right'
        });
    }

    // Configurar widget Search
    function widgetSearch() {
        return new Search({
            view: this.viewMap,
        });
    }
    
    // Cargar widget Search
    function loadSearch(widget) {
        this.viewMap.ui.add(widget, {
            position: 'top-right'
        });
    }
    
    initApp();
});