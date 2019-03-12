var jsonResponse = JSON.parse(_REST.responses[0].body);

var jsonOut = "";
var htmlOut = "";

function parsePois() {
	for(var currentPoiIndex = 0, totalPois = pois.length, currentPoi = ""; currentPoiIndex<totalPois; currentPoiIndex++) {
		currentPoi = pois[currentPoiIndex];
	    parsedPoi = [];
		parsedPoi.push({
		    id: currentPoi.poiId,
		    title: currentPoi.title,
		    buildingId: currentPoi.buildingId,
		    campusId: currentPoi.campusId,
		    lng: currentPoi.geometry.coordinates[0],
		    lat: currentPoi.geometry.coordinates[1]
		});
	    if (currentPoiIndex+1 < totalPois){
		    outPoi(parsedPoi);    
	    }else{
	    	lastPoi = 1;
		    outPoi(parsedPoi, lastPoi);
	    };
	}
	outJson();
	outHtml();
}

function outPoi(poi,isLast) {
    jsonOut = jsonOut + '{\n';
    jsonOut = jsonOut + '  "type": "Feature",\n';
    jsonOut = jsonOut + '  "geometry": {\n';
    jsonOut = jsonOut + '    "type": "Point",\n';
    jsonOut = jsonOut + '    "coordinates": [' + poi[0].lng + ',' + poi[0].lat + ']\n';
    jsonOut = jsonOut + '  },\n';
    jsonOut = jsonOut + '  "properties": {\n';
    jsonOut = jsonOut + '    "marker-symbol": "marker",\n';
//    jsonOut = jsonOut + '    "description": "<a href=\'https:\/\/use.mazemap.com/#v=1&campusid=200&campuses=unimelb&sharepoitype=poi&sharepoi=' + poi[0].id + '\'><h3>' + poi[0].title + '<\/h3><\/a>\"\n';
    jsonOut = jsonOut + '    "description": "<a href=\'https:\/\/maps.unimelb.edu.au\/point?poi=' + poi[0].id + '\'><h3>' + poi[0].title + '<\/h3><\/a>\"\n';
    jsonOut = jsonOut + '  }\n';
    if (isLast == 1) {
	    jsonOut = jsonOut + '}';
    }else{
	    jsonOut = jsonOut + '},';
    }
    
    htmlOut = htmlOut + '<li class="cell POI">';
    htmlOut = htmlOut + '<a href="https:\/\/maps.unimelb.edu.au\/point?poi=' + poi[0].id + '">' + poi[0].title + '<\/a>';
    htmlOut = htmlOut + '<\/li>\n';
}

function outJson() {
    print('<script>\nvar geojson = [');
	print(jsonOut);
    print('];\n<\/script>');
}

function outHtml() {
    print('<ul class="grid grid--3col">\n');
	print(htmlOut);
    print('<\/ul>\n');
}

if (jsonResponse.pois){
	var pois = jsonResponse.pois;
	if (pois.length > 0){
		parsePois();
		var totalFound = pois.length;
	}
}
