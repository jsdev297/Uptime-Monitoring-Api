/**
  * Title: Routes
  * Author: Fatin Ishraq Prapya
  * Date: 6 June 2023
*/

// Dependies
const simpleHandler = require("./RouteHandler/SimpleHandler");
const userHandler = require("./RouteHandler/UserHandler");

const routes = {
  simple: simpleHandler,
  user: userHandler
}

module.exports = routes;