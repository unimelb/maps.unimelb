if (_REST.response.info.http_code == 200) {
    var out = "";
    rs = JSON.parse(_REST.responses.length); // how many responses are there?
    for (var ri = 0, rl = rs, rc = ""; ri<rl; ri++){
        out += _REST.responses[ri].info.url + "\r\r"; // use URL as a heading
        rb = JSON.parse(_REST.responses[ri].body); // get the buildings info into an object
        rbl = rb.buildings.length;
        for (var bi = 0, bl = rbl, bc = ""; bi<bl; bi++){
            out += rb.buildings[bi].id + "," + rb.buildings[bi].name + "\r";
        }
        out += "\r--- \r\r"; // end
    }
}
print(out);