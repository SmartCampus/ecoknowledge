/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />
/// <reference path="../../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;

import DayFilter = require('../../../src/filter/daysOfWeek/DayFilter');

describe('DayFilter test', () => {
    var startDay = 1,   //  tuesday
        endDay = 4;     //  friday

    var filter:DayFilter = new DayFilter(startDay, endDay);

    describe('should filter date', () => {

        it('should filter if equal to start day', () => {
            var date:Date = new Date("August 4, 2015 00:00:00");    // it is a tuesday
            chai.expect(filter.filter(date)).to.be.true;
        });

        it('should filter if equal to end day', () => {
            var date:Date = new Date("August 7, 2015 12:12:12");    // it is a friday
            chai.expect(filter.filter(date)).to.be.true;
        });

        it('should filter if between specified day', () => {
            var date:Date = new Date("August 5, 2015 12:12:12");    // it is a wednesday
            chai.expect(filter.filter(date)).to.be.true;
        });
    });

    describe('should NOT filter date', () => {


        it('should not filter if "lower" than start day', () => {
            var date:Date = new Date("August 3, 2015 00:00:00");    // it is a monday
            chai.expect(filter.filter(date)).to.be.false;
        });

        it('should not filter if "higher" than end day', () => {
            var date:Date = new Date("August 8, 2015 12:12:12");    // it is a saturday
            chai.expect(filter.filter(date)).to.be.false;
        });

    });
});