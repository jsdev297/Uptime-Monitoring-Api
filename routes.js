/**
  * Title: Routes
  * Author: Fatin Ishraq Prapya
  * Date: 6 June 2023
*/

// Dependies
const userHandler = require("./RouteHandler/UserHandler");
const tokenHandler = require("./RouteHandler/TokenHandler");

const routes = {
  token: tokenHandler,
  user: userHandler
}

module.exports = routes;