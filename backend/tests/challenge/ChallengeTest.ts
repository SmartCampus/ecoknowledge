/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />
/// <reference path="../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;

import Challenge = require('../../src/challenge/Challenge');
import Goal = require('../../src/goal/Goal');
import GoalExpression = require('../../src/condition/expression/GoalExpression');
import Operand = require('../../src/condition/expression/Operand');
import AverageOnValue = require('../../src/condition/AverageOnValue');
import TimeBox = require('../../src/TimeBox');

describe("GoalInstance test", () => {

    var goalInstance:Challenge;
    var goalDefinition:Goal;

    var aStartDate:Date = new Date(Date.UTC(2000, 5, 1));
    var aDateOfCreation:Date = new Date(Date.UTC(2000, 5, 1));
    var aEndDate:Date = new Date(Date.UTC(2000, 8, 1));

    var aSymbolicName:string = 'Temperature_cli';
    var anotherSymbolicName:string = 'Temperature_ext';

    var aSensorName:string = 'AC_443';
    var anotherSensorName:string = 'TEMP_444';

    var anExpression:GoalExpression = new GoalExpression(new Operand(aSymbolicName, true), '<', new Operand('40', false), 'desc');
    var anotherExpression:GoalExpression = new GoalExpression(new Operand(anotherSymbolicName, true), '>', new Operand('25', false), 'desc')

    var anAverageCondition:AverageOnValue = new AverageOnValue(null, anExpression, 10, aStartDate, aDateOfCreation, aEndDate, new Date(0,1,0,0,0,0,0));
    var anotherAverageCondition:AverageOnValue = new AverageOnValue(null, anotherExpression, 10, aStartDate, aDateOfCreation, aEndDate, new Date(0,1,0,0,0,0,0));

    beforeEach(() => {
        goalDefinition = new Goal("goal1", null, null, 100, null);

        goalDefinition.addCondition(anAverageCondition);
        goalDefinition.addCondition(anotherAverageCondition);

        var mapSymbolicNameToSensor:any = {};
        mapSymbolicNameToSensor[aSymbolicName] = aSensorName;
        mapSymbolicNameToSensor[anotherSymbolicName] = anotherSensorName;

        goalInstance = new Challenge(aStartDate, aEndDate, "the badge for noobs", goalDefinition, mapSymbolicNameToSensor);
    });


    it("should return sensors required correctly", () => {
        var expectedConditionsDescription = {};
        var theStartDateMinusOneMonth:Date = new Date(Date.UTC(2000, 4, 1));

        var timeBoxObj:TimeBox = new TimeBox(theStartDateMinusOneMonth, aEndDate);

        var timeBox:any = {};
        timeBox.startDate = timeBoxObj.getStartDateInStringFormat();
        timeBox.endDate = timeBoxObj.getEndDateInStringFormat();

        expectedConditionsDescription[aSensorName] = timeBox;
        expectedConditionsDescription[anotherSensorName] = timeBox;

        var result = goalInstance.getSensors();

        chai.expect(result).to.be.eqls(expectedConditionsDescription);
    });

    it("should call goal definition evaluate on evaluate method", () => {
        var goalStubObj = sinon.stub(goalDefinition, "evaluate");
        goalStubObj.returns(true);

        var fakeParams:any = {'a': null, 'b': null};

        goalInstance.evaluate(fakeParams);

        chai.assert(goalStubObj.calledOnce);
        chai.assert(goalStubObj.calledWith(goalInstance.bindSymbolicNameToValue(fakeParams), goalInstance));
    });

    /*
     FIXME
     it("should evaluate the goal instance as OK", () => {
     var aStartDatePlus1Day:Date = new Date(Date.UTC(2000, 5, 2));

     var timeBoxObj:TimeBox = new TimeBox(aStartDatePlus1Day, aEndDate);

     var correctValuesDescription = {};
     var valuesForASensorName = {'values': [{date:timeBoxObj.getStartDateInStringFormat(), value:35}]};
     correctValuesDescription[aSensorName] = valuesForASensorName;

     var valuesForAnotherSensorName = {'values': [{date:timeBoxObj.getStartDateInStringFormat(), value:27}]};
     correctValuesDescription[anotherSensorName] = valuesForAnotherSensorName;

     chai.expect(goalInstance.evaluate(correctValuesDescription)).to.be.true;
     });

     it("should evaluate the goal instance as KO", () => {
     var incorrectValuesDescription = {};

     var valuesForASensorName = {'values': [{value: 35}]};
     incorrectValuesDescription[aSensorName] = valuesForASensorName;

     var valuesForAnotherSensorName = {'values': [{value: 20}]};
     incorrectValuesDescription[anotherSensorName] = valuesForAnotherSensorName;

     chai.expect(goalInstance.evaluate(incorrectValuesDescription)).to.be.false;
     });
     */
});