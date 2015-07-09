/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />
/// <reference path="../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;


import User = require('../src/user/User');

describe("Build a User", function () {
  var user:User;

  it("should have given name", () => {
    user = new User("aName");
    assert.equal(user.getName(), "aName");
  });
});

describe("Add a goal", function () {
  var user:User;

  beforeEach(() => {
    user = new User("aName");
  });

  it("should throw an error if given goal is null", () => {
    chai.expect(() => user.addGoal(null)).to.throw(Error);
  });

  it("should add the goal to the user's description", () => {
    /*
    user.addGoalByDescription(new Goal("a", "a", 0));
    chai.expect(user.getGoals().length).to.be.equals(1);
    */
  });
  it("should add the given goal to the user's description", () => {
    /*
    var goal:Goal = new Goal("a", "a", 0);
    user.addGoalByDescription(goal);
    chai.expect(user.getGoals().pop()).to.be.equals(goal);
    */
  });
});

describe("evaluate a goal", function () {
  var user:User;

  beforeEach(() => {
    user = new User("aName");
  });

  it("should return false if given goalName doesn't exist", () => {
   // var goal:Goal = new Goal("a", "inf", 10);
    //user.addGoalByDescription(goal);
    //assert.isFalse(user.evaluateGoal("aNameThatDoesntExist", 0));
  });
});
