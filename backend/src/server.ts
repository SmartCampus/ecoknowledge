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
import Clock = require('./Clock');

var userProvider:UserRepository = new UserRepository();
var badgeRepository:GoalInstanceRepository = new GoalInstanceRepository();
var goalRepository:GoalDefinitionRepository = new GoalDefinitionRepository();
var badgeRepositoryV2:BadgeRepository = new BadgeRepository();

var ecoknowledge:EcoKnowledge = new EcoKnowledge(goalRepository, badgeRepository, userProvider);

var context:Context = new DemoContext();
context.fill(goalRepository, badgeRepository, userProvider);

var demo:boolean = true;

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
    if (!req.params.id) {
        next();
    }

    console.log("ID :", req.params.id);

    var goalUUID:string = req.params.id;
    var result:any = ecoknowledge.getGoalDefinitionDescription(goalUUID);

    console.log("++ Sending", result);
    res.send(result);
});

app.get('/goals', jsonParser, function (req, res, next) {
    var result = ecoknowledge.getListOfGoalsDefinition();
    res.send(result);
});

app.get('/goalsInstance', jsonParser, function (req, res, next) {
    var result = ecoknowledge.getListOfGoalInstances();
    res.send(result);
});

app.get('/badges', jsonParser, function (req, res, next) {
    console.log("JSON STUB", JSON.stringify(jsonStub));
    var result = ecoknowledge.getGoalInstancesDescriptionInJsonFormat(jsonStub);
    res.send(result);
});

app.get('/badgesV2/', jsonParser, function (req, res, next) {
    console.log("get /badgesV2");
    var result = badgeRepositoryV2.getAllBadges();
    console.log("++ Sending", result);

    res.send(result);
});

var sensors = [{"name": "AC_443"}, {"name": "TEMP_442"}];
app.get('/required', jsonParser, function (req, res, next) {
    var goalName:string = req.query.goalName;
    console.log('goal name : ', goalName);
    var goal:GoalDefinition = goalRepository.getGoal(goalName);
    res.send(goal.getData());
});

app.get('/sensors', jsonParser, function (req, res, next) {
    //TODO : link with smartcampus
    res.send(sensors);
});

app.post('/badgesV2', jsonParser, function (req, res) {
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
    var result = ecoknowledge.addGoalInstance(actionData);
    res.send("OK");
});


app.post('/takeGoal', jsonParser, function (req, res) {
    var actionData = req.body;
    console.log(actionData);
    var goalID = actionData.goalID;
    console.log("GOALID", goalID);

    var data =
    {
        "goal": {
            "id": goalID,
            "conditions": {"TMP_CLI": "TEMP_443V"}
        }
    };

    ecoknowledge.addGoalInstance(data);
    res.send("0K");
});

//TODO move async calls
import GoalInstance = require('./goal/instance/GoalInstance');

var jsonStub:any = {};

//TODO need a badgeID in request
app.get('/evaluatebadge', jsonParser, function (req, res) {

    var badgeID:string = req.query.badgeID;

    var badge:GoalInstance = badgeRepository.getGoalInstance(badgeID);

    if (!demo) {

        //TODO move what follow
        var required = badge.getSensors();

        console.log("SENSORS TO GET : ", required);

        var requiredSensorName = Object.keys(required);
        var numberToLoad:number = requiredSensorName.length;
        console.log("numbertoload");
        console.log(numberToLoad);

        console.log("Sensor names");
        console.log(requiredSensorName);

        for (var currentSensorName in requiredSensorName) {
            (function (currentSensorName) {
                console.log("CURRENTSENSORNAME");
                console.log(currentSensorName);
                console.log("REQUIRED.CURRENTSENSORNAME");
                console.log(required);

                var startDate:string = '' + required[currentSensorName].startDate;
                var endDate:string = '' + required[currentSensorName].endDate;

                var path = 'http://smartcampus.unice.fr/sensors/' + currentSensorName + '/data?date=' + startDate + '/' + endDate;
                console.log("PATH");
                console.log(path);

                var dataJsonString = "";

                http.get(path, function (result) {
                    result.on("data", function (chunk) {
                        dataJsonString += chunk.toString();
                    });

                    result.on('end', function () {
                        numberToLoad--;
                        console.log("remaining number to load");
                        console.log(numberToLoad);
                        var jsonObject = JSON.parse(dataJsonString);
                        required[jsonObject.id] = jsonObject;

                        if (numberToLoad == 0) {
                            var result = badge.evaluate(required);
                            res.send(badge.getProgress());
                        }
                    });
                });
            })(requiredSensorName[currentSensorName]);
        }


        /*
         if (numberToLoad == 0) {
         console.log("aaaaaaaaaaa", JSON.stringify(required));

         var result = badge.evaluate(required);
         res.send(result);
         }

         async.times(requiredSensorName.length, function (n, next) {
         var startDate:string = '' + required[requiredSensorName[n]].startDate;
         var endDate:string = '' + required[requiredSensorName[n]].endDate;

         var path = 'http://smartcampus.unice.fr/sensors/' + requiredSensorName[n] + '/data?date=' + startDate + '/' + endDate;
         console.log("PATH", path);

         http.get(path, function (result) {
         result.on('end' , function() {
         console.log("EEEEEEEEEEENDLOLOLOOLOL");
         });

         result.on("data", function (chunk) {

         console.log("BODY: ",(JSON.parse( chunk.toString())));
         var jsonObject = JSON.parse(chunk.toString());

         required[jsonObject.id] = jsonObject;

         next(null, null);
         });
         }).on('error', function (e) {
         console.log("Got error: " + e.message);
         });
         },
         function (err) {
         var result = badge.evaluate(required);
         res.send(result);
         }
         );
         */


    }
    else {
        console.log("STUB", JSON.stringify(jsonStub));
        var result = badge.evaluate(jsonStub);
        res.send(badge.getProgress());
    }
});

var fs = require('fs');
fs.readFile('./stub_values.json', function (err, data) {
    if (err) {
        throw err;
    }
    jsonStub = JSON.parse(data.toString());
    console.log("++ Fichier stub chargé correctement");
});


//  For debug only
app.post('/evaluategoal', jsonParser, function (req, res) {
    var actionData = req.body;
    console.log(actionData);
    var result = ecoknowledge.evaluateGoal(actionData);
    res.send(result);

});


app.post('/addstub', jsonParser, function (req, res) {

    var data = req.body;
    var value = data.value;
    var key = data.key;

    var valueDesc:any = {};
    valueDesc.date = Clock.getNow() / 1000;
    valueDesc.value = value;

    var oldJson:any[] = jsonStub[key].values;
    oldJson.push(valueDesc);
    jsonStub[key].values = oldJson;

    res.send('Valeur' + JSON.stringify(valueDesc) + " ajoutee au stub ! Etat du stub : " + JSON.stringify(jsonStub));
});


app.post('/setNow', jsonParser, function (req, res) {
    var data = req.body;
    var newNow:Date = new Date(data.now);

    console.log("Mise a jour de la date actuelle. Nous sommes maintenant le", newNow);
    Clock.setNow(newNow.getTime());
    res.send("New 'now' : " + newNow);
});


app.listen(port);

console.log("Server started");
