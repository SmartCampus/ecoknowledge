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


import Goal = require('../../src/goal/Goal');
import GoalExpression = require('../../src/condition/expression/GoalExpression');
import OverallGoalCondition = require('../../src/condition/OverallGoalCondition');
import Operand = require('../../src/condition/expression/Operand');
import Clock = require('../../src/Clock');
import RecurringSession = require('../../src/goal/RecurringSession');
import ExpressionFactory = require('../../src/condition/factory/ExpressionFactory');

describe('Goal Test', () => {
    var aGoalID:string = "5d34ae6e-e9ca-4352-9a67-3fdf205cce26";
    var aGoalName:string = "goal 1";
    var aBadgeID:string = 'badge 1';

    var now:moment.Moment = moment('2015-08-26T00:00:00');
    var startDate:moment.Moment = moment("2015-08-17T:00:00:00");
    var endDate:moment.Moment = moment("2015-09-17T:23:59:59");

    var aRecurringSession:RecurringSession = new RecurringSession('week');

    var goal:Goal = new Goal(aGoalID, aGoalName, aBadgeID, now, endDate, aRecurringSession);

    describe("Build a goal", function () {

        it("should have given name", () => {
            assert.equal(goal.getName(), aGoalName);
        });

        it("should have given id", () => {
            assert.equal(goal.getUUID(), aGoalID);
        });

        it("should have given badgeID", () => {
            assert.equal(goal.getBadgeID(), aBadgeID);
        });

        it("should have given beginningOfValidityPeriod", () => {
            assert.equal(goal.getBeginningOfValidityPeriod().toISOString(), now.toISOString());
        });

        it("should have given endOfValidityPeriod", () => {
            assert.equal(goal.getEndOfValidityPeriod().toISOString(), endDate.toISOString());
        });
    });

    describe("Add a condition to a goal", () => {
        it('should be possible to add an expression', () => {
            var aSymbolicName:string = 'Temp_cli';

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

            expression = expressionFactory.createExpression(expressionDescription);
            var condition = new OverallGoalCondition(aConditionID, aConditionDescription, expression, aThresholdRate, null);

            goal.addCondition(condition);

            chai.expect(goal.getConditions().length).to.be.eql(1);
        });

        it("should return the proper json", () => {
            var expected:any = {
                id: goal.getUUID(),
                name: goal.getName(),
                timeBox: {
                    startDate: goal.getBeginningOfValidityPeriod(),
                    endDate: goal.getEndOfValidityPeriod()
                },
                duration: aRecurringSession.getDescription(),
                conditions: goal.getDataOfConditionsInJSON(),
                badgeID: goal.getBadgeID()
            };

            var actual = goal.getDataInJSON();

            chai.expect(expected).to.be.eqls(actual);
        });

    });
});


