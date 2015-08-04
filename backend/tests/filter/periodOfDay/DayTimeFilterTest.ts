/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />
/// <reference path="../../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;

import DayTimeFilter = require('../../../src/filter/periodOfDay/DayTimeFilter');

describe('DayTimeFilter test', () => {

    var startHour = 0,
        endHour = 12,
        anotherHourBetweenStartAndEndDate = 6;

    var filter:DayTimeFilter = new DayTimeFilter(startHour, endHour);

    describe('should filter date', () => {

        it('should filter if equal to start hours', () => {
            var date:Date = new Date("December 1, 2035 "+startHour+":59:59");
            chai.expect(filter.filter(date)).to.be.true;
        });

        it('should filter if perfectly equal to start hours', () => {
            var date:Date = new Date("December 1, 2035 "+startHour+":00:00");
            chai.expect(filter.filter(date)).to.be.true;
        });

        it('should filter if equal to end hours', () => {
            var date:Date = new Date("March 20, 1985 "+endHour+":15:40");
            chai.expect(filter.filter(date)).to.be.true;
        });

        it('should filter if equal to start hours + 1', () => {
            var date:Date = new Date("December 1, 2035 "+(startHour+1)+":05:01");
            chai.expect(filter.filter(date)).to.be.true;
        });

        it('should filter if lower than end hours', () => {
            var date:Date = new Date("March 20, 1985 "+(endHour-1)+":15:40");
            chai.expect(filter.filter(date)).to.be.true;
        });

        it('should filter if between specified hours', () => {
            var date:Date = new Date("January 25, 1999 "+anotherHourBetweenStartAndEndDate+":50:15");
            chai.expect(filter.filter(date)).to.be.true;
        });
    });

    describe('should NOT filter date', () => {


        it('should not filter if lower than start hours', () => {
            var date:Date = new Date("December 1, 2035 23:59:59");
            chai.expect(filter.filter(date)).to.be.false;
        });

        it('should not filter if higher than end hours', () => {
            var date:Date = new Date("March 20, 1985 "+(endHour+1)+":15:40");
            chai.expect(filter.filter(date)).to.be.false;
        });

    });
});