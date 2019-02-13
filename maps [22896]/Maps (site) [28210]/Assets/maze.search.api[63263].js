var jsonResponse = JSON.parse(_REST.responses[0].body);

// convert all the get variables to local variables
var qGet = "%globals_get_q%";
var rowsGet = "%globals_get_rows^empty:10%";
var startGet = "%globals_get_start^empty:0%";
var campusidGet = "%globals_get_campusid^empty:0%";

var campusArray = {"200": "Parkville", "216": "Southbank", "217": "Werribee", "218": "Burnley", "219": "Creswick", "220": "Dookie", "221": "Shepparton", "243": "Hawthorn"};

var jsonOut = "";
var htmlOut = "";

function parsePois() {
	for(var currentPoiIndex = 0, totalPois = pois.length, currentPoi = ""; currentPoiIndex<totalPois; currentPoiIndex++) {
		currentPoi = pois[currentPoiIndex];
	    parsedPoi = [];
	    
	    campusName = campusArray[currentPoi.campusId];
	    
		var type = "", id = "", buildingNumber = "", url = "", label = "", labelFull = "", buildingLabel = "";
		
	    if (currentPoi.poiId){
	    	// It's a poi
	    	type = "poi";
	    	id = currentPoi.poiId;
	    	
	    	// construct URL
			// url = 'https:\/\/maps.unimelb.edu.au\/point?poiid=' + currentPoi.poiId;
	    	url = 'https:\/\/use.mazemap.com/#v=1&campusid=' + currentPoi.campusId + '&campuses=unimelb&sharepoitype=poi&sharepoi=' + currentPoi.poiId;
	    	
	    	// construct label
/*	    	label = currentPoi.poiNames.join();
	    	label = label.replace(/,/, ', '); */
	    	label = currentPoi.title;

	    	// do something with currentPoi.zName to display floor if available
	    	labelFull = '<span class="title">' + label + '</span>';

	    	// if it's in a building
	    	if (currentPoi.dispBldNames[0]){
	    		buildingLabel = '<span class="buildingLevel">Level ' + currentPoi.zName + '</span> <span class="buildingName">' + currentPoi.dispBldNames[0] + '</span>';
	    		labelFull = labelFull + " " + buildingLabel;
	    	}
	    	
	    } else {
	    	// It's a building
			type = "building";
			id = currentPoi.buildingId;
			
	    	// hack out a building number
	    	buildingNumber = currentPoi.title.replace(/[^(]+\(([^)]+)\).*/, '$1');
	    	// construct a URL
	    	url = 'https:\/\/maps.unimelb.edu.au\/' + campusName.toLowerCase() + '\/building\/' + buildingNumber;
	    	
	    	// construct a label
	    	label = currentPoi.title;
	    	labelFull = '<span class="title">' + label + '</span>';
	    	
	    }	    

		// if the search is not scoped to a campus, show which campus results are from
        if (campusidGet){
			labelFull = labelFull + ' <span class="campus">' + campusName + '</span>';
		};

		parsedPoi.push({
			type: type,
			id: id,
			label: label,
			labelFull: labelFull,
			url: url,
			campusId: currentPoi.campusId,
			campusName: campusName,
			lng: currentPoi.point.coordinates[0],
			lat: currentPoi.point.coordinates[1]
		});

	    if (currentPoiIndex+1 < totalPois){
		    outPoi(parsedPoi);    
	    }else{
	    	lastPoi = 1;
		    outPoi(parsedPoi, lastPoi);
	    };
	}
	outJson("results");
	outHtml("results");
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
    jsonOut = jsonOut + '    "description": "<a href=\'' + poi[0].url + '\'><h3>' + poi[0].label + '<\/h3><\/a>\"\n';
    jsonOut = jsonOut + '  }\n';
    if (isLast == 1) {
	    jsonOut = jsonOut + '}';
    }else{
	    jsonOut = jsonOut + '},';
    }
    
    htmlOut = htmlOut + '<li class="cell '+ poi[0].type +'">';
    htmlOut = htmlOut + '<a href="' + poi[0].url + '">' + poi[0].labelFull + '<\/a>';
    htmlOut = htmlOut + '<\/li>\n';
}

function outJson() {
    print('<script>\nvar geojson = [');
	print(jsonOut);
    print('];\n<\/script>');
}

function outHtml(ou) {
    if (ou == "results"){
        print('<ul class="search-results">\n');
    	print(htmlOut);
        print('<\/ul>\n');
    }else{
        print('<h2>Sorry!<\/h2>\n');
        print('We couldn\'t find anything with that query\n');
    }
}

if (jsonResponse.result){
	var pois = jsonResponse.result;
	if (pois.length > 0){
		parsePois();
	}else{
    	outHtml("empty");
	}
}