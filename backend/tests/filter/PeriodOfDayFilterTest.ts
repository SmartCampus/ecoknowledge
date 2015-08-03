/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />
/// <reference path="../../typings/sinon/sinon.d.ts" />
/// <reference path="../../typings/node/node.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;

import PeriodOfDayFilter = require('../../src/filter/PeriodOfDayFilter');
import DayTimeFilter = require('../../src/filter/periodOfDay/DayTimeFilter');
import BadArgumentException = require('../../src/exceptions/BadArgumentException');

describe('PeriodOfDayFilter test', () => {

    describe('Test constructor', () => {
        var aNameThatDoesntExist:string = 'pouet';
        var filter:PeriodOfDayFilter;

        chai.expect(() => {
            filter = new PeriodOfDayFilter(aNameThatDoesntExist);
        }).to.throw(BadArgumentException);
    });

    describe('Test an "all" filter', () => {
        var aTimeOfDay:string = 'all';
        var filter:PeriodOfDayFilter = new PeriodOfDayFilter(aTimeOfDay);


        it('should build the proper type of filter', () => {
            chai.expect(filter.getInternalFilter().constructor.name).to.be.eq('DayTimeFilter');
        });

        it('should build the filter with proper parameters', () => {
            chai.expect(filter.getFilterTimeIntervals()).to.be.eqls([0, 23]);
        });
    });

    describe('Test an "morning" filter', () => {
        var aTimeOfDay:string = 'morning';
        var filter:PeriodOfDayFilter = new PeriodOfDayFilter(aTimeOfDay);


        it('should build the proper type of filter', () => {
            chai.expect(filter.getInternalFilter().constructor.name).to.be.eq('DayTimeFilter');
        });

        it('should build the filter with proper parameters', () => {
            chai.expect(filter.getFilterTimeIntervals()).to.be.eqls([8, 11]);
        });
    });

    describe('Test an "afternoon" filter', () => {
        var aTimeOfDay:string = 'afternoon';
        var filter:PeriodOfDayFilter = new PeriodOfDayFilter(aTimeOfDay);


        it('should build the proper type of filter', () => {
            chai.expect(filter.getInternalFilter().constructor.name).to.be.eq('DayTimeFilter');
        });

        it('should build the filter with proper parameters', () => {
            chai.expect(filter.getFilterTimeIntervals()).to.be.eqls([12, 18]);
        });
    });

    describe('Test an "night" filter', () => {
        var aTimeOfDay:string = 'night';
        var filter:PeriodOfDayFilter = new PeriodOfDayFilter(aTimeOfDay);


        it('should build the proper type of filter', () => {
            chai.expect(filter.getInternalFilter().constructor.name).to.be.eq('NightTimeFilter');
        });

        it('should build the filter with proper parameters', () => {
            chai.expect(filter.getFilterTimeIntervals()).to.be.eqls([19, 7]);
        });
    });
});