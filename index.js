var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var localConfig = require("./public/config/localhost");
var path = require("path");
var indexHtml = require("fs").readFileSync("./public/index.html");
var serialize = require('node-serialize');
var helmet = require('helmet');

// require("zone.js");

// global.Promise = require("bluebird");

app.use(helmet());
app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
// app.use(bodyParser.urlencoded({
//     extended: true
// }));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(path.resolve("./public/index.html"));
});

require("./router/local")(app, localConfig);
require("./router/dubbo")(app, localConfig);

app.get('/mockInfo', function(req, res) {
    var query = req.query;

    if (query.path) {
        var info = require("./public/mock/" + query.path);
        var infoStr = JSON.stringify(info, function(key, val) {
            if (typeof val === 'function') {
                return val.toString().replace(/\n/ig, '');
            }
            return val;
        });
        return res.send(infoStr);
    }

    res.error(new Error("没有path"));
});

app.listen(3000, function() {
    console.log('listen on port 3003');
});

exports = app;