var jsonResponse = JSON.parse(_REST.responses[0].body);

function parsePois(pois) { // organises the pois for output
    parsedPois = [];
	for(var currentPoiIndex = 0, totalPois = pois.length, currentPoi = ""; currentPoiIndex<totalPois; currentPoiIndex++) {
		var currentPoi = pois[currentPoiIndex];
	    var parsedPoi = [];
	    var type = "";
	    var typeMatch = /[LTS][BM]?[0-9]{1,4}/; // lift, toilet, stairwell
	    if (typeMatch.test(currentPoi.title.substring(0, 5))){
	    	type = currentPoi.title.charAt(0);
	    }
		parsedPoi.push({
			z: currentPoi.z,
			id: currentPoi.poiId,
			label: currentPoi.title,
			level: currentPoi.floorName,
			type: type
		});
		parsedPois.push(parsedPoi);
	}
	function sortL(a, b) {
	    /*
	   if (a[0].label.toString() < b[0].label.toString()) return -1;
	   if (a[0].label.toString() > b[0].label.toString()) return 1;
	   return 0;
	   */
   	   return a[0].label.toString().localeCompare(b[0].label.toString());
	}
	function sortZ(a, b) {
	   return a[0].z - b[0].z;
	}
	parsedPois = parsedPois.sort(sortL); // sort room names
	parsedPois = parsedPois.sort(sortZ); // then sort floors by the more reliable zLevel
	formatHTML(parsedPois); // all sorted
}

function formatHTML(parsedPois) { // prepares and prints the html output
	if (parsedPois){
		htmlHead = "<h2 class='heading-card' id='poilist'>Full list of rooms<\/h2>";
		htmlBody = "";
		htmlFoot = "<\/ul><\/accordion>";
		cLevel = "";
		typeClass = "";

		for(var i = 0, t = parsedPois.length, c = ""; i<t; i++) {
			c = parsedPois[i];
			if (c[0].z != cLevel){
				if (cLevel){
					htmlBody += "<\/ul><\/accordion>";
				}
				htmlBody += "<accordion name='Level " + c[0].level + "'><ul>";
			}
			cLevel = c[0].z;
			if ((c[0].type == "T") || (c[0].type == "L") || (c[0].type == "S")){
				typeClass = "type-" + c[0].type;
			}else{
				typeClass = "";
			}
			/*
			if ((c[0].label.substring(0, 1) == "T") || (c[0].label.substring(0, 1) == "L") || (c[0].label.substring(0, 1) == "S")){
				typeClass = "type-" + c[0].label.substring(0, 1);
			}else{
				typeClass = "";
			}
			*/
			htmlBody += "<li class='" + typeClass + "'><a href='https://maps.unimelb.edu.au/point?poi=" + c[0].id + "' rel='nofollow'>" + c[0].label + "<\/a><\/li>";
		}
	} else {
		htmlHead = "<p id='poilist'>Sorry, no items found inside this building. <a href='#map'>Back to the map<\/a>.<\/p>";
		htmlBody = "";
		htmlFoot = "";
	}
	print(htmlHead + htmlBody + htmlFoot);
}

if (jsonResponse){
	var pois = jsonResponse.pois;
	if (pois.length > 0){
		parsePois(pois);
	} else {
   		formatHTML();
	}
} else {
   	formatHTML();
}