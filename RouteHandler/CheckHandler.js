/**
  * Title: Check Route Handler
  * Author: Fatin Ishraq Prapya
  * Date: 8 July 2023
*/

// Dependencies
const data = require("../lib/data");
const { parseJSON, createRandomText } = require("../Helpers/Utilities");
const tokenHandler = require("./TokenHandler");
const { maxChecks } = require("../Helpers/Environments");

// Module Scaffolding
const checkHandler = {}

// Handler
checkHandler.handle = (requestProperties, callback) => {
    const { method } = requestProperties;
    const acceptedMethods = ["get", "post", "put", "delete"];
    if (acceptedMethods.indexOf(method) > -1) {
        checkHandler._check[method](requestProperties, callback);
    } else {
        callback(405, { message: "" });
    }
}

checkHandler._check = {};

checkHandler._check.post = (requestProperties, callback) => {
    const protocol = typeof (requestProperties.body.protocol) === "string" && ["http", "https"].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;
    const url = typeof (requestProperties.body.url) === "string" && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;
    const method = typeof (requestProperties.body.method) === "string" && ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;
    const successCodes = typeof (requestProperties.body.successCodes) === "object" && requestProperties.body.successCodes instanceof Array === true ? requestProperties.body.successCodes : false;
    const timeOutSeconds = typeof (requestProperties.body.timeOutSeconds) === "number" && requestProperties.body.timeOutSeconds % 2 === 0 && requestProperties.body.timeOutSeconds >= 1 && requestProperties.body.timeOutSeconds <= 5 ? requestProperties.body.timeOutSeconds : false;


    if (protocol && url && method && successCodes && timeOutSeconds) {
        const token = typeof (requestProperties.headers.token) === "string" ? requestProperties.headers.token : false;
        data.read("Tokens", token, (err, tokenData) => {
            if (!err && tokenData) {
                const userPhone = parseJSON(tokenData).phone;
                data.read("users", userPhone, (err, userData) => {
                    if (!err && userData) {
                        tokenHandler._token.varifyToken(token, userPhone, (tokenId) => {
                            if (tokenId) {
                                const user = parseJSON(userData);
                                const userChecks = typeof (user.checks) === "object" && user.checks instanceof Array ? user.checks : [];
                                if (userChecks.length < maxChecks) {
                                    const checkId = createRandomText(20);
                                    const checkObject = { id: checkId, userPhone: user.phone, protocol, url, method, successCodes, timeOutSeconds: timeOutSeconds };
                                    data.create("Checks", checkId, checkObject, (err) => {
                                        if (!err) {
                                            user.checks = userChecks;
                                            user.checks.push(checkId);
                                            data.update("users", user.phone, user, (err) => {
                                                if (!err) {
                                                    callback(200, checkObject);
                                                } else {
                                                    callback(500, {
                                                        error: "There was a problem in the server 2"
                                                    });
                                                }
                                            });
                                        } else {
                                            callback(500, {
                                                error: "There was a problem in the server"
                                            });
                                        }
                                    });
                                } else {
                                    callback(401, {
                                        error: "User has already riched max checks link"
                                    });
                                }
                            } else {
                                callback(403, {
                                    error: "Invalid Token"
                                });
                            }
                        });
                    } else {
                        callback(403, {
                            error: "User Not Found!"
                        });
                    }
                });
            } else {
                callback(403, {
                    error: "Authentication Problem"
                });
            }
        });
    } else {
        callback(400, {
            error: "Problem in your input!"
        });
    }

}

checkHandler._check.get = (requestProperties, callback) => {

}

checkHandler._check.put = (requestProperties, callback) => {

}

checkHandler._check.delete = (requestProperties, callback) => {

}

module.exports = checkHandler;