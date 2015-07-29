/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />
/// <reference path="../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;

import GoalCondition = require('../../src/goal/condition/GoalCondition');
import Operand = require('../../src/goal/condition/Operand');
import ExpressionFactory = require('../../src/goal/condition/ExpressionFactory');
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

    var now:number = Date.now();
    var timeBox:TimeBox = new TimeBox(now, now);

    var goalCondition:GoalCondition = new GoalCondition(leftOperand, typeOfComparison,
        rightOperand, description, timeBox);

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

        var goalConditionClone:GoalCondition = expressionFactory.createExpression(expected);

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
            chai.expect(goalConditionClone.isRighOperandRequired()).to.be.eq(rightOperandRequired);
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