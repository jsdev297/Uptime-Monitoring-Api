/**
  * Title: Not Found Route Handler
  * Author: Fatin Ishraq Prapya
  * Date: 6 June 2023
*/

// Module Scaffolding
const notFoundHandler = {}

// Handler
notFoundHandler.handle = (requestProperties, callback) => {
  callback(202, {});
}

module.exports = notFoundHandler;