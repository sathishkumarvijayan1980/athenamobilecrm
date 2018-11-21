const express = require("express");
const Request = express().request;
const Response = express().response;
const joi = require("joi");
const {
  crmCodes,
  errorCodes
} = require("../../utility/errorCodes");

/**
 * 
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 */
module.exports = async function getCustomers(req, res, next) {

  const getCustomersSchema = joi.object({
    customers: joi.object({
      type: joi.string().min(3).max(30).required()
    })
  })

  joi.validate(req.body, getCustomersSchema, {
    presence: "required"
  }, async (err, value) => {
    if (err) {
      res.status(errorCodes.BAD_REQUEST.Value);
      res.send({
        ...crmCodes.PARAM_ERR,
        data: err
      });
    } else {
      let databaserror = false;
      // Database error
      if (databaserror) {
        res.status(errorCodes.INTERNAL_SERVER_ERROR.Value);
        res.send({
          ...crmCodes.SERVER_ERR,
          data: databaserror
        });
      } else {
        try {
          res.json({
            data: {
              "address": "AshokNagar",
              "age": "38",
              "gender": "Male"
            }
          });
        } catch (error) {
          res.status(errorCodes.INTERNAL_SERVER_ERROR.Value);
          res.json({
            ...crmCodes.SERVER_ERR,
            data: error
          });
        }
      }
    }
  });
};