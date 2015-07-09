/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />
/// <reference path="../../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;

import GoalFactory = require('../../../src/goal/definition/GoalDefinitionFactory');
import Goal = require('../../../src/goal/definition/GoalDefinition');

describe("ExpressionFactory test", () => {

    var factory:GoalFactory = new GoalFactory();
    var goal:Goal;

    beforeEach(() => {
        var jsonExpression:any = {};
        jsonExpression.name = "Clim";

        var jsonCondition:any = {};
        jsonCondition.comparison = '<';
        jsonCondition.type = 'number';
        jsonCondition.description = 'description blabla ..';
        jsonCondition.valueLeft = {'value' : 'TEMP_CLI', 'sensor':true};
        jsonCondition.valueRight = {'value' : '15', 'sensor':false};


        var jsonConditions:any[] = [jsonCondition];
        jsonExpression.conditions = jsonConditions;

        goal = factory.createGoal(jsonExpression);
    });


    it("should build a goal with given name", () => {
        chai.expect(goal.getName()).to.be.eq('Clim');
    });

    it("should build a goal with non null conditions", () => {
        chai.expect(goal.getRequired()).to.be.eqls([['TEMP_CLI']]);
    });
});