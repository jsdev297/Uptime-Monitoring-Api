// Dependies
const fs = require("fs");
const path = require("path");

// Base Directory of the data folder
const lib = {};
lib.basedir = path.join(__dirname, "/../.data/");

// Write data to file
lib.create = (dir, file, data, callback) => {
    fs.open(`${lib.basedir}${dir}/${file}.json`, "wx", function (err, fileDescriptor) {
        if (!err & fileDescriptor) {
            const stringData = JSON.stringify(data);
            fs.writeFile(fileDescriptor, stringData, function (err) {
                if (!err) {
                    fs.close(fileDescriptor, function (err) {
                        if (!err) {
                            callback(false);
                        } else {
                            callback("Error Closing the file");
                        }
                    });
                } else {
                    callback("Error writting to new file!");
                }
            });
        } else {
            callback(err);
        }
    });
}

module.exports = lib;