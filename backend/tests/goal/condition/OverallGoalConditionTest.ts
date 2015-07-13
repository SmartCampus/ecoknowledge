/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />
/// <reference path="../../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;

import GoalCondition = require('../../../src/goal/condition/GoalCondition');
import OverallGoalCondition = require('../../../src/goal/condition/OverallGoalCondition');
import Operand = require('../../../src/goal/condition/Operand');
import TimeBox = require('../../../src/TimeBox');
import TimeBoxFactory = require('../../../src/TimeBoxFactory');

describe('Test OverallGoalCondition', () => {

    var overallGoalCondition:OverallGoalCondition;

    var condition:GoalCondition;

    var leftOperand:Operand = new Operand('TMP_Cli', true);
    var rightOperand:Operand = new Operand('15', false);
    var typeOfComparison:string = '>';
    var description:string = 'un test';

    it('should return false if min threshold is absolutely not reached', () => {
        condition = new GoalCondition(leftOperand, typeOfComparison, rightOperand, description);
        overallGoalCondition = new OverallGoalCondition(condition, 80);

        var data:any = {};

        var values:number[] = [10, 10, 10, 10, 10, 16, 18];
        data['TMP_Cli'] = values;

        chai.expect(overallGoalCondition.evaluate(data)).to.be.false;
    });

    it('should return false if min threshold is not reached', () => {
        condition = new GoalCondition(leftOperand, typeOfComparison, rightOperand, description);
        overallGoalCondition = new OverallGoalCondition(condition, 80);

        var data:any = {};

        var values:number[] = [18, 18, 18, 18, 18, 18, 18, 10, 10, 10];
        data['TMP_Cli'] = values;

        chai.expect(overallGoalCondition.evaluate(data)).to.be.false;
    });

    it('should return true if min threshold is just reached', () => {
        condition = new GoalCondition(leftOperand, typeOfComparison, rightOperand, description);
        overallGoalCondition = new OverallGoalCondition(condition, 80);

        var data:any = {};

        var values:number[] = [18, 18, 18, 18, 18, 18, 18, 18, 10, 10];
        data['TMP_Cli'] = values;

        chai.expect(overallGoalCondition.evaluate(data)).to.be.true;
    });

    it('should return true if min threshold is reached', () => {
        condition = new GoalCondition(leftOperand, typeOfComparison, rightOperand, description);
        overallGoalCondition = new OverallGoalCondition(condition, 80);

        var data:any = {};

        var values:number[] = [18, 18, 18, 18, 18, 18, 18, 18, 18, 18];
        data['TMP_Cli'] = values;

        chai.expect(overallGoalCondition.evaluate(data)).to.be.true;
    });
});