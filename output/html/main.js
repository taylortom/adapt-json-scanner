var fs = require("fs");
var handlebars = require("handlebars");
var opener = require("opener");
var path = require("path");
var config = require("../../config/config.json").output;

exports = module.exports = function(scanResults) {
    var HTML_TEMPLATE = path.join(__dirname, "template.html");
    var OUTPUT_FILE = path.join(__dirname, "results.html");

    // the (self)starting point
    (function start() {
        fs.readFile(HTML_TEMPLATE, "utf-8", function(error, htmlContents) {
            if(error) return console.log(error);

            var template = handlebars.compile(htmlContents);
            var html = template(generateModel());

            fs.writeFile(OUTPUT_FILE, html, function(error) {
                if(error) console.log(error);
            });

            if(config.autoOpen) opener(OUTPUT_FILE);
        });
    })();

    function generateModel() {
        var totalWarnings = 0;
        for(var key in scanResults) totalWarnings += scanResults[key].violations.length;

        return {
            totalWarnings: totalWarnings,
            violations: scanResults
        };
    }
};
