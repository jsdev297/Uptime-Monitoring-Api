/**
  * Title: Simple Route Handler
  * Author: Fatin Ishraq Prapya
  * Date: 6 June 2023
*/

// Module Scaffolding
const simpleHandler = {}

// handler
simpleHandler.handle = (requestProperties, callback) => {
  // console.log(requestProperties);
  callback(202, { email: 'fatinishraqprapya', name: 'Fatin Ishraq Prapya' });
}

module.exports = simpleHandler;