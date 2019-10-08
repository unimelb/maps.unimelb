// Define these variables
var nCat = "C"; // mazemap poi category
var dName = "Cafe"; // default name

// you shouldn't need to edit below here

// The source URLs must be in the order below
var nodes = JSON.parse(_REST.responses[0].body); // OSM data via overpass-api.de
var excludeList = JSON.parse(_REST.responses[1].body); // Local OSM exclusions file

// print(nodes.elements.length);
// print(excludeList.excludeItems.length);

// Initialise some more variables
var nAddr = "";
var nName = "";
var nLl = "";
var exclusions = []; // list of OSM Ids to exclude

function processExclusions(excludeNodes) {
	var thisNode = "";
    for(var nodeIndex = 0, totalNodes = excludeNodes.length; nodeIndex<totalNodes; nodeIndex++){
    	thisNode = excludeNodes[nodeIndex].osmID;
    	exclusions.push(thisNode);
    }
}

function processNodes(allNodes) {
    for(var nodeIndex = 0, totalNodes = allNodes.length, currentNode = ""; nodeIndex<totalNodes; nodeIndex++){
    	thisNode = allNodes[nodeIndex];
        nodeID = thisNode.id;
        // compare node against exclusions
        if (includeThis(nodeID, exclusions)) {
        	nLl = thisNode.lat + "," + thisNode.lon;
            nodeTime = thisNode.timestamp;
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
			printLine(nAddr,nName,nLl,nCat,nodeID,nodeTime);
        }
    }
}

// all data normalised, output to csv
function printLine(nAddr,nName,nLl,nCat,nodeID) {
    print("\"" + nAddr + "\",\"" + nName + "\",\"" + nLl + "\",\"" + nCat + "\",\"" + "EXT;OSM;" + nodeID+ "\",\"" + nodeTime + "\"\n");
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