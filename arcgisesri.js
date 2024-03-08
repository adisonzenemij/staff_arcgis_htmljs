require([
    'esri/config',
    'esri/Map',
    'esri/views/MapView',

	'esri/widgets/BasemapGallery',
    'esri/widgets/BasemapToggle',
	'esri/widgets/Expand',
	'esri/widgets/ScaleBar',
	'esri/widgets/Search',
], function(
    esriConfig,
    Map,
    MapView,

    BasemapGallery,
    BasemapToggle,
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
        viewMap = loadMapView(map);

        // Widget de Search
        configSearch();
        // Widget de BasemapGallery
        configBasemapGallery();
        // Widget de BasemapToggle
        configBasemapToggle();
        // Widget de ScaleBar
        configScaleBar();
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

    // Configurar widget de BasemapGallery
    function configBasemapGallery() {
        // Configurar widget de BasemapGallery
        const widget = new BasemapGallery({
            view: viewMap,
            source: {
                portal: {
                    url: 'https://www.arcgis.com',
                    // Estilos base vectoriales para mejor rendimiento
                    useVectorBasemaps: true
                }
            },
        });

        const expand = new Expand({
            view: viewMap,
            content: widget,
            // Tooltip para expandir el widget
            expandTooltip: 'Mostrar estilos base',
            // Tooltip para contraer el widget
            collapseTooltip: 'Ocultar estilos base',
        });

        viewMap.ui.add(expand, {
            position: 'top-right'
        });
    }

    // Configurar widget de BasemapToggle
    function configBasemapToggle() {
        const widget = new BasemapToggle({
            view: viewMap,
            nextBasemap: 'topo'
        });

        viewMap.ui.add(widget, {
            position: 'bottom-right',
        });
    }

    // Configurar widget de ScaleBar
    function configScaleBar() {
        // Configurar widget de ScaleBar
        const widget = new ScaleBar({
            view: viewMap,
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
        // Cargar widget de ScaleBar
        
        viewMap.ui.add(widget, {
            position: 'bottom-left',
        });
    }

    // Configurar widget de Search
    function configSearch() {
        // Configurar widget de Search
        const widget = new Search({
            view: viewMap,
        });

        viewMap.ui.add(widget, {
            position: 'top-right'
        });
    }
    
    initApp();
    console.log(`Map: ${viewMap}`);
});