/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/express/express.d.ts" />
/// <reference path="../typings/async/async.d.ts" />

import express = require("express");
import http = require("http");
import async = require("async");
var bodyParser = require('body-parser');
import path = require('path');
var app = express();

var jsonParser = bodyParser.json();
var xmlParser = bodyParser.text({type: "application/xml"});

import Goal = require('./goal/Goal');
import User = require('./user/User');

var currentUser:User = new User("Jackie");

import GoalProvider = require('./goal/GoalProvider');
import BadgeProvider = require('./badge/BadgeProvider');
import UserProvider = require('./user/UserProvider');

import EcoKnowledge = require('./Ecoknowledge');

var userProvider:UserProvider = new UserProvider();
var badgeProvider:BadgeProvider = new BadgeProvider();
var goalProvider:GoalProvider = new GoalProvider();

var ecoknowledge:EcoKnowledge = new EcoKnowledge(goalProvider,badgeProvider, userProvider);
userProvider.addUser(currentUser);
console.log(currentUser.getUUID());

// Enable JSON data for requests
//app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(express.static(path.join(__dirname, "public")));

// Allow cross site requests
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var args = process.argv;
var port = args[2] || 3000;

app.get('/helloworld/:slug', jsonParser, function (req, res, next) {
  console.log("HELLOWORLD");
  res.send("Hello  world!");
});

// http://localhost:3000/goals/779d6640-e489-4af3-9727-8eed7860cba8
app.get('/goals/:id', jsonParser, function (req, res, next) {
  console.log('\n++ Get : /goal asked ....');
  if(!req.params.id){
    next();
  }

  console.log("ID :", req.params.id);

  var goalUUID:string = req.params.id;
  var result:any = ecoknowledge.getGoalDescription(goalUUID);

  console.log("++ Sending", result);
  res.send(result);
});

app.get('/goals', jsonParser, function (req, res, next) {
    console.log('\nNo slug');
  var result = ecoknowledge.getListOfGoals();
  console.log("++ Sending", result);
  res.send(result);
});

app.get('/badges', jsonParser, function (req, res, next) {

  var result = ecoknowledge.getListOfBadges();
  console.log("++ Sending", result);

  res.send(result);
});

var sensors = [{"name":"AC_443"},{"name":"TEMP_442"}];

app.get('/required', jsonParser, function(req,res,next) {
  var goalName:string = req.query.goalName;
  console.log('goal name : ',goalName);
  var goal:Goal = goalProvider.getGoal(goalName);
  res.send(goal.getData());
});

app.get('/sensors', jsonParser, function(req, res, next) {
  //TODO : link with smartcampus
  res.send(sensors);
});

app.post('/addgoal', jsonParser, function (req, res) {
  var actionData = req.body;
  var result = ecoknowledge.addGoal(actionData);
  res.send(result);
});

app.post('/addbadge', jsonParser, function (req, res) {
  var actionData = req.body;
  console.log(actionData);

  //TODO : need to add a userUUID in request
  var result = ecoknowledge.addBadge(actionData);

  res.send("OK");
});


//TODO move async calls
import BadgeInstance = require('./badge/BadgeInstance');

//TODO need a badgeID in request
app.get('/evaluatebadge', jsonParser, function (req, res) {
  var badgeID:string = req.query.badgeID;

  var badge:BadgeInstance = badgeProvider.getBadge(badgeID);

  //TODO move what follow
  var required:string[] = badge.getSensors();
  var sensorsValues:any = {};

  console.log("SENSORS TO GET : ", required);

  async.times(required.length, function(n, next) {
    var path = 'http://smartcampus.unice.fr/sensors/' + required[n] + '/data/last';

    http.get(path, function(res) {
      res.on("data", function(chunk) {
        console.log("BODY: ", chunk.toString());
        var jsonObject = JSON.parse(chunk.toString());
        var value = jsonObject.values[0].value;

        var a = required[n];

        sensorsValues[a] = value;
        next(null, null);
      });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
  },
      function(err) {
        var result = badge.evaluate([sensorsValues]);
        res.send(result);
      }
  );
});




//  For debug only
app.post('/evaluategoal', jsonParser, function (req, res) {
  var actionData = req.body;
  console.log(actionData);
  var result = ecoknowledge.evaluateGoal(actionData);
  res.send(result);

});

app.listen(port);

console.log("Server started");
