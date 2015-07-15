/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />
/// <reference path="../../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;


import GoalDefinition = require('../../../src/goal/definition/GoalDefinition');
import ExpressionHandler = require('../../../src/goal/condition/ExpressionHandler');
import GoalCondition = require('../../../src/goal/condition/GoalCondition');
import OverallGoalCondition = require('../../../src/goal/condition/OverallGoalCondition');
import Operand = require('../../../src/goal/condition/Operand');

describe("Build a goal", function () {
  var goal:GoalDefinition;

  it("should have given name", () => {
    goal = new GoalDefinition("aName",null,null,0);
    assert.equal(goal.getName(), "aName");
  });
});

describe("Add a condition to a goal", () => {
  var goal:GoalDefinition;

  beforeEach(() => {
    goal = new GoalDefinition("aGoal",null,null,0);
  });

  it('should have its own uuid', () => {
    chai.expect(goal.hasUUID(goal.getUUID())).to.be.true;
  });

  it('should be possible to add an expression', () => {
    var comparison:GoalCondition = new GoalCondition(new Operand("Température",true), 'inf', new Operand('10',false), 'desc');
    var expression:OverallGoalCondition = new OverallGoalCondition(comparison,new Date(Date.UTC(2000,10,10)),new Date(Date.UTC(2000,10,15)));
    chai.expect(goal.addCondition(expression)).not.to.throw;
  });
});


