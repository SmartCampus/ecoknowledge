/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />
/// <reference path="../../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;

import GoalInstanceFactory = require('../../../src/goal/instance/GoalInstanceFactory');
import GoalDefinitionRepository = require('../../../src/goal/definition/GoalDefinitionRepository');
import GoalDefinition = require('../../../src/goal/definition/GoalDefinition');
import GoalCondition = require('../../../src/goal/condition/GoalCondition');
import Operand = require('../../../src/goal/condition/Operand');
import TimeBox = require('../../../src/TimeBox');

describe("GoalInstanceFactory test", () => {

    var factory:GoalInstanceFactory = new GoalInstanceFactory();
    var goalDefinitionRepository:GoalDefinitionRepository = new GoalDefinitionRepository();

    var aGoal:GoalDefinition;
    var aGoalName:string = "goal 1";

    var data:any;

    var aGoalID:string = "5d34ae6e-e9ca-4352-9a67-3fdf205cce26";

    var aGoalName:string = 'badge 1';
    var aGoalDescription:string = 'a desc';

    var aConditionName:string = 'Temp_cli';
    var aSensorName:string = 'AC_443';

    var anotherConditionName:string = 'Temp_ext';
    var anotherSensorName:string = 'TEMP_443';
    var now:Date = new Date(Date.now());
    var endDate:Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5);


    var conditions:any = {};
    beforeEach(() => {

        aGoal = new GoalDefinition(aGoalName, now, endDate, 5);
        aGoal.setUUID(aGoalID);
        aGoal.addCondition(new GoalCondition(new Operand(aConditionName, true), '<',
            new Operand(anotherConditionName, true), aGoalDescription));

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
        var goalInstance = factory.createGoalInstance(data, goalDefinitionRepository, null, now);
        chai.expect(goalInstance.getName()).to.be.equal(aGoalName);
    });

    it("should have proper description when built", () => {
        var goalInstance = factory.createGoalInstance(data, goalDefinitionRepository, null, now);
        chai.expect(goalInstance.getDescription()).to.be.equal(aGoalDescription);
    });

    it("should have proper sensors when build", () => {
        var goalInstance = factory.createGoalInstance(data, goalDefinitionRepository, null, now);

        var timeBox:TimeBox = new TimeBox(now.getTime(), endDate.getTime());

        var timeBoxDesc:any = {};
        timeBoxDesc.startDate = timeBox.getStartDate();
        timeBoxDesc.endDate = timeBox.getEndDate();

        var expectedConditionsDescription = {};
        expectedConditionsDescription[aSensorName] = timeBoxDesc;
        expectedConditionsDescription[anotherSensorName] = timeBoxDesc;

        chai.expect(goalInstance.getSensors()).to.be.eqls(expectedConditionsDescription);
    });

    it('should have proper startDate when built', () => {
        var goalInstance = factory.createGoalInstance(data, goalDefinitionRepository, null, now);
        chai.expect(goalInstance.getStartDate()).to.be.eq(now);
    });

    it('should have proper endDate when built', () => {
        var goalInstance = factory.createGoalInstance(data, goalDefinitionRepository, null, now);
        var aEndDate:Date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + aGoal.getDuration());
        chai.expect(goalInstance.getEndDate().getTime()).to.be.eq(aEndDate.getTime());
    });
});