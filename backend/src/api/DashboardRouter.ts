import RouterItf = require('./RouterItf');

import UserChallengeRepository = require('../challenge/UserChallengeRepository');
import UserChallengeFactory = require('../challenge/UserChallengeFactory');

import TeamChallengeRepository = require('../challenge/TeamChallengeRepository');
import TeamChallengeFactory = require('../challenge/TeamChallengeFactory');

import GoalRepository = require('../goal/GoalRepository');
import BadgeRepository = require('../badge/BadgeRepository');
import UserRepository = require('../user/UserRepository');
import TeamRepository = require('../user/TeamRepository');

import UserChallenge = require('../challenge/UserChallenge');
import TeamChallenge = require('../challenge/TeamChallenge');

import Clock = require('../Clock');
import ChallengeStatus = require('../Status');
import Goal = require('../goal/Goal');
import User = require('../user/User');
import Team = require('../user/Team');
import Entity = require('../user/Entity');

import Middleware = require('../Middleware');
import Context = require('../Context');

var merge = require('merge');

import BadRequestException = require('../exceptions/BadRequestException');
import BadArgumentException = require('../exceptions/BadArgumentException');

class DashboardRouter extends RouterItf {
    public static DEMO:boolean = true;
    private jsonStub:any = {};
    private pathToStubFile:string;

    private userChallengeRepository:UserChallengeRepository;
    private userChallengeFactory:UserChallengeFactory;

    private teamChallengeRepository:TeamChallengeRepository;
    private teamChallengeFactory:TeamChallengeFactory;

    private goalRepository:GoalRepository;

    private userRepository:UserRepository;

    private teamRepository:TeamRepository;

    private badgeRepository:BadgeRepository;

    private middleware:Middleware;

    constructor(context:Context, middleware:Middleware) {
        super();

        this.pathToStubFile = context.getPathToStubFile();

        var fs = require('fs');
        var data = fs.readFileSync(this.pathToStubFile, "utf-8");
        this.jsonStub = JSON.parse(data);

        console.log("STUB", JSON.stringify(this.jsonStub));

        this.userChallengeRepository = context.getUserChallengeRepository();
        this.userChallengeFactory = context.getUserChallengeFactory();

        this.teamChallengeRepository = context.getTeamChallengeRepository();
        this.teamChallengeFactory = context.getTeamChallengeFactory();

        this.goalRepository = context.getGoalRepository();

        this.userRepository = context.getUserRepository();
        this.teamRepository = context.getTeamRepository();

        this.badgeRepository = context.getBadgeRepository();

        this.middleware = middleware;
    }

