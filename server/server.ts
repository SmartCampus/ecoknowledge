/// <reference path="../typings/tsd.d.ts" />

import express = require("express");
var bodyParser = require('body-parser');
import path = require('path');

var app = express();

var jsonParser = bodyParser.json();
var xmlParser = bodyParser.text({type: "application/xml"});

import Goal = require('./Goal');
import User = require('./User');
import Badge = require('./Badge');

var currentUser:User = new User("Jackie");

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


app.get('/helloworld', jsonParser, function (req, res, next) {
  console.log("HELLOWORLD");
  res.send("Hello  world!");
});

app.get('/goals', jsonParser, function (req, res, next) {
  console.log('getgoals');
  var goals = currentUser.getGoals();

  var result = [];
  for(var i in goals) {
    var currentGoalDesc = goals[i];
    result.push(currentGoalDesc);
  }
console.log("Sending", result);
  res.send(result);
});

app.get('/badges', jsonParser, function (req, res, next) {
  console.log('getbadges');
  var badges = currentUser.getBadges();

  var result = [];
  for(var i in badges) {
    var currentBadgeDesc = badges[i];
    result.push(currentBadgeDesc);
  }
  console.log("Sending", result);

  res.send(result);
});


app.post('/addgoal', jsonParser, function (req, res) {
  var actionData = req.body;
  console.log(actionData);

  var goalName:string = actionData.name;
  var goalComparaisonType:string = actionData.comparaison;
  var goalValue:number = actionData.value;

  var newGoal:Goal = new Goal(goalName, goalComparaisonType, goalValue);

  var result = currentUser.addGoal(newGoal);

  res.send(result);
});

app.post('/addbadge', jsonParser, function (req, res) {
  var actionData = req.body;
  console.log(actionData);

  var badgeName:string = actionData.name;
  var badgeDescription:string = actionData.description;
  var badgeObjective:string = actionData.goal;
  var badgePoints:number = actionData.points;

  var goal = currentUser.retrieveGoal(badgeObjective);
  console.log("Log pour le badge en cours .. ", goal);

  var badge:Badge = new Badge(badgeName, badgeDescription, badgePoints, goal);

  currentUser.addBadge(badge);


  res.send("OK");
});


app.post('/evaluatebadge',jsonParser, function(req, res) {
  var actionData = req.body;
  console.log(actionData);

  var badgeName:string = actionData.name;
  var badgeValue:number = actionData.value;
  var result = currentUser.evaluateBadge(badgeName, badgeValue);
  res.send(result);

});


//  For debug only
app.post('/evaluategoal',jsonParser, function(req, res) {
  var actionData = req.body;
  console.log(actionData);

  var goalName:string = actionData.name;
  var goalValue:number = actionData.value;
  var result = currentUser.evaluateGoal(goalName, goalValue);
  res.send(result);

});

app.listen(port);
console.log("Server started");
