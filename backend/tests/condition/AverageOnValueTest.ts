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


describe('Test AverageOnValueTest', () => {

    var averageOnValue:AverageOnValue;

    var expressionStub = sinon.createStubInstance(GoalExpression);


    var leftOperand:Operand = new Operand('TMP_Cli', true);
    var rightOperand:Operand = new Operand('15', false);
    var typeOfComparison:string = '<'; //baisse
    var typeOfComparisonUp:string = '>'; //hausse
    var description:string = 'un test';

    var startDate:moment.Moment = moment(new Date(Date.UTC(2000, 1, 1)).getTime());
    var dateOfCreation:moment.Moment = moment(new Date(Date.UTC(2000, 1, 7)).getTime());
    var endDate:moment.Moment = moment(new Date(Date.UTC(2000, 1, 15)).getTime());

    var expression:GoalExpression = new GoalExpression(leftOperand, typeOfComparison, rightOperand, description);

    describe('evaluate method decrease', () => {

        it('should return true if threshold is reached', () => {
            expression = new GoalExpression(leftOperand, typeOfComparison, rightOperand, description);
            averageOnValue = new AverageOnValue(null,expression,10, startDate, dateOfCreation, endDate, moment(new Date(0,1,0,0,0,0,0).getTime()));

            var data:any = {};

            var oldValues:any[] = [
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 2)).getTime()).format(),
                    value: '100'
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 3)).getTime()).format(),
                    value: '101'
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 4)).getTime()).format(),
                    value: '99'
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 5)).getTime()).format(),
                    value: '102'
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 6)).getTime()).format(),
                    value: '98'
                }
            ];


            var newValues:any[] = [
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 8)).getTime()).format(),
                    value:'89'
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 9)).getTime()).format(),
                    value: '90'
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 10)).getTime()).format(),
                    value: '91'
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 11)).getTime()).format(),
                    value: '70'
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 12)).getTime()).format(),
                    value: '110'
                }
            ];


            data['TMP_Cli'] = {};
            data['TMP_Cli'].values = oldValues.concat(newValues);


            chai.expect(averageOnValue.evaluate(data)).to.be.true;
        });

        it('should return true if threshold is reached with different number of measures', () => {
            expression = new GoalExpression(leftOperand, typeOfComparison, rightOperand, description);
            averageOnValue = new AverageOnValue(null,expression,10, startDate, dateOfCreation, endDate,moment(new Date(0,1,0,0,0,0,0).getTime()));

            var data:any = {};

            var oldValues:any[] = [
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 2)).getTime()).format(),
                    value: 100
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 3)).getTime()).format(),
                    value: 101
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 4)).getTime()).format(),
                    value: 99
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 5)).getTime()).format(),
                    value: 102
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 6)).getTime()).format(),
                    value: 98
                }
            ];

            var newValues:any[] = [
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 8)).getTime()).format(),
                    value: 89
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 9)).getTime()).format(),
                    value: 90
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 10)).getTime()).format(),
                    value: 91
                }
            ];


            data['TMP_Cli'] = {};
            data['TMP_Cli'].values = oldValues.concat(newValues);

            chai.expect(averageOnValue.evaluate(data)).to.be.true;
        });

        it('should return false if threshold is close but not reached', () => {
            expression = new GoalExpression(leftOperand, typeOfComparison, rightOperand, description);
            averageOnValue = new AverageOnValue(null,expression,10, startDate, dateOfCreation, endDate,Clock.getMoment(new Date(0,1,0,0,0,0,0).getTime()));

            var data:any = {};

            var oldValues:any[] = [
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 2)).getTime()).format(),
                    value: 100
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 3)).getTime()).format(),
                    value: 101
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 4)).getTime()).format(),
                    value: 99
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 5)).getTime()).format(),
                    value: 102
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 6)).getTime()).format(),
                    value: 98
                }
            ];

            var newValues:any[] = [
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 8)).getTime()).format(),
                    value: 89
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 9)).getTime()).format(),
                    value: 91
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 10)).getTime()).format(),
                    value: 91
                }
            ];


            data['TMP_Cli'] = {};
            data['TMP_Cli'].values = oldValues.concat(newValues);

            chai.expect(averageOnValue.evaluate(data)).to.be.false;
        });
    });

    describe('progression fields', () => {
        describe('percentage achieved', () => {

            var data:any = {};
            var oldValues:any[] = [];
            var newValues:any[] = [];

            expression = new GoalExpression(leftOperand, typeOfComparison, rightOperand, description);
            averageOnValue = new AverageOnValue(null,expression,10, startDate, dateOfCreation, endDate,moment(new Date(0,1,0,0,0,0,0).getTime()));

            beforeEach(() => {

                data = {};

                //  average : 100
                oldValues = [
                    {
                        date: Clock.getMoment(new Date(Date.UTC(2000, 1, 2)).getTime()).format(),
                        value: 100
                    },
                    {
                        date: Clock.getMoment(new Date(Date.UTC(2000, 1, 3)).getTime()).format(),
                        value: 101
                    },
                    {
                        date: Clock.getMoment(new Date(Date.UTC(2000, 1, 4)).getTime()).format(),
                        value: 99
                    },
                    {
                        date: Clock.getMoment(new Date(Date.UTC(2000, 1, 5)).getTime()).format(),
                        value: 102
                    },
                    {
                        date: Clock.getMoment(new Date(Date.UTC(2000, 1, 6)).getTime()).format(),
                        value: 98
                    }
                ];
            });
            it('should have a zero percentage achieved if no value satisfy the condition', () => {

                //  average : 100
                newValues = [
                    {
                        date: Clock.getMoment(new Date(Date.UTC(2000, 1, 8)).getTime()).format(),
                        value: 100
                    },
                    {
                        date: Clock.getMoment(new Date(Date.UTC(2000, 1, 9)).getTime()).format(),
                        value: 101
                    },
                    {
                        date: Clock.getMoment(new Date(Date.UTC(2000, 1, 10)).getTime()).format(),
                        value: 99
                    }
                ];


                data['TMP_Cli'] = {};
                data['TMP_Cli'].values = oldValues.concat(newValues);
                averageOnValue.evaluate(data);

                assert.equal(averageOnValue.getPercentageAchieved(), 0);
            });

            it('should have 50 percentage achieved', () => {

                //  average : 95
                newValues = [
                    {
                        date: Clock.getMoment(new Date(Date.UTC(2000, 1, 8)).getTime()).format(),
                        value: 90
                    },
                    {
                        date: Clock.getMoment(new Date(Date.UTC(2000, 1, 9)).getTime()).format(),
                        value: 100
                    },
                    {
                        date: Clock.getMoment(new Date(Date.UTC(2000, 1, 10)).getTime()).format(),
                        value: 95
                    }
                ];

                data['TMP_Cli'] = {};
                data['TMP_Cli'].values = oldValues.concat(newValues);

                averageOnValue.evaluate(data);
                assert.equal(averageOnValue.getPercentageAchieved(), 50);
            });

            it('should have 100 percentage achieved', () => {

                //  average : 95
                newValues = [
                    {
                        date: Clock.getMoment(new Date(Date.UTC(2000, 1, 8)).getTime()).format(),
                        value: 85
                    },
                    {
                        date: Clock.getMoment(new Date(Date.UTC(2000, 1, 9)).getTime()).format(),
                        value: 95
                    },
                    {
                        date: Clock.getMoment(new Date(Date.UTC(2000, 1, 10)).getTime()).format(),
                        value: 91
                    },
                    {
                        date: Clock.getMoment(new Date(Date.UTC(2000, 1, 11)).getTime()).format(),
                        value: 89
                    }
                ];

                data['TMP_Cli'] = {};
                data['TMP_Cli'].values = oldValues.concat(newValues);

                averageOnValue.evaluate(data);
                assert.equal(averageOnValue.getPercentageAchieved(), 100);
            });
        });

        describe('duration achieved', () => {

            beforeEach(() => {
                expression = new GoalExpression(leftOperand, typeOfComparison, rightOperand, description);
                averageOnValue = new AverageOnValue(null,expression,10, startDate, dateOfCreation, endDate, moment(new Date(0,1,0,0,0,0,0).getTime()));
            });
            it('should be at 50 percent of time', () => {
                var currentDate:moment.Moment = moment(new Date(Date.UTC(2000, 1, 11)).getTime());
                averageOnValue.updateDurationAchieved(currentDate.valueOf());
                assert.equal(averageOnValue.getPercentageOfTimeElapsed(), 50);
            });

            it('should be at 0 percent of time', () => {
                var currentDate:moment.Moment = moment(new Date(Date.UTC(2000, 1, 7)).getTime());
                averageOnValue.updateDurationAchieved(currentDate.valueOf());
                assert.equal(averageOnValue.getPercentageOfTimeElapsed(), 0);
            });

            it('should throw an error if time given is before dateOfCreation', () => {
                var currentDate:moment.Moment = moment(new Date(Date.UTC(2000, 1, 1)).getTime());
                chai.expect(() => averageOnValue.updateDurationAchieved(currentDate.valueOf())).to.throw(Error);
            });
        });
    });

    describe('separate data', () => {
        it('should separate data correctly', () => {

            expression = new GoalExpression(leftOperand, typeOfComparison, rightOperand, description);
            averageOnValue = new AverageOnValue(null,expression,10, startDate, dateOfCreation, endDate,moment(new Date(0,1,0,0,0,0,0).getTime()));

            var values:any[] = [
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 2)).getTime()).format(),
                    value: 100
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 3)).getTime()).format(),
                    value: 101
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 4)).getTime()).format(),
                    value: 99
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 5)).getTime()).format(),
                    value: 102
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 6)).getTime()).format(),
                    value: 98
                },

                //   OLD/NEW DATA
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 8)).getTime()).format(),
                    value: 89
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 9)).getTime()).format(),
                    value: 90
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 10)).getTime()).format(),
                    value: 91
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 11)).getTime()).format(),
                    value: 70
                }
            ];


            var expectedOldValues:number[] = [100, 101, 99, 102, 98];
            var expectedNewValues:number[] = [89, 90, 91, 70];

            var actualOldValues:number[] = [];
            var actualNewValues:number[] = [];

            averageOnValue.separateOldAndNewData(values, actualOldValues, actualNewValues);
            chai.expect(actualOldValues).to.be.eqls(expectedOldValues);
            chai.expect(actualNewValues).to.be.eqls(expectedNewValues);
        });

        it('should separate data if these are older than 20 days', () => {
            var newStartDate:moment.Moment = moment(new Date(Date.UTC(1999, 12, 18)).getTime());
            expression = new GoalExpression(leftOperand, typeOfComparison, rightOperand, description);
            averageOnValue = new AverageOnValue(null,expression,10, newStartDate, dateOfCreation, endDate,moment(new Date(0,0,20,0,0,0,0).getTime()));

            var values:any[] = [
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 2)).getTime()).format(),
                    value: 100
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 3)).getTime()).format(),
                    value: 101
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 4)).getTime()).format(),
                    value: 99
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 5)).getTime()).format(),
                    value: 102
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 6)).getTime()).format(),
                    value: 98
                },

                //   OLD/NEW DATA

                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 8)).getTime()).format(),
                    value: 89
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 9)).getTime()).format(),
                    value: 90
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 10)).getTime()).format(),
                    value: 91
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 11)).getTime()).format(),
                    value: 70
                },

                //too old data, so it won't be in the arrays
                {
                    date: Clock.getMoment(new Date(Date.UTC(1999, 12, 17)).getTime()).format(),
                    value: 42
                }
            ];


            var expectedOldValues:number[] = [100, 101, 99, 102, 98];
            var expectedNewValues:number[] = [89, 90, 91, 70];

            var actualOldValues:number[] = [];
            var actualNewValues:number[] = [];

            averageOnValue.separateOldAndNewData(values, actualOldValues, actualNewValues);
            chai.expect(actualOldValues).to.be.eqls(expectedOldValues);
            chai.expect(actualNewValues).to.be.eqls(expectedNewValues);
        });

        it('should add data if these are younger than 30 days', () => {
            var newStartDate:moment.Moment = Clock.getMoment(new Date(Date.UTC(1999, 12, 8)).getTime());
            expression = new GoalExpression(leftOperand, typeOfComparison, rightOperand, description);
            averageOnValue = new AverageOnValue(null,expression,10, newStartDate, dateOfCreation, endDate,moment(new Date(0,0,30,0,0,0,0).getTime()));

            var values:any[] = [

                //datas after 1999-12-8
                {
                    date: Clock.getMoment(new Date(Date.UTC(1999, 12, 8, 1)).getTime()).format(),
                    value: 95
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(1999, 12, 12)).getTime()).format(),
                    value: 105
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(1999, 12, 31)).getTime()).format(),
                    value: 100
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 2)).getTime()).format(),
                    value: 100
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 3)).getTime()).format(),
                    value: 101
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 4)).getTime()).format(),
                    value: 99
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 5)).getTime()).format(),
                    value: 102
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 6)).getTime()).format(),
                    value: 98
                },

                //   OLD/NEW DATA

                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 8)).getTime()).format(),
                    value: 89
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 9)).getTime()).format(),
                    value: 90
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 10)).getTime()).format(),
                    value: 91
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 11)).getTime()).format(),
                    value: 70
                }
            ];


            var expectedOldValues:number[] = [95,105,100,100, 101, 99, 102, 98];
            var expectedNewValues:number[] = [89, 90, 91, 70];

            var actualOldValues:number[] = [];
            var actualNewValues:number[] = [];

            averageOnValue.separateOldAndNewData(values, actualOldValues, actualNewValues);
            chai.expect(actualOldValues).to.be.eqls(expectedOldValues);
            chai.expect(actualNewValues).to.be.eqls(expectedNewValues);
        });
    });

    describe('getRequired method', () => {

        expression = new GoalExpression(leftOperand, typeOfComparison, rightOperand, description);
        averageOnValue = new AverageOnValue(null,expression,10, startDate, dateOfCreation, endDate,moment(new Date(0,1,0,0,0,0,0).getTime()));

        var expected:any = {};
        var timeBoxDesc:any = {};
        timeBoxDesc['startDate'] = '2000-02-01 00:00:00';
        timeBoxDesc['endDate'] = '2000-02-15 00:00:00';
        expected['TMP_Cli'] = timeBoxDesc;

        console.log(JSON.stringify(expected));
        console.log(JSON.stringify(averageOnValue.getRequired()));

        //chai.expect(averageOnValue.getRequired()).to.be.eql(expected);

    });

    describe('evaluate method increase', () => {

        it('should return true if threshold is reached', () => {
            expression = new GoalExpression(leftOperand, typeOfComparisonUp, rightOperand, description);
            averageOnValue = new AverageOnValue(null,expression,10, startDate, dateOfCreation, endDate,moment(new Date(0,1,0,0,0,0,0).getTime()));

            var data:any = {};

            var oldValues:any[] = [
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 2)).getTime()).format(),
                    value: 100
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 3)).getTime()).format(),
                    value: 101
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 4)).getTime()).format(),
                    value: 99
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 5)).getTime()).format(),
                    value: 102
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 6)).getTime()).format(),
                    value: 98
                }
            ];


            var newValues:any[] = [
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 8)).getTime()).format(),
                    value: 121
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 9)).getTime()).format(),
                    value: 110
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 10)).getTime()).format(),
                    value: 119
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 11)).getTime()).format(),
                    value: 70
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 12)).getTime()).format(),
                    value: 130
                }
            ];


            data['TMP_Cli'] = {};
            data['TMP_Cli'].values = oldValues.concat(newValues);


            chai.expect(averageOnValue.evaluate(data)).to.be.true;
        });

        it('should return true if threshold is reached with different number of measures', () => {
            expression = new GoalExpression(leftOperand, typeOfComparisonUp, rightOperand, description);
            averageOnValue = new AverageOnValue(null,expression,10, startDate, dateOfCreation, endDate,moment(new Date(0,1,0,0,0,0,0).getTime()));

            var data:any = {};

            var oldValues:any[] = [
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 2)).getTime()).format(),
                    value: 100
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 3)).getTime()).format(),
                    value: 101
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 4)).getTime()).format(),
                    value: 99
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 5)).getTime()).format(),
                    value: 102
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 6)).getTime()).format(),
                    value: 98
                }
            ];

            var newValues:any[] = [
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 8)).getTime()).format(),
                    value: 111
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 9)).getTime()).format(),
                    value: 110
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 10)).getTime()).format(),
                    value: 109
                }
            ];


            data['TMP_Cli'] = {};
            data['TMP_Cli'].values = oldValues.concat(newValues);

            chai.expect(averageOnValue.evaluate(data)).to.be.true;
        });

        it('should return false if threshold is close but not reached', () => {
            expression = new GoalExpression(leftOperand, typeOfComparisonUp, rightOperand, description);
            averageOnValue = new AverageOnValue(null,expression,10, startDate, dateOfCreation, endDate, moment(new Date(0,1,0,0,0,0,0).getTime()));

            var data:any = {};

            var oldValues:any[] = [
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 2)).getTime()).format(),
                    value: 100
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 3)).getTime()).format(),
                    value: 101
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 4)).getTime()).format(),
                    value: 99
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 5)).getTime()).format(),
                    value: 102
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 6)).getTime()).format(),
                    value: 98
                }
            ];

            var newValues:any[] = [
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 8)).getTime()).format(),
                    value: 111
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 9)).getTime()).format(),
                    value: 109
                },
                {
                    date: Clock.getMoment(new Date(Date.UTC(2000, 1, 10)).getTime()).format(),
                    value: 109
                }
            ];


            data['TMP_Cli'] = {};
            data['TMP_Cli'].values = oldValues.concat(newValues);

            chai.expect(averageOnValue.evaluate(data)).to.be.false;
        });
    });
});