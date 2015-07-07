/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />
/// <reference path="../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;


import Goal = require('../../src/goal/Goal');
import ExpressionHandler = require('../../src/goal/condition/ExpressionHandler');
import GoalCondition = require('../../src/goal/condition/GoalCondition');
import Operand = require('../../src/goal/condition/Operand');

describe("Build a goal", function () {
  var goal:Goal;

  it("should throw an error when name given is null", () => {
    chai.expect(() => goal = new Goal(null)).to.throw(Error);
  });

  it("should have given name", () => {
    goal = new Goal("aName");
    assert.equal(goal.getName(), "aName");
  });
});

describe("Add a condition to a goal", () => {
  var goal:Goal;

  beforeEach(() => {
    goal = new Goal("aGoal");
  });

  it('should have its own uuid', () => {
    chai.expect(goal.hasUUID(goal.getUUID())).to.be.true;
  });

  it('should be possible to add an expression', () => {
    var comparison:GoalCondition = new GoalCondition(new Operand("Température",true), 'inf', new Operand('10',false), 'desc');
    chai.expect(goal.addCondition(comparison)).not.to.throw;
  });
});


