/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />
/// <reference path="../../typings/moment-timezone/moment-timezone.d.ts" />

var moment = require('moment');
var moment_timezone = require('moment-timezone');

import RouterItf = require('./RouterItf');

import ChallengeRepository = require('../challenge/ChallengeRepository');
import ChallengeFactory = require('../challenge/ChallengeFactory');
import GoalRepository = require('../goal/GoalRepository');
import Challenge = require('../challenge/Challenge');
import UserRepository = require('../user/UserRepository');
import Goal = require('../goal/Goal');
import Middleware = require('../Middleware');

import Clock = require('../Clock');
import ChallengeStatus = require('../Status');

import BadRequestException = require('../exceptions/BadRequestException');

var moment = require('moment');

class GoalInstanceRouter extends RouterItf {
    public static DEMO:boolean = true;

    public static STUB_FILE:string = './stub_values.json';

    private goalInstanceRepository:ChallengeRepository;
    private goalInstanceFactory:ChallengeFactory;
    private goalDefinitionRepository:GoalRepository;
    private userRepository:UserRepository;

    private middleware:Middleware;

    private jsonStub:any = {};

    constructor(goalInstanceRepository:ChallengeRepository, goalInstanceFactory:ChallengeFactory, goalDefinitionRepository:GoalRepository, userRepository:UserRepository) {
        super();
        this.goalInstanceRepository = goalInstanceRepository;
        this.goalInstanceFactory = goalInstanceFactory;

        this.goalDefinitionRepository = goalDefinitionRepository;
        this.userRepository = userRepository;

        var fs = require('fs');
        var data = fs.readFileSync(GoalInstanceRouter.STUB_FILE, "utf-8");
        this.jsonStub = JSON.parse(data);
        console.log("++ Fichier stub chargé correctement\n");
    }

    buildRouter() {
        var self = this;

        this.router.post('/new', function (req, res) {
            self.newGoalInstance(req, res);
        });

        this.router.get('/all', function (req, res) {
            self.getAllChallenges(req, res);
        });

        this.router.delete('/delete/:id', function (req, res) {
            self.deleteGoalInstance(req, res);
        });

        this.router.get('/evaluate', function (req, res) {
            self.evaluate(req, res);
        });

        this.router.get('/evaluate/all', function (req, res) {
            self.evaluateAll(req, res);
        });

        //  Debug routes only
        this.router.post('/addstub', function (req, res) {
            self.addStub(req, res);
        });

        this.router.post('/setNow', function (req, res) {
            self.setNow(req, res);
        });

        this.router.post('/addBadge', function (req, res) {
            self.addFinishedBadge(req.challengeID, req.userID);
        });
    }


    addStub(req, res) {

        var data = req.body;
        var value = data.value;
        var key = data.key;

        var valueDesc:any = {};
        valueDesc.date = Clock.getMoment(Clock.getNow()).valueOf();
        valueDesc.value = value;

       // console.log("DATE DU STUB AJOUTE", valueDesc.date);

        var oldJson:any[] = this.jsonStub[key].values;
        oldJson.push(valueDesc);
        this.jsonStub[key].values = oldJson;

        res.send('Valeur' + JSON.stringify(valueDesc) + " ajoutee au stub !");
    }


    setNow(req, res) {
        var data = req.body;
        var newNow:moment.Moment = Clock.getMomentFromString(data.now);

        console.log("Mise a jour de la date actuelle. Nous sommes maintenant le", newNow.date());
        Clock.setNow(newNow.valueOf());
        res.send("New 'now' : " + newNow.date());
    }


    newGoalInstance(req:any, res:any) {
        var goalID = req.body.id;

        if (!goalID) {
            res.status(400).send({'error': 'goalID field is missing in request'});
        }

        var newChall:Challenge = this.createGoalInstance(goalID, Clock.getMoment(Clock.getNow()));

        if(newChall == null) {
            res.send({'error': 'Can not take this challenge'});
            return;
        }

        res.send({"success": ("Objectif ajouté !" + newChall.getDataInJSON())});
    }

    createGoalInstance(goalID:string, date:moment.Moment):Challenge {
        //  TODO ! stub !
        //  The data object below is a stub to manually
        //  bind a symbolic name to a sensor name.
        //  In the future, this won't be hardcoded but
        //  will be set by final user during the account
        //  creation process

        var data =
        {
            "goal": {
                "id": goalID,
                "conditions": {"TMP_CLI": "TEMP_443V"}
            }
        };

        var goal:Goal = this.goalDefinitionRepository.getGoal(goalID);

        //console.log("Je construit un challenge en partant du principe que nous sommes le ", date.toISOString());
        var goalInstance = this.goalInstanceFactory.createGoalInstance(data, this.goalDefinitionRepository, null, date);

        if(goalInstance.getEndDate().isAfter(goal.getEndDate())) {
            return null;
        }

        this.goalInstanceRepository.addGoalInstance(goalInstance);
        this.userRepository.getCurrentUser().addChallenge(goalInstance.getId());
        return goalInstance;
    }

