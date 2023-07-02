/**
  * Title: Utilities
  * Author: Fatin Ishraq Prapya
  * Date: 6 June 2023
*/

// Dependencies
const crypto = require("crypto");
const environments = require("./Environments");

// Module Scaffolding
const utilities = {};

// Parse JSON to String
utilities.parseJSON = (jsonString) => {
    let output;
    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }
    return output;
}

// Hash String
utilities.hash = (string) => {
    let hash;
    if (typeof (string) === "string" && string.length > 0) {
        hash = crypto
            .createHmac("sha256", environments.secretKey)
            .update(string)
            .digest("hex");
        return hash;
    } else {
        return false;
    }
}

module.exports = utilities;