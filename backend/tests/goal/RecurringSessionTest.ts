/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />
/// <reference path="../../typings/sinon/sinon.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />
/// <reference path="../../typings/node/node.d.ts" />

var moment = require('moment');

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;

import RecurringWeek = require('../../src/goal/RecurringWeek');
import RecurringSession = require('../../src/goal/RecurringSession');

describe('RecurringSession test', () => {
    describe('RecurringWeek period', () => {
        var recurringSession:RecurringSession = new RecurringSession('week');

        it('should be in a session', () => {
            var now:moment.Moment = moment("2015-08-05T19:01:18");  //  It is a wednesday
            chai.expect(recurringSession.isInASession(now)).to.be.true;
        });

        it('should not be in a session', () => {
            var now:moment.Moment = moment("2015-08-08T19:01:18");  //  It is a saturday
            chai.expect(recurringSession.isInASession(now)).to.be.false;
        });

        it('should return the proper current session start', () => {
            var now:moment.Moment = moment("2015-08-05T19:01:18");  //  It is a wednesday
            var previousMonday = moment("2015-08-03T00:00:00");
            chai.expect(recurringSession.getCurrentSessionStart(now).unix()).to.be.eq(previousMonday.unix());
        });

        it('should return the proper current session start if it is the same day', () => {
            var now:moment.Moment = moment("2015-08-03T19:01:18");  //  It is a wednesday
            var previousMonday = moment("2015-08-03T00:00:00");
            chai.expect(recurringSession.getCurrentSessionStart(now).format()).to.be.eq(previousMonday.format());
        });

        it('should return the proper next session start', () => {
            var now:moment.Moment = moment("2015-08-08T19:01:18");  //  It is a wednesday
            var previousMonday = moment("2015-08-10T00:00:00");
            chai.expect(recurringSession.getNextSessionStart(now).format()).to.be.eq(previousMonday.format());
        });


        it('should return the proper next session start when it is not in a session', () => {
            var now:moment.Moment = moment("2015-08-08T19:01:18");  //  It is a wednesday
            var previousMonday = moment("2015-08-10T00:00:00");
            chai.expect(recurringSession.getCurrentSessionStart(now).format()).to.be.eq(previousMonday.format());
        });

        it('should return the proper current session end when it is in a session', () => {
            var now:moment.Moment = moment("2015-08-05T19:01:18");  //  It is a wednesday
            var nextFriday = moment("2015-08-07T23:59:59");
            chai.expect(recurringSession.getCurrentSessionEnd(now).format()).to.be.eq(nextFriday.format())
        });

        it('should return the proper current session end when it is at the end of a session', () => {
            var now:moment.Moment = moment("2015-08-07T19:01:18");  //  It is a wednesday
            var nextFriday = moment("2015-08-07T23:59:59");
            chai.expect(recurringSession.getCurrentSessionEnd(now).format()).to.be.eq(nextFriday.format())
        });

        it('should return the proper next session end when it is not in a session', () => {
            var now:moment.Moment = moment("2015-08-08T19:01:18");  //  It is a wednesday
            var nextFriday = moment("2015-08-14T23:59:59");
            chai.expect(recurringSession.getCurrentSessionEnd(now).format()).to.be.eq(nextFriday.format())
        });

        it('should return the proper next session end when it is in a session', () => {
            var now:moment.Moment = moment("2015-08-05T19:01:18");  //  It is a wednesday
            var nextFriday = moment("2015-08-14T23:59:59");
            chai.expect(recurringSession.getNextSessionEnd(now).format()).to.be.eq(nextFriday.format())
        });
    });

    describe('RecurringDay period', () => {
        var recurringSession:RecurringSession = new RecurringSession('day');

        it('should be in a session', () => {
            var now:moment.Moment = moment("2015-08-05T19:01:18");  //  It is a wednesday
            chai.expect(recurringSession.isInASession(now)).to.be.true;
        });

        it('should not be in a session', () => {
            var now:moment.Moment = moment("2015-08-08T19:01:18");  //  It is a saturday
            chai.expect(recurringSession.isInASession(now)).to.be.false;
        });

        it('should not be in a session when close to the session', () => {
            var now:moment.Moment = moment("2015-08-09T23:59:59");  //  It is a sunday
            chai.expect(recurringSession.isInASession(now)).to.be.false;
        });

        it('should return the proper current session start', () => {
            var now:moment.Moment = moment("2015-08-05T19:01:18");  //  It is a wednesday
            var beginOfTheDay = moment("2015-08-05T00:00:00");
            chai.expect(recurringSession.getCurrentSessionStart(now).unix()).to.be.eq(beginOfTheDay.unix());
        });

        it('should return the proper next session start when in a session', () => {
            var now:moment.Moment = moment("2015-08-05T19:01:18");  //  It is a wednesday
            var previousMonday = moment("2015-08-06T00:00:00");
            chai.expect(recurringSession.getNextSessionStart(now).unix()).to.be.eq(previousMonday.unix());
        });

        it('should return the proper next session start when not in a session', () => {
            var now:moment.Moment = moment("2015-08-08T19:01:18");  //  It is a saturday
            var previousMonday = moment("2015-08-10T00:00:00");

            chai.expect(recurringSession.getNextSessionStart(now).format()).to.be.eq(previousMonday.format());
        });

        it('should return the proper next session start when it is not in a session - saturday', () => {
            var now:moment.Moment = moment("2015-08-08T19:01:18");  //  It is a saturday
            var previousMonday = moment("2015-08-10T00:00:00");
            chai.expect(recurringSession.getCurrentSessionStart(now).unix()).to.be.eq(previousMonday.unix());
        });

        it('should return the proper next session start when it is not in a session - just before next session', () => {
            var now:moment.Moment = moment("2015-08-09T23:59:59");  //  It is a sunday
            var previousMonday = moment("2015-08-10T00:00:00");
            chai.expect(recurringSession.getCurrentSessionStart(now).unix()).to.be.eq(previousMonday.unix());
        });

        it('should return the proper current session end when it is in a session', () => {
            var now:moment.Moment = moment("2015-08-05T19:01:18");  //  It is a wednesday
            var nextFriday = moment("2015-08-05T23:59:59");
            chai.expect(recurringSession.getCurrentSessionEnd(now).format()).to.be.eq(nextFriday.format())
        });

        it('should return the proper current session end when it is at the end of a session', () => {
            var now:moment.Moment = moment("2015-08-05T23:58:59");  //  It is a wednesday
            var nextFriday = moment("2015-08-05T23:59:59");
            chai.expect(recurringSession.getCurrentSessionEnd(now).format()).to.be.eq(nextFriday.format())
        });

        it('should return the proper next session end when it is not in a session', () => {
            var now:moment.Moment = moment("2015-08-08T19:01:18");  //  It is a wednesday
            var nextFriday = moment("2015-08-10T23:59:59");
            chai.expect(recurringSession.getCurrentSessionEnd(now).format()).to.be.eq(nextFriday.format())
        });

        it('should return the proper next session end when it is in a session', () => {
            var now:moment.Moment = moment("2015-08-05T19:01:18");  //  It is a wednesday
            var nextFriday = moment("2015-08-06T23:59:59");
            chai.expect(recurringSession.getNextSessionEnd(now).format()).to.be.eq(nextFriday.format())
        });
    });

    describe('RecurringMonth period', () => {
        var recurringSession:RecurringSession = new RecurringSession('month');

        it('should be in a session', () => {
            var now:moment.Moment = moment("2015-08-05T19:01:18");
            chai.expect(recurringSession.isInASession(now)).to.be.true;
        });

        it('should return the proper current session start', () => {
            var now:moment.Moment = moment("2015-08-05T19:01:18");
            var firstDayOfMonth = moment("2015-08-01T00:00:00");
            chai.expect(recurringSession.getCurrentSessionStart(now).format()).to.be.eq(firstDayOfMonth.format());
        });

        it('should return the proper next session start when in a session', () => {
            var now:moment.Moment = moment("2015-08-05T19:01:18");  //  It is a wednesday
            var previousMonday = moment("2015-09-01T00:00:00");
            chai.expect(recurringSession.getNextSessionStart(now).format()).to.be.eq(previousMonday.format());
        });

        it('should return the proper next session start when not in a session', () => {
            var now:moment.Moment = moment("2015-08-08T19:01:18");  //  It is a saturday
            var previousMonday = moment("2015-09-01T00:00:00");

            chai.expect(recurringSession.getNextSessionStart(now).format()).to.be.eq(previousMonday.format());
        });

        it('should return the proper next session start when it is not in a session - saturday', () => {
            var now:moment.Moment = moment("2015-08-08T19:01:18");  //  It is a saturday
            var previousMonday = moment("2015-08-01T00:00:00");
            chai.expect(recurringSession.getCurrentSessionStart(now).format()).to.be.eq(previousMonday.format());
        });

        it('should return the proper next session start when it is not in a session - just before next session', () => {
            var now:moment.Moment = moment("2015-08-09T23:59:59");  //  It is a sunday
            var previousMonday = moment("2015-08-01T00:00:00");
            chai.expect(recurringSession.getCurrentSessionStart(now).format()).to.be.eq(previousMonday.format());
        });

        it('should return the proper current session end when it is in a session - 31 days', () => {
            var now:moment.Moment = moment("2015-08-05T19:01:18");  //  It is a wednesday
            var nextFriday = moment("2015-08-31T23:59:59");
            chai.expect(recurringSession.getCurrentSessionEnd(now).format()).to.be.eq(nextFriday.format())
        });

        it('should return the proper current session end when it is in a session - 31 days', () => {
            var now:moment.Moment = moment("2015-09-05T19:01:18");  //  It is a wednesday
            var nextFriday = moment("2015-09-30T23:59:59");
            chai.expect(recurringSession.getCurrentSessionEnd(now).format()).to.be.eq(nextFriday.format())
        });

        it('should return the proper current session end when it is at the end of a session', () => {
            var now:moment.Moment = moment("2015-08-31T23:58:59");  //  It is a wednesday
            var nextFriday = moment("2015-08-31T23:59:59");
            chai.expect(recurringSession.getCurrentSessionEnd(now).format()).to.be.eq(nextFriday.format())
        });

        it('should return the proper next session end when it is in a session - 31/30 days', () => {
            var now:moment.Moment = moment("2015-08-05T19:01:18");  //  It is a wednesday
            var nextFriday = moment("2015-09-30T23:59:59");
            chai.expect(recurringSession.getNextSessionEnd(now).format()).to.be.eq(nextFriday.format())
        });

        it('should return the proper next session end when it is in a session - 30/31', () => {
            var now:moment.Moment = moment("2015-09-01T19:01:18");  //  It is a wednesday
            var nextFriday = moment("2015-10-31T23:59:59");
            chai.expect(recurringSession.getNextSessionEnd(now).format()).to.be.eq(nextFriday.format())
        });
    });
});