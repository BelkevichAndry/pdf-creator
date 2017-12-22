const routes = require('express').Router();

routes.get('/user/:name', function(req, res) {
    var user = req.params.name;
    res.send(user);
});

module.exports = routes;
