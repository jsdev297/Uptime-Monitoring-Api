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

// Reading File
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir}${dir}/${file}.json`, "utf8", (err, data) => {
        callback(err, data);
    });
}

// Update Existing File
lib.update = (dir, file, data, callback) => {
    fs.open(`${lib.basedir}${dir}/${file}.json`, "r+", function (err, fileDescriptor) {
        if (!err & fileDescriptor) {
            const stringData = JSON.stringify(data);
            fs.ftruncate(fileDescriptor, (err) => {
                if (!err) {
                    fs.writeFile(fileDescriptor, stringData, (err) => {
                        if (!err) {
                            fs.close(fileDescriptor, (err) => {
                                if (!err) {
                                    callback(false);
                                } else {
                                    callback("Error closing File");
                                }
                            });
                        }
                    });
                } else {
                    callback("Error truncating file!");
                }
            });
        } else {
            callback("Error Updating file may not exists");
        }
    });
}

module.exports = lib;