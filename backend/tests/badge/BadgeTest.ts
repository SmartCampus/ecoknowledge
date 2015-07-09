/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />
/// <reference path="../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;


import BadgeInstance = require('../../src/badge/BadgeInstance');
import Goal = require('../../src/goal/Goal');
import GoalCondition = require('../../src/goal/condition/GoalCondition');
import Operand = require('../../src/goal/condition/Operand');

describe("Badge test", () => {

    var badge:BadgeInstance;
    var goal1:Goal, goal2:Goal;
    var goals:Goal[];

    var aSymbolicName:string = 'Temperature_cli';
    var anotherSymbolicName:string = 'Temperature_ext';

    var aSensorName:string = 'AC_443';
    var anotherSensorName:string = 'TEMP_444';

    beforeEach(() => {
        goal1 = new Goal("goal1");
        goal1.addCondition(new GoalCondition(new Operand(aSymbolicName, true), '<', new Operand('40', false), 'desc'));
        goal1.addCondition(new GoalCondition(new Operand(anotherSymbolicName, true), '>', new Operand('25', false), 'desc'));

        goals = [goal1];

        var mapGoalToConditionAndSensor:any = {};

        var conditionDescription:any = {};
        conditionDescription[aSymbolicName] = aSensorName;
        conditionDescription[anotherSymbolicName] = anotherSensorName;

        mapGoalToConditionAndSensor[goal1.getUUID()] = conditionDescription;

        badge = new BadgeInstance("aName", "the badge for noobs", 42, goals, null,
            mapGoalToConditionAndSensor);

    });


    it("should return sensors required correctly", () => {
        var expectedDescription:any = {};

        var expectedConditionsDescription = {};
        expectedConditionsDescription[aSensorName] = null;
        expectedConditionsDescription[anotherSensorName] = null;

        expectedDescription[goal1.getUUID()] = expectedConditionsDescription;

        chai.expect(badge.getSensors()).to.be.eqls(expectedDescription);
    });

    it("should evaluate the badge as OK", () => {
        var correctValueDescription:any = {};

        var correctValuesDescription = {};
        correctValuesDescription[aSensorName] = 35;
        correctValuesDescription[anotherSensorName] = 27;

        correctValueDescription[goal1.getUUID()] = correctValuesDescription;

        chai.expect(badge.evaluate(correctValueDescription)).to.be.true;
    });

    it("should evaluate the badge as KO", () => {
        var incorrectValueDescription:any = {};

        var incorrectValuesDescription = {};
        incorrectValuesDescription[aSensorName] = 35;
        incorrectValuesDescription[anotherSensorName] = 20;

        incorrectValueDescription[goal1.getUUID()] = incorrectValuesDescription;

        chai.expect(badge.evaluate(incorrectValueDescription)).to.be.false;
    });
});