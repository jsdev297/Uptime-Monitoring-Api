/**
  * Title: Uptime Monitoring Api
  * Description: Uptime Monitoring Api for my Practice
  * Author: Fatin Ishraq Prapya
  * Date: 6 June 2023
*/

// Dependencies
const http = require("http");
const { handleReqRes } = require("./Helpers/HandleReqRes");
const environment = require("./Helpers/Environments");
const data = require("./lib/data");

// Module Scaffolding
const app = {};

// testing file system
// @TODO: pore muche dibo
data.delete('test', 'newfile', (err) => {
  console.log(`${err}`);
});

// Create Server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(environment.port, () => console.log("Server listening at port ", environment.port));
}

// Handle Request & Response
app.handleReqRes = handleReqRes;

// Run Server
app.createServer();