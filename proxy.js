var modelproxy = require("modelproxy").modelProxy;
var mockjsEngine = require("modelproxy-engine-mockjs").MockEngine;
var dubboEngine = require("modelproxy-engine-dubbo").DubboEngine;
var dubboConfig = require("./public/config/dubbo");
var localConfig = require("./public/config/localhost");


// 服务端使用modleproxy，这里只是用了mockjs的engine
var proxy = new modelproxy.Proxy();

var engine = function() {}
engine.prototype.proxy = function(instance, options) {
    return require("./public/mock/" + instance.ns + "/" + instance.key);
};

// 加载配置
proxy.loadConfig(dubboConfig);
proxy.loadConfig(localConfig);
// 添加engines
proxy.addEngines({
    mockjs: new mockjsEngine(new engine()),
    dubbo: new dubboEngine({
        dubbo: {
            version: "2.8.5",
            rootPath: "dubbo",
            registerStr: "dubboadmin.uat1.rs.com:2181"
        },
        options: {
            sessionTimeout: 6000,
            spinDelay: 3000,
            retries: 5
        }
    })
});

module.exports = exports = proxy;