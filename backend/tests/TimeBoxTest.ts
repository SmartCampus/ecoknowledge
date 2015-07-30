/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />
/// <reference path="../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;

import TimeBox = require('../src/TimeBox');

describe('TimeBox test', () => {
    describe('Is in timebox', () => {
        var timeBox:TimeBox = new TimeBox(new Date(Date.UTC(1993, 5, 5)), new Date(Date.UTC(2025, 5, 5)));

        it('should return true when time given is in the time box', () => {
            var currentTime:Date = new Date(Date.UTC(2000, 2, 2));
            chai.expect(timeBox.isDateInTimeBox(currentTime)).to.be.true;
            chai.expect(timeBox.isDateInMillisInTimeBox(currentTime.getTime())).to.be.true;
        });

        it('should return false when time given is after the time box', () => {
            var currentTime:Date = new Date(Date.UTC(2050, 2, 2));
            chai.expect(timeBox.isDateInTimeBox(currentTime)).to.be.false;
            chai.expect(timeBox.isDateInMillisInTimeBox(currentTime.getTime())).to.be.false;
        });

        it('should return false when time given is after the time box', () => {
            var currentTime:Date = new Date(Date.UTC(1980, 2, 2));
            chai.expect(timeBox.isDateInTimeBox(currentTime)).to.be.false;
            chai.expect(timeBox.isDateInMillisInTimeBox(currentTime.getTime())).to.be.false;
        });
    });
});