/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />
/// <reference path="../../typings/sinon/sinon.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />

var moment = require('moment');

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;

import BadgeRepository = require('../../src/badge/BadgeRepository');
import Badge = require('../../src/badge/Badge');

import ChallengeRepository = require('../../src/challenge/UserChallengeRepository');
import ChallengeFactory = require('../../src/challenge/UserChallengeFactory');
import Challenge = require('../../src/challenge/UserChallenge');

import GoalRepository = require('../../src/goal/GoalRepository');
import Goal = require('../../src/goal/Goal');
import RecurringSession = require('../../src/goal/RecurringSession');

import UserRepository = require('../../src/user/UserRepository');
import TeamRepository = require('../../src/user/TeamRepository');

import User = require('../../src/user/User');

import Clock = require('../../src/Clock');
import ChallengeStatus = require('../../src/Status');

import Middleware = require('../../src/Middleware');

import DashboardRouter = require('../../src/api/DashboardRouter');

describe('UserChallenge integration test', () => {

    //  Important ! Allow us to set time
    DashboardRouter.DEMO = true;

    var badgeRepository:BadgeRepository = new BadgeRepository();
    var challengeRepository:ChallengeRepository = new ChallengeRepository();
    var challengeFactory:ChallengeFactory = new ChallengeFactory();
    var goalRepository:GoalRepository = new GoalRepository(badgeRepository);

    var userRepository:UserRepository = new UserRepository();
    var teamRepository:TeamRepository = new TeamRepository();

    //  Build a default user / current user
    var user:User = new User('Charlie');
    userRepository.addUser(user);
    userRepository.setCurrentUser(user);

    //  Init the router under test
    var dashboardRouter:DashboardRouter = new DashboardRouter(challengeRepository, challengeFactory, goalRepository, userRepository, teamRepository, badgeRepository, new Middleware());

    //  Create a fake badge for fake goal
    var aBadgeName = 'Badge 1';
    var aBadgePoint = 100;
    var aBadge:Badge = new Badge(aBadgeName, aBadgePoint);

    //  Create fake goal
    var aGoalName = 'Objectif 1';
    var startDate:moment.Moment = moment("August 03, 2015 00:00:00");
    var endDate:moment.Moment = moment("September 03, 2015 00:00:00");

    var aGoal = new Goal(aGoalName, startDate, endDate, 5, aBadge.getUuid(), null, new RecurringSession('week'));
    goalRepository.addGoal(aGoal);

    it('should have initialized the new challenge status to "RUN" when challenge is created during a working week', () => {
        var newChallenge = dashboardRouter.createGoalInstance(user, aGoal.getUUID(), moment("2015-08-05T12:15:00+02:00"));
        chai.expect(newChallenge.getStatus()).to.be.eq(ChallengeStatus.RUN);
    });

    it('should have initialized the new challenge status to "WAITING" when challenge is created during week-end', () => {
        //  The goal is recurrent every week (monday-friday). A goal created saturday must be in WAITING status
        var newChallenge = dashboardRouter.createGoalInstance(user, aGoal.getUUID(), moment("2015-08-08T12:15:00+02:00"));
        chai.expect(newChallenge.getStatus()).to.be.eq(ChallengeStatus.WAIT);
    });

    it('should have set the startDate to monday if goal is "week recurrent"', () => {
        var newChallenge = dashboardRouter.createGoalInstance(user, aGoal.getUUID(), moment("2015-08-05T12:15:00+02:00"));
        chai.expect(newChallenge.getStartDate().toISOString()).to.be.eq(startDate.toISOString());
    });

    it('should have set the endDate to friday if goal is "week recurrent"', () => {
        var newChallenge = dashboardRouter.createGoalInstance(user, aGoal.getUUID(), moment("2015-08-07T23:59:59+02:00"));
        chai.expect(newChallenge.getStartDate().toISOString()).to.be.eq(startDate.toISOString());
    });
});