/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />
/// <reference path="../../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;

import ExpressionFactory = require('../../../src/goal/condition/ExpressionFactory');
import Expression = require('../../../src/goal/condition/Expression');

describe("ExpressionFactory test", () => {

    var factory:ExpressionFactory = new ExpressionFactory();
    var expression:Expression;

    beforeEach(() => {
        var jsonExpression:any = {};
        jsonExpression.comparison = '<';
        jsonExpression.type = 'number';
        jsonExpression.description = 'description blabla ..';

        jsonExpression.valueLeft = {'value' : 'TEMP_CLI', 'sensor':true};
        jsonExpression.valueRight = {'value' : '15', 'sensor':false};

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
        chai.expect(expression.getRequired()).to.be.eqls({'TEMP_CLI':{}});
    });
});