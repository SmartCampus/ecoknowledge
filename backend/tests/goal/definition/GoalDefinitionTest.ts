/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />
/// <reference path="../../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;


import GoalDefinition = require('../../../src/goal/definition/GoalDefinition');
import ExpressionHandler = require('../../../src/goal/condition/ExpressionHandler');
import GoalCondition = require('../../../src/goal/condition/GoalCondition');
import Operand = require('../../../src/goal/condition/Operand');

describe("Build a goal", function () {
  var goal:GoalDefinition;

  it("should throw an error when name given is null", () => {
    chai.expect(() => goal = new GoalDefinition(null)).to.throw(Error);
  });

  it("should have given name", () => {
    goal = new GoalDefinition("aName");
    assert.equal(goal.getName(), "aName");
  });
});

describe("Add a condition to a goal", () => {
  var goal:GoalDefinition;

  beforeEach(() => {
    goal = new GoalDefinition("aGoal");
  });

  it('should have its own uuid', () => {
    chai.expect(goal.hasUUID(goal.getUUID())).to.be.true;
  });

  it('should be possible to add an expression', () => {
    var comparison:GoalCondition = new GoalCondition(new Operand("Température",true), 'inf', new Operand('10',false), 'desc');
    chai.expect(goal.addCondition(comparison)).not.to.throw;
  });
});


