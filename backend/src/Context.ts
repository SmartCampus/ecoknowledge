import BadgeRepository = require('./badge/BadgeRepository');
import BadgeFactory = require('./badge/BadgeFactory');

import GoalRepository = require('./goal/GoalRepository');
import GoalFactory = require('./goal/GoalFactory');

import UserChallengeRepository = require('./challenge/UserChallengeRepository');
import UserChallengeFactory = require('./challenge/UserChallengeFactory');

import UserRepository = require('./user/UserRepository');
import UserFactory = require('./user/UserFactory');
import User = require('./user/User');

import TeamRepository = require('./user/TeamRepository');
import TeamFactory = require('./user/TeamFactory');

import Clock = require('./Clock');


import StoringHandler = require('./StoringHandler');

class Context {


    private _badgeRepository:BadgeRepository;
    private _badgeFactory:BadgeFactory;

    private _goalRepository:GoalRepository;
    private _goalFactory:GoalFactory;

    private _userChallengeRepository:UserChallengeRepository;
    private _userChallengeFactory:UserChallengeFactory;

    private _userRepository:UserRepository;
    private _userFactory:UserFactory;

    private _teamRepository:TeamRepository;
    private _teamFactory:TeamFactory;

    private storingHandler:StoringHandler;

    private _pathToFileToLoad:string;
    private _pathToStubFile:string;

    constructor(pathToFileToLoad:string, pathToStubFile:string = null) {
        this._pathToFileToLoad = pathToFileToLoad;
        this._pathToStubFile = pathToStubFile;

        this._userRepository = new UserRepository();

        this._badgeRepository = new BadgeRepository();
        this._badgeFactory = new BadgeFactory();

        this._goalRepository = new GoalRepository(this._badgeRepository);
        this._goalFactory = new GoalFactory();

        this._userChallengeRepository = new UserChallengeRepository();
        this._userChallengeFactory = new UserChallengeFactory();

        this._userRepository = new UserRepository();
        this._userFactory = new UserFactory();

        this._teamRepository = new TeamRepository();
        this._teamFactory = new TeamFactory();

        this.storingHandler = new StoringHandler(this);
    }

    loadData() {
        var data = this.storingHandler.load(this._pathToFileToLoad);
        this.fillRepositories(data);
    }

    saveData(successFunc:Function, failFunc:Function) {
        this.storingHandler.save(this._pathToFileToLoad, successFunc, failFunc);
    }

    fillRepositories(data) {
        //console.log("___________________________________________________________");

        this.fillGoalDefinitionRepository(data);
        //this._goalRepository.displayShortState();

        this.fillBadgesRepository(data);
        //this._badgeRepository.displayShortState();

        this.fillUsersRepository(data);
        //this._userRepository.displayShortState();

        this.fillTeamRepository(data);
        //this._teamRepository.displayShortState();

        this.fillChallengesRepository(data);
        //this._userChallengeRepository.displayShortState();

        //console.log("___________________________________________________________");

        return {success: '+++\tRepositories filled correctly\t+++'};
    }

    fillGoalDefinitionRepository(data) {
        var goalDefinitions = data.definitions;

        for (var currentGoalDefinitionIndex in goalDefinitions) {
            var currentGoalDefinition = goalDefinitions[currentGoalDefinitionIndex];
            var currentGoal = this._goalFactory.createGoal(currentGoalDefinition);
            this._goalRepository.addGoal(currentGoal);
        }
    }

    fillBadgesRepository(data) {
        var badges = data.badges;

        for (var currentBadgeIndex in badges) {
            var currentBadgeDescription = badges[currentBadgeIndex];
            this._badgeRepository.addBadge(this._badgeFactory.createBadge(currentBadgeDescription));
        }
    }

    fillUsersRepository(data) {
        var users = data.users;

        for (var currentUserIndex in users) {
            var currentUserDescription = users[currentUserIndex];
            var currentUser = this._userFactory.createUser(currentUserDescription, this._userChallengeFactory);
            this._userRepository.addUser(currentUser);
            this._userRepository.setCurrentUser(currentUser);
        }
    }

    fillTeamRepository(data) {
        var teams = data.teams;

        for (var currentTeamIndex in teams) {
            var currentTeamDescription = teams[currentTeamIndex];
            var currentTeam = this._teamFactory.createTeam(currentTeamDescription, this._userRepository);
            this._teamRepository.addTeam(currentTeam);
        }

    }

    fillChallengesRepository(data) {
        var challenges = data.challenges;
        this.fillUserChallengeRepository(challenges);
    }

    fillUserChallengeRepository(data) {
        var challenges = data.userChallenges;

        for (var currentChallengeIndex = 0; currentChallengeIndex < challenges.length; currentChallengeIndex++) {
            var currentChallengeDescription = challenges[currentChallengeIndex];

            var currentChallenge = this._userChallengeFactory.restoreChallenge(currentChallengeDescription, this._goalRepository, this._userRepository, Clock.getMoment(Clock.getNow()));

            this._userChallengeRepository.addGoalInstance(currentChallenge);
        }
    }

    public getBadgeRepository():BadgeRepository {
        return this._badgeRepository;
    }

    public getBadgeFactory():BadgeFactory {
        return this._badgeFactory;
    }

    public getGoalRepository():GoalRepository {
        return this._goalRepository;
    }

    public getGoalFactory():GoalFactory {
        return this._goalFactory;
    }

    public getUserChallengeRepository():UserChallengeRepository {
        return this._userChallengeRepository;
    }

    public getUserChallengeFactory():UserChallengeFactory {
        return this._userChallengeFactory;
    }

    public getUserRepository():UserRepository {
        return this._userRepository;
    }

    public getUserFactory():UserFactory {
        return this._userFactory;
    }

    public getTeamRepository():TeamRepository {
        return this._teamRepository;
    }

    public getTeamFactory():TeamFactory {
        return this._teamFactory;
    }

    public getPathToFileToLoad():string {
        return this._pathToFileToLoad;
    }

    public getPathToStubFile():string {
        return this._pathToStubFile;
    }
}

export = Context;