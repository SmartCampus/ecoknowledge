/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/express/express.d.ts" />

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


app.get('/helloworld/:slug', jsonParser, function (req, res, next) {
  console.log("HELLOWORLD");
  res.send("Hello  world!");
});

app.get('/goals/:id', jsonParser, function (req, res, next) {
  console.log('\n++ Get : /goal asked ....');
  if(!req.params.id){
    console.log('yolo');
    next();
  }
  var result:any = {};
  var idGoal:string = req.params.id;
  console.log('id goal : ',idGoal);
  var goal:Goal = currentUser.retrieveGoal(idGoal);
  console.log('goal name : ',goal.getName);
  result.goal = goal;
  console.log("++ Sending", result);
  res.send(result);
});

app.get('/goals', jsonParser, function (req, res, next) {
  console.log('\nNo slug');

  var goals:Goal[] = currentUser.getGoals();
  var result:any[] = [];

  for (var i in goals) {
    result.push(goals[i].getName());
  }

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

  result['conditions'] = goal.getData();

  var elementsRequiredForGivenGoal:string[] = goal.getRequired();
  for(var i = 0 ; i < elementsRequiredForGivenGoal.length; i ++) {
    var currentElementRequired:string = "" + elementsRequiredForGivenGoal[i];
    result[""+currentElementRequired] = tempSensors;
  }

  res.send(result);
});


app.post('/addgoal', jsonParser, function (req, res) {
  var actionData = req.body;
  console.log(actionData);

  var goalName:string = actionData.name;
  var newGoal:Goal = new Goal(goalName);

  console.log("Construction de l'objectif ", newGoal.getName());

  var goalConditions:any[] = actionData.conditions;

  console.log("\tConstruction des conditions de succès ...");
  for (var i = 0; i < goalConditions.length; i++) {
    var currentCondition = goalConditions[i];

    console.log("\t\tCondition courante", currentCondition);

    var required:string = currentCondition.required;
    var comparison:string = currentCondition.comparison;
    var thresholdValue:boolean|number = currentCondition.value;

    console.log("\t\t\tCréation de la condition avec", required, comparison, thresholdValue);

    newGoal.addCondition(required,comparison,thresholdValue);
  }

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

  /*
TODO
  var badge:Badge = new Badge(badgeName, badgeDescription, badgePoints, goal);
  currentUser.addBadge(badge);
*/

  res.send("OK");
});


app.post('/evaluatebadge', jsonParser, function (req, res) {
  var actionData = req.body;
  console.log(actionData);

  var badgeName:string = actionData.name;
  var badgeValue:number = actionData.value;
  var result = currentUser.evaluateBadge(badgeName, badgeValue);
  res.send(result);

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
goal.addCondition("Température", 'inf', 20);
goal.addCondition("Température", 'sup', 0);

currentUser.addGoal(goal);
console.log("Ajout d'un objectif de debug");

console.log("Server started");
