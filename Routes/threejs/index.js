const threejs = require('express').Router();
const path = require('path');
const express = require('express')

// const findObject = require('../../utils/findObject');

// threejs.param('modelId', findObject('model'));

// threejs.use('/:modelId/cars', cars);

// threejs.get('/:modelId', single);

console.log("routes/threejs/index.js : "+__dirname);

threejs.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/../../templates/threejs/index.html'));
});

threejs.get('/simple_cube', (req, res) => {
  res.sendFile(path.join(__dirname+'/../../templates/threejs/simple_cube/simple_cube.html'));
});

threejs.get('/tinyhouse', (req, res) => {
  res.sendFile(path.join(__dirname+'/../../templates/threejs/house/house.html'));
});

threejs.get('/human', (req, res) => {
  res.sendFile(path.join(__dirname+'/../../templates/threejs/human/human.html'));
});

threejs.get('/car', (req, res) => {
  res.sendFile(path.join(__dirname+'/../../templates/threejs/car/car.html'));
});

module.exports = threejs;