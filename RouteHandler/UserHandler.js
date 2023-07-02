/**
  * Title: Router Handler to handle user realated routes
  * Author: Fatin Ishraq Prapya
  * Date: 6 June 2023
*/

// Dependencies
const data = require("../lib/data");
const { hash } = require("../Helpers/Utilities");

// Module Scaffolding
const userHandler = {}

// handler
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

module.exports = userHandler;