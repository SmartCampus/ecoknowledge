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

import ChallengeFactory = require('../../src/challenge/ChallengeFactory');
import GoalRepository = require('../../src/goal/GoalRepository');
import Goal = require('../../src/goal/Goal');
import OverallGoalCondition = require('../../src/condition/OverallGoalCondition');
import GoalExpression = require('../../src/condition/expression/GoalExpression');
import Operand = require('../../src/condition/expression/Operand');
import TimeBox = require('../../src/TimeBox');
import Clock = require('../../src/Clock');

describe("GoalInstanceFactory test", () => {

    var factory:ChallengeFactory = new ChallengeFactory();
    var goalDefinitionRepository:GoalRepository = new GoalRepository(null);

    var aGoal:Goal;
    var aGoalName:string = "goal 1";

    var data:any;

    var aGoalID:string = "5d34ae6e-e9ca-4352-9a67-3fdf205cce26";

    var aGoalName:string = 'badge 1';
    var aGoalDescription:string = 'a desc';

    var aConditionName:string = 'Temp_cli';
    var aSensorName:string = 'AC_443';

    var anotherConditionName:string = 'Temp_ext';
    var anotherSensorName:string = 'TEMP_443';
    var now:moment.Moment = moment(new Date(Clock.getNow()).valueOf());
    var endDate:moment.Moment = moment(new Date(now.year(), now.month(), now.date() + 5, now.hours(), now.minutes(), now.seconds()).valueOf());


    var conditions:any = {};
    beforeEach(() => {

        aGoal = new Goal(aGoalName, now, endDate, 5, null);
        aGoal.setUUID(aGoalID);

        var goalCondition:OverallGoalCondition = new OverallGoalCondition(null, new GoalExpression(new Operand(aConditionName, true), '<',
            new Operand(anotherConditionName, true), aGoalDescription), 0, null, null, null);

        aGoal.addCondition(goalCondition);

        goalDefinitionRepository.addGoal(aGoal);

        data = {};

        data.id = aGoal.getUUID();

        data.description = aGoalDescription;

        conditions[aConditionName] = aSensorName;
        conditions[anotherConditionName] = anotherSensorName;

        data.goal = {};

        data.goal.id = aGoal.getUUID();
        data.goal.conditions = conditions;
    });

    it("should have proper name when built", () => {
        /*
         var goalInstance = factory.createGoalInstance(data, goalDefinitionRepository, null, now);
         chai.expect(goalInstance.getName()).to.be.equal(aGoalName);
         */
    });

    it("should have proper description when built", () => {
        /*
         var goalInstance = factory.createGoalInstance(data, goalDefinitionRepository, null, now);
         chai.expect(goalInstance.getDescription()).to.be.equal(aGoalDescription);
         */
    });

    it("should have proper sensors when build", () => {
        /*
         var goalInstance = factory.createGoalInstance(data, goalDefinitionRepository, null, now);

         var timeBox:TimeBox = new TimeBox(now, endDate);

         var timeBoxDesc:any = {};
         timeBoxDesc.startDate = timeBox.getStartDateInStringFormat();
         timeBoxDesc.endDate = timeBox.getEndDateInStringFormat();

         var expectedConditionsDescription = {};
         expectedConditionsDescription[aSensorName] = timeBoxDesc;
         expectedConditionsDescription[anotherSensorName] = timeBoxDesc;

         chai.expect(goalInstance.getSensors()).to.be.eqls(expectedConditionsDescription);
         */
    });

    it('should have proper startDate when built', () => {
        /*
         var goalInstance = factory.createGoalInstance(data, goalDefinitionRepository, null, now);
         chai.expect(goalInstance.getStartDate()).to.be.eq(now);
         */
    });

    it('should have proper endDate when built', () => {
        /*
         var goalInstance = factory.createGoalInstance(data, goalDefinitionRepository, null, now);
         var aEndDate:Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + aGoal.getDuration(), now.getHours(), now.getMinutes(), now.getSeconds());
         chai.expect(goalInstance.getEndDate().getTime()).to.be.eq(aEndDate.getTime());
         */
    });
});