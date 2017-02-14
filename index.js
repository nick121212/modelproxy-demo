var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var localConfig = require("./public/config/localhost");
var path = require("path");
var indexHtml = require("fs").readFileSync("./public/index.html");
var serialize = require('node-serialize');
var modelproxy = require("modelproxy").modelProxy;
var mockjsEngine = require("modelproxy-engine-mockjs").MockEngine;

// 服务端使用modleproxy，这里只是用了mockjs的engine
var proxy = new modelproxy.Proxy();
var engine = function() {}
engine.prototype.valivate = function() {
    return true;
}
engine.prototype.proxy = function(instance, options) {
    return require("./public/mock/" + instance.ns + "/" + instance.key);
};
// 加载配置
proxy.loadConfig(localConfig);
// 添加engines
proxy.addEngines({
    mockjs: new mockjsEngine(new engine())
});

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

        return res.json(serialize.serialize(info));
    }

    res.error(new Error("没有path"));

    res.json();
});

app.get("/test/server", function(req, res) {
    // 使用mockjs来返回数据
    proxy.execute("/localhost/login", { data: { username: "", password: "111111" }, instance: { engine: "mockjs" } }).then(function(result) {
        res.json(result);
    }).catch(function(err) {
        res.json(err);
    });
});

app.listen(3000, function() {
    console.log('listen on port 3000');
});