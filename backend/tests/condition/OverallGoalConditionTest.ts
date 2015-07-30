/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />
/// <reference path="../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;

import GoalExpression = require('../../src/condition/expression/GoalExpression');
import OverallGoalCondition = require('../../src/condition/OverallGoalCondition');
import Operand = require('../../src/condition/expression/Operand');
import TimeBox = require('../../src/TimeBox');
import Clock = require('../../src/Clock');
import TimeBoxFactory = require('../../src/TimeBoxFactory');

describe('Test OverallGoalCondition', () => {

    var overallGoalCondition:OverallGoalCondition;

    var condition:GoalExpression;

    var leftOperand:Operand = new Operand('TMP_Cli', true);
    var rightOperand:Operand = new Operand('15', false);
    var typeOfComparison:string = '>';
    var description:string = 'un test';

    var startDate:Date = new Date(Date.UTC(2000,1,1));
    var endDate:Date = new Date(Date.UTC(2000,8,1));

    it('should return false if min threshold is absolutely not reached', () => {
        condition = new GoalExpression(leftOperand, typeOfComparison, rightOperand, description);
        overallGoalCondition = new OverallGoalCondition(null, condition, 80, startDate, new Date(Clock.getNow()), endDate);

        var data:any = {};

        var values:any[] = [
            {date:null,value:10},
            {date:null,value:10},
            {date:null,value:10},
            {date:null,value:10},
            {date:null,value:10},
            {date:null,value:16},
            {date:null,value:18}
        ];

        var valuesDesc:any = {};
        valuesDesc['values'] = values;

        data['TMP_Cli'] = valuesDesc;

        chai.expect(overallGoalCondition.evaluate(data)).to.be.false;
    });

    it('should return false if min threshold is not reached', () => {
        condition = new GoalExpression(leftOperand, typeOfComparison, rightOperand, description);
        overallGoalCondition = new OverallGoalCondition(null, condition, 80, startDate, new Date(Clock.getNow()), endDate);

        var data:any = {};
        var values:any[] = [
            {date:null,value:18},
            {date:null,value:18},
            {date:null,value:18},
            {date:null,value:18},
            {date:null,value:18},
            {date:null,value:18},
            {date:null,value:18},
            {date:null,value:10},
            {date:null,value:10},
            {date:null,value:10}
        ];

        var valuesDesc:any = {};
        valuesDesc['values'] = values;

        data['TMP_Cli'] = valuesDesc;
        chai.expect(overallGoalCondition.evaluate(data)).to.be.false;
    });

    it('should return true if min threshold is just reached', () => {
        condition = new GoalExpression(leftOperand, typeOfComparison, rightOperand, description);
        overallGoalCondition = new OverallGoalCondition(null, condition, 50, startDate, new Date(Clock.getNow()), endDate);

        var data:any = {};

        var values:any[] = [
            {date:null,value:17},
            {date:null,value:16},
            {date:null,value:16},
            {date:null,value:17},
            {date:null,value:18},
            {date:null,value:19},
            {date:null,value:18},
            {date:null,value:17},
            {date:null,value:10},
            {date:null,value:10}
        ];

        var valuesDesc:any = {};
        valuesDesc['values'] = values;

        data['TMP_Cli'] = valuesDesc;
        // FIXME DATE NULL chai.expect(overallGoalCondition.evaluate(data)).to.be.true;
    });

    it('should return true if min threshold is reached', () => {
        condition = new GoalExpression(leftOperand, typeOfComparison, rightOperand, description);
        overallGoalCondition = new OverallGoalCondition(null, condition, 50, startDate, new Date(Clock.getNow()), endDate);

        var data:any = {};

        var values:any[] = [
            {date:null,value:16},
            {date:null,value:17},
            {date:null,value:18},
            {date:null,value:19},
            {date:null,value:18},
            {date:null,value:18},
            {date:null,value:17},
            {date:null,value:18},
            {date:null,value:16},
            {date:null,value:17}
        ];

        var valuesDesc:any = {};
        valuesDesc['values'] = values;

        data['TMP_Cli'] = valuesDesc;

        // FIXME DATE NULL chai.expect(overallGoalCondition.evaluate(data)).to.be.true;
    });
});