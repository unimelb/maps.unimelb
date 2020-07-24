myMap.on('load', function(){
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('poi')){
        Mazemap.Data.getPoi(urlParams.get('poi')).then(function(poi) {
            var nodeList = document.querySelectorAll('title, #title, meta[name="title"]');
            nodeList.forEach(function(node){
                node.innerText=poi.properties.title?poi.properties.title:'Point';
            });
            var lngLat = Mazemap.Util.getPoiLngLat(poi);
            if (!(urlParams.get('SQ_DESIGN_NAME')=='embed'))
            {
                updateLocationFromMazemapRESTAPI(poi)
                updateLatLong(lngLat);
            }
            var marker = new Mazemap.MazeMarker({
                color: 'MazeBlue',
                size: 34,
                zLevel: 0
            });
            var zLevel = (typeof poi.properties.zLevel !== 'undefined')?poi.properties.zLevel:0;
            
            marker.setLngLat(lngLat)
                .setZLevel(zLevel)
                .addTo(myMap);
            myMap.zLevel = zLevel;
            if(poi.geometry.type === "Polygon"){
                myMap.highlighter.highlight(poi);
            }
        
            myMap.flyTo({center: lngLat, zoom: 19, duration: 2000});
        });
    }
    
    if(urlParams.get('identifier')){
        fetch('https://api.mazemap.com/api/pois/?identifier=' + urlParams.get('identifier'))
        .then(function(response) {
             return response.json();
        })
        .then(function(data) {
            var getPoiId = data.pois[0].poiId;
            Mazemap.Data.getPoi(getPoiId).then(function(poi) {
                var nodeList = document.querySelectorAll('title, #title, meta[name="title"]');
                nodeList.forEach(function(node){
                    node.innerText=poi.properties.title?poi.properties.title:'Point';
                });
                var lngLat = Mazemap.Util.getPoiLngLat(poi);
                if (!(urlParams.get('SQ_DESIGN_NAME')=='embed'))
                {
                    updateLocationFromMazemapRESTAPI(poi)
                    updateLatLong(lngLat);
                }
                var marker = new Mazemap.MazeMarker({
                    color: 'MazeBlue',
                    size: 34,
                    zLevel: 0
                });
                var zLevel = (typeof poi.properties.zLevel !== 'undefined')?poi.properties.zLevel:0;
                
                marker.setLngLat(lngLat)
                    .setZLevel(zLevel)
                    .addTo(myMap);
                myMap.zLevel = zLevel;
                if(poi.geometry.type === "Polygon"){
                    myMap.highlighter.highlight(poi);
                }
            
                myMap.flyTo({center: lngLat, zoom: 19, duration: 2000});
            });
        })
        .catch((error) => {
          console.log('Error:', error);
          window.location = '/point';
        });
    }
    
    if (urlParams.get('lat')) {
        var nodeList = document.querySelectorAll('title, h1');
        nodeList.forEach(function(node){
            node.innerText='Selected location';
        });
        
        nodeList = document.querySelectorAll('meta[name="title"], meta[property="og:title"]');
        nodeList.forEach(function(node){
            node.setAttribute("content", 'Selected location');
        });
        
        if (urlParams.get('lng')) {
            var marker = new Mazemap.MazeMarker({
                color: 'MazeBlue',
                size: 34,
                zLevel: 0
            });
            var zLevel = 0;
            var lngLat = {
                lat: urlParams.get('lat'),
                lng: urlParams.get('lng')
            }
             if (!(urlParams.get('SQ_DESIGN_NAME')=='embed'))
                updateLatLong(lngLat);

            marker.setLngLat(lngLat)
                .setZLevel(zLevel)
                .addTo(myMap);
            myMap.zLevel = zLevel;
        
            myMap.flyTo({center: lngLat, zoom: 17, duration: 2000});
        }
    }
});


function updateLocationFromMazemapRESTAPI(poi) {
    Mazemap.Data.getCampus(poi.properties.campusId).then(function(campus) {
        var campusName = campusIdSwap(campus.properties.id);
        var dom = document.querySelector('#mazeMapLocation');
        dom.innerHTML = 
            (poi.properties.floorName?'Level '+poi.properties.floorName+': ':'')
            +'<a href="https://maps.unimelb.edu.au/'+campusName+(poi.properties.buildingName?'/building/'+(poi.properties.identifier!=null?poi.properties.identifier.split(';')[1].toLowerCase():'')+'">'+poi.properties.buildingName:'">'+campus.properties.name+' campus')+'</a>';
        dom.hidden=false;    
    });
}

function updateLatLong(lngLat) {
    document.querySelector('#googleMapLink').href='http://www.google.com.au/maps/?q='+lngLat.lat+','+lngLat.lng;
    document.querySelector('#openStreetMapLink').href='https://www.openstreetmap.org/?mlat='+lngLat.lat+'&'+'mlon='+lngLat.lng+'#map=17/'+lngLat.lat+'/'+lngLat.lng;
    document.querySelector("#latLongText").innerText=lngLat.lat+','+lngLat.lng;
}