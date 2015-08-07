var fs = require("fs");
var jsonScan = require("./js/json-scan");
var path = require("path");

var blacklist = require("./config/blacklist.json");
var config = require("./config/config.json");

// the (self)starting point
(function start() {
    jsonScan(config, blacklist, onScanComplete);
})();

function onScanComplete(error, violations) {
    console.log("json-scan: scan complete!");
    if(error) return console.log(error);

    if(!violations) console.log("All courses scanned are v2.0.0 compatible");
    else outputResults(violations);
};

function outputResults(data) {
    if(config.output.format === "console") return console.log(JSON.stringify(data));

    var pluginDir = path.join("output", config.output.format, "main");

    fs.stat(pluginDir + ".js", function(error) {
        if(error) return console.log("Unrecognised output format '" + config.output.format + "'");

        var outputPlugin = require("./" + pluginDir);
        outputPlugin(data);
    });
}
