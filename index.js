/**
  * Title: Uptime Monitoring Api
  * Description: Uptime Monitoring Api for my Practice
  * Author: Fatin Ishraq Prapya
  * Date: 6 June 2023
*/

// Dependencies
const http = require("http");
const { handleReqRes } = require("./Helpers/HandleReqRes");

// Module Scaffolding
const app = {};

// Configuration
app.config = {
  port: 3000
};

// Create Server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(app.config.port, () => console.log("Server listening at port ", app.config.port));
}

// Handle Request & Response
app.handleReqRes = handleReqRes;

// Run Server
app.createServer();