/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />
/// <reference path="../../typings/sinon/sinon.d.ts" />
/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />
/// <reference path="../../typings/moment-timezone/moment-timezone.d.ts" />

var moment = require('moment');
var moment_timezone = require('moment-timezone');

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;

import GoalExpression = require('../../src/condition/expression/GoalExpression');
import OverallGoalCondition = require('../../src/condition/OverallGoalCondition');
import Operand = require('../../src/condition/expression/Operand');
import TimeBox = require('../../src/TimeBox');
import Clock = require('../../src/Clock');
import TimeBoxFactory = require('../../src/TimeBoxFactory');

import ExpressionFactory = require('../../src/condition/factory/ExpressionFactory');
import Filter = require('../../src/filter/Filter');

describe('Test OverallGoalCondition', () => {

    var aSymbolicName = "TMP_CLI";
    var expression:GoalExpression;
    var expressionDescription:any = {
        valueLeft: {
            value: aSymbolicName,
            symbolicName: true
        },
        valueRight: {
            value: "15",
            symbolicName: false
        },
        comparison: ">"
    };

    var expressionFactory:ExpressionFactory = new ExpressionFactory();

    var aConditionID = "id1";
    var aConditionDescription = "a desc";
    var aThresholdRate = 80;
    var filterOfCondition:Filter = new Filter('all', ['all']);

    expression = expressionFactory.createExpression(expressionDescription);
    var condition = new OverallGoalCondition(aConditionID, aConditionDescription, expression, aThresholdRate, filterOfCondition);
    var conditionDescription:any = {
        symbolicNames: ["TMP_CLI"],
        timeBox: {
            start: Clock.getMomentFromString("2000-01-01T00:00:00"),
            end: Clock.getMomentFromString("2000-08-01T00:00:00")
        }
    };

    it('should return false if min threshold is absolutely not reached', () => {
        var data:any = {};

        var values:any[] = [
            {date: "2000-02-01T00:00:00", value: 10},
            {date: "2000-02-01T00:00:00", value: 10},
            {date: "2000-02-01T00:00:00", value: 10},
            {date: "2000-02-01T00:00:00", value: 10},
            {date: "2000-02-01T00:00:00", value: 10},
            {date: "2000-02-01T00:00:00", value: 16},
            {date: "2000-02-01T00:00:00", value: 18}
        ];

        data[aSymbolicName] = values;

        var result = condition.evaluate(data, conditionDescription);
        chai.expect(result.finished).to.be.false;
    });

    it('should return false if min threshold is not reached', () => {
        var data:any = {};
        var values:any[] = [
            {date: "2000-02-01T00:00:00", value: 18},
            {date: "2000-02-01T00:00:00", value: 18},
            {date: "2000-02-01T00:00:00", value: 18},
            {date: "2000-02-01T00:00:00", value: 18},
            {date: "2000-02-01T00:00:00", value: 18},
            {date: "2000-02-01T00:00:00", value: 18},
            {date: "2000-02-01T00:00:00", value: 18},
            {date: "2000-02-01T00:00:00", value: 10},
            {date: "2000-02-01T00:00:00", value: 10},
            {date: "2000-02-01T00:00:00", value: 10}
        ];

        data[aSymbolicName] = values;

        var result = condition.evaluate(data, conditionDescription);
        chai.expect(result.finished).to.be.false;
    });

    it('should return true if min threshold is just reached', () => {
        var data:any = {};

        var values:any[] = [
            {date: "2000-02-01T00:00:00", value: 17},
            {date: "2000-02-01T00:00:00", value: 16},
            {date: "2000-02-01T00:00:00", value: 16},
            {date: "2000-02-01T00:00:00", value: 17},
            {date: "2000-02-01T00:00:00", value: 18},
            {date: "2000-02-01T00:00:00", value: 19},
            {date: "2000-02-01T00:00:00", value: 18},
            {date: "2000-02-01T00:00:00", value: 17},
            {date: "2000-02-01T00:00:00", value: 10},
            {date: "2000-02-01T00:00:00", value: 10}
        ];

        data[aSymbolicName] = values;

        var result = condition.evaluate(data, conditionDescription);
        chai.expect(result.finished).to.be.true;
    });


    it('should return true if min threshold is reached', () => {
        var data:any = {};

        var values:any[] = [
            {date: "2000-02-01T00:00:00", value: 16},
            {date: "2000-02-01T00:00:00", value: 17},
            {date: "2000-02-01T00:00:00", value: 18},
            {date: "2000-02-01T00:00:00", value: 19},
            {date: "2000-02-01T00:00:00", value: 18},
            {date: "2000-02-01T00:00:00", value: 18},
            {date: "2000-02-01T00:00:00", value: 17},
            {date: "2000-02-01T00:00:00", value: 18},
            {date: "2000-02-01T00:00:00", value: 16},
            {date: "2000-02-01T00:00:00", value: 17}
        ];

        data[aSymbolicName] = values;

        var result = condition.evaluate(data, conditionDescription);
        chai.expect(result.finished).to.be.true;
    });
});