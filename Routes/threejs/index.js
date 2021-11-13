const threejs = require('express').Router();
const path = require('path');

// const findObject = require('../../utils/findObject');

// threejs.param('modelId', findObject('model'));

// threejs.use('/:modelId/cars', cars);

// threejs.get('/:modelId', single);
threejs.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/../../templates/threejs/index.html'));
});

// routes.get('/', function(req, res) {
//   res.sendFile(path.join(__dirname+'/../templates/index.html'));
// });

module.exports = threejs;