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

import UserChallengeRepository = require('../../src/challenge/UserChallengeRepository');
import UserChallengeFactory = require('../../src/challenge/UserChallengeFactory');
import UserChallenge = require('../../src/challenge/UserChallenge');

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
import LoginRouter = require('../../src/api/LoginRouter');
import Context = require('../../src/Context');

describe('UserChallenge integration test', () => {

    //  Important ! Allow us to set time
    DashboardRouter.DEMO = true;

    var context:Context = new Context('./db_test.json', './stub_values_test.json');


    var dashboardRouter:DashboardRouter = new DashboardRouter(context, null);
    var loginRouter:LoginRouter = new LoginRouter(context);

    var aUsername:string = 'Charlie';
    var aGoalID:string = '9bddaf87-5065-4df7-920a-d1d249c9171d';


    var requestForLogin:any = {
        username: aUsername
    };

    describe('Connection', () => {
        context.loadData();

        it('should have proper id', () => {
            var token:string = loginRouter.checkUserProfile(requestForLogin).getUUID();
            var expected:string = '2cf91e02-a320-4766-aa9f-6efce3142d44';
            chai.expect(token).to.be.eq(expected);
        });
    });

    describe('Take a challenge', () => {


        var user = loginRouter.checkUserProfile(requestForLogin);
        var token:string = user.getUUID();

        beforeEach(() => {
            user.wipeCurrentChallenges();
        });

        it('should not throw', () => {
            dashboardRouter.createChallenge(token, aGoalID, Clock.getMomentFromString("2015-08-05T12:15:00"));
        });

        it('should have added given challenge to current user', () => {
            var challenge = dashboardRouter.createChallenge(token, aGoalID,Clock.getMomentFromString("2015-08-05T12:15:00"));
            var expected = [challenge.getId()];
            var result = user.getCurrentChallenges();
            chai.expect(result).to.be.eqls(expected);
        });

        it('should have initialized the new challenge status to "RUN" when challenge is created during a working week', () => {
            var newChallenge = dashboardRouter.createChallenge(token, aGoalID, Clock.getMomentFromString("2015-08-05T12:15:00"));
            chai.expect(newChallenge.getStatus()).to.be.eq(ChallengeStatus.RUN);
        });

        it('should have initialized the new challenge status to "WAITING" when challenge is created during week-end', () => {
            var newChallenge = dashboardRouter.createChallenge(token, aGoalID, Clock.getMomentFromString("2015-08-08T12:15:00"));
            chai.expect(newChallenge.getStatus()).to.be.eq(ChallengeStatus.WAIT);
        });

        it('should have set the startDate to monday if goal is "week recurrent"', () => {
            var newChallenge = dashboardRouter.createChallenge(token, aGoalID, Clock.getMomentFromString("2015-08-07T12:15:00"));
            chai.expect(newChallenge.getStartDate().toISOString()).to.be.eq(Clock.getMomentFromString("2015-08-03T00:00:00.000").toISOString());
        });

        it('should have set the endDate to friday if goal is "week recurrent"', () => {
            var newChallenge = dashboardRouter.createChallenge(token, aGoalID, Clock.getMomentFromString("2015-08-07T12:15:00"));
            chai.expect(newChallenge.getEndDate().toISOString()).to.be.eq(Clock.getMomentFromString("2015-08-07T23:59:59.999").toISOString());
        });
    });

    describe('Evaluate a challenge', () => {
        var user = loginRouter.checkUserProfile(requestForLogin);
        var challenge = dashboardRouter.createChallenge(user.getUUID(), aGoalID, Clock.getMomentFromString("2015-08-03T12:15:00"));
        var result:any = dashboardRouter.evaluateChallengesForGivenUser(user);

    });
});