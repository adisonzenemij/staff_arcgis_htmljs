require([
    'esri/config',
    'esri/WebMap',
    'esri/Map',
    'esri/Graphic',
    'esri/views/MapView',

    'esri/core/reactiveUtils',

    'esri/layers/FeatureLayer',
    'esri/layers/RouteLayer',

    'esri/rest/query',
    'esri/rest/support/Query',

	'esri/widgets/BasemapGallery',
    'esri/widgets/BasemapToggle',
    'esri/widgets/CoordinateConversion',
    'esri/widgets/Directions',
	'esri/widgets/Expand',
    'esri/widgets/FeatureTable',
    'esri/widgets/Home',
    'esri/widgets/Locate',
    'esri/widgets/Print',
	'esri/widgets/ScaleBar',
	'esri/widgets/Search',
], function(
    esriConfig,
    WebMap,
    Map,
    Graphic,
    MapView,

    reactiveUtils,

    FeatureLayer,
    RouteLayer,

    query,
    Query,

    BasemapGallery,
    BasemapToggle,
    CoordinateConversion,
    Directions,
    Expand,
    FeatureTable,
    Home,
    Locate,
    Print,
    ScaleBar,
    Search,
) {
    let mapArcGis;
    let viewMap;
    let apiKey = 'AAPKee5e48ded1a54c3a969ca183ad3fe39bG6BDy8jzySt7T-Z7DjxOC4rj9910p7jpwLnxa8qKI9kWY5pNwR-o8tqyhh2ZEosK';
    let printSvc = 'https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task';
    // Función para inicializar la aplicación
    function initApp() {
        // Uso:
        if (elementExists('viewDiv') && elementExists('tableDiv')) {
            // Configura la clave de la API
            esriConfig.apiKey = apiKey;

            // Construir mapa con el servicio de estilos base
            mapArcGis = configMap();
            // Cargar vista centrada en Colombia, Bogotá
            viewMap = loadMapView();

            // Posicion Top Left
            configHome();
            configBasemapGallery();
            configSearch();
            configDirections();

            // Posicion Top Right
            configCoordConv();
            configLocate();
            configPrint();

            // Posicion Botton Right
            configBasemapToggle();

            // Posicion Botton Left
            configScaleBar();

            // Other Configurations
            configFeatureTable();

            serviceFeature();
            serviceQuery();
        }
    }

    function elementExists(elementId) {
        return document.getElementById(elementId) !== null;
    }

    function mapViewAdd(widget, position) {
        viewMap.ui.add(widget, {
            position: position,
        });
    }

    // Funciones para crear elementos
    function configMap() {
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
    
    function loadMapView() {
        return new MapView({
            map: mapArcGis,
            center: [-74.0808, 4.6097],
            zoom: 10,
            container: 'viewDiv',
            constraints: {
                snapToZoom: false,
            },
        });
    }
    
    function configHome() {
        // Configurar widget con propiedades
        let widget = new Home({
            view: viewMap
        });
        // Cargar widget sobre el mapa
        mapViewAdd(widget, 'top-left');
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
        // Expandir el widget con botones
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

    // Configurar widget de Coordinates
    function configCoordConv() {
        // Configurar widget con propiedades
        const widget = new CoordinateConversion({
            view: viewMap,
        });
        // Expandir el widget con botones
        const expand = new Expand({
            view: viewMap,
            content: widget,
            // Tooltip para expandir el widget
            expandTooltip: 'Activar Conversión de Coordenadas',
            // Tooltip para contraer el widget
            collapseTooltip: 'Ocultar Conversión de Coordenadas',
            // Posición del widget expandible
            //expandIconClass: 'esri-icon-coordinate',
        });
        // Cargar widget sobre el mapa
        mapViewAdd(expand, 'top-left');
    }

    // Configurar widget de Directions
    function configDirections() {
        // Crear una capa de ruta vacía
        const routeLayer = new RouteLayer();
        // Configurar el widget con propiedades
        const widget = new Directions({
            view: viewMap,
            layer: routeLayer
        });
        // Expandir el widget con botones
        const expand = new Expand({
            view: viewMap,
            content: widget,
            expandIconClass: 'esri-icon-directions',
            expandTooltip: 'Activar Direcciones',
            collapseTooltip: 'Ocultar Direcciones',
        });
        // Cargar widget sobre el mapa
        mapViewAdd(expand, 'top-left');
    }

    // Configurar widget de Locate
    function configLocate() {
        // Configurar el widget con propiedades
        let widget = new Locate({
            // Attaches the Locate button to the view
            view: viewMap,
            graphic: new Graphic({
                symbol: { type: "simple-marker" },
            })
        });
        // Cargar widget sobre el mapa
        mapViewAdd(widget, 'top-right');
    }

    // Configurar widget de Print
    function configPrint() {
        // Configurar widget con propiedades
        const widget = new Print({
            view: viewMap,
            printServiceUrl: printSvc,
        });
        // Expandir el widget con botones
        const expand = new Expand({
            view: viewMap,
            content: widget,
            expandTooltip: 'Imprimir',
            expandIconClass: 'esri-icon-printer'
        });
        // Cargar widget sobre el mapa
        mapViewAdd(expand, 'top-right');
        // Agregar interceptor para monitorear la solicitud de impresión
        esriConfig.request.interceptors.push({
            urls: widget.printServiceUrl,
            after: function(response) {
                console.log("Exported links: ", response.exportedLinks.items[0]);
            }
        });
    }

    // Configurar widget de Print
    function configFeatureTable() {
        //document.getElementById('tableDiv').innerHTML = null;
        const layer = new FeatureLayer({
            // URL to the service
            url: 'https://gis.transmilenio.gov.co/arcgis/rest/services/Zonal/consulta_paraderos/FeatureServer/0'
        });
        // Agregar layer sobre el mapa
        viewMap.map.add(layer);
        // Agregar datos sobre la tabla
        const data = new FeatureTable({
            view: viewMap,
            layer: layer,
            container:'tableDiv',
        });
        console.log(data);
    }

    // Servicio de query con features
    function serviceFeature() {
        // Create featurelayer from feature service
        const layer = new FeatureLayer({
            // URL to the service
            url: 'https://gis.transmilenio.gov.co/arcgis/rest/services/Zonal/consulta_paraderos/FeatureServer/0'
        });

        let queryParams = layer.createQuery();
        queryParams.outFields = ['*'];
        queryParams.outSpatialReference = { wkid: 3116 };
        queryParams.returnGeometry = true;
        queryParams.where = `1 = 1`;

        // query the layer with the modified params object
        layer.queryFeatures(queryParams).then(function(results){
            // prints the array of result graphics to the console
            console.log(results);
            console.log(results.features);
            results.features.map(function(response){
                console.log(response.attributes);
            });
        });

        // prints the number of results satisfying the query
        layer.queryFeatureCount(queryParams).then(function(numResults){
            console.log(numResults);
        });

        // prints the array of Object IDs to the console
        layer.queryObjectIds().then(function(results){
            console.log(results);
        });

        // prints the array of Object IDs to the console
        layer.queryObjectIds(queryParams).then(function(results){
            console.log(results);
        });
    }

    // Servicio de query con url directa
    function serviceQuery() {
        // url to the layer of interest to query
        let queryUrl = 'https://gis.transmilenio.gov.co/arcgis/rest/services/Zonal/consulta_paraderos/FeatureServer/0';

        // create the Query object
        let queryParams = new Query();
        queryParams.outFields = ['*'];
        queryParams.outSpatialReference = { wkid: 3116 };
        queryParams.returnGeometry = true;
        queryParams.where = `1 = 1`;

        // call the executeQueryJSON() method
        query.executeQueryJSON(queryUrl, queryParams).then(function(results){
            // results.graphics contains the graphics returned from query
            console.log(results);
        });
    }

    initApp();
    //console.log(viewMap);
});