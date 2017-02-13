var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var localConfig = require("./public/config/localhost");
var path = require("path");
var indexHtml = require("fs").readFileSync("./public/index.html");
var serialize = require('node-serialize');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(path.resolve("./public/index.html"));
});

app.get('/config', function(req, res) {
    res.json(localConfig);
});

app.get('/test', function(req, res) {
    res.json({
        data: 1,
        name: "nick"
    });
});

app.post('/login', function(req, res) {
    res.json({
        body: req.body,
        query: req.query
    });
});

app.get('/mockInfo', function(req, res) {
    var query = req.query;

    if (query.path) {
        var info = require("./public/mock/" + query.path);

        console.log(info);

        return res.json(serialize.serialize(info));
    }

    res.error(new Error("没有path"));

    res.json();
});

app.listen(3000, function() {
    console.log('listen on port 3000');
});