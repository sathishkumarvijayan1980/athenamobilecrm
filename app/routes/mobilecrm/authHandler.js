const express = require("express");
const Request = express().request;
const Response = express().response;
const joi = require('joi');

let {
    generateAuthNToken
} = require("../../utility/dbHandler");
let {
    persistAuthToken,
    validateToken,
    validateAppKey
} = require("../../models/tokenModels");
const {
    errorCodes,
    crmCodes
} = require("../../utility/errorCodes");
const manipulateToken = require("../../utility/jwtHandler").manipulateToken;

exports.authenticateUser = async (req, res, next) => {

    let {
        appsecretkey
    } = req.headers;
    let {
        username,
        password
    } = req.body;

    const userAuthSchema = joi.object().keys({
        username: joi.string().min(3).max(30).required(),
        password: joi.string().min(3).max(30).required()
    }).with('username', ['password'])

    if (appsecretkey === undefined || appsecretkey === "" || appsecretkey === null) {
        res.status(401);
        res.json({
            status: "401",
            message: "Missing appsecret key",
            data: {}
        })
    } else {
        joi.validate(req.body, userAuthSchema, async (err, value) => {
            if (err) {
                res.status(400);
                res.json({
                    ...crmCodes.PARAM_ERR,
                    data: err
                })

            } else {
                validateAppKey(appsecretkey).then(resdata => {
                    if (resdata.Data.length !== 0) {

                        generateAuthNToken(username, password).then(authNTokenData => {
                            persistAuthToken(username, authNTokenData.authToken).then(data => {
                                res.send({
                                    ...crmCodes.SUCCESS,
                                    data: authNTokenData
                                })
                            }).catch(err => {
                                res.status(500);
                                res.send({
                                    ...crmCodes.SERVER_ERR,
                                    data: err
                                })
                            })
                        }).catch(err => {
                            res.status(401).send({
                                status: "401",
                                message: "Authentication Failed",
                                data: err
                            })
                        })

                    } else {
                        res.status(401).send({
                            status: "401",
                            message: "Invalid App Key",
                            data: {}
                        })
                    }
                }).catch(err => {
                    res.status(500);
                    res.send({
                        ...spmsCodes.SERVER_ERR,
                        data: err
                    })
                });

            }
        })
    }

}

/**
 * Generates authxtoken on generation
 * @param {Request} req 
 * @param {Response} res 
 * @param {function} next 
 */
exports.generateAuthXToken = async (req, res, next) => {

    let { appsecretkey } = req.headers;
    let {
        username,
        authNtoken
    } = req.body;

    if(appsecretkey === null || appsecretkey === undefined || appsecretkey === ""){
        res.status(400);
        res.send({
            status: "401",
            message: "Missing app secret key",
            data: {}
        })
    }else{

        const validateSchema = joi.object().keys({
            username: joi.string().min(3).max(30).required(),
            authNtoken: joi.string().min(3).max(100).required()
        }).with('username', ['authNtoken'])

        joi.validate(req.body, validateSchema, async (err, value) => {
            if (err) {
                res.status(400);
                res.json({
                    ...spmsCodes.PARAM_ERR,
                    data: err
                })
            } else {
                validateAppKey(appsecretkey).then(resdata => {
                    if(resdata.Data.length !== 0){
                        validateToken(username, authNtoken).then(async data => {
                            if (data.Data.length !== 0) {
                                try {
                                    let returnAutXToken = await manipulateToken({
                                        token: authNtoken
                                    }, "generate")

                                    res.send({
                                        ...crmCodes.SUCCESS,
                                        data: {
                                            authXToken: returnAutXToken
                                        }
                                    })
                                } catch (error) {
                                    
                                }
                            } else {
                                res.status(401);
                                res.send({
                                    status: "401",
                                    message: "Authentication Failed",
                                    data: {}
                                })
                            }
                        }).catch(err => {
                            res.status(500);
                            res.send({
                                ...crmCodes.SERVER_ERR,
                                data: err
                            })
                        })
                    }else{
                        res.status(401).send({
                            status: crmCodes.AUTH_ERR.status,
                            message: "Invalid App Key",
                            data: {}
                        })
                    }
                }).catch(err => {
                        res.status(500);
                        res.send({
                            ...crmCodes.SERVER_ERR,
                            data:err
                        })
                    });

            }
        });
    }
}

exports.authenticateApplication = async (req, res, next) => {

    let {
        username,
        password
    } = req.body;

    let {
        appsecretkey
    } = req.headers;

    if (appsecretkey === null || appsecretkey === undefined || appsecretkey === "") {
        res.status(400);
        res.send({
            status: crmCodes.PARAM_ERR.status,
            message: "Missing app secret key",
            data: {}
        })
    } else {

        const validateSchema = joi.object().keys({
            username: joi.string().min(3).max(30).required(),
            password: joi.string().min(3).max(30).required(),
        }).with('username', ['password'])

        joi.validate(req.body, validateSchema, async (err, value) => {
            if (err) {
                res.status(400).json({
                    ...crmCodes.PARAM_ERR,
                    data: err
                })
            } else {
                validateAppKey(appsecretkey).then(resdata => {
                    if (resdata.Data.length !== 0) {
                        generateAuthNToken(username, password).then(async authNTokenData => {
                            try {
                                let returnAutXToken = await manipulateToken({
                                    token: authNTokenData.authToken
                                }, "generate")

                                res.send({
                                    ...crmCodes.SUCCESS,
                                    data: {
                                        authXToken: returnAutXToken
                                    }
                                })
                            } catch (err) {
                                res.status(500);
                                res.send({
                                    ...crmCodes.SERVER_ERR,
                                    data: err
                                })
                            }
                        }).catch(err => {
                            res.status(401).send({
                                status: "401",
                                message: "Authentication Failed",
                                data: err
                            })
                        })
                    } else {
                        res.status(401).send({
                            status: crmCodes.AUTH_ERR.status,
                            message: "Invalid App Key",
                            data: {}
                        })
                    }
                }).catch(err => {
                    res.status(500);
                    res.send({
                        ...crmCodes.SERVER_ERR,
                        data: err
                    })
                });

            }
        });
    }
}