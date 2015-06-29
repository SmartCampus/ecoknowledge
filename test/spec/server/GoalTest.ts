/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />
/// <reference path="../../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;


import Goal = require('../../../server/Goal');

describe("Build a goal", function () {
  var goal:Goal;

  it("should throw an error when name given is null", () => {
    chai.expect(() => goal = new Goal(null, "", 0)).to.throw(Error);
  });
  it("should throw an error when typeOfComparison given is null", () => {
    chai.expect(() => goal = new Goal("", null, 0)).to.throw(Error);
  });

  it("should have given name", () => {
    goal = new Goal("aName", "aTypeOfComparison", 0);
    assert.equal(goal.getName(), "aName");
  });

  it("should have given typeOfComparison", () => {
    goal = new Goal("aName", "aTypeOfComparison", 0);
    assert.equal(goal.getTypeOfComparison(), "aTypeOfComparison");
  });

  it("should have given value", () => {
    goal = new Goal("aName", "aTypeOfComparison", 0);
    assert.equal(goal.getValue(),  0);
  });
});

describe("Evaluate a goal with inf", () => {
  var goal:Goal;

  beforeEach(() => {
    goal = new Goal("aGoalWithInf", "inf", 10);
  });

  it("should return true if given parameter value is lower than the goalValue", () => {
    assert.isTrue(goal.evaluate(5));
  });
  it("should return false if given parameter value is greater than the goalValue", () => {
    assert.isFalse(goal.evaluate(11));
  });
  it("should return true if given parameter value is equal to the goalValue", () => {
    assert.isTrue(goal.evaluate(10));
  });
});

describe("Evaluate a goal with sup", () => {
  var goal:Goal;

  beforeEach(() => {
    goal = new Goal("aGoalWithSup", "sup", 10);
  });

  it("should return true if given parameter value is greater than the goalValue", () => {
    assert.isTrue(goal.evaluate(11));
  });
  it("should return false if given parameter value is lower than the goalValue", () => {
    assert.isFalse(goal.evaluate(5));
  });
  it("should return true if given parameter value is equal to the goalValue", () => {
    assert.isTrue(goal.evaluate(10));
  });
});

describe("Evaluate a goal with eq", () => {
  var goal:Goal;

  beforeEach(() => {
    goal = new Goal("aGoalWithEq", "eq", 10);
  });

  it("should return false if given parameter value is greater than the goalValue", () => {
    assert.isFalse(goal.evaluate(11));
  });
  it("should return false if given parameter value is lower than the goalValue", () => {
    assert.isFalse(goal.evaluate(5));
  });
  it("should return true if given parameter value is equal to the goalValue", () => {
    assert.isTrue(goal.evaluate(10));
  });
});

describe("Evaluate a goal with dif", () => {
  var goal:Goal;

  beforeEach(() => {
    goal = new Goal("aGoalWithDif", "dif", 10);
  });

  it("should return true if given parameter value is greater than the goalValue", () => {
    assert.isTrue(goal.evaluate(11));
  });
  it("should return true if given parameter value is lower than the goalValue", () => {
    assert.isTrue(goal.evaluate(5));
  });
  it("should return false if given parameter value is equal to the goalValue", () => {
    assert.isFalse(goal.evaluate(10));
  });
});


