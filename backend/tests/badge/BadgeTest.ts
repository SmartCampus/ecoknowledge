/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />
/// <reference path="../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;


import Badge = require('../../src/badge/Badge');
import Goal = require('../../src/goal/Goal');
import ValueComparison = require('../../src/goal/condition/ValueComparison');

describe("Badge test", () => {

    var badge:Badge;
    var goal1:Goal, goal2:Goal;
    var goals:Goal[];

    beforeEach(() => {
        goal1  = new Goal("goal1");

       /*

        goal1.addConditionByDescription("Température", 'inf', 40);
        goal1.addConditionByDescription("Température", 'sup', 25);

        goals = [goal1];

        badge = new Badge("aName", "the badge for noobs", 42,goals, ['']);
        */
    });

    /*
    //FIXME test badges became more difficult
    it("should evaluate the badge as OK", () => {
        var values = [[30,30]];
        chai.expect(badge.evaluate(values)).to.be.true;
    });

    it("should evaluate the badge as KO", () => {
        var values = [[30,20]];
        chai.expect(badge.evaluate(values)).to.be.false;
    });
    */

});