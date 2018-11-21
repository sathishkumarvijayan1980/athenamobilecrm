var crmRouter = require("express").Router();
var getcustomers = require("./getCustomers");

var appAuthHandler = require("../../controller/authController.js").appAuthHandler;
const {
    authenticateUser,
    generateAuthXToken,
    authenticateApplication
} = require("./authHandler");

crmRouter.post("/userauthenticate", authenticateUser);
crmRouter.post("/getauthxtoken", generateAuthXToken);
crmRouter.post("/getcustomers", appAuthHandler, getcustomers);

module.exports = crmRouter;