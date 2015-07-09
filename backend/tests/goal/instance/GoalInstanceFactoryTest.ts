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

describe("BadgeFactory test", () => {

    var factory:GoalInstanceFactory = new GoalInstanceFactory();
    var goalProvider:GoalDefinitionRepository = new GoalDefinitionRepository();

    var aGoal:GoalDefinition;
    var aGoalName:string = "goal 1";

    var data:any;

    var aGoalID:string = "5d34ae6e-e9ca-4352-9a67-3fdf205cce26";

    var aBadgeName:string = 'badge 1';
    var aBadgeDescription:string = 'a desc';
    var badgePoints:number = 50;

    var aConditionName:string = 'Temp_cli';
    var aSensorName:string = 'AC_443';

    var anotherConditionName:string = 'Temp_ext';
    var anotherSensorName:string = 'TEMP_443';


    beforeEach(() => {
        aGoal = new GoalDefinition(aGoalName);
        aGoal.setUUID(aGoalID);
        aGoal.addCondition(new GoalCondition(new Operand(aConditionName, true), '<',
            new Operand(anotherConditionName, true), aBadgeDescription));

        goalProvider.addGoal(aGoal);

        data = {};
        data.name = aBadgeName;
        data.description = aBadgeDescription;
        data.points = badgePoints;

        var conditions:any[] = [
            {"name": aConditionName, "sensor": aSensorName},
            {"name": anotherConditionName, "sensor": anotherSensorName}
        ];

        var goals:any[] = [
            {"id": aGoalID, "conditions": conditions}
        ];

        data.goals = goals;
    });

    it("should have proper name when built", () => {
        var badge = factory.createBadge(data, goalProvider, null);
        chai.expect(badge.getName()).to.be.equal(aBadgeName);
    });

    it("should have proper description when built", () => {
        var badge = factory.createBadge(data, goalProvider, null);
        chai.expect(badge.getDescription()).to.be.equal(aBadgeDescription);
    });

    /*
    FIXME
    it("should have proper points when built", () => {
        var badge = factory.createBadge(data, goalProvider, null);
        chai.expect(badge.getPoints()).to.be.equal(badgePoints);
    });

    it("should have proper goal when build", () => {
        var badge = factory.createBadge(data, goalProvider, null);
        chai.expect(badge.getObjectives()).to.be.eqls([aGoal]);
    });

    it("should have proper goal when build", () => {
        var badge = factory.createBadge(data, goalProvider, null);
        chai.expect(badge.getObjectives()).to.be.eqls([aGoal]);
    });
    */

    it("should have proper sensors when build", () => {
        var badge = factory.createBadge(data, goalProvider, null);
        console.log(JSON.stringify(badge.getSensors()));
        //FIXME chai.expect(badge.getSensors()).to.be.eqls([aGoal]);
    });
});