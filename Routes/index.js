const routes = require('express').Router();
const threejs = require('./threejs');
const path = require('path');

routes.use('/threejs', threejs);

routes.get('/', function(req, res) {
  res.sendFile(path.join(__dirname+'/../templates/index.html'));
});

module.exports = routes;