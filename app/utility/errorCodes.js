exports.errorCodes = {
    SUCCESS: {
        Text: "Success",
        Value: 200
    },
    BAD_REQUEST: {
        Text: "Bad Request",
        Value: 400
    },
    UNAUTHORIZED: {
        Text: "Unauthorized",
        Value: 401
    },
    INTERNAL_SERVER_ERROR: {
        Text: "Internal Server Error",
        Value: 500
    }
}

exports.crmCodes = {
    SUCCESS: {
        status: "00",
        message: "Success"
    },
    NORECORDS: {
        status: "97",
        message: "No Records to Send"
    },
    PARAM_ERR: {
        status: "98",
        message: "Parameter error"
    },
    SERVER_ERR: {
        status: "99",
        message: "Internal Server error"
    },
    AUTH_ERR: {
        status: "99",
        message: "Unauthorized"
    }
}