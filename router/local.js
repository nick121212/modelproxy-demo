module.exports = exports = function(app, localConfig) {

    app.get('/config', function(req, res) {
        res.json(localConfig);
    });

    app.post('/login', function(req, res) {
        res.json({
            uid: 100001,
            username: "nick",
        });
    });


}