'use strict';

let express = require('express'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser');

app.get('/', function (req, res) {
    res.send('Hello API');
});


module.exports = app;
