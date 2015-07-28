import RouterItf = require('./RouterItf');

import GoalInstanceRepository = require('../goal/instance/GoalInstanceRepository');
import GoalInstanceFactory = require('../goal/instance/GoalInstanceFactory');
import GoalDefinitionRepository = require('../goal/definition/GoalDefinitionRepository');
import UserRepository = require('../user/UserRepository');

import Middleware = require('../Middleware');

import Clock = require('../Clock');

class GoalInstanceRouter extends RouterItf {
    public static DEMO:boolean = true;

    public static STUB_FILE:string = './stub_values.json';

    private goalInstanceRepository:GoalInstanceRepository;
    private goalInstanceFactory:GoalInstanceFactory;
    private goalDefinitionRepository:GoalDefinitionRepository;
    private userRepository:UserRepository;

    private middleware:Middleware;

    private jsonStub:any = {};

    constructor(goalInstanceRepository:GoalInstanceRepository, goalInstanceFactory:GoalInstanceFactory, goalDefinitionRepository:GoalDefinitionRepository, userRepository:UserRepository) {
        super();
        this.goalInstanceRepository = goalInstanceRepository;
        this.goalInstanceFactory = goalInstanceFactory;
        console.log("GOALINSTANCEFACTORY", this.goalInstanceFactory);

        this.goalDefinitionRepository = goalDefinitionRepository;
        this.userRepository = userRepository;

        var fs = require('fs');
        fs.readFile(GoalInstanceRouter.STUB_FILE, function (err, data) {
            if (err) {
                throw err;
            }
            this.jsonStub = JSON.parse(data.toString());
            console.log("++ Fichier stub chargé correctement");
        });
    }


    buildRouter() {
        var self = this;

        this.router.post('/new', function(req,res) {
            self.newGoalInstance(req,res);
        });
        this.router.delete('/delete/:id', this.deleteGoalInstance);
        this.router.get('/evaluate', this.evaluate);

        //  Debug routes only
        this.router.post('/addstub', this.addStub);
        this.router.post('/setNow', this.setNow);
    }


    addStub(req, res) {

        var data = req.body;
        var value = data.value;
        var key = data.key;

        var valueDesc:any = {};
        valueDesc.date = Clock.getNow() / 1000;
        valueDesc.value = value;

        var oldJson:any[] = this.jsonStub[key].values;
        oldJson.push(valueDesc);
        this.jsonStub[key].values = oldJson;

        res.send('Valeur' + JSON.stringify(valueDesc) + " ajoutee au stub ! Etat du stub : " + JSON.stringify(this.jsonStub));
    }


    setNow(req, res) {
        var data = req.body;
        var newNow:Date = new Date(data.now);

        console.log("Mise a jour de la date actuelle. Nous sommes maintenant le", newNow);
        Clock.setNow(newNow.getTime());
        res.send("New 'now' : " + newNow);
    }


    newGoalInstance(req:any, res:any) {
        var goalID = req.body.goalID;

        if (!goalID) {
            res.status(400).send({'error': 'goalID field is missing in request'});
        }

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

        var goalInstance = this.goalInstanceFactory.createGoalInstance(data, this.goalDefinitionRepository, null, new Date(Clock.getNow()));
        this.goalInstanceRepository.addGoalInstance(goalInstance);
        res.send({"success": "Objectif ajouté !"});
    }

    deleteGoalInstance(req:any, res:any) {
        var goalID = req.params.id;
        this.goalInstanceRepository.removeGoalInstance(goalID);
        res.send({"success": "Objectif supprimé !"});
    }

    evaluate(req:any, res:any) {
        var self = this;

        var goalInstanceID:string = req.query.badgeID;

        var goalInstanceToEvaluate = this.goalInstanceRepository.getGoalInstance(goalInstanceID);

        if (!GoalInstanceRouter.DEMO) {

            //TODO move what follow
            var required = goalInstanceToEvaluate.getSensors();

            var requiredSensorName = Object.keys(required);
            var numberToLoad:number = requiredSensorName.length;

            for (var currentSensorName in requiredSensorName) {
                (function (currentSensorName) {
                    var startDate:string = '' + required[currentSensorName].startDate;
                    var endDate:string = '' + required[currentSensorName].endDate;

                    var path = 'http://smartcampus.unice.fr/sensors/' + currentSensorName + '/data?date=' + startDate + '/' + endDate;
                    var dataJsonString = "";

                    self.middleware.getSensorsInfo(required, numberToLoad, dataJsonString, path,
                        function () {
                            var result = goalInstanceToEvaluate.evaluate(required);
                            if (result) {
                                self.addFinishedBadge(goalInstanceID, self.userRepository.getCurrentUser());
                            }
                            console.log("All data were retrieve properly");
                            res.send(goalInstanceToEvaluate.getProgress());
                        },
                        function () {
                            console.log("FAIL MIDDLEWARE");
                            res.send({error: "Error occured in middleware"});
                        });

                })(requiredSensorName[currentSensorName]);
            }
        }
        else {
            var result = goalInstanceToEvaluate.evaluate(this.jsonStub);
            if (result) {
                this.addFinishedBadge(goalInstanceID, this.userRepository.getCurrentUser());
            }
            res.send(goalInstanceToEvaluate.getProgress());
        }
    }

    private addFinishedBadge(challengeID, userID) {
        var user = this.userRepository.getUser(userID);
        var badge = this.goalInstanceRepository.getBadgeByChallengeID(challengeID);
        user.addFinishedBadge(badge);
        user.deleteChallenge(challengeID);
    }
}

export = GoalInstanceRouter;