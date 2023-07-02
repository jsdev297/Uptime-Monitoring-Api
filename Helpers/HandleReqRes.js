/**
  * Title: Request Response Handlers
  * Author: Fatin Ishraq Prapya
  * Date: 6 June 2023
*/

// Dependencies
const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../routes");
const notFoundHandler = require("../RouteHandler/NotFoundHandler");

// Module Scaffolding
const handler = {}

// Handler
handler.handleReqRes = (req, res) => {
  const headers = req.headers;
  const parseUrl = url.parse(req.url, true);
  const path = parseUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  const method = req.method.toLowerCase();
  const queryObject = parseUrl.query;
  const requestProperties = { parseUrl, headers, path, trimmedPath, method, queryObject }

  const Decoder = new StringDecoder("utf-8");
  let realData = "";

  const choosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;
  const { handle } = choosenHandler;

  req.on("data", (buffer) => {
    realData += Decoder.write(buffer);
  });

  req.on("end", (buffer) => {
    realData += Decoder.end();

    handle(requestProperties, (statusCode, payload) => {
      statusCode = typeof statusCode === 'number' ? statusCode : 500;
      payload = typeof payload === 'object' ? payload : {};
      const payloadString = JSON.stringify(payload);
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });

}

module.exports = handler;