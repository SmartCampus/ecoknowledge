/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />
/// <reference path="../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;

import GoalExpression = require('../../src/condition/expression/GoalExpression');
import Operand = require('../../src/condition/expression/Operand');
import ExpressionFactory = require('../../src/condition/factory/ExpressionFactory');
import TimeBox = require('../../src/TimeBox');

describe('Test store GoalCondition class', () => {

    var leftOperandName:string = 'leftOperandName';
    var leftOperandRequired:boolean = true;
    var leftOperand:Operand = new Operand(leftOperandName, leftOperandRequired);

    var rightOperandName:string = 'rightOperandName';
    var rightOperandRequired:boolean = false;
    var rightOperand:Operand = new Operand(rightOperandName, rightOperandRequired);

    var typeOfComparison:string = '<';
    var description = 'a desc';

    var now:Date = new Date(Date.now());
    var timeBox:TimeBox = new TimeBox(now, now);

    var goalCondition:GoalExpression = new GoalExpression(leftOperand, typeOfComparison,
        rightOperand, description);

    var expected:any = {
        valueLeft: {
            value: leftOperand.getStringDescription(),
            sensor: leftOperand.hasToBeDefined()
        },
        valueRight: {
            value: rightOperand.getStringDescription(),
            sensor: rightOperand.hasToBeDefined()
        },
        comparison: typeOfComparison,
        description: description,
        timeBox: {
            startDate: now,
            endDate: now
        }
    };

    it('should return the proper json object', () => {
        chai.expect(goalCondition.getDataInJSON()).to.be.eqls(expected);
    });

    describe('build with its own description', () => {
        var expressionFactory:ExpressionFactory = new ExpressionFactory();

        var goalConditionClone:GoalExpression = expressionFactory.createExpression(expected);

        it('should have the same left operand name', () => {
            chai.expect(goalConditionClone.getLeftOperandDescription()).to.be.eq(leftOperandName);
        });

        it('should have the same left operand required', () => {
            chai.expect(goalConditionClone.isLeftOperandRequired()).to.be.eq(leftOperandRequired);
        });

        it('should have the same right operand name', () => {
            chai.expect(goalConditionClone.getRightOperandDescription()).to.be.eq(rightOperandName);
        });

        it('should have the same right operand required', () => {
            chai.expect(goalConditionClone.isRightOperandRequired()).to.be.eq(rightOperandRequired);
        });

        it('should have the same type of comparison', () => {
            chai.expect(goalConditionClone.getComparisonType()).to.be.eq(typeOfComparison);
        });

        it('should have the same description', () => {
            chai.expect(goalConditionClone.getDescription()).to.be.eq(description);
        });

        /*FIXME
        it('should have the same startDate', () => {
            chai.expect(goalConditionClone.getStartDateInMillis()).to.be.eq(now);
        });

        it('should have the same endDate', () => {
            chai.expect(goalConditionClone.getEndDateInMillis()).to.be.eq(now);
        });
        */
    });
});