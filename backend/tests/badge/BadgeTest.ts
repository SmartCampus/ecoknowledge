/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />
/// <reference path="../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;


import BadgeInstance = require('../../src/badge/BadgeInstance');
import Goal = require('../../src/goal/Goal');
import GoalCondition = require('../../src/goal/condition/GoalCondition');
import Operand = require('../../src/goal/condition/Operand');

describe("Badge test", () => {

    var badge:BadgeInstance;
    var goal1:Goal, goal2:Goal;
    var goals:Goal[];

    beforeEach(() => {
        goal1 = new Goal("goal1");
        goal1.addCondition(new GoalCondition(new Operand('Temperature', true), '<', new Operand('40', false), 'desc'));
        goal1.addCondition(new GoalCondition(new Operand('Temperature', true), '>', new Operand('25', false), 'desc'));

        goals = [goal1];

        badge = new BadgeInstance("aName", "the badge for noobs", 42, goals, null,[{'name':'Temperature','sensor':'AC_443'}, {'name':'Temperature','sensor':'TEMP_443'}]);

    });


    //FIXME test badges became more difficult
    it("should evaluate the badge as OK", () => {
        var values = [[[30, 30]]];
        // chai.expect(badge.evaluate(values)).to.be.true;
    });

    it("should evaluate the badge as KO", () => {
        var values = [[[30, 20]]];
        // chai.expect(badge.evaluate(values)).to.be.false;
    });


});