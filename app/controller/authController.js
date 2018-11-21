const express = require("express");
const Request = express().request;
const Response = express().response;
const {
    errorCodes,
    crmCodes
} = require("../utility/errorCodes");
const manipulateToken = require("../utility/jwtHandler").manipulateToken;

/**
 * @param {Request} req
 * @param {Response} res
 */
exports.appAuthHandler = async function (req, res, next) {
    try {
        if (req.headers.authxtoken === undefined || req.headers.authxtoken === null || req.headers.authorization === "") {
            res.status(errorCodes.UNAUTHORIZED.Value);
            res.send({
                ...crmCodes.AUTH_ERR,
                "data": {}
            })
        } else if (await manipulateToken(req.headers.authxtoken)) {
            next();
        } else {
            res.status(errorCodes.UNAUTHORIZED.Value);
            res.send({
                ...crmCodes.AUTH_ERR,
                "data": {}
            })
        }
    } catch (e) {
        res.status(errorCodes.INTERNAL_SERVER_ERROR.Value);
        res.send({
            ...crmCodes.SERVER_ERR,
            data: e
        })
        console.info("error @appAuthHanlder ", e)
    }
}