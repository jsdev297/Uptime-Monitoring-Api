/**
  * Title: Token Handler to handle Token realated routes
  * Author: Fatin Ishraq Prapya
  * Date: 4 July 2023
*/

// Dependencies
const data = require("../lib/data");
const { hash, parseJSON, createRandomText } = require("../Helpers/Utilities");

// Module Scaffolding
const tokenHandler = {}

// handler
tokenHandler.handle = (requestProperties, callback) => {
    const { method } = requestProperties;
    const acceptedMethods = ["get", "post", "put", "delete"];
    if (acceptedMethods.indexOf(method) > -1) {
        tokenHandler._token[method](requestProperties, callback);
    } else {
        callback(405, { message: "" });
    }
}

tokenHandler._token = {};

// User Creating System
tokenHandler._token.post = (requestProperties, callback) => {
    const phone = typeof (requestProperties.body.phone) === "string" && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
    const password = typeof (requestProperties.body.password) === "string" && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    if (phone && password) {
        data.read("users", phone, (err, userData) => {
            if (!err && userData) {
                const hashedPassword = hash(password);
                userData = parseJSON(userData)
                if (userData.password === hashedPassword) {
                    console.log("password matched");
                    const tokenId = createRandomText();
                    const expires = Date.now() + (60 * 60 * 1000);
                    const tokenObject = { phone, id: tokenId, expires }

                    data.create("Tokens", tokenId, tokenObject, (err) => {
                        if (!err) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, {
                                message: "There was an Error!"
                            });
                        }
                    });
                } else {
                    callback(400, {
                        message: "Wrong Password"
                    });
                }
            } else {
                callback(400, {
                    message: "Invalid Phone Number"
                });
            }
        });
    }
}

tokenHandler._token.get = (requestProperties, callback) => {

}

tokenHandler._token.put = (requestProperties, callback) => {

}

tokenHandler._token.delete = (requestProperties, callback) => {

}

module.exports = tokenHandler;