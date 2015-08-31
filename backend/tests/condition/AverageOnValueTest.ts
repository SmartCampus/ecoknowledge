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

import Condition = require('../../src/condition/Condition');
import GoalExpression = require('../../src/condition/expression/GoalExpression');
import AverageOnValue = require('../../src/condition/AverageOnValue');
import Operand = require('../../src/condition/expression/Operand');
import TimeBox = require('../../src/TimeBox');
import Clock = require('../../src/Clock');
import TimeBoxFactory = require('../../src/TimeBoxFactory');
import ExpressionFactory = require('../../src/condition/factory/ExpressionFactory');
import Filter = require('../../src/filter/Filter');
import ReferencePeriod = require('../../src/condition/ReferencePeriod');

describe('Test AverageOnValueTest', () => {
    var aSymbolicName = "TMP_Cli";
    var expressionDescription:any = {
        valueLeft: {
            value: aSymbolicName,
            symbolicName: true
        },
        valueRight: {
            value: "15",
            symbolicName: false
        },
        comparison: "<"
    };

    var expressionFactory:ExpressionFactory = new ExpressionFactory();
    var expression:GoalExpression = expressionFactory.createExpression(expressionDescription);

    var aConditionID = "id1";
    var aConditionDescription = "a desc";
    var aThresholdRate = 10;
    var filterOfCondition:Filter = new Filter('all', ['all']);
    var referencePeriod:ReferencePeriod = new ReferencePeriod(1, 'week');

    var averageOnValue:AverageOnValue = new AverageOnValue(aConditionID, aConditionDescription, expression, aThresholdRate, filterOfCondition, referencePeriod);

    var startDateOfChallenge:moment.Moment = Clock.getMomentFromString("2000-01-07T00:00:00");
    var endDateOfChallenge:moment.Moment = Clock.getMomentFromString("2000-01-14T00:00:00");
    var conditionDescription = averageOnValue.getRequiredByCondition(startDateOfChallenge, endDateOfChallenge);

    describe('GetRequired method', () => {
        it('should have proper symbolic names field', () => {
            var expected = [aSymbolicName];
            var result = conditionDescription.symbolicNames;
            chai.expect(result).to.be.eqls(expected);
        });

        it('should have the proper start date', ()=> {
            var expectedStartDate:moment.Moment = startDateOfChallenge.clone().subtract(1, 'week');
            var result = conditionDescription.timeBox.start;
            chai.expect(result.toISOString()).to.be.eql(expectedStartDate.toISOString());
        });

        it('should have the proper date of creation', ()=> {
            var expectedDateOfCreation:moment.Moment = startDateOfChallenge.clone();
            var result = conditionDescription.timeBox.dateOfCreation;
            chai.expect(result.toISOString()).to.be.eql(expectedDateOfCreation.toISOString());
        });

        it('should have the proper end date', ()=> {
            var expectedEndDate:moment.Moment = endDateOfChallenge.clone();
            var result = conditionDescription.timeBox.end;
            chai.expect(result.toISOString()).to.be.eql(expectedEndDate.toISOString());
        });
    });

    describe('evaluate method decrease', () => {

        it('should return true if threshold is reached', () => {

            var data:any = {};

            var oldValues:any[] = [
                {
                    date: "2000-01-02T00:00:00",
                    value: '100'
                },
                {
                    date: "2000-01-03T00:00:00",
                    value: '101'
                },
                {
                    date: "2000-01-04T00:00:00",
                    value: '99'
                },
                {
                    date: "2000-01-05T00:00:00",
                    value: '102'
                },
                {
                    date: "2000-01-06T00:00:00",
                    value: '98'
                }
            ];


            var newValues:any[] = [
                {
                    date: "2000-01-08T00:00:00",
                    value: '89'
                },
                {
                    date: "2000-01-09T00:00:00",
                    value: '90'
                },
                {
                    date: "2000-01-10T00:00:00",
                    value: '91'
                },
                {
                    date: "2000-01-11T00:00:00",
                    value: '70'
                },
                {
                    date: "2000-01-12T00:00:00",
                    value: '110'
                }
            ];


            data[aSymbolicName] = oldValues.concat(newValues);

            var result:any = averageOnValue.evaluate(data, conditionDescription);
            chai.expect(result.finished).to.be.true;
        });

        it('should return true if threshold is reached with different number of measures', () => {
            var data:any = {};

            var oldValues:any[] = [
                {
                    date: "2000-01-02T00:00:00",
                    value: '100'
                },
                {
                    date: "2000-01-03T00:00:00",
                    value: '101'
                },
                {
                    date: "2000-01-04T00:00:00",
                    value: '99'
                },
                {
                    date: "2000-01-05T00:00:00",
                    value: '102'
                },
                {
                    date: "2000-01-06T00:00:00",
                    value: '98'
                }
            ];

            var newValues:any[] = [
                {
                    date: "2000-01-08T00:00:00",
                    value: '89'
                },
                {
                    date: "2000-01-09T00:00:00",
                    value: '90'
                },
                {
                    date: "2000-01-10T00:00:00",
                    value: '91'
                }
            ];


            data[aSymbolicName] = oldValues.concat(newValues);

            var result:any = averageOnValue.evaluate(data, conditionDescription);
            chai.expect(result.finished).to.be.true;
        });

        it('should return false if threshold is close but not reached', () => {

            var data:any = {};

            var oldValues:any[] = [
                {
                    date: "2000-01-02T00:00:00",
                    value: '100'
                },
                {
                    date: "2000-01-03T00:00:00",
                    value: '101'
                },
                {
                    date: "2000-01-04T00:00:00",
                    value: '99'
                },
                {
                    date: "2000-01-05T00:00:00",
                    value: '102'
                },
                {
                    date: "2000-01-06T00:00:00",
                    value: '98'
                }
            ];


            var newValues:any[] = [
                {
                    date: "2000-01-08T00:00:00",
                    value: '89'
                },
                {
                    date: "2000-01-09T00:00:00",
                    value: '91'
                },
                {
                    date: "2000-01-10T00:00:00",
                    value: '91'
                }
            ];

            data[aSymbolicName] = oldValues.concat(newValues);

            var result:any = averageOnValue.evaluate(data, conditionDescription);

            chai.expect(result.finished).to.be.false;
        });

    });

    describe('progression fields', () => {
        describe('percentage achieved', () => {

            var data:any = {};
            var oldValues:any[] = [];
            var newValues:any[] = [];

            beforeEach(() => {

                data = {};

                //  average : 100
                oldValues = [
                    {
                        date: "2000-01-02T00:00:00",
                        value: 100
                    },
                    {
                        date: "2000-01-03T00:00:00",
                        value: 101
                    },
                    {
                        date: "2000-01-04T00:00:00",
                        value: 99
                    },
                    {
                        date: "2000-01-05T00:00:00",
                        value: 102
                    },
                    {
                        date: "2000-01-06T00:00:00",
                        value: 98
                    }
                ];
            });
            it('should have a zero percentage achieved if no value satisfy the condition', () => {

                //  average : 100
                newValues = [
                    {
                        date: "2000-01-08T00:00:00",
                        value: 100
                    },
                    {
                        date: "2000-01-09T00:00:00",
                        value: 101
                    },
                    {
                        date: "2000-01-10T00:00:00",
                        value: 99
                    }
                ];


                data[aSymbolicName] = oldValues.concat(newValues);

                var result:any = averageOnValue.evaluate(data, conditionDescription);


                assert.equal(result.percentageAchieved, 0);
            });

            it('should have 50 percentage achieved', () => {

                //  average : 95
                newValues = [
                    {
                        date: "2000-01-08T00:00:00",
                        value: 90
                    },
                    {
                        date: "2000-01-09T00:00:00",
                        value: 100
                    },
                    {
                        date: "2000-01-10T00:00:00",
                        value: 95
                    }
                ];

                data[aSymbolicName] = oldValues.concat(newValues);

                var result:any = averageOnValue.evaluate(data, conditionDescription);


                assert.equal(result.percentageAchieved, 50);
            });

            it('should have 50 percentage achieved when old values must be ignored', () => {

                oldValues.push({
                    date: "1999-12-10T00:00:00",
                    value: 110
                });

                //  average : 95
                newValues = [
                    {
                        date: "2000-01-08T00:00:00",
                        value: 90
                    },
                    {
                        date: "2000-01-09T00:00:00",
                        value: 100
                    },
                    {
                        date: "2000-01-10T00:00:00",
                        value: 95
                    }
                ];

                data[aSymbolicName] = oldValues.concat(newValues);

                var result:any = averageOnValue.evaluate(data, conditionDescription);


                assert.equal(result.percentageAchieved, 50);
            });

            it('should have 100 percentage achieved', () => {

                //  average : 95
                //85.95.91.89
                newValues = [
                    {
                        date: "2000-01-08T00:00:00",
                        value: '85'
                    },
                    {
                        date: "2000-01-09T00:00:00",
                        value: '95'
                    },
                    {
                        date: "2000-01-10T00:00:00",
                        value: '91'
                    },
                    {
                        date: "2000-01-11T00:00:00",
                        value: '89'
                    }
                ];

                data[aSymbolicName] = oldValues.concat(newValues);

                var result:any = averageOnValue.evaluate(data, conditionDescription);

                assert.equal(result.percentageAchieved, 100);
            });
        });

    });

    describe('separate data', () => {

        it('should separate data correctly', () => {

            var values:any[] = [
                {
                    date: "2000-01-02T00:00:00",
                    value: 100
                },
                {
                    date: "2000-01-03T00:00:00",
                    value: 101
                },
                {
                    date: "2000-01-04T00:00:00",
                    value: 99
                },
                {
                    date: "2000-01-05T00:00:00",
                    value: 102
                },
                {
                    date: "2000-01-06T00:00:00",
                    value: 98
                },

                //   OLD/NEW DATA
                {
                    date: "2000-01-08T00:00:00",
                    value: 89
                },
                {
                    date: "2000-01-09T00:00:00",
                    value: 90
                },
                {
                    date: "2000-01-10T00:00:00",
                    value: 91
                },
                {
                    date: "2000-01-11T00:00:00",
                    value: 70
                }
            ];


            var expectedOldValues:number[] = [100, 101, 99, 102, 98];
            var expectedNewValues:number[] = [89, 90, 91, 70];

            var actualOldValues:number[] = [];
            var actualNewValues:number[] = [];

            averageOnValue.separateOldAndNewData(values, actualOldValues, actualNewValues, Clock.getMomentFromString("2000-01-07T00:00:00"));
            chai.expect(actualOldValues).to.be.eqls(expectedOldValues);
            chai.expect(actualNewValues).to.be.eqls(expectedNewValues);
        });


        it('should separate data even if these are older than start date', () => {
            var values:any[] = [
                {
                    date: "2000-01-02T00:00:00",
                    value: 100
                },
                {
                    date: "2000-01-03T00:00:00",
                    value: 101
                },
                {
                    date: "2000-01-04T00:00:00",
                    value: 99
                },
                {
                    date: "2000-01-05T00:00:00",
                    value: 102
                },
                {
                    date: "2000-01-06T00:00:00",
                    value: 98
                },

                //   OLD/NEW DATA
                {
                    date: "2000-01-08T00:00:00",
                    value: 89
                },
                {
                    date: "2000-01-09T00:00:00",
                    value: 90
                },
                {
                    date: "2000-01-10T00:00:00",
                    value: 91
                },
                {
                    date: "2000-01-11T00:00:00",
                    value: 70
                },

                //too old data, so it won't be in the arrays
                {
                    date: "1999-11-17T00:00:00",
                    value: 42
                }
            ];


            var expectedOldValues:number[] = [100, 101, 99, 102, 98, 42];
            var expectedNewValues:number[] = [89, 90, 91, 70];

            var actualOldValues:number[] = [];
            var actualNewValues:number[] = [];

            averageOnValue.separateOldAndNewData(values, actualOldValues, actualNewValues, conditionDescription.timeBox.dateOfCreation);
            chai.expect(actualOldValues).to.be.eqls(expectedOldValues);
            chai.expect(actualNewValues).to.be.eqls(expectedNewValues);
        });


    });


    describe('evaluate method increase', () => {

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
        var expression:GoalExpression = expressionFactory.createExpression(expressionDescription);
        var averageOnValue:AverageOnValue = new AverageOnValue(aConditionID, aConditionDescription, expression, aThresholdRate, filterOfCondition, referencePeriod);

        it('should return true if threshold is reached', () => {

            var data:any = {};

            var oldValues:any[] = [
                {
                    date: "2000-01-02T00:00:00",
                    value: '100'
                },
                {
                    date: "2000-01-03T00:00:00",
                    value: '101'
                },
                {
                    date: "2000-01-04T00:00:00",
                    value: '99'
                },
                {
                    date: "2000-01-05T00:00:00",
                    value: '102'
                },
                {
                    date: "2000-01-06T00:00:00",
                    value: '98'
                }
            ];


            var newValues:any[] = [
                {
                    date: "2000-01-08T00:00:00",
                    value: 121
                },
                {
                    date: "2000-01-09T00:00:00",
                    value: 110
                },
                {
                    date: "2000-01-10T00:00:00",
                    value: 119
                },
                {
                    date: "2000-01-11T00:00:00",
                    value: 70
                },
                {
                    date: "2000-01-12T00:00:00",
                    value: 130
                }
            ];


            data[aSymbolicName] = oldValues.concat(newValues);

            var result:any = averageOnValue.evaluate(data, conditionDescription);
            chai.expect(result.finished).to.be.true;
        });

        it('should return true if threshold is reached with different number of measures', () => {
            var data:any = {};

            var oldValues:any[] = [
                {
                    date: "2000-01-02T00:00:00",
                    value: 100
                },
                {
                    date: "2000-01-03T00:00:00",
                    value: 101
                },
                {
                    date: "2000-01-04T00:00:00",
                    value: 99
                },
                {
                    date: "2000-01-05T00:00:00",
                    value: 102
                },
                {
                    date: "2000-01-06T00:00:00",
                    value: 98
                }
            ];

            var newValues:any[] = [
                {
                    date: "2000-01-08T00:00:00",
                    value: 111
                },
                {
                    date: "2000-01-09T00:00:00",
                    value: 110
                },
                {
                    date: "2000-01-10T00:00:00",
                    value: 109
                }
            ];

            data[aSymbolicName] = oldValues.concat(newValues);

            var result:any = averageOnValue.evaluate(data, conditionDescription);
            chai.expect(result.finished).to.be.true;
        });

        it('should return false if threshold is close but not reached', () => {
            var data:any = {};

            var oldValues:any[] = [
                {
                    date: "2000-01-02T00:00:00",
                    value: 100
                },
                {
                    date: "2000-01-03T00:00:00",
                    value: 101
                },
                {
                    date: "2000-01-04T00:00:00",
                    value: 99
                },
                {
                    date: "2000-01-05T00:00:00",
                    value: 102
                },
                {
                    date: "2000-01-06T00:00:00",
                    value: 98
                }
            ];

            var newValues:any[] = [
                {
                    date: "2000-01-08T00:00:00",
                    value: 111
                },
                {
                    date: "2000-01-09T00:00:00",
                    value: 109
                },
                {
                    date: "2000-01-10T00:00:00" + '',
                    value: 109
                }
            ];


            data[aSymbolicName] = oldValues.concat(newValues);

            var result:any = averageOnValue.evaluate(data, conditionDescription);
            chai.expect(result.finished).to.be.false;
        });

    });


});