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

describe("GoalInstance test", () => {

    var goalInstance:GoalInstance;
    var goalDefinition:GoalDefinition;

    var aSymbolicName:string = 'Temperature_cli';
    var anotherSymbolicName:string = 'Temperature_ext';

    var aSensorName:string = 'AC_443';
    var anotherSensorName:string = 'TEMP_444';

    beforeEach(() => {
        goalDefinition = new GoalDefinition("goal1");
        goalDefinition.addCondition(new GoalCondition(new Operand(aSymbolicName, true), '<', new Operand('40', false), 'desc'));
        goalDefinition.addCondition(new GoalCondition(new Operand(anotherSymbolicName, true), '>', new Operand('25', false), 'desc'));

        var mapSymbolicNameToSensor:any = {};
        mapSymbolicNameToSensor[aSymbolicName] = aSensorName;
        mapSymbolicNameToSensor[anotherSymbolicName] = anotherSensorName;

         goalInstance = new GoalInstance("the badge for noobs", goalDefinition, mapSymbolicNameToSensor);
    });


    it("should return sensors required correctly", () => {
        var expectedConditionsDescription = {};
        expectedConditionsDescription[aSensorName] = null;
        expectedConditionsDescription[anotherSensorName] = null;

        chai.expect(goalInstance.getSensors()).to.be.eqls(expectedConditionsDescription);
    });

    it("should evaluate the badge as OK", () => {
        var correctValuesDescription = {};
        correctValuesDescription[aSensorName] = 35;
        correctValuesDescription[anotherSensorName] = 27;

        chai.expect(goalInstance.evaluate(correctValuesDescription)).to.be.true;
    });

    it("should evaluate the badge as KO", () => {
        var incorrectValuesDescription = {};
        incorrectValuesDescription[aSensorName] = 35;
        incorrectValuesDescription[anotherSensorName] = 20;

        chai.expect(goalInstance.evaluate(incorrectValuesDescription)).to.be.false;
    });
});