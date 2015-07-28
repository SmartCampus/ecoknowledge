/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />
/// <reference path="../../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;

import GoalCondition = require('../../../src/goal/condition/GoalCondition');
import AverageOnValue = require('../../../src/goal/condition/AverageOnValue');
import Operand = require('../../../src/goal/condition/Operand');
import TimeBox = require('../../../src/TimeBox');
import TimeBoxFactory = require('../../../src/TimeBoxFactory');

describe('Test AverageOnValueTest', () => {

    var averageOnValue:AverageOnValue;

    var condition:GoalCondition;

    var leftOperand:Operand = new Operand('TMP_Cli', true);
    var rightOperand:Operand = new Operand('15', false);
    var typeOfComparison:string = '<'; //baisse
    var typeOfComparisonUp:string = '>'; //hausse
    var description:string = 'un test';

    var startDate:Date = new Date(Date.UTC(2000, 1, 1));
    var dateOfCreation:Date = new Date(Date.UTC(2000, 1, 7));
    var endDate:Date = new Date(Date.UTC(2000, 1, 15));

    describe('evaluate method decrease', () => {

        it('should return true if threshold is reached', () => {
            condition = new GoalCondition(leftOperand, typeOfComparison, rightOperand, description);
            averageOnValue = new AverageOnValue(condition, startDate, dateOfCreation, endDate, 10);

            var data:any = {};

            var oldValues:any[] = [
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 2)).getTime() / 1000),
                    value: 100
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 3)).getTime() / 1000),
                    value: 101
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 4)).getTime() / 1000),
                    value: 99
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 5)).getTime() / 1000),
                    value: 102
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 6)).getTime() / 1000),
                    value: 98
                }
            ];


            var newValues:any[] = [
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 8)).getTime() / 1000),
                    value: 89
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 9)).getTime() / 1000),
                    value: 90
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 10)).getTime() / 1000),
                    value: 91
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 11)).getTime() / 1000),
                    value: 70
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 12)).getTime() / 1000),
                    value: 110
                }
            ];


            data['TMP_Cli'] = {};
            data['TMP_Cli'].values = oldValues.concat(newValues);


            chai.expect(averageOnValue.evaluate(data)).to.be.true;
        });

        it('should return true if threshold is reached with different number of measures', () => {
            condition = new GoalCondition(leftOperand, typeOfComparison, rightOperand, description);
            averageOnValue = new AverageOnValue(condition, startDate, dateOfCreation, endDate, 10);

            var data:any = {};

            var oldValues:any[] = [
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 2)).getTime() / 1000),
                    value: 100
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 3)).getTime() / 1000),
                    value: 101
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 4)).getTime() / 1000),
                    value: 99
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 5)).getTime() / 1000),
                    value: 102
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 6)).getTime() / 1000),
                    value: 98
                }
            ];

            var newValues:any[] = [
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 8)).getTime() / 1000),
                    value: 89
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 9)).getTime() / 1000),
                    value: 90
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 10)).getTime() / 1000),
                    value: 91
                }
            ];


            data['TMP_Cli'] = {};
            data['TMP_Cli'].values = oldValues.concat(newValues);

            chai.expect(averageOnValue.evaluate(data)).to.be.true;
        });

        it('should return false if threshold is close but not reached', () => {
            condition = new GoalCondition(leftOperand, typeOfComparison, rightOperand, description);
            averageOnValue = new AverageOnValue(condition, startDate, dateOfCreation, endDate, 10);

            var data:any = {};

            var oldValues:any[] = [
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 2)).getTime() / 1000),
                    value: 100
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 3)).getTime() / 1000),
                    value: 101
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 4)).getTime() / 1000),
                    value: 99
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 5)).getTime() / 1000),
                    value: 102
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 6)).getTime() / 1000),
                    value: 98
                }
            ];

            var newValues:any[] = [
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 8)).getTime() / 1000),
                    value: 89
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 9)).getTime() / 1000),
                    value: 91
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 10)).getTime() / 1000),
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

            condition = new GoalCondition(leftOperand, typeOfComparison, rightOperand, description);
            averageOnValue = new AverageOnValue(condition, startDate, dateOfCreation, endDate, 10);

            beforeEach(() => {

                data = {};

                //  average : 100
                oldValues = [
                    {
                        date: new Date(new Date(Date.UTC(2000, 1, 2)).getTime() / 1000),
                        value: 100
                    },
                    {
                        date: new Date(new Date(Date.UTC(2000, 1, 3)).getTime() / 1000),
                        value: 101
                    },
                    {
                        date: new Date(new Date(Date.UTC(2000, 1, 4)).getTime() / 1000),
                        value: 99
                    },
                    {
                        date: new Date(new Date(Date.UTC(2000, 1, 5)).getTime() / 1000),
                        value: 102
                    },
                    {
                        date: new Date(new Date(Date.UTC(2000, 1, 6)).getTime() / 1000),
                        value: 98
                    }
                ];
            });
            it('should have a zero percentage achieved if no value satisfy the condition', () => {

                //  average : 100
                newValues = [
                    {
                        date: new Date(new Date(Date.UTC(2000, 1, 8)).getTime() / 1000),
                        value: 100
                    },
                    {
                        date: new Date(new Date(Date.UTC(2000, 1, 9)).getTime() / 1000),
                        value: 101
                    },
                    {
                        date: new Date(new Date(Date.UTC(2000, 1, 10)).getTime() / 1000),
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
                        date: new Date(new Date(Date.UTC(2000, 1, 8)).getTime() / 1000),
                        value: 90
                    },
                    {
                        date: new Date(new Date(Date.UTC(2000, 1, 9)).getTime() / 1000),
                        value: 100
                    },
                    {
                        date: new Date(new Date(Date.UTC(2000, 1, 10)).getTime() / 1000),
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
                        date: new Date(new Date(Date.UTC(2000, 1, 8)).getTime() / 1000),
                        value: 85
                    },
                    {
                        date: new Date(new Date(Date.UTC(2000, 1, 9)).getTime() / 1000),
                        value: 95
                    },
                    {
                        date: new Date(new Date(Date.UTC(2000, 1, 10)).getTime() / 1000),
                        value: 91
                    },
                    {
                        date: new Date(new Date(Date.UTC(2000, 1, 11)).getTime() / 1000),
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
                condition = new GoalCondition(leftOperand, typeOfComparison, rightOperand, description);
                averageOnValue = new AverageOnValue(condition, startDate, dateOfCreation, endDate, 10);
            });
            it('should be at 50 percent of time', () => {
                var currentDate:Date = new Date(Date.UTC(2000, 1, 11));
                averageOnValue.updateDurationAchieved(currentDate.getTime());
                assert.equal(averageOnValue.getDurationAchieved(), 50);
            });

            it('should be at 0 percent of time', () => {
                var currentDate:Date = new Date(Date.UTC(2000, 1, 7));
                averageOnValue.updateDurationAchieved(currentDate.getTime());
                assert.equal(averageOnValue.getDurationAchieved(), 0);
            });

            it('should throw an error if time given is before dateOfCreation', () => {
                var currentDate:Date = new Date(Date.UTC(2000, 1, 1));
                chai.expect(() => averageOnValue.updateDurationAchieved(currentDate.getTime())).to.throw(Error);
            });
        });
    });

    describe('separate data', () => {
        it('should separate data correctly', () => {

            condition = new GoalCondition(leftOperand, typeOfComparison, rightOperand, description);
            averageOnValue = new AverageOnValue(condition, startDate, dateOfCreation, endDate, 10);

            var values:any[] = [
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 2)).getTime() / 1000),
                    value: 100
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 3)).getTime() / 1000),
                    value: 101
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 4)).getTime() / 1000),
                    value: 99
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 5)).getTime() / 1000),
                    value: 102
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 6)).getTime() / 1000),
                    value: 98
                },

                //   OLD/NEW DATA
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 8)).getTime() / 1000),
                    value: 89
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 9)).getTime() / 1000),
                    value: 90
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 10)).getTime() / 1000),
                    value: 91
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 11)).getTime() / 1000),
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
    });

    describe('getRequired method', () => {

        condition = new GoalCondition(leftOperand, typeOfComparison, rightOperand, description);
        averageOnValue = new AverageOnValue(condition, startDate, dateOfCreation, endDate, 10);

        var expected:any = {};
        var timeBoxDesc:any = {};
        timeBoxDesc['startDate'] = '2000-02-01 00:00:00';
        timeBoxDesc['endDate'] = '2000-02-15 00:00:00';
        expected['TMP_Cli'] = timeBoxDesc;

        console.log(JSON.stringify(expected));
        console.log(JSON.stringify(averageOnValue.getRequired()));

        chai.expect(averageOnValue.getRequired()).to.be.eql(expected);

    });

    describe('evaluate method increase', () => {

        it('should return true if threshold is reached', () => {
            condition = new GoalCondition(leftOperand, typeOfComparisonUp, rightOperand, description);
            averageOnValue = new AverageOnValue(condition, startDate, dateOfCreation, endDate, 10);

            var data:any = {};

            var oldValues:any[] = [
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 2)).getTime() / 1000),
                    value: 100
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 3)).getTime() / 1000),
                    value: 101
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 4)).getTime() / 1000),
                    value: 99
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 5)).getTime() / 1000),
                    value: 102
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 6)).getTime() / 1000),
                    value: 98
                }
            ];


            var newValues:any[] = [
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 8)).getTime() / 1000),
                    value: 121
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 9)).getTime() / 1000),
                    value: 110
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 10)).getTime() / 1000),
                    value: 119
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 11)).getTime() / 1000),
                    value: 70
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 12)).getTime() / 1000),
                    value: 130
                }
            ];


            data['TMP_Cli'] = {};
            data['TMP_Cli'].values = oldValues.concat(newValues);


            chai.expect(averageOnValue.evaluate(data)).to.be.true;
        });

        it('should return true if threshold is reached with different number of measures', () => {
            condition = new GoalCondition(leftOperand, typeOfComparisonUp, rightOperand, description);
            averageOnValue = new AverageOnValue(condition, startDate, dateOfCreation, endDate, 10);

            var data:any = {};

            var oldValues:any[] = [
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 2)).getTime() / 1000),
                    value: 100
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 3)).getTime() / 1000),
                    value: 101
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 4)).getTime() / 1000),
                    value: 99
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 5)).getTime() / 1000),
                    value: 102
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 6)).getTime() / 1000),
                    value: 98
                }
            ];

            var newValues:any[] = [
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 8)).getTime() / 1000),
                    value: 111
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 9)).getTime() / 1000),
                    value: 110
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 10)).getTime() / 1000),
                    value: 109
                }
            ];


            data['TMP_Cli'] = {};
            data['TMP_Cli'].values = oldValues.concat(newValues);

            chai.expect(averageOnValue.evaluate(data)).to.be.true;
        });

        it('should return false if threshold is close but not reached', () => {
            condition = new GoalCondition(leftOperand, typeOfComparisonUp, rightOperand, description);
            averageOnValue = new AverageOnValue(condition, startDate, dateOfCreation, endDate, 10);

            var data:any = {};

            var oldValues:any[] = [
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 2)).getTime() / 1000),
                    value: 100
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 3)).getTime() / 1000),
                    value: 101
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 4)).getTime() / 1000),
                    value: 99
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 5)).getTime() / 1000),
                    value: 102
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 6)).getTime() / 1000),
                    value: 98
                }
            ];

            var newValues:any[] = [
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 8)).getTime() / 1000),
                    value: 111
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 9)).getTime() / 1000),
                    value: 109
                },
                {
                    date: new Date(new Date(Date.UTC(2000, 1, 10)).getTime() / 1000),
                    value: 109
                }
            ];


            data['TMP_Cli'] = {};
            data['TMP_Cli'].values = oldValues.concat(newValues);

            chai.expect(averageOnValue.evaluate(data)).to.be.false;
        });
    });
});