    buildRouter() {
        var self = this;

        this.router.get('/view/:id/:dashboard?', function (req, res) {

            var userID = req.params.id;
            var dashboardWanted = req.params.dashboard;

            console.log('UserID : ', userID, 'Dashboard wanted', dashboardWanted);

            var result:any = {};

            var currentUser:User = self.checkUserID(userID);

            if (currentUser == null) {
                res.status(404).send({error: 'Le profil utilisateur n\'existe pas'});
                return;
            }


            //  User dashboard wanted
            if (dashboardWanted == 'personal') {
                result = self.getPersonalDashboard(currentUser);

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
            }

            //  Team dashboard wanted
            else {

                var team:Team = self.teamRepository.getTeam(dashboardWanted);
                if (team == null) {
                    res.status(404).send({error: 'Le dashboard demandé n\'existe pas'});
                    return;
                }

                console.log("Dashboard de la team", team.getName(), "désiré");

                var currentUserIsLeaderOfTargetedTeam = team.hasLeader(currentUser.getUUID());
                if (currentUserIsLeaderOfTargetedTeam) {
                    console.log("L'utilisateur est leader de la team", team.getName());
                    result = self.getTeamDashboardForALeader(team);
                }
                else {
                    console.log("L'utilisateur n'est que membre  de la team", team.getName());
                    result = self.getTeamDashboardForAMember(team);
                }

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
            }


            res.send({data: result});
        });


        this.router.delete('/delete/:id/:challengeID/:target', function (req, res) {
            self.deleteChallenge(req, res);
        });

        this.router.post('/takeGoal/', function (req, res) {
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

        var oldJson:any[] = this.jsonStub[key];
        oldJson.push(valueDesc);
        this.jsonStub[key] = oldJson;

        res.send('Valeur' + JSON.stringify(valueDesc) + " ajoutee au stub !");
    }

    setNow(req, res) {
        var data = req.body;

        var newNow:moment.Moment = Clock.getMomentFromString(data.now);

        console.log("Mise a jour de la date actuelle. Nous sommes maintenant le", newNow.toISOString());
        Clock.setNowByString(newNow.toISOString());
        res.send("New 'now' : " + newNow.toISOString());
    }

    newGoalInstance(req:any, res:any) {
        console.log(req.body);

        var goalID = req.body.goalID;

        if (!goalID) {
            res.status(400).send({'error': 'goalID field is missing in request'});
        }

        //TODO check if it's a user taking a challenge for himself
        //  or a team leader taking a challenge for its team

        var currentUserID = req.body.userID;
        var currentUser:User = this.checkUserID(currentUserID);

        var target = req.body.target;

        var newChallenge = null;
        if (target == 'personal') {
            newChallenge = this.createUserChallenge(currentUserID, goalID, Clock.getMoment(Clock.getNow()));
        }
        else {
            newChallenge = this.createTeamChallenge(target, goalID, Clock.getMoment(Clock.getNow()));
        }

        if (newChallenge == null) {
            res.send({'error': 'Can not take this challenge'});
            return;
        }

        res.send({"success": ("Objectif ajouté !" + newChallenge.getDataInJSON())});
    }

    deleteChallenge(req:any, res:any) {

        var challengeID = req.params.challengeID;
        var userID = req.params.id;

        var target = req.params.target;

        console.log("TARGET", target);

        try {
            if (target == 'personal') {

                var user:User = null;
                user = this.checkUserID(userID);

                user.deleteChallenge(challengeID);
                res.send({"success": "Objectif supprimé !"});
            }
            else {

                var team:Team = null;
                team = this.checkTeamID(target);

                var challengeToDelete = this.teamChallengeRepository.getChallengeByID(challengeID);

                team.deleteChallenge(challengeToDelete);
                res.send({"success": "Objectif supprimé !"});
            }
        }
        catch (e) {
            if (e instanceof BadRequestException) {
                res.status(400).send({error: e.getMessage()});
                return;

            }
            else if (e instanceof BadArgumentException) {
                res.status(400).send({error: e.getMessage()});
                return;

            }
            else {
                res.status(500).send({error: e.getMessage()});
                return;
            }
        }
    }

    getTeamDashboardForAMember(teamDescriptionWanted:Team):any {
        var result:any = {};
        //  Evaluate challenge and return them
        //  Done before everything to be up to date
        this.evaluateChallengeForGivenTeam(teamDescriptionWanted);

        //  First col : available goal
        var descriptionOfAvailableGoals = this.goalRepository.getListOfNotTakenGoalInJSONFormat(teamDescriptionWanted, this.userChallengeRepository);

        // Second col : badge description
        var descriptionOfBadges:any[] = this.buildBadgesDescriptionForGivenTeam(teamDescriptionWanted);

        //  Third col : Build the description of updated challenges (potential additions/deletions)
        var descriptionOfChallenges:any[] = this.buildCurrentChallengesDescriptionForGivenTeam(teamDescriptionWanted);

        result.goals = {'canTakeGoal': false, goalsData: descriptionOfAvailableGoals};
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
        var descriptionOfAvailableGoals = this.goalRepository.getListOfNotTakenGoalInJSONFormat(teamDescriptionWanted, this.teamChallengeRepository);

        // Second col : badge description
        var descriptionOfBadges:any[] = this.buildBadgesDescriptionForGivenTeam(teamDescriptionWanted);

        //  Third col : Build the description of updated challenges (potential additions/deletions)
        var descriptionOfChallenges:any[] = this.buildCurrentChallengesDescriptionForGivenTeam(teamDescriptionWanted);

        //  Build the response
        result.goals = {'canTakeGoal': true, goalsData: descriptionOfAvailableGoals};
        result.badges = descriptionOfBadges;
        result.challenges = descriptionOfChallenges;

        return result;
    }

    getPersonalDashboard(user:User):any {
        console.log("\t Personal Dashboard mode");
        console.log('\t Current client', user.getName());


        var result:any = {};

        //  Evaluate challenge and return them
        //  Done before everything to be up to date
        this.evaluateChallengesForGivenUser(user);

        //  First col : available goal
        var descriptionOfAvailableGoals = this.goalRepository.getListOfNotTakenGoalInJSONFormat(user, this.userChallengeRepository);

        // Second col : badge description
        var descriptionOfBadges:any[] = this.buildBadgesDescriptionForGivenUser(user);

        //  Third col : Build the description of updated challenges (potential additions/deletions)
        var descriptionOfChallenges:any[] = this.buildCurrentChallengesDescriptionForGivenUser(user);

        //  Build the response
        result.goals = {'canTakeGoal': true, goalsData: descriptionOfAvailableGoals};
        result.badges = descriptionOfBadges;
        result.challenges = descriptionOfChallenges;

        return result;
    }

    private buildCurrentChallengesDescriptionForGivenTeam(team:Team):any[] {
        var descriptionOfChallenges:any[] = [];
        var challenges = team.getCurrentChallenges();
        for (var challengeIndex in challenges) {
            var currentChallengeID = challenges[challengeIndex];
            var currentChallenge = this.teamChallengeRepository.getChallengeByID(currentChallengeID);
            var currentChallengeDesc = currentChallenge.getDataForClient();
            descriptionOfChallenges.push(currentChallengeDesc);
        }

        return descriptionOfChallenges;
    }

    private buildCurrentChallengesDescriptionForGivenUser(user:User):any[] {
        var descriptionOfChallenges:any[] = [];

        var challenges = user.getCurrentChallenges();
        for (var challengeIndex in challenges) {
            var currentChallengeID = challenges[challengeIndex];
            var currentChallenge = this.userChallengeRepository.getChallengeByID(currentChallengeID);
            var currentChallengeDesc = currentChallenge.getDataForClient();
            descriptionOfChallenges.push(currentChallengeDesc);
        }

        return descriptionOfChallenges;
    }

    private buildBadgesDescriptionForGivenTeam(team:Team):any[] {
        var descriptionOfBadges:any[] = [];

        var badges = team.getBadges();

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

    private evaluateChallengeForGivenTeam(team:Team):void {
        var challenges = team.getCurrentChallenges();
        for (var challengeIndex in challenges) {
            var currentChallengeID = challenges[challengeIndex];
            var currentChallenge = this.teamChallengeRepository.getChallengeByID(currentChallengeID);

            this.evaluateTeamChallenge(team, currentChallenge, currentChallengeID);
        }
    }

    evaluateChallengesForGivenUser(user:User):void {
        var challenges = user.getCurrentChallenges();

        for (var challengeIndex in challenges) {
            var currentChallengeID = challenges[challengeIndex];
            var currentChallenge = this.userChallengeRepository.getChallengeByID(currentChallengeID);

            this.evaluateChallenge(user, currentChallenge, currentChallengeID);
        }
    }

    private evaluateTeamChallenge(entity, challengeToEvaluate:TeamChallenge, challengeID) {
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
                                var newChall = self.createUserChallenge(entity, challengeToEvaluate.getGoal().getUUID(), challengeToEvaluate.getEndDate());
                                this.addBadge(challengeID, entity.getUUID());
                                if (newChall != null) {
                                    self.evaluateChallenge(entity, newChall, newChall.getID());
                                }
                            }
                            console.log("All data were retrieve properly");
                            return challengeToEvaluate;
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
                console.log("Le challenge doit démarrer");
                challengeToEvaluate.setStatus(ChallengeStatus.RUN);
            }


            var result:any = challengeToEvaluate.evaluate(this.jsonStub);


            console.log("RESULT", result);

            //  Check if the challenge is achieved and finished
            if (result.achieved && result.finished) {
                console.log("Le challenge est réussi et terminé");

                //  Add finished badge to current user
                this.addFinishedBadge(challengeID, entity.getUUID());

                /*
                 //  Build the new challenge (recurring) and evaluate it
                 var newChallenge = self.createTeamChallenge(entity.getUUID(), challengeToEvaluate.getGoal().getUUID(), challengeToEvaluate.getEndDate());
                 if (newChallenge != null) {
                 self.evaluateTeamChallenge(entity, newChallenge, newChallenge.getID());
                 }
                 */
            }

            //  Check if the challenge is not achieved but finished
            else if (!result.achieved && result.finished) {
                console.log("Le challenge est FAIL et terminé");

                entity.deleteChallenge(challengeToEvaluate.getID());

                /*
                 //  Build the new challenge (recurring) and evaluate it
                 var newChallenge = self.createTeamChallenge(entity.getUUID(), challengeToEvaluate.getGoal().getUUID(), challengeToEvaluate.getEndDate());
                 if (newChallenge != null) {
                 self.evaluateTeamChallenge(entity, newChallenge, newChallenge.getID());
                 }
                 */
            }

            return challengeToEvaluate;
        }
    }


