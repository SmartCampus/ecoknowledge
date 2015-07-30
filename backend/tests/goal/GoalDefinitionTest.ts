/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />
/// <reference path="../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;


import Goal = require('../../src/goal/Goal');
import ConditionList = require('../../src/condition/ConditionList');
import GoalExpression = require('../../src/condition/expression/GoalExpression');
import OverallGoalCondition = require('../../src/condition/OverallGoalCondition');
import Operand = require('../../src/condition/expression/Operand');
import Clock = require('../../src/Clock');

describe("Build a goal", function () {
    var goal:Goal;

    it("should have given name", () => {
        goal = new Goal("aName", null, null, 0, null);
        assert.equal(goal.getName(), "aName");
    });
});

describe("Add a condition to a goal", () => {
    var goal:Goal;

    beforeEach(() => {
        goal = new Goal("aGoal", null, null, 0, null);
    });

    it('should have its own uuid', () => {
        chai.expect(goal.hasUUID(goal.getUUID())).to.be.true;
    });

    it('should be possible to add an expression', () => {
        var comparison:GoalExpression = new GoalExpression(new Operand("Température", true), 'inf', new Operand('10', false), 'desc');
        var expression:OverallGoalCondition = new OverallGoalCondition(null, comparison, 0, new Date(Date.UTC(2000, 10, 10)), new Date(Clock.getNow()), new Date(Date.UTC(2000, 10, 15)));
        chai.expect(goal.addCondition(expression)).not.to.throw;
    });
});


