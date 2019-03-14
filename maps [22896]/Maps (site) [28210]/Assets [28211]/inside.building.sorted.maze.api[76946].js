var html = "<p id='poilist'>Sorry, no items found inside this building. <a href='#map'>Back to the map<\/a>.<\/p>";

if (_REST.response.info.http_code == 200) {
    var data = JSON.parse(_REST.response.body);
    var rooms = {};
    var floors = {};

    var typeMatch = /[LTS][BM]?[0-9]{1,4}/; // lift, toilet, stairwell

    if (data.pois.length) {
        html = "<h2 class='heading-card' id='poilist'>Full list of rooms<\/h2>";
        data.pois.forEach(function(poi){
            if (!(poi.z in rooms))
            {
                rooms[poi.z] = {};
                floors[poi.z]=poi.floorName;
            }
            rooms[poi.z][poi.title]= poi.poiId;
           
        });
        Object.keys(floors).sort(function(a, b){return a-b}).forEach(function(level) {
            html+="<accordion name='Level " + floors[level] +"'><ul>";
            Object.keys(rooms[level]).sort().forEach(function(room) {
                html+="<li " + (typeMatch.test(room.substring(0, 5))?"class='type-"+room.charAt(0)+"'":'') + "><a href='https://maps.unimelb.edu.au/point?poi=" + rooms[level][room] + "' rel='nofollow'>" + room + "<\/a><\/li>";
            });
            html+="<\/ul><\/accordion>";
        });
    } 
} 

print(html);
