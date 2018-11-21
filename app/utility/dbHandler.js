const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator(256);
let md5Obj = require('md5');
let datetime = require('node-datetime');
let adconfig = require("./config").ad;
let adUserConfig = require("./config").adUserConfig;
let eachSeries = require("async/eachSeries");
let asyncjs = require("async");

exports.generateAuthNToken = async function (username, password) {

    let config = {
        username: username,
        password: password
    }

    if (username === "Sathish" && password === "2709") {

        return new Promise(async (resolve, reject) => {
            let dt = datetime.create();
            let randToken = uidgen.generateSync();
            let authToken = md5Obj(randToken + username + dt)
            let data = {
                authToken
            };
            resolve(data);
        });
    } else {
        res.status(400);
        res.json({
            ...crmCodes.UNAUTHORIZED.Text
        })
    }
}