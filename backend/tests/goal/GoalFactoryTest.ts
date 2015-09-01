/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />
/// <reference path="../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;

import GoalFactory = require('../../src/goal/GoalFactory');
import Goal = require('../../src/goal/Goal');
import Clock = require('../../src/Clock');

describe("GoalFactory test", () => {

    var factory:GoalFactory = new GoalFactory();
    var goal:Goal;

    var start = Clock.getMomentFromString("2000-01-01T00:00:00");
    var end = Clock.getMomentFromString("2000-08-01T00:00:00");

    console.log("START ?", start.toISOString());

    beforeEach(() => {
        var jsonDefinition:any = {};
        jsonDefinition.name = "Clim";
        jsonDefinition.badgeID = "badgeID";
        jsonDefinition.recurringPeriod = "week";

        var validityPeriod:any = {};
        validityPeriod.start = start.toISOString();
        validityPeriod.end = end.toISOString();
        jsonDefinition.validityPeriod = validityPeriod;

        jsonDefinition.duration = 'day';

        var jsonExpression:any = {};
        jsonExpression.comparison = '<';
        jsonExpression.type = 'number';
        jsonExpression.description = 'description blabla ..';
        jsonExpression.valueLeft = {'value': 'TEMP_CLI', 'symbolicName': true};
        jsonExpression.valueRight = {'value': '15', 'symbolicName': false};

        var aJsonCondition:any = {};
        aJsonCondition.type = 'overall';
        aJsonCondition.threshold = 10;
        aJsonCondition.expression = jsonExpression;
        aJsonCondition.filter = {};
        aJsonCondition.filter.dayOfWeekFilter = 'all';
        aJsonCondition.filter.periodOfDayFilter = ['all'];

        var jsonConditions:any[] = [aJsonCondition];
        jsonDefinition.conditions = jsonConditions;

        goal = factory.createGoal(jsonDefinition);
    });


    it("should build a goal with given name", () => {
        chai.expect(goal.getName()).to.be.eq('Clim');
    });

    it("should build a goal with non null conditions", () => {
        chai.expect(goal.getRequired(start, end)).to.be.not.null;
    });
});