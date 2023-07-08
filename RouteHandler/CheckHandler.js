/**
  * Title: Check Route Handler
  * Author: Fatin Ishraq Prapya
  * Date: 8 July 2023
*/

// Dependencies
const data = require("../lib/data");
const { hash, parseJSON } = require("../Helpers/Utilities");
const tokenHandler = require("./TokenHandler");

// Module Scaffolding
const checkHandler = {}

// Handler
checkHandler.handle = (requestProperties, callback) => {
    const { method } = requestProperties;
    const acceptedMethods = ["get", "post", "put", "delete"];
    if (acceptedMethods.indexOf(method) > -1) {
        userHandler._check[method](requestProperties, callback);
    } else {
        callback(405, { message: "" });
    }
}

userHandler._check = {};

userHandler._check.post = (requestProperties, callback) => {

}

userHandler._check.get = (requestProperties, callback) => {

}

userHandler._check.put = (requestProperties, callback) => {

}

userHandler._check.delete = (requestProperties, callback) => {

}

module.exports = checkHandler;