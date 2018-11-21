var jwt = require('jsonwebtoken');

exports.manipulateToken = async function (data, type) {

    const encryptOptions = {
        expiresIn: "2h",
        algorithm: "HS256"
    };

    let signingKey = "mobilecrmapikey2709$$";

    try {
        if (type === "generate") {
            return jwt.sign(data, signingKey, encryptOptions);
        }

        if (type === "decode") {
            return jwt.decode(data, signingKey, encryptOptions);
        }

        return jwt.verify(data, signingKey, encryptOptions);
    } catch (error) {
        return false;
    }
}