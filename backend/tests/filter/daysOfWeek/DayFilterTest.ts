/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />
/// <reference path="../../../typings/sinon/sinon.d.ts" />
/// <reference path="../../../typings/node/node.d.ts" />
/// <reference path="../../../typings/moment/moment.d.ts" />
/// <reference path="../../../typings/moment-timezone/moment-timezone.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;
var moment = require('moment');
var moment_timezone = require('moment-timezone');

import DayFilter = require('../../../src/filter/daysOfWeek/DayFilter');
import Clock = require('../../../src/Clock');

describe('DayFilter test', () => {
    var startDay = 2,   //  tuesday
        endDay = 4;     //  thursday

    var filter:DayFilter = new DayFilter(startDay, endDay);

    describe('should filter date', () => {

        it('should filter if equal to start day', () => {
            var dateString = "2015-08-04T00:00:00";     // it is a tuesday
            var date = moment.tz(dateString, Clock.getTimeZone());
            chai.expect(filter.filter(date)).to.be.true;
        });

        it('should filter if equal to end day', () => {
            var dateString = "2015-08-06T12:12:12";    // it is a thursday
            var date = moment.tz(dateString, Clock.getTimeZone());
            chai.expect(filter.filter(date)).to.be.true;
        });

        it('should filter if between specified day', () => {
            var dateString = "2015-08-05T12:12:12";    // it is a wednesday
            var date = moment.tz(dateString, Clock.getTimeZone());
            chai.expect(filter.filter(date)).to.be.true;
        });
    });

    describe('should NOT filter date', () => {


        it('should not filter if "lower" than start day', () => {
            var dateString = "2015-08-03T00:00:00";    // it is a monday
            var date = moment.tz(dateString, Clock.getTimeZone());
            chai.expect(filter.filter(date)).to.be.false;
        });

        it('should not filter if "higher" than end day', () => {
            var dateString = "2015-08-08T12:12:12";    // it is a saturday
            var date = moment.tz(dateString, Clock.getTimeZone());
            chai.expect(filter.filter(date)).to.be.false;
        });
    });
});