/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />
/// <reference path="../../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;


import ValueComparison = require('../../../src/goal/condition/ValueComparison');
import BooleanComparison = require('../../../src/goal/condition/BooleanComparison');
import ExpressionHandler = require('../../../src/goal/condition/ExpressionHandler');

describe("ExpressionHandler test", () => {

  var expressionHandler:ExpressionHandler;

  var basicValueComparison:ValueComparison = new ValueComparison("Température", 'inf', 0, 'desc');
  var basicBooleanComparison:BooleanComparison = new BooleanComparison("Door", 'eq', true, 'desc');

  beforeEach(() => {
    expressionHandler = new ExpressionHandler();
  });

  it("Can add an expression", () => {
    expressionHandler.addExpression(basicValueComparison);
    chai.expect(expressionHandler.getExpressions().length).to.be.equals(1);
  });

  it("Can add expressions", () => {
    var i;
    for(i = 0 ; i < 10 ; i ++) {
      expressionHandler.addExpression(basicValueComparison);
    }
    chai.expect(expressionHandler.getExpressions().length).to.be.equals(i);
  });

  it("Return expected required", () => {
    expressionHandler.addExpression(basicValueComparison);

    var expected = [];
    expected.push(basicValueComparison.getRequired());

    chai.expect(expressionHandler.getRequired()).to.be.eql(expected);
  });

  it("Return expected required", () => {
    expressionHandler.addExpression(basicValueComparison);
    expressionHandler.addExpression(basicBooleanComparison);

    var expected = [];
    expected.push(basicValueComparison.getRequired());
    expected.push(basicBooleanComparison.getRequired());

    chai.expect(expressionHandler.getRequired()).to.be.eql(expected);
  });

  it("Evaluate correctly an expression to false", () => {
    expressionHandler.addExpression(basicValueComparison);

    var values = [];
    values.push(3);

    chai.expect(expressionHandler.evaluate(values)).to.be.false;
  });

  it("Evaluate correctly an expression to true", () => {
    expressionHandler.addExpression(basicValueComparison);

    var values = [-2];
    chai.expect(expressionHandler.evaluate(values)).to.be.true;
  });

  it("Evaluate correctly expressions to true", () => {
    var valueComparison1:ValueComparison = new ValueComparison("Température", 'sup', 0,'desc');
    var valueComparison2:ValueComparison = new ValueComparison("Température", 'inf', 10,'desc');
    var valueComparison3:ValueComparison = new ValueComparison("Température", 'eq', 4,'desc');
    var booleanComparison:BooleanComparison = new BooleanComparison("Door", 'eq', true,'desc');
    expressionHandler.addExpression(valueComparison1);
    expressionHandler.addExpression(valueComparison2);
    expressionHandler.addExpression(booleanComparison);
    expressionHandler.addExpression(valueComparison3);

    var values = [3,2,true,4];
    chai.expect(expressionHandler.evaluate(values)).to.be.true;
  });

  it("Evaluate correctly expressions to false", () => {
    var valueComparison1:ValueComparison = new ValueComparison("Température", 'inf', 0,'desc');
    var valueComparison2:ValueComparison = new ValueComparison("Température", 'inf', 10,'desc');
    var valueComparison3:ValueComparison = new ValueComparison("Température", 'eq', 4,'desc');
    var booleanComparison:BooleanComparison = new BooleanComparison("Door", 'eq', true,'desc');
    expressionHandler.addExpression(valueComparison1);
    expressionHandler.addExpression(valueComparison2);
    expressionHandler.addExpression(booleanComparison);
    expressionHandler.addExpression(valueComparison3);

    var values = [3,2,true,4];
    chai.expect(expressionHandler.evaluate(values)).to.be.false;
  });

  it("Should throw an error", () => {
    var valueComparison1:ValueComparison = new ValueComparison("Température", 'inf', 0, 'desc');
    var valueComparison2:ValueComparison = new ValueComparison("Température", 'inf', 10,'desc');
    expressionHandler.addExpression(valueComparison1);
    expressionHandler.addExpression(valueComparison2);

    var values = [3];

    chai.expect(() => expressionHandler.evaluate(values)).to.throw(Error);
  });

});