    /**
     *  ---------------------
     */
    getAllChallenges(req:any, res:any) {
        var result:any[] = [];

        var challenges = this.userRepository.getCurrentUser().getChallenges();

        for (var currentChallengeIDIndex in challenges) {
            var currentChallengeID = challenges[currentChallengeIDIndex];
            var currentChallenge = this.goalInstanceRepository.getGoalInstance(currentChallengeID);
            var currentChallengeDesc = currentChallenge.getDataInJSON();
            result.push(currentChallengeDesc);
        }

        res.send(result);
    }

    deleteGoalInstance(req:any, res:any) {
        var goalID = req.params.id;

        try {
            this.userRepository.getCurrentUser().deleteChallenge(goalID);
            res.send({"success": "Objectif supprimé !"});
        }
        catch (e) {
            res.send({error: e.toString()});
        }
    }

    evaluate(req:any, res:any) {
        var goalInstanceID:string = req.query.id;

        var goalInstanceToEvaluate:Challenge = this.goalInstanceRepository.getGoalInstance(goalInstanceID);

        if (!goalInstanceToEvaluate) {
            var msg:string = 'Can not find challenge with given id';
            res.status(400).send({error: msg});
            throw new BadRequestException(msg);
        }

        res.send(this.evaluateChallenge(goalInstanceToEvaluate, goalInstanceID));
    }


    /**
     *  ---------------------
     */
    evaluateAll(req:any, res:any) {
        try {
            var challenges = this.userRepository.getCurrentUser().getChallenges();
            for (var challengeIndex in challenges) {
                var currentChallengeID = challenges[challengeIndex];
                var challengeToEvaluate = this.goalInstanceRepository.getGoalInstance(currentChallengeID);
                this.evaluateChallenge(challengeToEvaluate, currentChallengeID);
            }
            res.send({success: ''});
        }
        catch (e) {
            res.send(e.toString());
        }
    }

    //  debug only
    private addFinishedBadge(challengeID:string, userID:string) {
        /*
        console.log('add finished badge');
        console.log('user id : ', userID);
        console.log('challenge ID : ', challengeID);
        */
        var user = this.userRepository.getUser(userID);
        var badgeID = this.goalInstanceRepository.getBadgeByChallengeID(challengeID);
        user.addFinishedBadge(badgeID);
        user.deleteChallenge(challengeID);
    }

    private evaluateChallenge(challengeToEvaluate:Challenge, challengeID) {
        var self = this;

        if (!GoalInstanceRouter.DEMO) {

            //TODO move what follow
            var required = challengeToEvaluate.getSensors();

            var requiredSensorName = Object.keys(required);
            var numberToLoad:number = requiredSensorName.length;

            for (var currentSensorName in requiredSensorName) {
                (function (currentSensorName) {
                    var startDate:string = '' + required[currentSensorName].startDate;
                    var endDate:string = '' + required[currentSensorName].endDate;

                    var path = 'http://smartcampus.unice.fr/sensors/' + currentSensorName + '/data?date=' + startDate + '/' + endDate;
                    var dataJsonString = "";

                    this.middleware.getSensorsInfo(required, numberToLoad, dataJsonString, path,
                        function () {
                            var result = challengeToEvaluate.evaluate(required);
                            if (result) {
                                var newChall = self.createGoalInstance(challengeToEvaluate.getGoalDefinition().getUUID(), challengeToEvaluate.getEndDate());
                                this.addFinishedBadge(challengeID, this.userRepository.getCurrentUser().getUUID());
                                if (newChall != null) {
                                    self.evaluateChallenge(newChall, newChall.getId());
                                }
                            }
                            console.log("All data were retrieve properly");
                            return challengeToEvaluate.getProgress();
                        },
                        function () {
                            return {error: "Error occurred in middleware"};
                        });

                })(requiredSensorName[currentSensorName]);
            }
        }
        else {
            console.log('++++++++++++++++++++++ \tMODE DEMO\t+++++++++++++++++++++');

            if(challengeToEvaluate.haveToStart(Clock.getCurrentDemoMoment())) {
                challengeToEvaluate.setStatus(ChallengeStatus.RUN);
            }

            var result = challengeToEvaluate.evaluate(this.jsonStub);

            //  Check if the challenge is achieved and finished
            if (result && challengeToEvaluate.isFinished()) {
                //console.log("Le challenge est réussi et terminé");

                //  Add finished badge to current user
                this.addFinishedBadge(challengeID, this.userRepository.getCurrentUser().getUUID());

                //  Build the new challenge (recurring) and evaluate it
                var newChallenge = self.createGoalInstance(challengeToEvaluate.getGoalDefinition().getUUID(), challengeToEvaluate.getEndDate());
                if (newChallenge != null) {
                    self.evaluateChallenge(newChallenge, newChallenge.getId());
                }
            }

            //  Check if the challenge is not achieved but finished
            else if (!result && challengeToEvaluate.isFinished()) {
                //console.log("Le challenge est FAIL et terminé");

                var user = this.userRepository.getCurrentUser();
                user.deleteChallenge(challengeToEvaluate.getId());

                //  Build the new challenge (recurring) and evaluate it
                var newChallenge = self.createGoalInstance(challengeToEvaluate.getGoalDefinition().getUUID(), challengeToEvaluate.getEndDate());
                if (newChallenge != null) {
                     self.evaluateChallenge(newChallenge, newChallenge.getId());
                }
            }

            return challengeToEvaluate.getProgress();
        }
    }
}

export = GoalInstanceRouter;