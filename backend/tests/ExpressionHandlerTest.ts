/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />
/// <reference path="../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;


import ValueComparison = require('../src/ValueComparison');
import BooleanComparison = require('../src/BooleanComparison');
import ExpressionHandler = require('../src/ExpressionHandler');

describe("ExpressionHandler test", () => {

  var expressionHandler:ExpressionHandler;

  beforeEach(() => {
    expressionHandler = new ExpressionHandler();
  });

  it("Can add an expression", () => {
    expressionHandler.addExpression(new ValueComparison("Température", 'inf', 0));
    chai.expect(expressionHandler.getExpressions().length).to.be.equals(1);
  });

  it("Can add expressions", () => {
    var i;
    for(i = 0 ; i < 10 ; i ++) {
      expressionHandler.addExpression(new ValueComparison("Température", 'inf', 0));
    }
    chai.expect(expressionHandler.getExpressions().length).to.be.equals(i);
  });

  it("Return expected required", () => {
    var valueComparison:ValueComparison = new ValueComparison("Température", 'inf', 0);
    expressionHandler.addExpression(valueComparison);

    var expected = [];
    expected.push(valueComparison.getRequired());

    chai.expect(expressionHandler.getRequired()).to.be.eql(expected);
  });

  it("Return expected required", () => {
    var valueComparison:ValueComparison = new ValueComparison("Température", 'inf', 0);
    var booleanComparison:BooleanComparison = new BooleanComparison("Door", 'eq', false);
    expressionHandler.addExpression(valueComparison);
    expressionHandler.addExpression(booleanComparison);

    var expected = [];
    expected.push(valueComparison.getRequired());
    expected.push(booleanComparison.getRequired());

    chai.expect(expressionHandler.getRequired()).to.be.eql(expected);
  });

  it("Evaluate correctly an expression to false", () => {
    var valueComparison:ValueComparison = new ValueComparison("Température", 'inf', 0);
    expressionHandler.addExpression(valueComparison);

    var values = [];
    values.push(3);

    chai.expect(expressionHandler.evaluate(values)).to.be.false;
  });

  it("Evaluate correctly an expression to true", () => {
    var valueComparison:ValueComparison = new ValueComparison("Température", 'sup', 0);
    expressionHandler.addExpression(valueComparison);

    var values = [3];
    chai.expect(expressionHandler.evaluate(values)).to.be.true;
  });

  it("Evaluate correctly expressions to true", () => {
    var valueComparison1:ValueComparison = new ValueComparison("Température", 'sup', 0);
    var valueComparison2:ValueComparison = new ValueComparison("Température", 'inf', 10);
    var valueComparison3:ValueComparison = new ValueComparison("Température", 'eq', 4);
    var booleanComparison:BooleanComparison = new BooleanComparison("Door", 'eq', true);
    expressionHandler.addExpression(valueComparison1);
    expressionHandler.addExpression(valueComparison2);
    expressionHandler.addExpression(booleanComparison);
    expressionHandler.addExpression(valueComparison3);

    var values = [3,2,true,4];
    chai.expect(expressionHandler.evaluate(values)).to.be.true;
  });

  it("Evaluate correctly expressions to false", () => {
    var valueComparison1:ValueComparison = new ValueComparison("Température", 'inf', 0);
    var valueComparison2:ValueComparison = new ValueComparison("Température", 'inf', 10);
    var valueComparison3:ValueComparison = new ValueComparison("Température", 'eq', 4);
    var booleanComparison:BooleanComparison = new BooleanComparison("Door", 'eq', true);
    expressionHandler.addExpression(valueComparison1);
    expressionHandler.addExpression(valueComparison2);
    expressionHandler.addExpression(booleanComparison);
    expressionHandler.addExpression(valueComparison3);

    var values = [3,2,true,4];
    chai.expect(expressionHandler.evaluate(values)).to.be.false;
  });

});
