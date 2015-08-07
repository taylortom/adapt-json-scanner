var _ = require("underscore");
var async = require("async");
var fs = require("fs");
var path = require("path");

exports = module.exports = function(config, blacklist, callback) {
    // the (self)starting point
    (function start() {
        scanDir(config.coursesDir, callback);
    })();

    // Recursively scans dir, calling scanObject on anything in blacklist
    function scanDir(dir, callback) {
        fs.readdir(dir, function onReaddir(error, files) {
            if(error) return console.log(error);
            async.each(files, function onAsyncLoop(file, done) {
                var filepath = path.join(dir, file);
                // in blacklist, scan JSON
                if(blacklist[file]) {
                    scanJSON(file, filepath, done);
                }
                else {
                    // if directory, go deeper
                    fs.stat(filepath, function onFSStat(error, data) {
                        if(data.isDirectory()) scanDir(filepath, done);
                        else done();
                    })
                }
            },
            // when done with all files, rip out any violations
            function(error) {
                if(error) return console.log(error);
                var violations = {};
                // each file type
                for(var fileKey in blacklist) {
                    // each warning for file
                    for(var warningKey in blacklist[fileKey]) {
                        var warningData = blacklist[fileKey][warningKey];
                        if(warningData.violations && warningData.violations.length > 0) {
                            violations[warningKey] = warningData;
                        }
                    }
                }
                if(_.isEmpty(violations)) callback();
                else callback(null, violations);
            });
        });


        // reads JSON file and calls scanObject appropriately
        function scanJSON(filename, filepath, callback) {
            fs.readFile(filepath, function onReadFile(error, data) {
                if(error) return console.log(error);
                var jsonData = JSON.parse(data);
                // content objects (A,B,Cs) are [], configs are {}
                if(_.isArray(jsonData)) {
                    async.each(jsonData, function onAsyncLoop(co, done) {
                        scanObject(filename, filepath, co, done);
                    }, callback);
                }
                else {
                    scanObject(filename, filepath, jsonData, callback);
                }
            });
        }

        // check object for blacklisted properties and add to config->violations
        function scanObject(filename, filepath, jsonData, callback) {
            var blacklistData = blacklist[filename];
            for(var key in blacklistData) {
                var exists = doesPropertyExist(key, jsonData);
                var negate = blacklistData[key].negate || false;

                if((exists && !negate) || (!exists && negate)) {
                    // get outta here if the prerequisite isn't satisfied
                    var prerequisiteExists = doesPropertyExist(blacklistData[key].prerequisite, jsonData);
                    if(blacklistData[key].prerequisite && !prerequisiteExists) return;

                    var violations = blacklistData[key].violations = blacklistData[key].violations || [];
                    if(violations.indexOf(jsonData._id) === -1) violations.push({
                        "id": jsonData._id,
                        "filename": filename,
                        "filepath": filepath
                    });
                }
            }
            callback(null);
        };

        // compares a dot notation string to an object heirarchy (e.g. "object.prop1.prop2")
        function doesPropertyExist(str, targetObj) {
            try {
                return str.split('.').reduce(getValue, targetObj) !== undefined;
            } catch(e) {
                return false;
            }
        };

        function getValue(obj, key) {
            return obj[key];
        };
    }
};
