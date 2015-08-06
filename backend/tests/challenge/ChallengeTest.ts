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

import Challenge = require('../../src/challenge/Challenge');
import Goal = require('../../src/goal/Goal');
import GoalExpression = require('../../src/condition/expression/GoalExpression');
import Operand = require('../../src/condition/expression/Operand');
import AverageOnValue = require('../../src/condition/AverageOnValue');
import TimeBox = require('../../src/TimeBox');
import Clock = require('../../src/Clock');

describe("GoalInstance test", () => {

    var goalInstance:Challenge;
    var goalDefinition:Goal;

    var aStartDate:moment.Moment = Clock.getMomentFromString('2000-05-01T00:00:00');
    var aDateOfCreation:moment.Moment = Clock.getMomentFromString('2000-05-01T00:00:00');
    var aEndDate:moment.Moment = Clock.getMomentFromString('2000-08-01T00:00:00');

    var aSymbolicName:string = 'Temperature_cli';
    var anotherSymbolicName:string = 'Temperature_ext';

    var aSensorName:string = 'AC_443';
    var anotherSensorName:string = 'TEMP_444';

    var anExpression:GoalExpression = new GoalExpression(new Operand(aSymbolicName, true), '<', new Operand('40', false), 'desc');
    var anotherExpression:GoalExpression = new GoalExpression(new Operand(anotherSymbolicName, true), '>', new Operand('25', false), 'desc');

    var anAverageCondition:AverageOnValue = new AverageOnValue(null, anExpression, 10, aStartDate, aDateOfCreation, aEndDate, Clock.getMoment(new Date(0,1,0,0,0,0,0).getTime()));
    var anotherAverageCondition:AverageOnValue = new AverageOnValue(null, anotherExpression, 10, aStartDate, aDateOfCreation, aEndDate, Clock.getMoment(new Date(0,1,0,0,0,0,0).getTime()));

    beforeEach(() => {
        goalDefinition = new Goal("goal1", aStartDate, aEndDate, 100, null);

        goalDefinition.addCondition(anAverageCondition);
        goalDefinition.addCondition(anotherAverageCondition);

        var mapSymbolicNameToSensor:any = {};
        mapSymbolicNameToSensor[aSymbolicName] = aSensorName;
        mapSymbolicNameToSensor[anotherSymbolicName] = anotherSensorName;

        goalInstance = new Challenge(aStartDate, aEndDate, "the badge for noobs", goalDefinition, mapSymbolicNameToSensor);
    });


    it("should return sensors required correctly", () => {
        var expectedConditionsDescription = {};

        var timeBox:any = {};
        timeBox.startDate = "2000-05-01 00:00:00";
        timeBox.endDate = "2000-08-01 00:00:00";

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