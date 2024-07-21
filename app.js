const http = require('http');
const config = require('./config/amiConfig');
const { port, host, username, password } = config;
console.log({ port, host, username, password })
var ami = new require('asterisk-manager')(port, host, username, password, true);
require('events').EventEmitter.defaultMaxListeners = 5;
ami.keepConnected();
global.AMI = ami;
const morgan = require('morgan')
require('./database/index');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const cors = require('cors');
const moment = require('moment');
const log = console.log;
const router = require('./routes');
const { required } = require('joi');

app.use(cors({ origin: "*" }));
app.use(bodyParser.json({ limit: "25mb" }));
app.use(morgan('dev'));
app.use(router)
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.post(`/logger`, (req, res) => {
    const time = moment().format('YYYY-MM-DD HH:mm:ss');
    log(time, JSON.stringify({ params: req.params }));
    log(time, JSON.stringify({ query: req.query }));
    log(time, JSON.stringify({ body: req.body }));
    res.send("ok");
});
var httpServer = http.createServer(app);
httpServer.listen(3000);
log("Server is running!\nAPI documentation: http://localhost:3000/doc");