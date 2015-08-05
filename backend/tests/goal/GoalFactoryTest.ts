/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />
/// <reference path="../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;

import GoalFactory = require('../../src/goal/GoalFactory');
import Goal = require('../../src/goal/Goal');

describe("GoalFactory test", () => {

    var factory:GoalFactory = new GoalFactory();
    var goal:Goal;

    beforeEach(() => {
        var jsonDefinition:any = {};
        jsonDefinition.name = "Clim";

        var timeBox:any = {};
        timeBox.startDate = Date.now();
        timeBox.endDate = Date.now() + 10;
        jsonDefinition.timeBox = timeBox;

        jsonDefinition.duration = 'day';

        var jsonExpression:any = {};
        jsonExpression.comparison = '<';
        jsonExpression.type = 'number';
        jsonExpression.description = 'description blabla ..';
        jsonExpression.valueLeft = {'value': 'TEMP_CLI', 'sensor': true};
        jsonExpression.valueRight = {'value': '15', 'sensor': false};

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
        chai.expect(goal.getRequired()).to.be.not.null;
    });
});