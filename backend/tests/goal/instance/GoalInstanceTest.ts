/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />
/// <reference path="../../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;

import GoalInstance = require('../../../src/goal/instance/GoalInstance');
import GoalDefinition = require('../../../src/goal/definition/GoalDefinition');
import GoalCondition = require('../../../src/goal/condition/GoalCondition');
import Operand = require('../../../src/goal/condition/Operand');
import AverageOnValue = require('../../../src/goal/condition/AverageOnValue');

describe("GoalInstance test", () => {

    var goalInstance:GoalInstance;
    var goalDefinition:GoalDefinition;

    var aStartDate:Date = new Date(Date.UTC(2000,5,1));
    var aEndDate:Date = new Date(Date.UTC(2000,8,1));

    var aSymbolicName:string = 'Temperature_cli';
    var anotherSymbolicName:string = 'Temperature_ext';

    var aSensorName:string = 'AC_443';
    var anotherSensorName:string = 'TEMP_444';

    var aCondition:GoalCondition = new GoalCondition(new Operand(aSymbolicName, true), '<', new Operand('40', false), 'desc');
    var anotherCondition:GoalCondition = new GoalCondition(new Operand(anotherSymbolicName, true), '>', new Operand('25', false), 'desc')

    var anAverageCondition:AverageOnValue;

    beforeEach(() => {
        goalDefinition = new GoalDefinition("goal1",null,null,100);
        goalDefinition.addCondition(aCondition);
        goalDefinition.addCondition(anotherCondition);

        var mapSymbolicNameToSensor:any = {};
        mapSymbolicNameToSensor[aSymbolicName] = aSensorName;
        mapSymbolicNameToSensor[anotherSymbolicName] = anotherSensorName;

        goalInstance = new GoalInstance(aStartDate, aEndDate, "the badge for noobs", goalDefinition, mapSymbolicNameToSensor);

        //FIXME
        // anAverageCondition = new AverageOnValue(aCondition,<STARTDATE-1month>, goalInstance.getStartDate(), goalInstance.getEndDate());

    });


    it("should return sensors required correctly", () => {
        var expectedConditionsDescription = {};
        expectedConditionsDescription[aSensorName] = null;
        expectedConditionsDescription[anotherSensorName] = null;

        chai.expect(goalInstance.getSensors()).to.be.eqls(expectedConditionsDescription);
    });

    it("should evaluate the goal instance as OK", () => {
        var correctValuesDescription = {};
        var valuesForASensorName = {'values':[{value:35}]};
        correctValuesDescription[aSensorName] = valuesForASensorName;

        var valuesForAnotherSensorName = {'values':[{value:27}]};
        correctValuesDescription[anotherSensorName] = valuesForAnotherSensorName;

        chai.expect(goalInstance.evaluate(correctValuesDescription)).to.be.true;
    });

    it("should evaluate the goal instance as KO", () => {
        var incorrectValuesDescription = {};

        var valuesForASensorName = {'values':[{value:35}]};
        incorrectValuesDescription[aSensorName] = valuesForASensorName;

        var valuesForAnotherSensorName = {'values':[{value:20}]};
        incorrectValuesDescription[anotherSensorName] = valuesForAnotherSensorName;

        chai.expect(goalInstance.evaluate(incorrectValuesDescription)).to.be.false;
    });
});