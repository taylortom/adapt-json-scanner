var jsonScan = require("./js/json-scan");
var blacklist = require("./config/blacklist.json");
var config = require("./config/config.json");

jsonScan(config, blacklist, function(error, violations) {
    if(error) {
        console.log(error);
    }
    else {
        if(!violations) console.log("No violations!!");
        else console.log(JSON.stringify(violations, null, 4));
    }
});
