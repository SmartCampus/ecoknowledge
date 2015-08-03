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

import Clock = require('../../../src/Clock');

import DayTimeFilter = require('../../../src/filter/periodOfDay/DayTimeFilter');

describe('DayTimeFilter test', () => {

    var startHour = 0,
        endHour = 12,
        anotherHourBetweenStartAndEndDate = 6;

    var filter:DayTimeFilter = new DayTimeFilter(startHour, endHour);

    describe('should filter date', () => {

        it('should filter if equal to start hours', () => {
            var dateString:string = "2005-12-12T12:59:59";
            var date = moment.tz(dateString,Clock.getTimeZone());
            chai.expect(filter.filter(date)).to.be.true;
        });

        it('should filter if perfectly equal to start hours', () => {
            var dateString = "2005-12-01T0"+startHour+":00:00";
            var date = moment.tz(dateString,Clock.getTimeZone());
            chai.expect(filter.filter(date)).to.be.true;
        });

        it('should filter if equal to end hours', () => {
            var dateString = "1985-03-20T"+endHour+":15:40";
            var date = moment.tz(dateString,Clock.getTimeZone());
            chai.expect(filter.filter(date)).to.be.true;
        });

        it('should filter if equal to start hours + 1', () => {
            var dateString = "2005-12-01T0"+(startHour+1)+":05:01";
            var date = moment.tz(dateString,Clock.getTimeZone());
            chai.expect(filter.filter(date)).to.be.true;
        });

        it('should filter if lower than end hours', () => {
            var dateString = "1985-03-20T"+(endHour-1)+":15:40";
            var date = moment.tz(dateString,Clock.getTimeZone());
            chai.expect(filter.filter(date)).to.be.true;
        });

        it('should filter if between specified hours', () => {
            var dateString = "1999-25-01T0"+anotherHourBetweenStartAndEndDate+":50:15";
            var date = moment.tz(dateString,Clock.getTimeZone());
            chai.expect(filter.filter(date)).to.be.true;
        });
    });

    describe('should NOT filter date', () => {


        it('should not filter if lower than start hours', () => {
            var dateString = "2035-12-01T23:59:59+02:00";
            var date = moment.tz(dateString,Clock.getTimeZone());
            chai.expect(filter.filter(date)).to.be.false;
        });

        it('should not filter if higher than end hours', () => {
            var dateString = "1985-03-20T"+(endHour+1)+":15:40";
            var date = moment.tz(dateString,Clock.getTimeZone());
            chai.expect(filter.filter(date)).to.be.false;
        });
    });
});