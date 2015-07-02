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

import Goal = require('./Goal');
import User = require('./User');
import Badge = require('./Badge');

var currentUser:User = new User("Jackie");

import GoalProvider = require('./GoalProvider');

import EcoKnowledge = require('./Ecoknowledge');
var ecoknowledge:EcoKnowledge = new EcoKnowledge(new GoalProvider());

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

  var goals:Goal[] = currentUser.getGoals();
  var result:any = {};
  var data:any[] = [];

  for (var i in goals) {
    data.push(goals[i].getName());
  }

  result.data = data;
  result.success = true;
  console.log("++ Sending", result);
  res.send(result);
});

app.get('/badges', jsonParser, function (req, res, next) {
  var badges = currentUser.getBadges();

  var result = [];
  for (var i in badges) {
    var currentBadgeDesc = badges[i];
    result.push(currentBadgeDesc);
  }
  console.log("++ Sending", result);

  res.send(result);
});

var tempSensors = [{"id":"AC_443"},{"id":"TEMP_442"}];

app.get('/required', jsonParser, function(req,res,next) {
  var goalName:string = req.query.goalName;
  var goal:Goal = currentUser.retrieveGoal(goalName);

  var result:any = {};
  result['conditions'] = goal.getData().conditions;

  var elementsRequiredForGivenGoal:string[] = goal.getRequired();
  var sensors:any = {};
  for(var i = 0 ; i < elementsRequiredForGivenGoal.length; i ++) {
    var currentElementRequired:string = "" + elementsRequiredForGivenGoal[i];
    sensors[currentElementRequired] = tempSensors;
  }
  result['sensors'] = sensors;

  res.send(result);
});


app.post('/addgoal', jsonParser, function (req, res) {
  var actionData = req.body;
  console.log("Received",actionData);
  var result = ecoknowledge.addGoal(actionData);
  res.send(result);
});

app.post('/addbadge', jsonParser, function (req, res) {
  var actionData = req.body;
  console.log(actionData);

  var badgeName:string = actionData.name;
  var badgeDescription:string = actionData.description;
  var badgeGoal:string = actionData.currentGoal.name;
  var badgePoints:number = actionData.points;
  var badgeSensors:any[] = actionData.currentGoal.conditions;

  var sensors:string[] = [];
  for(var i = 0 ; i < badgeSensors.length ; i ++) {
    sensors.push(badgeSensors[i].sensor.id);
  }

  var goal = currentUser.retrieveGoal(badgeGoal);
  console.log("Log pour le badge en cours .. ", goal);

  var badge:Badge = new Badge(badgeName, badgeDescription, badgePoints, [goal], sensors);
  currentUser.addBadge(badge);

  res.send("OK");
});

app.get('/evaluatebadge', jsonParser, function (req, res) {
  var badgeName:string = req.query.badgeName;
  var badge:Badge = currentUser.retrieveBadge(badgeName);

  var required:string[] = badge.getRequired();
  var sensorsValues:any = {};

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

  var goalName:string = actionData.name;
  var goalValues:any[] = actionData.values;

  var values = [];
  for(var i = 0 ; i < goalValues.length ; i++) {
    values.push(goalValues[i].value);
  }

  var result = currentUser.evaluateGoal(goalName, values);
  res.send(result);

});

app.listen(port);

var goal:Goal = new Goal("ObjectifDebug");
goal.addConditionByDescription("Température", 'inf', 20);
goal.addConditionByDescription("Température", 'sup', 0);

currentUser.addGoal(goal);
console.log("Ajout d'un objectif de debug");

console.log("Server started");
