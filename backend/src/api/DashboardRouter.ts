import RouterItf = require('./RouterItf');

import ChallengeRepository = require('../challenge/ChallengeRepository');
import ChallengeFactory = require('../challenge/ChallengeFactory');
import GoalRepository = require('../goal/GoalRepository');
import BadgeRepository = require('../badge/BadgeRepository');
import UserRepository = require('../user/UserRepository');
import Challenge = require('../challenge/Challenge');
import Clock = require('../Clock');
import ChallengeStatus = require('../Status');
import Goal = require('../goal/Goal');

import Middleware = require('../Middleware');

class DashboardRouter extends RouterItf {
    public static DEMO:boolean = true;
    private jsonStub:any = {};
    public static STUB_FILE:string = './stub_values.json';

    private challengeRepository:ChallengeRepository;
    private challengeFactory:ChallengeFactory;

    private goalRepository:GoalRepository;

    private userRepository:UserRepository;

    private badgeRepository:BadgeRepository;

    private middleware:Middleware;

    constructor(challengeRepository:ChallengeRepository, challengeFactory:ChallengeFactory, goalRepository:GoalRepository, userRepository:UserRepository, badgeRepository:BadgeRepository, middleware:Middleware) {
        super();

        var fs = require('fs');
        var data = fs.readFileSync(DashboardRouter.STUB_FILE, "utf-8");
        this.jsonStub = JSON.parse(data);

        this.challengeRepository = challengeRepository;
        this.challengeFactory = challengeFactory;
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
        this.badgeRepository = badgeRepository;
        this.middleware = middleware;
    }

    buildRouter() {
        var self = this;

        this.router.get('/', function (req, res) {
            self.getDashboard(req, res);
        });

        this.router.delete('/delete/:id', function (req, res) {
            self.deleteChallenge(req, res);
        });

        this.router.post('/takeGoal', function (req, res) {
            self.newGoalInstance(req, res);
        });

        //  Debug routes only
        this.router.post('/addstub', function (req, res) {
            self.addStub(req, res);
        });

        this.router.post('/setNow', function (req, res) {
            self.setNow(req, res);
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

        if (newChall == null) {
            res.send({'error': 'Can not take this challenge'});
            return;
        }

        res.send({"success": ("Objectif ajouté !" + newChall.getDataInJSON())});
    }

    deleteChallenge(req:any, res:any) {
        var goalID = req.params.id;

        try {
            this.userRepository.getCurrentUser().deleteChallenge(goalID);
            res.send({"success": "Objectif supprimé !"});
        }
        catch (e) {
            res.send({error: e.toString()});
        }
    }

    getDashboard(req, res) {
        console.log("\n=======================================================================\n---> Getting Dashboard\n");
        var result:any = {};

        try {

            //  Third col : Evaluate challenge and return them
            //  Done before everything to be up to date
            var challenges = this.userRepository.getCurrentUser().getChallenges();
            for (var challengeIndex in challenges) {
                var currentChallengeID = challenges[challengeIndex];
                var currentChallenge = this.challengeRepository.getGoalInstance(currentChallengeID);

                this.evaluateChallenge(currentChallenge, currentChallengeID);
            }

            //  Build the description of updated challenges (potential additions/deletions)
            var descriptionOfChallenges:any[] = [];
            var challenges = this.userRepository.getCurrentUser().getChallenges();
            for (var challengeIndex in challenges) {
                var currentChallengeID = challenges[challengeIndex];
                var currentChallenge = this.challengeRepository.getGoalInstance(currentChallengeID);
                var currentChallengeDesc = currentChallenge.getDataInJSON();
                descriptionOfChallenges.push(currentChallengeDesc);
            }

            //  First col : available goal
            var descriptionOfAvailableGoals = this.goalRepository.getListOfUntakedGoalInJSONFormat(this.userRepository.getCurrentUser(), this.challengeRepository);

            // Second col : badge description
            var descriptionOfBadges:any[] = [];

            var badges = this.userRepository.getCurrentUser().getFinishedBadges();
            for (var currentBadgeIDIndex in badges) {
                var currentBadge = this.badgeRepository.getBadge(currentBadgeIDIndex).getData();
                var dataTrophy = {
                    number: badges[currentBadgeIDIndex],
                    badge: currentBadge
                };

                descriptionOfBadges.push(dataTrophy);
            }


            //  Build the response
            result.goals = descriptionOfAvailableGoals;
            result.badges = descriptionOfBadges;
            result.challenges = descriptionOfChallenges;

            res.send({success: 'Everything is fine', data: result});
            console.log("\nSending ... \n", JSON.stringify(result));
            console.log("=======================================================================\n\n");

        }
        catch (e) {
            res.send({error: e.toString()});
        }

    }

    private evaluateChallenge(challengeToEvaluate:Challenge, challengeID) {
        var self = this;

        if (!DashboardRouter.DEMO) {

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

            if (challengeToEvaluate.haveToStart(Clock.getCurrentDemoMoment())) {
                challengeToEvaluate.setStatus(ChallengeStatus.RUN);
            }

            var result = challengeToEvaluate.evaluate(this.jsonStub);

            //  Check if the challenge is achieved and finished
            if (result && challengeToEvaluate.isFinished()) {
                console.log("Le challenge est réussi et terminé");

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
                console.log("Le challenge est FAIL et terminé");

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

    //  debug only
    private addFinishedBadge(challengeID:string, userID:string) {
        /*
         console.log('add finished badge');
         console.log('user id : ', userID);
         console.log('challenge ID : ', challengeID);
         */
        var user = this.userRepository.getUser(userID);
        var badgeID = this.challengeRepository.getBadgeByChallengeID(challengeID);
        user.addFinishedBadge(badgeID);
        user.deleteChallenge(challengeID);
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

        var goal:Goal = this.goalRepository.getGoal(goalID);

        //console.log("Je construit un challenge en partant du principe que nous sommes le ", date.toISOString());
        var goalInstance = this.challengeFactory.createGoalInstance(data, this.goalRepository, null, date);

        if (goalInstance.getEndDate().isAfter(goal.getEndDate())) {
            return null;
        }

        this.challengeRepository.addGoalInstance(goalInstance);
        this.userRepository.getCurrentUser().addChallenge(goalInstance.getId());
        return goalInstance;
    }
}

export = DashboardRouter;