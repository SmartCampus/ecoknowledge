/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />
/// <reference path="../../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;

import GoalCondition = require('../../../src/goal/condition/GoalCondition');
import AverageOnValue = require('../../../src/goal/condition/AverageOnValue');
import Operand = require('../../../src/goal/condition/Operand');
import TimeBox = require('../../../src/TimeBox');
import TimeBoxFactory = require('../../../src/TimeBoxFactory');

describe('Test AverageOnValueTest', () => {

    var averagOnValue:AverageOnValue;

    var condition:GoalCondition;

    var leftOperand:Operand = new Operand('TMP_Cli', true);
    var rightOperand:Operand = new Operand('15', false);
    var typeOfComparison:string = '>';
    var description:string = 'un test';

    var startDate:Date = new Date(Date.UTC(2000, 1, 1));
    var dateOfCreation:Date = new Date(Date.UTC(2000, 1, 7));
    var endDate:Date = new Date(Date.UTC(2000, 1, 14));

    it('should return true if threshold is reached', () => {
        condition = new GoalCondition(leftOperand, typeOfComparison, rightOperand, description);
        averagOnValue = new AverageOnValue(condition,startDate,dateOfCreation, endDate, 10);

        var data:any = {};

        var oldValues:number[] = [100, 101, 99, 102, 98];
        var newValues:number[] = [89, 90, 91,70,110];

        var dataDateDescription:any = {};
        var oldKeyDescription:string = startDate.getTime() + '-' + dateOfCreation.getTime();
        var newKeyDescription:string = dateOfCreation.getTime() + '-' + endDate.getTime();

        dataDateDescription[oldKeyDescription] = oldValues;
        dataDateDescription[newKeyDescription] = newValues;

        data['TMP_Cli'] = dataDateDescription;

        chai.expect(averagOnValue.evaluate(data)).to.be.true;
    });

    it('should return true if threshold is reached with different number of measures', () => {
        condition = new GoalCondition(leftOperand, typeOfComparison, rightOperand, description);
        averagOnValue = new AverageOnValue(condition,startDate,dateOfCreation, endDate, 10);

        var data:any = {};

        var oldValues:number[] = [100, 101, 99, 102, 98];
        var newValues:number[] = [89, 90, 91];

        var dataDateDescription:any = {};
        var oldKeyDescription:string = startDate.getTime() + '-' + dateOfCreation.getTime();
        var newKeyDescription:string = dateOfCreation.getTime() + '-' + endDate.getTime();

        dataDateDescription[oldKeyDescription] = oldValues;
        dataDateDescription[newKeyDescription] = newValues;

        data['TMP_Cli'] = dataDateDescription;

        chai.expect(averagOnValue.evaluate(data)).to.be.true;
    });

    it('should return false if threshold is close but not reached', () => {
        condition = new GoalCondition(leftOperand, typeOfComparison, rightOperand, description);
        averagOnValue = new AverageOnValue(condition,startDate,dateOfCreation, endDate, 10);

        var data:any = {};

        var oldValues:number[] = [100, 101, 99, 102, 98];
        var newValues:number[] = [89, 90, 92];

        var dataDateDescription:any = {};
        var oldKeyDescription:string = startDate.getTime() + '-' + dateOfCreation.getTime();
        var newKeyDescription:string = dateOfCreation.getTime() + '-' + endDate.getTime();

        dataDateDescription[oldKeyDescription] = oldValues;
        dataDateDescription[newKeyDescription] = newValues;

        data['TMP_Cli'] = dataDateDescription;

        chai.expect(averagOnValue.evaluate(data)).to.be.false;
    });

});