/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />
/// <reference path="../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;


import Condition = require('../../src/condition/Condition');
import ExpressionFactory = require('../../src/condition/factory/ExpressionFactory');
import Filter = require('../../src/filter/Filter');
import GoalExpression = require('../../src/condition/expression/GoalExpression');
import Clock = require('../../src/Clock');


describe('Test Condition', () => {
    var condition:Condition;
    var conditionDescription:any = {
        symbolicNames: ["TMP_CLI"],
        timeBox: {
            start: Clock.getMomentFromString("2000-01-01T00:00:00"),
            end: Clock.getMomentFromString("2000-08-01T00:00:00")
        }
    };

    var aSymbolicName = "TMP_CLI";
    var aValue = "15";
    var aComparison = ">";
    var expression:GoalExpression;
    var expressionDescription:any = {
        valueLeft: {
            value: aSymbolicName,
            symbolicName: true
        },
        valueRight: {
            value: aValue,
            symbolicName: false
        },
        comparison: aComparison
    };

    var expressionFactory:ExpressionFactory = new ExpressionFactory();
    expression = expressionFactory.createExpression(expressionDescription);

    var aConditionID = "id1";
    var aConditionDescription = "a desc";
    var aThresholdRate = 80;
    var filterOfCondition:Filter = new Filter('all', ['all']);

    condition = new Condition(aConditionID, aConditionDescription, expression, aThresholdRate, filterOfCondition);

    describe('Build test', () => {

        var dataInJSON:any = condition.getDataInJSON();

        it('should have proper id', () => {
            chai.expect(dataInJSON.id).to.be.eq(aConditionID);
        });

        it('should have proper description', () => {
            chai.expect(dataInJSON.description).to.be.eq(aConditionDescription);
        });

        it('should have proper threshold', () => {
            chai.expect(dataInJSON.threshold).to.be.eq(aThresholdRate);
        });

        it('should have proper threshold', () => {
            var expectedFilters:any = {
                dayOfWeekFilter: 'all',
                periodOfDayFilter: ['all']
            }

            chai.expect(dataInJSON.filter).to.be.eqls(expectedFilters);
        });

        it('should have proper expression', () => {
            var expected:any = {
                valueLeft: {
                    value: aSymbolicName,
                    sensor: true
                },
                valueRight: {
                    value: aValue,
                    sensor: false
                },
                comparison: aComparison
            };

            chai.expect(dataInJSON.expression).to.be.eqls(expected);
        });
    });

    describe('KeepUsefulValues method', () => {
        it('should keep nothing if nothing is in the timeBox', () => {
            var expected:any = {};
            expected[aSymbolicName] = [];

            var data:any = {};
            data[aSymbolicName] = [
                {date: "2000-09-01T00:00:00", value: 10},
                {date: "2000-09-01T00:00:00", value: 10},
                {date: "2000-09-01T00:00:00", value: 10},
                {date: "2000-09-01T00:00:00", value: 10}
            ];


            var result:any[] = condition.keepUsefulValues(data, conditionDescription);

            chai.expect(result).to.be.eqls(expected);
        });

        it('should keep everything if everything is in the timeBox', () => {
            var data:any = {};
            data[aSymbolicName] = [
                {date: "2000-02-01T00:00:00", value: 10},
                {date: "2000-02-01T00:00:00", value: 10},
                {date: "2000-02-01T00:00:00", value: 10},
                {date: "2000-02-01T00:00:00", value: 10}
            ];
            var result:any[] = condition.keepUsefulValues(data, conditionDescription);

            chai.expect(result).to.be.eqls(data);
        });

        it('should keep what is in the timeBox', () => {
            var expected:any = {};
            expected[aSymbolicName] = [
                {date: "2000-02-01T00:00:00", value: 10},
                {date: "2000-02-01T00:00:00", value: 10},
                {date: "2000-02-01T00:00:00", value: 10},
                {date: "2000-02-01T00:00:00", value: 10}
            ];

            var data:any = {};
            data[aSymbolicName] = [
                {date: "1999-01-01T00:00:00", value: 10},
                {date: "2000-02-01T00:00:00", value: 10},
                {date: "2000-02-01T00:00:00", value: 10},
                {date: "2000-02-01T00:00:00", value: 10},
                {date: "2000-02-01T00:00:00", value: 10},
                {date: "2000-09-01T00:00:00", value: 10},
            ];
            var result:any[] = condition.keepUsefulValues(data, conditionDescription);

            chai.expect(result).to.be.eqls(expected);
        });
    });

    describe('GetRequired chain', () => {
        it('should have proper required result', () => {
            var aStart:moment.Moment = Clock.getMomentFromString("2000-01-01T00:00:00");
            var anEnd:moment.Moment = Clock.getMomentFromString("2000-07-01T00:00:00");
            var expected:any = {
                symbolicNames: [aSymbolicName],
                timeBox: {
                    start: aStart,
                    end: anEnd
                }
            };
            var result = condition.getRequiredByCondition(aStart, anEnd);
            chai.expect(result).to.be.eqls(expected);
        });
    });
});
