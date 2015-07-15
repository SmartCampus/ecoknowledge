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

import GoalDefinition = require('./goal/definition/GoalDefinition');
import User = require('./user/User');
import Badge = require('./badge/Badge');

var currentUser:User = new User("Jackie");

import GoalDefinitionRepository = require('./goal/definition/GoalDefinitionRepository');
import GoalInstanceRepository = require('./goal/instance/GoalInstanceRepository');
import UserRepository = require('./user/UserRepository');
import BadgeRepository = require('./badge/BadgeRepository');

import EcoKnowledge = require('./Ecoknowledge');
import Context = require('./Context');
import DemoContext = require('./context/DemoContext');

var userProvider:UserRepository = new UserRepository();
var badgeRepository:GoalInstanceRepository = new GoalInstanceRepository();
var goalRepository:GoalDefinitionRepository = new GoalDefinitionRepository();
var badgeRepositoryV2:BadgeRepository = new BadgeRepository();

var ecoknowledge:EcoKnowledge = new EcoKnowledge(goalRepository,badgeRepository, userProvider);

var context:Context = new DemoContext();
context.fill(goalRepository, badgeRepository, userProvider);

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
  var result:any = ecoknowledge.getGoalDefinitionDescription(goalUUID);

  console.log("++ Sending", result);
  res.send(result);
});

app.get('/goals', jsonParser, function (req, res, next) {
    console.log('/goals');
  var result = ecoknowledge.getListOfGoalsDefinition();
  console.log("++ Sending", result);
  res.send(result);
});

app.get('/badges', jsonParser, function (req, res, next) {

  console.log("/badges");
  var result = ecoknowledge.getGoalInstancesDescriptionInJsonFormat();
  console.log("++ Sending", result);

  res.send(result);
});

app.get('/badgesV2/', jsonParser, function(req, res, next) {
  console.log("get /badgesV2")
  var result = badgeRepositoryV2.getAllBadges();
  console.log("++ Sending", result);

  res.send(result);
});

var sensors = [{"name":"AC_443"},{"name":"TEMP_442"}];

app.get('/required', jsonParser, function(req,res,next) {
  var goalName:string = req.query.goalName;
  console.log('goal name : ',goalName);
  var goal:GoalDefinition = goalRepository.getGoal(goalName);
  res.send(goal.getData());
});

app.get('/sensors', jsonParser, function(req, res, next) {
  //TODO : link with smartcampus
  res.send(sensors);
});

app.post('/badgesV2', jsonParser, function(req, res) {
  var badgeData = req.body;
  console.log('badges V2 : ', badgeData);
  badgeRepositoryV2.addBadge(new Badge(badgeData.name, badgeData.points));
  res.send("OK badges V2");
});

app.post('/addgoal', jsonParser, function (req, res) {
  var actionData = req.body;
  var result = ecoknowledge.addGoalDefinition(actionData);
  res.send(result);
});

app.post('/addbadge', jsonParser, function (req, res) {
  var actionData = req.body;
  console.log(actionData);

  //TODO : need to add a userUUID in request
  var result = ecoknowledge.addGoalInstance(actionData);

  res.send("OK");
});


//TODO move async calls
import GoalInstance = require('./goal/instance/GoalInstance');

//TODO need a badgeID in request
app.get('/evaluatebadge', jsonParser, function (req, res) {
  var badgeID:string = req.query.badgeID;

  var badge:GoalInstance = badgeRepository.getGoalInstance(badgeID);

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
