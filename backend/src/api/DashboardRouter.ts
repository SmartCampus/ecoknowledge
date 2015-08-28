import RouterItf = require('./RouterItf');

import ChallengeRepository = require('../challenge/UserChallengeRepository');
import ChallengeFactory = require('../challenge/UserChallengeFactory');
import GoalRepository = require('../goal/GoalRepository');
import BadgeRepository = require('../badge/BadgeRepository');
import UserRepository = require('../user/UserRepository');
import TeamRepository = require('../user/TeamRepository');
import Challenge = require('../challenge/UserChallenge');
import Clock = require('../Clock');
import ChallengeStatus = require('../Status');
import Goal = require('../goal/Goal');
import User = require('../user/User');
import Team = require('../user/Team');
import Entity = require('../user/Entity');

import Middleware = require('../Middleware');

class DashboardRouter extends RouterItf {
    public static DEMO:boolean = true;
    private jsonStub:any = {};
    public static STUB_FILE:string = './stub_values.json';

    private challengeRepository:ChallengeRepository;
    private challengeFactory:ChallengeFactory;

    private goalRepository:GoalRepository;

    private userRepository:UserRepository;

    private teamRepository:TeamRepository;

    private badgeRepository:BadgeRepository;

    private middleware:Middleware;

    //  TODO DELETE THIS TOKEN WHEN SESSION WILL BE ESTABLISHED
    private currentUser:Entity;

    constructor(challengeRepository:ChallengeRepository, challengeFactory:ChallengeFactory, goalRepository:GoalRepository,
                userRepository:UserRepository, teamRepository:TeamRepository, badgeRepository:BadgeRepository, middleware:Middleware) {
        super();

        var fs = require('fs');
        var data = fs.readFileSync(DashboardRouter.STUB_FILE, "utf-8");
        this.jsonStub = JSON.parse(data);

        this.challengeRepository = challengeRepository;
        this.challengeFactory = challengeFactory;
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
        this.badgeRepository = badgeRepository;
        this.middleware = middleware;
    }

