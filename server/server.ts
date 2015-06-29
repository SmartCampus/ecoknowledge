/// <reference path="../typings/tsd.d.ts" />

import express = require("express");
var bodyParser = require('body-parser');
import path = require('path');

var app = express();

var jsonParser = bodyParser.json();
var xmlParser = bodyParser.text({type: "application/xml"});

// Enable JSON data for requests
//app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(express.static(path.join(__dirname, "public")));

// Allow cross site requests
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

// Allow cross site requests
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

var args = process.argv;
var port = args[2] || 3000;


app.get('/helloworld', jsonParser, function (req, res, next) {
    console.log("HELLOWORLD");
    res.send("Hello  world!");
});



// Story #PQJO-13
app.post('/test/', jsonParser, function(req,res) {
    var botID = parseInt(req.params.botID);
    var actionData = req.body;
    console.log(actionData);
    res.send(actionData);
});

app.listen(port);
console.log("Server started");

