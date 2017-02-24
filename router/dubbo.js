var proxy = require("../proxy");

module.exports = exports =
    function(app, localConfig) {

        /**
         * 调用2个dubbo接口
         * 返回接口的数据
         */
        app.post("/combination", function(req, res) {
            Promise.all([
                proxy.execute("/dubbo/getHouseById", {
                    data: {
                        id: ~~req.query.id || 155060
                    }
                }),
                proxy.execute("/dubbo/insertBookingOrder", {
                    data: {
                        roomId: 100116,
                        contactPhone: 18559311819,
                        userPhone: 18559311819,
                        bookingNumber: 1234567,
                        status: 0,
                        memo: "",
                        contactor: "nick",
                        userName: "nick",
                        consultantOpenId: "05d93845-3156-4dd2-9c46-d958a3d23542",
                        userOpenId: "7144b4f5-348f-437f-8315-ccda28f077c3"
                    }
                })
            ]).then(function(results) {
                res.json({
                    houseInfo: results[0],
                    orderId: results[1]
                });
            }).catch(function(err) {
                console.error(err);
                res.json(err);
            });
        });
    }