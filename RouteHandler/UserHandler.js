/**
  * Title: Router Handler to handle user realated routes
  * Author: Fatin Ishraq Prapya
  * Date: 6 June 2023
*/

// Dependencies
const data = require("../lib/data");
const { hash, parseJSON } = require("../Helpers/Utilities");
const tokenHandler = require("./TokenHandler");

// Module Scaffolding
const userHandler = {}

// Handler
userHandler.handle = (requestProperties, callback) => {
  const { method } = requestProperties;
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(method) > -1) {
    userHandler._users[method](requestProperties, callback);
  } else {
    callback(405, { message: "" });
  }
}

userHandler._users = {};

// User Creating System
userHandler._users.post = (requestProperties, callback) => {
  const firstName = typeof (requestProperties.body.firstName) === "string" && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
  const lastName = typeof (requestProperties.body.lastName) === "string" && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;
  const phone = typeof (requestProperties.body.phone) === "string" && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
  const password = typeof (requestProperties.body.password) === "string" && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
  const toAgreement = typeof (requestProperties.body.agreement) === "boolean" ? requestProperties.body.agreement : false;

  if (firstName && lastName && phone && password && toAgreement) {
    // Make sure that user doest not already exits
    data.read("users", phone, (err, user) => {
      if (err) {
        let userObject = {
          firstName,
          lastName,
          phone,
          toAgreement,
          password: hash(password)
        };
        data.create("users", phone, userObject, (err) => {
          if (!err) {
            callback(200, { message: "User Created" });
          } else {
            callback(500, { message: "Error on server side" });
          }
        })
      } else {
        callback(500, {
          message: "There is an error in server side"
        });
      }
    });
  } else {
    callback(400, {
      callback: "you have a problem in your request"
    })
  }

}

// !TODO: User Details Getting Method (Authentication needed)
userHandler._users.get = (requestProperties, callback) => {
  const phone = typeof (requestProperties.queryObject.phone) === "string" && requestProperties.queryObject.phone.trim().length === 11 ? requestProperties.queryObject.phone : false;
  if (phone) {
    const token = typeof (requestProperties.headers.token) === "string" ? requestProperties.headers.token : false;
    if (token) {
      tokenHandler._token.varifyToken(token, phone, (tokenId) => {
        if (tokenId) {
          data.read("users", phone, (err, user) => {
            if (!err) {
              const userCu = JSON.parse(user);
              delete userCu["password"];
              callback(200, userCu);
            } else {
              callback(500, { message: "Error Established in Database" });
            }
          });
        } else {
          callback(403, {
            message: "User Authentication Failure!"
          });
        }
      });
    } else {
      callback(403, {
        message: "User Authentication Failure"
      });
    }


  } else {
    callback(404, { message: "request user is not defined" });
  }
}

// !TODO: User Update Method (Authentication needed)
userHandler._users.put = (requestProperties, callback) => {
  const phone = typeof (requestProperties.body.phone) === "string" && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
  const firstName = typeof (requestProperties.body.firstName) === "string" && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
  const lastName = typeof (requestProperties.body.lastName) === "string" && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;
  const password = typeof (requestProperties.body.password) === "string" && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

  if (phone) {
    if (firstName || lastName || password) {
      const token = typeof (requestProperties.headers.token) === "string" ? requestProperties.headers.token : false;
      if (token) {
        tokenHandler._token.varifyToken(token, phone, (tokenId) => {
          if (tokenId) {
            data.read("users", phone, (err, user) => {
              if (!err && user) {
                user = parseJSON(user);
                if (firstName) {
                  user.firstName = firstName;
                }
                if (lastName) {
                  user.lastName = lastName;
                }
                if (password) {
                  user.password = hash(password);
                }
                data.update("users", phone, user, (err) => {
                  if (!err) {
                    callback(200, {
                      message: "User Was Updated Successfully"
                    })
                  } else {
                    callback(500, {
                      error: "There was  a problem"
                    })
                  }
                })
              } else {
                callback(400, {
                  error: "Problem in file reading"
                });
              }
            });
          } else {
            callback(403, {
              message: "Authentication Failure!"
            });
          }
        });

      } else {
        callback(403, {
          message: "User need to authenticate before updating system"
        });
      }


    } else {
      callback(400, {
        error: "You have problem in your request"
      })
    }
  } else {
    callback(400, {
      error: "Invalid Phone Number!"
    });
  }
}

// !TODO: User Delete Method (Authentication needed)
userHandler._users.delete = (requestProperties, callback) => {
  const phone = typeof (requestProperties.queryObject.phone) === "string" && requestProperties.queryObject.phone.trim().length === 11 ? requestProperties.queryObject.phone : false;
  if (phone) {
    const token = typeof (requestProperties.headers.token) === "string" ? requestProperties.headers.token : false;
    if (token) {
      tokenHandler._token.varifyToken(token, phone, (tokenId) => {
        if (tokenId) {
          data.read("users", phone, (err, userData) => {
            if (!err && userData) {
              data.delete("users", phone, (err) => {
                if (!err) {
                  callback(200, {
                    message: "User Deleted Successfully"
                  });
                } else {
                  callback(500, {
                    error: "file deletion failed"
                  });
                }
              })
            } else {
              callback(400, {
                error: "User not Found!"
              })
            }
          })

        } else {
          callback(403, {
            message: "Authencation Failure!"
          });
        }
      });
    } else {
      callback(403, {
        message: "User need to authenticate before deleting!"
      });
    }

  } else {
    callback(500, {
      message: "Wrong Input"
    });
  }
}

module.exports = userHandler;