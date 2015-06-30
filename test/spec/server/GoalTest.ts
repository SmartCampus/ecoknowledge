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
   // chai.expect(() => goal = new Goal(null, "", 0)).to.throw(Error);
  });
  it("should throw an error when typeOfComparison given is null", () => {
  //  chai.expect(() => goal = new Goal("", null, 0)).to.throw(Error);
  });

  it("should have given name", () => {
  //  goal = new Goal("aName", "aTypeOfComparison", 0);
   // assert.equal(goal.getName(), "aName");
  });
});



