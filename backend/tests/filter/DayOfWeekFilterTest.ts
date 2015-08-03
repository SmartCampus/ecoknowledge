/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />
/// <reference path="../../typings/sinon/sinon.d.ts" />
/// <reference path="../../typings/node/node.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;

import DayOfWeekFilter = require('../../src/filter/DayOfWeekFilter');
import DayFilter = require('../../src/filter/daysOfWeek/DayFilter');
import BadArgumentException = require('../../src/exceptions/BadArgumentException');

describe('PeriodOfDayFilter test', () => {

    describe('Test constructor', () => {
        var aNameThatDoesntExist:string = 'pouet';
        var filter:DayOfWeekFilter;

        chai.expect(() => {
            filter = new DayOfWeekFilter(aNameThatDoesntExist);
        }).to.throw(BadArgumentException);
    });

    describe('Test an "all" filter', () => {
        var aTimeOfDay:string = 'all';
        var filter:DayOfWeekFilter = new DayOfWeekFilter(aTimeOfDay);

        it('should build the proper type of filter', () => {
            chai.expect(filter.getInternalFilter().constructor.name).to.be.eq('DayFilter');
        });

        it('should build the filter with proper parameters', () => {
            chai.expect(filter.getFilterTimeIntervals()).to.be.eqls([0, 6]);
        });
    });

    describe('Test an "week-end" filter', () => {
        var aTimeOfDay:string = 'week-end';
        var filter:DayOfWeekFilter = new DayOfWeekFilter(aTimeOfDay);

        it('should build the proper type of filter', () => {
            chai.expect(filter.getInternalFilter().constructor.name).to.be.eq('DayFilter');
        });

        it('should build the filter with proper parameters', () => {
            chai.expect(filter.getFilterTimeIntervals()).to.be.eqls([5, 6]);
        });
    });

    describe('Test an "working-week" filter', () => {
        var aTimeOfDay:string = 'working-week';
        var filter:DayOfWeekFilter = new DayOfWeekFilter(aTimeOfDay);

        it('should build the proper type of filter', () => {
            chai.expect(filter.getInternalFilter().constructor.name).to.be.eq('DayFilter');
        });

        it('should build the filter with proper parameters', () => {
            chai.expect(filter.getFilterTimeIntervals()).to.be.eqls([0, 4]);
        });
    });
});