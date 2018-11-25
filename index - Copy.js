var path = require("path");
var fs = require('fs');
var rfs = require("rotating-file-stream");
var morgan = require("morgan");
var cors = require("cors");

const express = require('express');
const bodyParser = require('body-parser');
var crmRouter = require("./app/routes/mobilecrm")

const app = express();

const port = 3002;

app.use(cors())
app.use(bodyParser.json());
app.use(express.urlencoded({
    extended: false
}));


/**
 * Method Used as part of Log file rotation for APi logging
 * @param {*} num
 */

function pad(num) {
    return (num > 9 ? "" : "0") + num;
}

/**
 * Method Used as part of Log file rotation for APi logging
 * @param {*} time 
 * @param {*} index 
 */
function generator(time, index) {
    if (!time)
        return "file.log";

    var month = time.getFullYear() + "" + pad(time.getMonth() + 1);
    var day = pad(time.getDate());
    var hour = pad(time.getHours());
    var minute = pad(time.getMinutes());

    return month + "/" + month +
        day + "-" + hour + minute + "-" + index + "-file.log";
}

// Code block for Log writing 
var logDirectory = path.join(__dirname, 'log')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
var accessLogStream = rfs(generator, {
    interval: '1d',
    size: '10M',
    path: logDirectory
})

// Routes
app.use("/mobilecrm/api", crmRouter)


app.listen(port, () => {
    console.info(`Mobile CRM API is @ ${port}`)
})