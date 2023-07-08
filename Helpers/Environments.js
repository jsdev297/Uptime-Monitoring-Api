/**
  * Title: All Environment Variables
  * Author: Fatin Ishraq Prapya
  * Date: 6 June 2023
*/

const environments = {};

environments.staging = {
  port: 3000,
  name: "staging",
  secretKey: "sfdsdfsdfsdfsdfsdf",
  maxChecks: 5
}

environments.production = {
  port: 5000,
  name: "production",
  secretKey: "sdfsdfsdfsdf",
  maxChecks: 5
}

const currentEnvironment = typeof (process.env.NODE_ENV) === "string" ? process.env.NODE_ENV : "staging";
const environmentToExport = typeof (environments[currentEnvironment]) === "object" ? environments[currentEnvironment] : "staging";

module.exports = environmentToExport;