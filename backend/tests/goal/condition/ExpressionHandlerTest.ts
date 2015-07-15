/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />
/// <reference path="../../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;

var merge = require('merge');

import Operand = require('../../../src/goal/condition/Operand');
import GoalCondition = require('../../../src/goal/condition/GoalCondition');
import ExpressionHandler = require('../../../src/goal/condition/ExpressionHandler');

describe("ExpressionHandler test", () => {

    var expressionHandler:ExpressionHandler;

    var basicValueComparison:GoalCondition;
    var basicBooleanComparison:GoalCondition;

    beforeEach(() => {
        expressionHandler = new ExpressionHandler();
        basicValueComparison = new GoalCondition(new Operand("Température", true), '<', new Operand('0', false), 'desc');
        basicBooleanComparison = new GoalCondition(new Operand("Door", true), '==', new Operand('true', false), 'desc');
    });

    it("Can add an expression", () => {
        expressionHandler.addExpression(basicValueComparison);
        chai.expect(expressionHandler.getExpressions().length).to.be.equals(1);
    });

    it("Can add expressions", () => {
        var i;
        for (i = 0; i < 10; i++) {
            expressionHandler.addExpression(basicValueComparison);
        }
        chai.expect(expressionHandler.getExpressions().length).to.be.equals(i);
    });

    it("Return expected required", () => {
        expressionHandler.addExpression(basicValueComparison);
        var expectedConditionRequired = basicValueComparison.getRequired();
        chai.expect(expressionHandler.getRequired()).to.be.eqls(expectedConditionRequired);
    });

    it("Return expected required", () => {
        expressionHandler.addExpression(basicValueComparison);
        expressionHandler.addExpression(basicBooleanComparison);

        var expected:any = merge(basicValueComparison.getRequired(), basicBooleanComparison.getRequired());

        chai.expect(expressionHandler.getRequired()).to.be.eqls(expected);
    });

    it("Evaluate correctly an expression to false", () => {
        expressionHandler.addExpression(basicValueComparison);
        var values = {'Température': {'values':[{date:null,value:'3'}]}};
        chai.expect(expressionHandler.evaluate(values)).to.be.false;
    });

    it("Evaluate correctly an expression to true", () => {
        expressionHandler.addExpression(basicValueComparison);
        var values = {'Température': {'values':[{date:null,value:'-3'}]}};
        chai.expect(expressionHandler.evaluate(values)).to.be.true;
    });

    it("Evaluate correctly expressions to true", () => {
        var valueComparison1:GoalCondition = new GoalCondition(new Operand("Température1", true), '>', new Operand('0', false), 'desc');
        var valueComparison2:GoalCondition = new GoalCondition(new Operand("Température2", true), '<', new Operand('10', false), 'desc');
        var valueComparison3:GoalCondition = new GoalCondition(new Operand("Température3", true), '==', new Operand('4', false), 'desc');
        var booleanComparison:GoalCondition = new GoalCondition(new Operand("Door", true), '==', new Operand('true', false), 'desc');

        expressionHandler.addExpression(valueComparison1);
        expressionHandler.addExpression(valueComparison2);
        expressionHandler.addExpression(booleanComparison);
        expressionHandler.addExpression(valueComparison3);

        var values:any = {
            'Température1': { values: [{date:null,value:'3'}]},
            'Température2': { values: [{date:null,value:'2'}]},
            'Température3': {values : [{date:null,value:'4'}]},
            'Door': {values: [{date:null,value:true}]}
        };

        chai.expect(expressionHandler.evaluate(values)).to.be.true;
    });

    it("Evaluate correctly expressions to false", () => {
        var valueComparison1:GoalCondition = new GoalCondition(new Operand("Température1", true), '<', new Operand('0', false), 'desc');
        var valueComparison2:GoalCondition = new GoalCondition(new Operand("Température2", true), '<', new Operand('10', false), 'desc');
        var valueComparison3:GoalCondition = new GoalCondition(new Operand("Température3", true), '==', new Operand('4', false), 'desc');
        var booleanComparison:GoalCondition = new GoalCondition(new Operand("Door", true), '==', new Operand('true', false), 'desc');

        expressionHandler.addExpression(valueComparison1);
        expressionHandler.addExpression(valueComparison2);
        expressionHandler.addExpression(booleanComparison);
        expressionHandler.addExpression(valueComparison3);


        var values:any = {
            'Température1':{values: [{date:null,value:'3'}]},
            'Température2': {values:[{date:null,value:'2'}]},
            'Température3': {values:[{date:null,value:'4'}]},
            'Door': {values:[{date:null,value:true}]}
        };

        chai.expect(expressionHandler.evaluate(values)).to.be.false;
    });

    /*FIXME
    it("Should throw an error if there is not enough values", () => {
        var valueComparison1:GoalCondition = new GoalCondition(new Operand("Température1", true), '<', new Operand('0', false), 'desc');
        var valueComparison2:GoalCondition = new GoalCondition(new Operand("Température2", true), '<', new Operand('10', false), 'desc');

        expressionHandler.addExpression(valueComparison1);
        expressionHandler.addExpression(valueComparison2);

        var values:any = {'Température1':'-1'};

        chai.expect(() => expressionHandler.evaluate(values)).to.throw(Error);
    });
    */
});
