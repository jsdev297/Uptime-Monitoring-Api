/**
  * Title: Routes
  * Author: Fatin Ishraq Prapya
  * Date: 6 June 2023
*/

// Dependies
const simpleHandler = require("./RouteHandler/SimpleHandler");
const notFoundHandler = require("./RouteHandler/NotFoundHandler")

const routes = {
  simple: simpleHandler,
  notFound: notFoundHandler
}

module.exports = routes;