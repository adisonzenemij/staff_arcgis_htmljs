require([
    'esri/config',
    'esri/Map',
    'esri/views/MapView',

	'esri/widgets/BasemapGallery',
    'esri/widgets/BasemapToggle',
    'esri/widgets/CoordinateConversion',
	'esri/widgets/Expand',
	'esri/widgets/ScaleBar',
	'esri/widgets/Search',
], function(
    esriConfig,
    Map,
    MapView,

    BasemapGallery,
    BasemapToggle,
    CoordinateConversion,
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

        // Posicion Top Left
        // Widget de Basemap Gallery
        configBasemapGallery();

        // Posicion Top Right
        // Widget de Coordinate Conversion
        configCoordConv();
        // Widget de Search
        configSearch();

        // Posicion Botton Right
        // Widget de Basemap Toggle
        configBasemapToggle();

        // Posicion Botton Left
        // Widget de Scale Bar
        configScaleBar();
    }

    function mapViewAdd(widget, position) {
        viewMap.ui.add(widget, {
            position: position,
        });
    }

    // Funciones para crear elementos
    function createMap() {
        let config = [
            'arcgis/topographic',
            'arcgis/streets',
            'arcgis/navigation',
            'arcgis/satellite',
            'arcgis/dark-gray'
        ];
        let mapType = config[0];
        return new Map({
            // basemap styles service
            basemap: mapType,
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
        // Configurar widget con propiedades
        const widget = new BasemapGallery({
            view: viewMap,
            source: {
                portal: {
                    url: 'https://www.arcgis.com',
                    // Estilos base vectoriales para mejor rendimiento
                    useVectorBasemaps: true,
                },
            },
        });
        // Expandir widget con propiedades
        const expand = new Expand({
            view: viewMap,
            content: widget,
            // Tooltip para expandir el widget
            expandTooltip: 'Activar Estilos',
            // Tooltip para contraer el widget
            collapseTooltip: 'Ocultar Estilos',
        });
        // Cargar widget sobre el mapa
        mapViewAdd(expand, 'top-left');
    }

    // Configurar widget de BasemapToggle
    function configBasemapToggle() {
        // Configurar widget con propiedades
        const widget = new BasemapToggle({
            view: viewMap,
            nextBasemap: 'topo',
        });
        // Cargar widget sobre el mapa
        mapViewAdd(widget, 'bottom-right');
    }

    // Configurar widget de ScaleBar
    function configScaleBar() {
        // Configurar widget con propiedades
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
        // Cargar widget sobre el mapa
        mapViewAdd(widget, 'bottom-left');
    }

    // Configurar widget de Search
    function configSearch() {
        // Configurar widget con propiedades
        const widget = new Search({
            view: viewMap,
        });
        // Cargar widget sobre el mapa
        mapViewAdd(widget, 'top-right');
    }

    function configCoordConv() {
        // Configurar widget con propiedades
        const widget = new CoordinateConversion({
            view: viewMap,
        });
        // Cargar widget sobre el mapa
        mapViewAdd(widget, 'top-right');
    }
    
    initApp();
    console.log(viewMap);
});