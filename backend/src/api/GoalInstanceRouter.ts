import RouterItf = require('./RouterItf');

import ChallengeRepository = require('../challenge/ChallengeRepository');
import ChallengeFactory = require('../challenge/ChallengeFactory');
import GoalRepository = require('../goal/GoalRepository');
import Challenge = require('../challenge/Challenge');
import UserRepository = require('../user/UserRepository');

import Middleware = require('../Middleware');

import Clock = require('../Clock');

import BadRequestException = require('../exceptions/BadRequestException');

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
        console.log("++ Fichier stub chargé correctement\n", JSON.stringify(this.jsonStub));
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
            self.addStub(req, res)
        });

        this.router.post('/setNow', function (req, res) {
            self.setNow(req, res)
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
        valueDesc.date = Clock.getNow();
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
        var goalID = req.body.id;

        if (!goalID) {
            res.status(400).send({'error': 'goalID field is missing in request'});
        }

        var newChall:Challenge = this.createGoalInstance(goalID,new Date(Clock.getNow()));

        res.send({"success": ("Objectif ajouté !"+newChall.getDataInJSON())});
    }

    createGoalInstance(goalID:string,date:Date):Challenge{
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

        var goalInstance = this.goalInstanceFactory.createGoalInstance(data, this.goalDefinitionRepository, null, date);
        this.goalInstanceRepository.addGoalInstance(goalInstance);
        this.userRepository.getCurrentUser().addChallenge(goalInstance.getId());
        //TODO if checkdate return null
        return goalInstance;
    }

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

    evaluateAll(req:any, res:any){
        try {
            var challenges = this.userRepository.getCurrentUser().getChallenges();
            for (var challenge in challenges) {
                var currentChallengeID = challenges[challenge];
                var challengeToEvaluate = this.goalInstanceRepository.getGoalInstance(currentChallengeID);
                this.evaluateChallenge(challengeToEvaluate, currentChallengeID);
            }
            res.send({success:''});
        }
        catch(e) {
            res.send(e.toString());
        }
    }

    //  debug only
    private addFinishedBadge(challengeID:string, userID:string) {
        console.log('user id : ', userID);
        console.log('challenge ID : ', challengeID);
        var user = this.userRepository.getUser(userID);
        var badgeID = this.goalInstanceRepository.getBadgeByChallengeID(challengeID);
        user.addFinishedBadge(badgeID);
        user.deleteChallenge(challengeID);
    }

    private evaluateChallenge(goalInstanceToEvaluate:Challenge, goalInstanceID){
        var self=this;
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

                    this.middleware.getSensorsInfo(required, numberToLoad, dataJsonString, path,
                        function () {
                            var result = goalInstanceToEvaluate.evaluate(required);
                            if (result) {
                                var newChall = self.createGoalInstance(goalInstanceToEvaluate.getGoalDefinition().getUUID(),goalInstanceToEvaluate.getEndDate());
                                this.addFinishedBadge(goalInstanceID, this.userRepository.getCurrentUser().getUUID());
                                if(newChall!=null){
                                    self.evaluateChallenge(newChall, newChall.getId());
                                }
                            }
                            console.log("All data were retrieve properly");
                            return goalInstanceToEvaluate.getProgress();
                        },
                        function () {
                           return {error: "Error occured in middleware"};
                        });

                })(requiredSensorName[currentSensorName]);
            }
        }
        else {
            console.log('++++++++++++ \tMODE DEMO\t+++++++++++');
            var result = goalInstanceToEvaluate.evaluate(this.jsonStub);
            if (result) {
                var newChall = self.createGoalInstance(goalInstanceToEvaluate.getGoalDefinition().getUUID(), goalInstanceToEvaluate.getEndDate());
                this.addFinishedBadge(goalInstanceID, this.userRepository.getCurrentUser().getUUID());
                if(newChall!=null){
                    self.evaluateChallenge(newChall, newChall.getId());
                }
            }
            return goalInstanceToEvaluate.getProgress();
        }
    }
}

export = GoalInstanceRouter;