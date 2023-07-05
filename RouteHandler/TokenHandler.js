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
                    const tokenId = createRandomText(20);
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
                    message: "Your Number is not ragistered!"
                });
            }
        });
    } else {
        callback(400, {
            message: "Invalid Number"
        })
    }
}

tokenHandler._token.get = (requestProperties, callback) => {
    const id = typeof (requestProperties.queryObject.id) === "string" && requestProperties.queryObject.id.trim().length === 20 ? requestProperties.queryObject.id : false;
    if (id) {
        data.read("Tokens", id, (err, tokenData) => {
            if (!err) {
                const token = parseJSON(tokenData);
                callback(200, token);
            } else {
                callback(500, { message: "Request Token was not found" });
            }
        });
    } else {
        callback(404, { message: "Wrong Id" });
    }
}

tokenHandler._token.put = (requestProperties, callback) => {
    const id = typeof (requestProperties.body.id) === "string" && requestProperties.body.id.trim().length === 20 ? requestProperties.body.id : false;
    const extend = typeof (requestProperties.body.extend) === "boolean" && requestProperties.body.extend === true ? true : false;

    if (id && extend) {
        data.read("Tokens", id, (err, tokenData) => {
            if (!err && tokenData) {
                let tokenObject = parseJSON(tokenData);
                if (tokenObject.expires > Date.now()) {
                    tokenObject.expires = Date.now() + (60 * 60 * 1000);
                    data.update("Tokens", id, tokenObject, (err) => {
                        if (!err) {
                            callback(200, { message: "token updated successfully" });
                        } else {
                            callback(400, { message: "There was an Error!" });
                        }
                    });
                } else {
                    callback(400, {
                        error: "Token Already Expired"
                    });
                }
            } else {
                callback(400, {
                    error: "Token not matched!"
                });
            }
        });
    } else {
        callback(400, { error: "There was an Error!" });
    }
}

tokenHandler._token.delete = (requestProperties, callback) => {
    const id = typeof (requestProperties.queryObject.id) === "string" && requestProperties.queryObject.id.trim().length === 20 ? requestProperties.queryObject.id : false;

    if (id) {
        data.read("Tokens", id, (err, tokenData) => {
            if (!err && tokenData) {
                data.delete("Tokens", id, (err) => {
                    if (!err) {
                        callback(200, {
                            message: "Token Deleted Successfully"
                        });
                    } else {
                        callback(500, {
                            error: "Token deletion failed"
                        });
                    }
                })
            } else {
                callback(400, {
                    error: "Token not Found!"
                })
            }
        })
    } else {
        callback(500, {
            message: "Wrong Input"
        });
    }
}


tokenHandler._token.varifyToken = (id, phone, callback) => {
    data.read("Tokens", id, (err, tokenData) => {
        if (!err && callback) {
            if (parseJSON(tokenData).phone === phone) {
                callback(true);
            }
        } else {
            callback(false);
        }
    });
}

module.exports = tokenHandler;