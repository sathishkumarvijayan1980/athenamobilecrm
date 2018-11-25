// var http = require('http');

const express = require('express');

const app = express();
const port = 3002;
app.use(cors())
app.use(bodyParser.json());
app.use(express.urlencoded({
    extended: false
}));

app.listen(port, () => {
    console.info(`Mobile CRM API is @ ${port}`)
})


// var server = http.createServer(function(request, response) {

//     response.writeHead(200, {"Content-Type": "text/plain"});
//     response.end("Hello World!");

// });

// var port = process.env.PORT || 1337;
// server.listen(port);

console.log("Server running at http://localhost:%d", port);