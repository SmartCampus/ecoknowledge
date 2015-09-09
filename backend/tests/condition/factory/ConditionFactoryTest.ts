/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />
/// <reference path="../../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;

import ExpressionFactory = require('../../../src/condition/factory/ExpressionFactory');
import GoalExpression = require('../../../src/condition/expression/GoalExpression');

describe("ConditionFactory test", () => {

    var factory:ExpressionFactory = new ExpressionFactory();
    var expression:GoalExpression;

    beforeEach(() => {
        var jsonExpression:any = {};
        jsonExpression.comparison = '<';
        jsonExpression.type = 'number';
        jsonExpression.description = 'description blabla ..';

        jsonExpression.valueLeft = {'value' : 'TEMP_CLI', 'symbolicName':true};
        jsonExpression.valueRight = {'value' : '15', 'symbolicName':false};

        expression = factory.createExpression(jsonExpression);

    });


    it("should build an expression with right left operand", () => {
        chai.expect(expression.hasLeftOperand('TEMP_CLI')).to.be.true;
    });

    it("should build an expression with right right operand", () => {
        chai.expect(expression.hasRightOperand('15')).to.be.true;
    });

    it("should build an expression with right comparison type operand", () => {
        chai.expect(expression.getComparisonType()).to.be.eql('<');
    });

    it("should build an expression with right required", () => {
        chai.expect(expression.getRequired()).to.be.eqls(['TEMP_CLI']);
    });
});