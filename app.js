var express = require('express');
const routes = require('./Routes');
const path = require('path');

var app = express();

app.use('/', routes);

app.get('/about', function(req, res) {
  res.sendFile(path.join(__dirname+'/templates/about.html'));
});

app.listen(3000);