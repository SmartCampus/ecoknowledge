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

import ChallengeRepository = require('../../src/challenge/ChallengeRepository');
import ChallengeFactory = require('../../src/challenge/ChallengeFactory');
import Challenge = require('../../src/challenge/Challenge');

import GoalRepository = require('../../src/goal/GoalRepository');
import Goal = require('../../src/goal/Goal');
import RecurringSession = require('../../src/goal/RecurringSession');

import UserRepository = require('../../src/user/UserRepository');
import User = require('../../src/user/User');

import Clock = require('../../src/Clock');
import ChallengeStatus = require('../../src/Status');

import ChallengeRouter = require('../../src/api/GoalInstanceRouter');

describe('Challenge integration test', () => {

    //  Important ! Allow us to set time
    ChallengeRouter.DEMO = true;

    var badgeRepository:BadgeRepository = new BadgeRepository();
    var challengeRepository:ChallengeRepository = new ChallengeRepository();
    var challengeFactory:ChallengeFactory = new ChallengeFactory();
    var goalRepository:GoalRepository = new GoalRepository(badgeRepository);

    //  Build a default user / current user
    var userRepository:UserRepository = new UserRepository();
    var user:User = new User('Charlie');
    userRepository.addUser(user);
    userRepository.setCurrentUser(user);

    //  Init the router under test
    var challengeRouter:ChallengeRouter = new ChallengeRouter(challengeRepository, challengeFactory, goalRepository, userRepository);

    //  Create a fake badge for fake goal
    var aBadgeName = 'Badge 1';
    var aBadgePoint = 100;
    var aBadge:Badge = new Badge(aBadgeName, aBadgePoint);

    //  Create fake goal
    var aGoalName = 'Objectif 1';
    var startDate:Date = new Date("August 03, 2015 00:00:00");
    var endDate:Date = new Date("September 03, 2015 00:00:00");

    var aGoal = new Goal(aGoalName, startDate, endDate, 5, aBadge.getUuid(), null, new RecurringSession('week'));
    goalRepository.addGoal(aGoal);

    it('should have initialized the new challenge status to "RUN" when challenge is created during a working week', () => {
        var newChallenge = challengeRouter.createGoalInstance(aGoal.getUUID(), new Date("2015-08-05T12:15:00+02:00"));
        chai.expect(newChallenge.getStatus()).to.be.eq(ChallengeStatus.RUN);
    });

    it('should have initialized the new challenge status to "WAITING" when challenge is created during week-end', () => {
        //  The goal is recurrent every week (monday-friday). A goal created saturday must be in WAITING status
        var newChallenge = challengeRouter.createGoalInstance(aGoal.getUUID(), new Date("2015-08-08T12:15:00+02:00"));
        chai.expect(newChallenge.getStatus()).to.be.eq(ChallengeStatus.WAIT);
    });

    it('should have set the startDate to monday if goal is "week recurrent"', () => {
        var newChallenge = challengeRouter.createGoalInstance(aGoal.getUUID(), new Date("2015-08-05T12:15:00+02:00"));
        chai.expect(newChallenge.getStartDate().toISOString()).to.be.eq(startDate.toISOString());
    });

    it('should have set the endDate to friday if goal is "week recurrent"', () => {
        var newChallenge = challengeRouter.createGoalInstance(aGoal.getUUID(), new Date("2015-08-07T23:59:59+02:00"));
        chai.expect(newChallenge.getStartDate().toISOString()).to.be.eq(startDate.toISOString());
    });
});