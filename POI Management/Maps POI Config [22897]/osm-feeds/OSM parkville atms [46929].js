// Define these variables
var nCat = "ATM"; // mazemap poi category
var dName = "ATM"; // default name if none found

// you shouldn't need to edit below here

// The source URLs must be in the order below
var nodes = JSON.parse(_REST.responses[0].body); // OSM data via overpass-api.de
var excludeList = JSON.parse(_REST.responses[1].body); // Local OSM exclusions file

// print(nodes.elements.length);
// print(excludeList.excludeItems.length);

// Initialise some more variables
var nAddr = "";
var nName = "";
var nLat = "";
var nLng = "";
var lineCount = "0";
var exclusions = []; // list of OSM Ids to exclude

function processExclusions(excludeNodes) {
	var thisNode = "";
    for(var nodeIndex = 0, totalNodes = excludeNodes.length; nodeIndex<totalNodes; nodeIndex++){
    	thisNode = excludeNodes[nodeIndex].osmID;
    	exclusions.push(thisNode);
    }
}

/* Nodes in OSM have unique tags.
The processNodes function decides which tags appear in the two searchable name columns. */
function processNodes(allNodes) {
    for(var nodeIndex = 0, totalNodes = allNodes.length, currentNode = ""; nodeIndex<totalNodes; nodeIndex++){
    	thisNode = allNodes[nodeIndex];
        nodeID = thisNode.id;
        // compare node against exclusions
        if (includeThis(nodeID, exclusions)) {
        	nLat = thisNode.lat;
        	nLng = thisNode.lon;
            // nodeTime = thisNode.timestamp;
        	if (thisNode.tags['addr:housenumber']){
            	if (thisNode.tags['addr:street']){
            	   nAddr = thisNode.tags['addr:housenumber'] + " " + thisNode.tags['addr:street'];
            	} else {
            	   nAddr = "";
            	}
        	} else {
        	   nAddr = "";
        	}
			if (!thisNode.tags.name) {
				if (!thisNode.tags.operator) {
					nName = dName;
				} else {
					nName = thisNode.tags.operator;
				}
			} else {
				nName = thisNode.tags.name;
			}
			lineCount++;
			printLine(nAddr,nName,nLat,nLng,nCat,nodeID,lineCount);
        }
    }
}

// all data normalised, output to csv
function printLine(nAddr,nName,nLat,nLng,nCat,nodeID,lineCount) {
    print("\"" + lineCount + "\",\"" + "EXT_OSM_" + nodeID + "\",\"" + nLat + "\",\"" + nLng + "\",\"" + nName + "\",\"" + nAddr + "\",\"" + nCat + "\"\n");
}

function includeThis(id, exclList) {
    for(var xIndex = 0, totalX = exclList.length, currentX = ""; xIndex<totalX; xIndex++){
    	thisX = exclList[xIndex];
    	if (thisX == id){
    		return false;
    	}
    }
    // This has no matches in the exclude list, so return true
	return true;
}

if(excludeList.excludeItems.length > 0){
    excludeNodes = excludeList.excludeItems;
    processExclusions(excludeNodes);
}

if(nodes.elements.length > 0){
    allElements = nodes.elements;
    processNodes(allElements);
}