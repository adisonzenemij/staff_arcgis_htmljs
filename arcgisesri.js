require([
    'esri/config',
    'esri/WebMap',
    'esri/Map',
    'esri/Graphic',
    'esri/views/MapView',

    'esri/core/reactiveUtils',

    'esri/layers/FeatureLayer',
    'esri/layers/GroupLayer',
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
    'esri/widgets/LayerList',
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
    GroupLayer,
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
    LayerList,
    Locate,
    Print,
    ScaleBar,
    Search,
) {
    let mapArcGis;
    let viewMap;
    let aprovechamientoLayer;
    let featureTable;
    let apiKey = 'AAPKee5e48ded1a54c3a969ca183ad3fe39bG6BDy8jzySt7T-Z7DjxOC4rj9910p7jpwLnxa8qKI9kWY5pNwR-o8tqyhh2ZEosK';
    let printSvc = 'https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task';
    // Función para inicializar la aplicación
    function initApp() {
        // Uso:
        if (elementExists('viewDiv') && elementExists('tableDiv')) {
            configShellPanels();

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
            configLayerGroups();

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

    function configShellPanels() {
        const shellPanelStart = document.getElementById('shell-panel-start');
        const panelStart = document.getElementById('panel-start');
        const actionsStart = shellPanelStart?.querySelectorAll('calcite-action');

        if (!shellPanelStart || !panelStart || !actionsStart?.length) {
            return;
        }

        actionsStart.forEach(function(action) {
            action.addEventListener('click', function() {
                const shouldOpen = shellPanelStart.collapsed || panelStart.closed || !action.active;

                actionsStart.forEach(function(item) {
                    item.active = false;
                });

                action.active = shouldOpen;
                shellPanelStart.collapsed = !shouldOpen;
                panelStart.closed = !shouldOpen;
                panelStart.heading = action.text;
            });
        });

        panelStart.addEventListener('calcitePanelClose', function() {
            actionsStart.forEach(function(action) {
                action.active = false;
            });
            shellPanelStart.collapsed = true;
        });

        const shellPanelEnd = document.getElementById('shell-panel-end');
        const panelEnd = document.getElementById('panel-end');

        panelEnd?.addEventListener('calcitePanelClose', function() {
            shellPanelEnd.collapsed = true;
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
        aprovechamientoLayer = new FeatureLayer({
            // URL to the service
            //url: 'https://gis.transmilenio.gov.co/arcgis/rest/services/Zonal/consulta_paraderos/FeatureServer/0'
            url: 'https://test-map-services.minambiente.gov.co/arcgis/rest/services/aprovechamiento/Edicion_aprovechamiento/FeatureServer/0',
            title: 'Edición aprovechamiento - Área del Predio'
        });
        aprovechamientoLayer.title = 'Edición aprovechamiento - Área del Predio';

        const defaultGroupLayer = new GroupLayer({
            title: 'Predeterminado',
            visibilityMode: 'independent',
            layers: [aprovechamientoLayer],
        });
        // Agregar layer sobre el mapa
        viewMap.map.add(defaultGroupLayer);
        // Agregar datos sobre la tabla
        const data = new FeatureTable({
            view: viewMap,
            layer: aprovechamientoLayer,
            container:'tableDiv',
        });
        console.log(data);
    }

    async function configLayerGroups() {
        const layerFiles = [
            ['Predeterminado', 'assets/json/arcgis/layers.json'],
            ['Ministerio', 'assets/json/arcgis/ministerio.json'],
            ['Transmilenio', 'assets/json/arcgis/transmilenio.json'],
        ];

        try {
            const layerConfigs = await Promise.all(
                layerFiles.map(async function([groupTitle, file]) {
                    const response = await fetch(file);

                    if (!response.ok) {
                        throw new Error(`No se pudo cargar ${file}.`);
                    }

                    return {
                        groupTitle,
                        layer: await response.json(),
                    };
                }),
            );

            const groups = layerConfigs.map(function(config) {
                const layer = new FeatureLayer(config.layer);

                if (config.groupTitle === 'Ministerio') {
                    aprovechamientoLayer = layer;
                }

                return new GroupLayer({
                    title: config.groupTitle,
                    visibilityMode: 'independent',
                    layers: [layer],
                });
            });

            // El LayerList muestra primero las capas ubicadas arriba en el mapa.
            viewMap.map.addMany(groups.reverse());

            featureTable = new FeatureTable({
                view: viewMap,
                layer: aprovechamientoLayer,
                container: 'tableDiv',
            });

            configLayerList();
        } catch (error) {
            console.error('Error al cargar la configuración de capas:', error);
        }
    }

    function configLayerList() {
        if (!elementExists('layerListDiv')) {
            return;
        }

        const groupActions = [
            { id: 'zoom-to', title: 'Acercar a capa', className: 'esri-icon-zoom-in-magnifying-glass' },
            { id: 'show-properties', title: 'Mostrar propiedades', className: 'esri-icon-description' },
            { id: 'rename', title: 'Cambiar nombre', className: 'esri-icon-edit' },
            { id: 'remove', title: 'Eliminar', className: 'esri-icon-trash' },
            { id: 'move-to-basemap', title: 'Mover al mapa base', className: 'esri-icon-basemap' },
            { id: 'group', title: 'Grupo', className: 'esri-icon-group' },
        ];
        const layerActions = [
            { id: 'show-properties', title: 'Mostrar propiedades', className: 'esri-icon-description' },
            { id: 'show-table', title: 'Mostrar tabla', className: 'esri-icon-table' },
            { id: 'rename', title: 'Cambiar nombre', className: 'esri-icon-edit' },
            { id: 'remove', title: 'Eliminar', className: 'esri-icon-trash' },
        ];

        const layerList = new LayerList({
            view: viewMap,
            container: 'layerListDiv',
            listItemCreatedFunction: function(event) {
                const item = event.item;

                if (item.layer.type === 'group') {
                    item.open = true;
                }

                item.actionsSections = [
                    (item.layer.type === 'group' ? groupActions : layerActions).map(function(action) {
                        return Object.assign({}, action);
                    }),
                ];
            },
        });

        layerList.on('trigger-action', function(event) {
            handleLayerAction(event.action.id, event.item.layer);
        });
    }

    function handleLayerAction(actionId, layer) {
        switch (actionId) {
            case 'zoom-to':
                zoomToLayer(layer);
                break;
            case 'show-properties':
                showLayerProperties(layer);
                break;
            case 'show-table':
                showLayerTable(layer);
                break;
            case 'rename':
                renameLayer(layer);
                break;
            case 'remove':
                removeLayer(layer);
                break;
            case 'move-to-basemap':
                moveLayerToBasemap(layer);
                break;
            case 'group':
                groupLayer(layer);
                break;
            default:
                break;
        }
    }

    async function zoomToLayer(layer) {
        try {
            await layer.load();
            let extent = layer.fullExtent;

            if (!extent && layer.type === 'group') {
                const childLayers = layer.layers.toArray();
                await Promise.all(childLayers.map(function(childLayer) {
                    return childLayer.load();
                }));
                extent = childLayers.reduce(function(currentExtent, childLayer) {
                    return currentExtent ? currentExtent.union(childLayer.fullExtent) : childLayer.fullExtent;
                }, null);
            }

            if (extent) {
                await viewMap.goTo(extent.expand(1.15));
            }
        } catch (error) {
            console.error('No se pudo acercar a la capa:', error);
        }
    }

    function showLayerProperties(layer) {
        const shellPanelEnd = document.getElementById('shell-panel-end');
        const panelEnd = document.getElementById('panel-end');
        const propertiesDiv = document.getElementById('propertiesDiv');

        if (!shellPanelEnd || !panelEnd || !propertiesDiv) {
            return;
        }

        const rows = [
            ['Nombre', layer.title],
            ['Tipo', layer.type === 'group' ? 'Grupo de capas' : 'Capa de entidades'],
            ['Visibilidad', layer.visible ? 'Visible' : 'Oculta'],
            ['URL', layer.url || 'No aplica'],
        ];
        const list = document.createElement('dl');
        list.className = 'property-list';

        rows.forEach(function([label, value]) {
            const row = document.createElement('div');
            const term = document.createElement('dt');
            const definition = document.createElement('dd');

            row.className = 'property-row';
            term.textContent = label;
            definition.textContent = value;
            row.append(term, definition);
            list.append(row);
        });

        propertiesDiv.replaceChildren(list);
        panelEnd.heading = layer.title;
        panelEnd.closed = false;
        shellPanelEnd.collapsed = false;
    }

    function showLayerTable(layer) {
        if (layer.type === 'group') {
            return;
        }

        featureTable?.destroy();
        document.getElementById('tableDiv').replaceChildren();
        featureTable = new FeatureTable({
            view: viewMap,
            layer,
            container: 'tableDiv',
        });
    }

    function renameLayer(layer) {
        const title = window.prompt('Nuevo nombre de la capa:', layer.title);

        if (title && title.trim()) {
            layer.title = title.trim();
        }
    }

    function removeLayer(layer) {
        if (!window.confirm(`¿Eliminar "${layer.title}" del mapa?`)) {
            return;
        }

        if (layer.parent?.layers) {
            layer.parent.layers.remove(layer);
        } else {
            viewMap.map.layers.remove(layer);
        }

        if (featureTable?.layer === layer) {
            featureTable.destroy();
            featureTable = null;
            document.getElementById('tableDiv').replaceChildren();
        }
    }

    function moveLayerToBasemap(layer) {
        if (layer.type === 'group') {
            layer.layers.toArray().forEach(function(childLayer) {
                layer.layers.remove(childLayer);
                viewMap.map.basemap.baseLayers.add(childLayer);
            });
            viewMap.map.layers.remove(layer);
            return;
        }

        if (layer.parent?.layers) {
            layer.parent.layers.remove(layer);
        } else {
            viewMap.map.layers.remove(layer);
        }
        viewMap.map.basemap.baseLayers.add(layer);
    }

    function groupLayer(layer) {
        const groupTitle = window.prompt('Nombre del nuevo grupo:', `Grupo de ${layer.title}`);

        if (!groupTitle || !groupTitle.trim()) {
            return;
        }

        const parentLayers = layer.parent?.layers || viewMap.map.layers;
        const index = parentLayers.indexOf(layer);
        parentLayers.remove(layer);
        const newGroup = new GroupLayer({
            title: groupTitle.trim(),
            visibilityMode: 'independent',
            layers: [layer],
        });
        parentLayers.add(newGroup, index);
    }

    // Servicio de query con features
    function serviceFeature() {
        // Create featurelayer from feature service
        const layer = new FeatureLayer({
            // URL to the service
            //url: 'https://gis.transmilenio.gov.co/arcgis/rest/services/Zonal/consulta_paraderos/FeatureServer/0'
            url: 'https://test-map-services.minambiente.gov.co/arcgis/rest/services/aprovechamiento/Edicion_aprovechamiento/FeatureServer/0'
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
        //let queryUrl = 'https://gis.transmilenio.gov.co/arcgis/rest/services/Zonal/consulta_paraderos/FeatureServer/0';
        let queryUrl = 'https://test-map-services.minambiente.gov.co/arcgis/rest/services/aprovechamiento/Edicion_aprovechamiento/FeatureServer/0';

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
