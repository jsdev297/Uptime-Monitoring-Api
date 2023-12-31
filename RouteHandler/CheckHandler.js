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
    const id = typeof (requestProperties.queryObject.id) === "string" && requestProperties.queryObject.id.trim().length === 20 ? requestProperties.queryObject.id : false;
    if (id) {
        data.read("Checks", id, (err, checkData) => {
            if (!err && checkData) {
                const token = typeof (requestProperties.headers.token) === "string" ? requestProperties.headers.token : false;
                if (token) {
                    tokenHandler._token.varifyToken(token, parseJSON(checkData).userPhone, (tokenValid) => {
                        if (tokenValid) {
                            callback(200, parseJSON(checkData));
                        } else {
                            callback(403, {
                                message: "Invalid Token!"
                            });
                        }
                    });
                } else {
                    callback(500, {
                        message: "Please Provide Token"
                    })
                }
            } else {
                callback(500, {
                    message: "Wrong Id"
                });
            }
        });

    } else {
        callback(500, {
            message: "Invalid Check Id"
        });
    }
}

checkHandler._check.put = (requestProperties, callback) => {
    const id = typeof (requestProperties.body.id) === "string" && requestProperties.body.id.trim().length === 20 ? requestProperties.body.id : false;
    if (id) {
        const protocol = typeof (requestProperties.body.protocol) === "string" && ["http", "https"].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;
        const url = typeof (requestProperties.body.url) === "string" && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;
        const method = typeof (requestProperties.body.method) === "string" && ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;
        const successCodes = typeof (requestProperties.body.successCodes) === "object" && requestProperties.body.successCodes instanceof Array === true ? requestProperties.body.successCodes : false;
        const timeOutSeconds = typeof (requestProperties.body.timeOutSeconds) === "number" && requestProperties.body.timeOutSeconds % 2 === 0 && requestProperties.body.timeOutSeconds >= 1 && requestProperties.body.timeOutSeconds <= 5 ? requestProperties.body.timeOutSeconds : false;

        if (protocol || url || method || successCodes || timeOutSeconds) {
            data.read("Checks", id, (err, checkData) => {
                if (!err && checkData) {
                    const checkObject = parseJSON(checkData);
                    const token = typeof (requestProperties.headers.token) === "string" ? requestProperties.headers.token : false;
                    if (token) {
                        tokenHandler._token.varifyToken(token, checkObject.userPhone, (tokenIsValid) => {
                            if (tokenIsValid) {
                                if (protocol) {
                                    checkObject.protocol = protocol;
                                } if (url) {
                                    checkObject.url = url;
                                } if (method) {
                                    checkObject.method = method;
                                } if (successCodes) {
                                    checkObject.successCodes = successCodes;
                                } if (timeOutSeconds) {
                                    checkObject.timeOutSeconds = timeOutSeconds;
                                }
                                data.update("Checks", id, checkObject, (err) => {
                                    if (!err) {
                                        callback(200, {
                                            message: "Check updated done"
                                        });
                                    } else {
                                        callback(200, {
                                            message: "There was a server side error"
                                        });
                                    }
                                });
                            } else {
                                callback(403, {
                                    message: "Wrong Token Id"
                                });
                            }
                        });
                    } else {
                        callback(500, {
                            message: "Provide Token id"
                        });
                    }
                } else {
                    callback(500, {
                        message: "There was a problem"
                    });
                }
            });
        } else {
            callback(500, {
                message: "There is no field to update"
            });
        }

    } else {
        callback(500, {
            message: "Please Provide ID"
        });
    }
}

checkHandler._check.delete = (requestProperties, callback) => {
    const id = typeof (requestProperties.queryObject.id) === "string" && requestProperties.queryObject.id.trim().length === 20 ? requestProperties.queryObject.id : false;
    if (id) {
        data.read("Checks", id, (err, checkData) => {
            if (!err && checkData) {
                const token = typeof (requestProperties.headers.token) === "string" ? requestProperties.headers.token : false;
                if (token) {
                    tokenHandler._token.varifyToken(token, parseJSON(checkData).userPhone, (tokenValid) => {
                        if (tokenValid) {
                            data.delete("Checks", id, (err) => {
                                if (!err) {
                                    console.log(parseJSON(checkData));
                                    data.read("users", parseJSON(checkData).phone, (err, userData) => {
                                        if (!err && userData) {
                                            let userObject = parseJSON(userData);
                                            let userChecks = typeof (userObject.checks) === "object" && userObject.checks instanceof Array ? userObject.checks : [];
                                            const checkPosition = userChecks.indexOf(id);
                                            if (checkPosition > 0) {
                                                userChecks.splice(checkPosition, 1);
                                                userObject.checks = userChecks;
                                                data.update("users", userObject.phone, userObject, (err) => {
                                                    if (!err) {
                                                        callback(200, {
                                                            message: "Check deleted successfully"
                                                        });
                                                    } else {
                                                        callback(500, {
                                                            message: "Server Site Error Updating..."
                                                        });
                                                    }
                                                });
                                            } else {
                                                callback(500, {
                                                    message: "The check you want to remove is not available!"
                                                });
                                            }
                                        } else {
                                            callback(500, {
                                                message: "Error Established Finding Check!"
                                            });
                                        }
                                    });
                                } else {
                                    callback(500, {
                                        message: "Server Site Error Deleting"
                                    });
                                }
                            });
                        } else {
                            callback(403, {
                                message: "Invalid Token!"
                            });
                        }
                    });
                } else {
                    callback(500, {
                        message: "Please Provide Token"
                    })
                }
            } else {
                callback(500, {
                    message: "Wrong Id"
                });
            }
        });

    } else {
        callback(500, {
            message: "Invalid Check Id"
        });
    }
}

module.exports = checkHandler;