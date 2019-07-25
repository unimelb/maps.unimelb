if (document.getElementById('search-input-container'))
    var mySearchInput = new Mazemap.Search.SearchInput({
        container: document.getElementById('search-input-container'),
        input: document.getElementById('searchInput'),
        suggestions: document.getElementById('suggestions'),
        searchController: mySearch
    }).on('itemclick', function(e){
        var poiFeature = e.item;
        placePoiMarker( poiFeature );
        popup.setHTML(popupPoiHTML(poiFeature));    
        if (!popup.isOpen())
            resultMarker.togglePopup();
        }
    );

myMap.layerEventHandler.on('click', null, function(e, features) {
    var lngLat = e.lngLat;
    var zLevel = 0;
    mapClick(lngLat, zLevel);
});


myMap.layerEventHandler.on('click', 'mm-floor-outline', function(e, features) {
    var lngLat = e.lngLat;
    var zLevel = myMap.zLevel;
    mapClick(lngLat, zLevel);
});

var mapClick=function(lngLat, zLevel) {
    myMap.highlighter.clear();
    resultMarker
    .setLngLat(lngLat)
    .setZLevel(zLevel)
    .addTo(myMap);
    
    popup.setHTML(popupLatLngHTML(lngLat, zLevel));

    Mazemap.Data.getPoiAt(lngLat, zLevel).then( function(poi) {
        clickPoiMarker(poi);
    }).catch( function(error){
        if (!popup.isOpen())
             resultMarker.togglePopup();
    });
    
}

function popupPoiHTML(poi) {
    if (poi.properties.type == 'building')
        	return '<h4>'+ (poi.properties.title!='null'?poi.properties.title:'')+'</h4><p>'+(poi.properties.buildingName?toTitleCase(poi.properties.buildingName):'')+(poi.properties.floorName?', Floor '
	+toTitleCase(poi.properties.floorName):'')+'</p><p><strong>Get directions:<strong></p><p><a href="%globals_asset_url:97098%?lngA='+poi.geometry.coordinates[0]+'&latA='+poi.geometry.coordinates[1]+'&zA=1" class="set-start">Start Here</a> or <a href="%globals_asset_url:97098%?lngB='+poi.geometry.coordinates[0]+'&latB='+poi.geometry.coordinates[1]+'&zB=1" class="set-end">End here</a></p>';
    else
    	return '<h4>'+ (poi.properties.title!='null'?'<a href="%globals_asset_url:67217%?poi='+poi.properties.poiId+'">'+poi.properties.title+'</a>':'')+'</h4><p>'+(poi.properties.buildingName?toTitleCase(poi.properties.buildingName):'')+(poi.properties.floorName?', Floor '
	+toTitleCase(poi.properties.floorName):'')+'</p><p><strong>Get directions:<strong></p><p><a href="%globals_asset_url:97098%?pointA='+poi.properties.poiId+'" class="set-start">Start Here</a> or <a href="%globals_asset_url:97098%?pointB='+poi.properties.poiId+'" class="set-end">End here</a></p>';
}

function popupLatLngHTML(lngLat, zLevel) {
    return '<h4><a href="%globals_asset_url:67217%?lat='+lngLat.lat+'&lng='+lngLat.lng+'">Selected Location</a></h4><p><strong>Get directions:<strong></p><p><a href="%globals_asset_url:97098%?lngA='+lngLat.lng+'&latA='+lngLat.lat+'&zA='+zLevel+'" class="set-start">Start Here</a> or <a href="%globals_asset_url:97098%?lngB='+lngLat.lng+'&latB='+lngLat.lat+'&zB='+zLevel+'" class="set-end">End here</a></p>';
}