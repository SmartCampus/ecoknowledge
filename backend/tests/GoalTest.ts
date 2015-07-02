/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />
/// <reference path="../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;


import Goal = require('../src/Goal');

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

  it("should throw an error when typeOfComparison given is null", () => {
    chai.expect(() => goal.addConditionByDescription("", null, 0)).to.throw(Error);
  });

  it("should add it to the goal conditions", () => {
    goal.addConditionByDescription("Température", 'sup', 0);
    chai.expect(() => goal.evaluate([5])).not.to.throw(Error);
  });
});