    buildRouter() {
        var self = this;

        this.router.get('/view/:id/:dashboard?', function (req, res) {

            var userID = req.params.id;
            var dashboardWanted = req.params.dashboard;

            console.log('UserID : ', userID, 'Dashboard wanted', dashboardWanted);

            var result:any = {};

            var currentUser:User = self.userRepository.getUser(userID);

            var team:Team = self.teamRepository.getTeam(dashboardWanted);

            if (currentUser == null && team == null) {
                res.status(404).send('Euh ... Juste, tu n\'existes pas. Désolé. Bisous. Dégage');
                return;
            }

            //  User dashboard wanted
            if (currentUser != null && team == null) {
                result = self.getPersonalDashboard(currentUser);
            }

            //  Team dashboard wanted
            else if (currentUser != null && team != null) {
                //TODO Check if user is leader or member of team


                var currentUserIsLeaderOfTargetedTeam = team.hasLeader(currentUser.getUUID());
                if (currentUserIsLeaderOfTargetedTeam) {
                    result = self.getTeamDashboardForALeader(team);
                }
                else {
                    result = self.getTeamDashboardForAMember(team);
                }
            }
            //  TODO extract method
            //  Build dashboardList, every views possible for current user
            var dashboardList:any[] = [];

            var teams = self.teamRepository.getTeamsByMember(currentUser.getUUID());


            for (var teamIndex in teams) {
                var currentTeam = teams[teamIndex];
                var teamDescription:any = {};
                teamDescription.id = currentTeam.getUUID();
                teamDescription.name = currentTeam.getName();
                dashboardList.push(teamDescription);
            }

            result.dashboardList = dashboardList;

            res.send({data: result});
        });

        this.router.get('/', function (req, res) {
            console.log("Getting dashboard");
            //  TODO redirect login page
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

        //  TODO replace currentUser by user in the session
        var currentUser = this.userRepository.getCurrentUser();

        var newChall:Challenge = this.createGoalInstance(currentUser, goalID, Clock.getMoment(Clock.getNow()));

        if (newChall == null) {
            res.send({'error': 'Can not take this challenge'});
            return;
        }

        res.send({"success": ("Objectif ajouté !" + newChall.getDataInJSON())});
    }

    deleteChallenge(req:any, res:any) {
        var goalID = req.params.id;

        try {
            this.currentUser.deleteChallenge(goalID);
            res.send({"success": "Objectif supprimé !"});
        }
        catch (e) {
            res.send({error: e.toString()});
        }
    }

    getDashboard(req, res) {
        console.log("\n=======================================================================\n---> Getting Dashboard\n");

        //  TODO replace getCurrentUser by session user

        var result:any = {};

        try {
            //  Build dashboardList, every views possible for current user
            var dashboardList:any[] = [];

            var teams = this.teamRepository.getTeamsByMember(this.currentUser.getUUID());
            for (var teamIndex in teams) {
                var team = teams[teamIndex];
                var teamDescription:any = {};
                teamDescription.id = team.getUUID();
                teamDescription.name = team.getName();
                dashboardList.push(teamDescription);
            }

            console.log("Dashboard views available : ", dashboardList);

            var typeOfDashboardAsked:string = req.query.typeOfDashboard;

            console.log("Dashboard view asked : ", typeOfDashboardAsked);

            if (typeOfDashboardAsked == undefined || typeOfDashboardAsked === 'personal') {
                result = this.getPersonalDashboard(null);
            }
            else {
                var teamDescriptionWanted = this.teamRepository.getTeam(typeOfDashboardAsked);
                console.log("Team dashboard mode, with team : \n\t", team.getStringDescription());

                //  TODO DELETE THIS TOKEN WHEN SESSION WILL BE ESTABLISHED
                // this.currentUser = teamDescriptionWanted;

                //  Check if current user is leader of the team
                var currentUserIsLeaderOfTargetedTeam = teamDescriptionWanted.hasLeader(this.currentUser.getUUID());
                if (currentUserIsLeaderOfTargetedTeam) {
                    result = this.getTeamDashboardForALeader(teamDescriptionWanted);
                }
                else {
                    result = this.getTeamDashboardForAMember(teamDescriptionWanted);
                }
            }
            result.dashboardList = dashboardList;

            res.send({success: 'Everything is fine', data: result});
            console.log("\nSending ... \n", JSON.stringify(result));
            console.log("=======================================================================\n\n");

        }
        catch (e) {
            res.send({error: e.toString()});
        }
    }

    getTeamDashboardForAMember(teamDescriptionWanted:Team):any {
        var result:any = {};
        //  Evaluate challenge and return them
        //  Done before everything to be up to date
        this.evaluateChallengeForGivenTeam(teamDescriptionWanted);
        // Second col : badge description
        var descriptionOfBadges:any[] = this.buildBadgesDescriptionForGivenEntity(teamDescriptionWanted);

        //  Third col : Build the description of updated challenges (potential additions/deletions)
        var descriptionOfChallenges:any[] = this.buildCurrentChallengesDescriptionForGivenEntity(teamDescriptionWanted);

        result.badges = descriptionOfBadges;
        result.challenges = descriptionOfChallenges;

        return result;
    }

    getTeamDashboardForALeader(teamDescriptionWanted:Team):any {
        var result:any = {};

        console.log("Current user is leader of given team");

        //  Evaluate challenge and return them
        //  Done before everything to be up to date
        this.evaluateChallengeForGivenTeam(teamDescriptionWanted);

        //  First col : available goal
        var descriptionOfAvailableGoals = this.goalRepository.getListOfNotTakenGoalInJSONFormat(teamDescriptionWanted, this.challengeRepository);

        // Second col : badge description
        var descriptionOfBadges:any[] = this.buildBadgesDescriptionForGivenEntity(teamDescriptionWanted);

        //  Third col : Build the description of updated challenges (potential additions/deletions)
        var descriptionOfChallenges:any[] = this.buildCurrentChallengesDescriptionForGivenEntity(teamDescriptionWanted);

        //  Build the response
        result.goals = descriptionOfAvailableGoals;
        result.badges = descriptionOfBadges;
        result.challenges = descriptionOfChallenges;

        return result;
    }

    getPersonalDashboard(user:User):any {
        var result:any = {};


        console.log('Current client', user.getName());

        console.log("Personal Dashboard mode");

        //  Evaluate challenge and return them
        //  Done before everything to be up to date
        this.evaluateChallengeForGivenUser(user);

        //  First col : available goal
        var descriptionOfAvailableGoals = this.goalRepository.getListOfNotTakenGoalInJSONFormat(user, this.challengeRepository);

        // Second col : badge description
        var descriptionOfBadges:any[] = this.buildBadgesDescriptionForGivenUser(user);

        //  Third col : Build the description of updated challenges (potential additions/deletions)
        var descriptionOfChallenges:any[] = this.buildCurrentChallengesDescriptionForGivenUser(user);

        //  Build the response
        result.goals = descriptionOfAvailableGoals;
        result.badges = descriptionOfBadges;
        result.challenges = descriptionOfChallenges;

        return result;
    }


    private evaluateChallengeForGivenTeam(team:Team):void {
        var challenges = team.getCurrentChallenges();
        for (var challengeIndex in challenges) {
            var currentChallengeID = challenges[challengeIndex];
            var currentChallenge = this.challengeRepository.getGoalInstance(currentChallengeID);

            this.evaluateChallenge(team, currentChallenge, currentChallengeID);
        }
    }

    private evaluateChallengeForGivenUser(user:User):void {
        var challenges = user.getCurrentChallenges();
        for (var challengeIndex in challenges) {
            var currentChallengeID = challenges[challengeIndex];
            var currentChallenge = this.challengeRepository.getGoalInstance(currentChallengeID);

            this.evaluateChallenge(user, currentChallenge, currentChallengeID);
        }
    }

    private buildCurrentChallengesDescriptionForGivenEntity(entity:Entity):any[] {
        var descriptionOfChallenges:any[] = [];
        var challenges = entity.getChallenges();
        for (var challengeIndex in challenges) {
            var currentChallengeID = challenges[challengeIndex];
            var currentChallenge = this.challengeRepository.getGoalInstance(currentChallengeID);
            var currentChallengeDesc = currentChallenge.getDataInJSON();
            descriptionOfChallenges.push(currentChallengeDesc);
        }

        return descriptionOfChallenges;
    }


    private buildCurrentChallengesDescriptionForGivenUser(user:User):any[] {
        var descriptionOfChallenges:any[] = [];

        var challenges = user.getCurrentChallenges();
        for (var challengeIndex in challenges) {
            var currentChallengeID = challenges[challengeIndex];
            var currentChallenge = this.challengeRepository.getGoalInstance(currentChallengeID);
            var currentChallengeDesc = currentChallenge.getDataInJSON();
            descriptionOfChallenges.push(currentChallengeDesc);
        }

        return descriptionOfChallenges;
    }


    private buildBadgesDescriptionForGivenEntity(entity:Entity):any[] {
        var descriptionOfBadges:any[] = [];

        var badges = entity.getFinishedBadges();

        for (var currentBadgeIDIndex in badges) {
            var currentBadge = this.badgeRepository.getBadge(currentBadgeIDIndex).getData();
            var dataTrophy = {
                number: badges[currentBadgeIDIndex],
                badge: currentBadge
            };

            descriptionOfBadges.push(dataTrophy);
        }

        return descriptionOfBadges;
    }


    private buildBadgesDescriptionForGivenUser(user:User):any[] {
        var descriptionOfBadges:any[] = [];

        var badges = user.getBadges();

        for (var currentBadgeIDIndex in badges) {
            var currentBadge = this.badgeRepository.getBadge(currentBadgeIDIndex).getData();
            var dataTrophy = {
                number: badges[currentBadgeIDIndex],
                badge: currentBadge
            };

            descriptionOfBadges.push(dataTrophy);
        }

        return descriptionOfBadges;
    }

    private evaluateChallenge(entity, challengeToEvaluate:Challenge, challengeID) {
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
                                var newChall = self.createGoalInstance(entity, challengeToEvaluate.getGoalDefinition().getUUID(), challengeToEvaluate.getEndDate());
                                this.addBadge(challengeID, entity.getUUID());
                                if (newChall != null) {
                                    self.evaluateChallenge(entity, newChall, newChall.getId());
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
                this.addFinishedBadge(challengeID, entity.getUUID());

                //  Build the new challenge (recurring) and evaluate it
                var newChallenge = self.createGoalInstance(entity, challengeToEvaluate.getGoalDefinition().getUUID(), challengeToEvaluate.getEndDate());
                if (newChallenge != null) {
                    self.evaluateChallenge(entity, newChallenge, newChallenge.getId());
                }
            }

            //  Check if the challenge is not achieved but finished
            else if (!result && challengeToEvaluate.isFinished()) {
                console.log("Le challenge est FAIL et terminé");

                entity.deleteChallenge(challengeToEvaluate.getId());

                //  Build the new challenge (recurring) and evaluate it
                var newChallenge = self.createGoalInstance(entity, challengeToEvaluate.getGoalDefinition().getUUID(), challengeToEvaluate.getEndDate());
                if (newChallenge != null) {
                    self.evaluateChallenge(entity, newChallenge, newChallenge.getId());
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
        user.addBadge(badgeID);
        user.deleteChallenge(challengeID);
    }

    createGoalInstance(currentUser:User, goalID:string, date:moment.Moment):Challenge {

        var goal:Goal = this.goalRepository.getGoal(goalID);

        var newChallenge = currentUser.addChallenge(goal, date);

        if (newChallenge == null) {
            return null;
        }

        this.challengeRepository.addGoalInstance(newChallenge);
        return newChallenge;
    }
}

export = DashboardRouter;