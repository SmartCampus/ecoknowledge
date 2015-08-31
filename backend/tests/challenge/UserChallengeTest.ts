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

import ChallengeFactory = require('../../src/challenge/UserChallengeFactory');
import RecurringSession = require('../../src/goal/RecurringSession');
import Goal = require('../../src/goal/Goal');
import GoalExpression = require('../../src/condition/expression/GoalExpression');
import User = require('../../src/user/User');
import ExpressionFactory = require('../../src/condition/factory/ExpressionFactory');
import OverallGoalCondition = require('../../src/condition/OverallGoalCondition');

describe("UserChallenge test", () => {

    var factory:ChallengeFactory = new ChallengeFactory();

    var aGoalID:string = "5d34ae6e-e9ca-4352-9a67-3fdf205cce26";
    var aGoalName:string = "goal 1";
    var aBadgeID:string = 'badge 1';

    var now:moment.Moment = moment('2015-08-26T00:00:00');
    var startDate:moment.Moment = moment("2015-08-17T00:00:00");
    var endDate:moment.Moment = moment("2015-09-17T23:59:59");

    var aRecurringSession:RecurringSession = new RecurringSession('week');

    var aGoal:Goal = new Goal(aGoalID, aGoalName, aBadgeID, now, endDate, aRecurringSession);

    var aSymbolicName:string = 'Temp_cli';
    var aSensorName:string = 'AC_443';

    var mapSymbolicNameToSensor:any = {};
    mapSymbolicNameToSensor[aSymbolicName] = aSensorName;
    var aUser:User = new User('Gérard', mapSymbolicNameToSensor, [], null, factory);

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

    aGoal.addCondition(condition);

    var userChallenge = factory.createChallenge(aGoal, aUser, now);

    describe('GetSensor method', () => {

        var result = userChallenge.getSensors();

        it("should have condition's id of goal, recorded", () => {
            chai.expect(result[aConditionID]).not.to.be.null;
        });

        it("should have condition's symbolic names recorded", () => {
            chai.expect(result[aConditionID].symbolicNames).to.be.eqls([aSymbolicName]);
        })

        it("should have condition's timeBox recorded", () => {
            chai.expect(result[aConditionID].timeBox).not.to.be.null;
        });

        it("should have sensors array built", () => {
            chai.expect(result[aConditionID].sensors).to.be.eqls([aSensorName]);
        });

        it("should have sensor entry built", () => {
            chai.expect(result[aConditionID][aSensorName]).not.to.be.null;
        });
    });

});