    private evaluateChallenge(entity, challengeToEvaluate:UserChallenge, challengeID) {
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
                                var newChall = self.createUserChallenge(entity, challengeToEvaluate.getGoal().getUUID(), challengeToEvaluate.getEndDate());
                                this.addBadge(challengeID, entity.getUUID());
                                if (newChall != null) {
                                    self.evaluateChallenge(entity, newChall, newChall.getID());
                                }
                            }
                            console.log("All data were retrieve properly");
                            return challengeToEvaluate;
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
                console.log("Le challenge doit démarrer");
                challengeToEvaluate.setStatus(ChallengeStatus.RUN);
            }


            var result:any = challengeToEvaluate.evaluate(this.jsonStub);


            //  Check if the challenge is achieved and finished
            if (challengeToEvaluate.getStatus() == ChallengeStatus.SUCCESS) {
                console.log("Le challenge est réussi et terminé");


                if(challengeToEvaluate.isAPersonalChallenge()) {
                    //  Add finished badge to current user
                    this.addFinishedBadge(challengeID, entity.getUUID());
                }
                entity.deleteChallenge(challengeToEvaluate.getID());


                //  Build the new challenge (recurring) and evaluate it
                var newChallenge = self.createUserChallenge(entity.getUUID(), challengeToEvaluate.getGoal().getUUID(), challengeToEvaluate.getEndDate());
                if (newChallenge != null) {
                    self.evaluateChallenge(entity, newChallenge, newChallenge.getID());
                }
            }

            //  Check if the challenge is not achieved but finished
            else if (challengeToEvaluate.getStatus() == ChallengeStatus.FAIL) {
                console.log("Le challenge est FAIL et terminé");

                entity.deleteChallenge(challengeToEvaluate.getID());

                //  Build the new challenge (recurring) and evaluate it
                var newChallenge = self.createUserChallenge(entity.getUUID(), challengeToEvaluate.getGoal().getUUID(), challengeToEvaluate.getEndDate());
                if (newChallenge != null) {
                    self.evaluateChallenge(entity, newChallenge, newChallenge.getID());
                }
            }

            return challengeToEvaluate;
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
        var badgeID = this.userChallengeRepository.getBadgeByChallengeID(challengeID);
        user.addBadge(badgeID);
        user.deleteChallenge(challengeID);
    }


    createUserChallenge(userID:string, goalID:string, date:moment.Moment):UserChallenge {

        var user:User = this.userRepository.getUser(userID);
        var goal:Goal = this.goalRepository.getGoal(goalID);

        var newChallenge = user.addChallenge(goal, date);

        if (newChallenge == null) {
            return null;
        }

        this.userChallengeRepository.addUserChallenge(newChallenge);
        return newChallenge;
    }

    createTeamChallenge(teamID:string, goalID:string, date:moment.Moment) {

        var team:Team = this.teamRepository.getTeam(teamID);
        var goal:Goal = this.goalRepository.getGoal(goalID);


        var newChallenge = team.addChallenge(goal, this.userChallengeRepository, date);

        if (newChallenge == null) {
            return null;
        }

        this.teamChallengeRepository.addTeamChallenge(newChallenge);
        return newChallenge;
    }


    checkTeamID(teamID):Team {
        var currentTeam:Team = this.teamRepository.getTeam(teamID);
        if (currentTeam == null) {
            throw new BadArgumentException('Given team can not be found');
        }

        return currentTeam;
    }

    checkUserID(userID):User {

        var currentUser:User = this.userRepository.getUser(userID);

        if (currentUser == null) {
            throw new BadArgumentException('Given username can not be found');
        }

        return currentUser;
    }

    checkUserProfile(username):User {

        if (!username) {
            throw new BadRequestException('Field username is missing in request');
        }

        var currentUser:User = this.userRepository.getUserByName(username);
        if (currentUser == null) {
            throw new BadArgumentException('Given username can not be found');
        }

        return currentUser;
    }
}

export = DashboardRouter;