/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />
/// <reference path="../../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;


import ValueComparison = require('../../../server/ValueComparison');

describe("Evaluate an 'value' expression like X < 20", () => {
  describe("Evaluate an expression with inf", () => {
    var expression:ValueComparison;

    beforeEach(() => {
      expression = new ValueComparison("Température", "inf", 10);
    });

    it("should return true if given parameter value is lower than the goalValue", () => {
      assert.isTrue(expression.evaluate(5));
    });
    it("should return false if given parameter value is greater than the goalValue", () => {
      assert.isFalse(expression.evaluate(11));
    });
    it("should return true if given parameter value is equal to the goalValue", () => {
      assert.isTrue(expression.evaluate(10));
    });
  });

  describe("Evaluate an expression with sup", () => {
    var goal:ValueComparison;

    beforeEach(() => {
      goal = new ValueComparison("Température", "sup", 10);
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

  describe("Evaluate an expression with eq", () => {
    var goal:ValueComparison;

    beforeEach(() => {
      goal = new ValueComparison("Température", "eq", 10);
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

  describe("Evaluate an expression with dif", () => {
    var goal:ValueComparison;

    beforeEach(() => {
      goal = new ValueComparison("Température", "dif", 10);
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
});


import BooleanComparison = require('../../../server/BooleanComparison');

describe("Evaluate a boolean check like door == false", () => {
  describe("Evaluate a check with eq", () => {
    var goal:BooleanComparison;

    beforeEach(() => {
      goal = new BooleanComparison("Porte", "eq", true);
    });

    it("should return true if given parameter value is true", () => {
      assert.isTrue(goal.evaluate(true));
    });
    it("should return false if given parameter value is false", () => {
      assert.isFalse(goal.evaluate(false));
    });
  });

  describe("Evaluate a check with dif", () => {
    var goal:BooleanComparison;

    beforeEach(() => {
      goal = new BooleanComparison("Porte", "dif", false);
    });

    it("should return true if given parameter value is true", () => {
      assert.isTrue(goal.evaluate(true));
    });
    it("should return false if given parameter value is false", () => {
      assert.isFalse(goal.evaluate(false));
    });
  });
});
