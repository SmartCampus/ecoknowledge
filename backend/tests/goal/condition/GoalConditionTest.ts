/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />
/// <reference path="../../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;

import GoalExpression = require('../../../src/condition/expression/GoalExpression');
import Operand = require('../../../src/condition/expression/Operand');
import TimeBox = require('../../../src/TimeBox');
import TimeBoxFactory = require('../../../src/TimeBoxFactory');

describe('Test GoalCondition', () => {
    describe('Build a condition', () => {

        var condition:GoalExpression;

        var leftOperandRequired:Operand = new Operand('TMP_Cli', true);
        var leftOperandNotRequired:Operand = new Operand('TMP_Cli', false);
        var rightOperandNotRequired:Operand = new Operand('10', false);
        var rightOperandRequired:Operand = new Operand('10', true);
        var typeOfComparison:string = '<';
        var description:string = 'un test';

        it('should not have required', () => {
            condition = new GoalExpression(leftOperandNotRequired, typeOfComparison, rightOperandNotRequired, description);
            var expected:any = {};
            chai.expect(condition.getRequired()).to.be.eqls(expected);
        });

        it('should have proper required on left operand', () => {
            condition = new GoalExpression(leftOperandRequired, typeOfComparison, rightOperandNotRequired, description);
            var expected:any = {};
            expected['TMP_Cli'] = {};
            chai.expect(condition.getRequired()).to.be.eqls(expected);
        });

        it('should have proper required on right operand', () => {
            condition = new GoalExpression(leftOperandNotRequired, typeOfComparison, rightOperandRequired, description);
            var expected:any = {};
            expected['10'] = {};

            chai.expect(condition.getRequired()).to.be.eqls(expected);
        });

        it('should have proper required on both operand', () => {
            condition = new GoalExpression(leftOperandRequired, typeOfComparison, rightOperandRequired, description);
            var expected:any = {};
            expected['TMP_Cli'] = {};
            expected['10'] = {};

            chai.expect(condition.getRequired()).to.be.eqls(expected);
        });

        it('should have proper left operand', () => {
            condition = new GoalExpression(leftOperandRequired, typeOfComparison, rightOperandRequired, description);
            chai.expect(condition.hasLeftOperand('TMP_Cli')).to.be.true;
        });

        it('should have proper right operand', () => {
            condition = new GoalExpression(leftOperandRequired, typeOfComparison, rightOperandRequired, description);
            chai.expect(condition.hasRightOperand('10')).to.be.true;
        });

        it('should have proper type of comparison', () => {
            condition = new GoalExpression(leftOperandRequired, typeOfComparison, rightOperandRequired, description);
            chai.expect(condition.getComparisonType()).to.be.eq(typeOfComparison);
        });

    });

    describe('Evaluate a basic condition without required', () => {
        var condition:GoalExpression;
        var leftOperand:Operand;
        var rightOperand:Operand;
        var typeOfComparison:string;
        var description:string;

        beforeEach(() => {
            leftOperand = new Operand('10', false);
            rightOperand = new Operand('11', false);
            typeOfComparison = '<';
            description = 'un test';

            condition = new GoalExpression(leftOperand, typeOfComparison, rightOperand, description);
        });

        it('should evaluate basic boolean comparison should not throw error', () => {
            chai.expect(() => condition.evaluate([])).not.to.throw(Error);
        });

        it('should get a proper description', () => {
            chai.expect(condition.getStringRepresentation()).to.be.eq('10<11');
        });

        describe('Evaluate with <', () => {
            it('should evaluate 10<11 at true', () => {
                chai.expect(condition.evaluate([])).to.be.true;
            });

            it('should evaluate 10<10 at false', () => {
                rightOperand = new Operand('10', false);
                condition.setRightOperand(rightOperand);
                chai.expect(condition.evaluate([])).to.be.false;
            });

            it('should evaluate 10<9 at false', () => {
                rightOperand = new Operand('9', false);
                condition.setRightOperand(rightOperand);
                chai.expect(condition.evaluate([])).to.be.false;
            });
        });

        describe('Evaluate with >', () => {

            beforeEach(() => {
                typeOfComparison = '>';
                condition.setTypeOfComparison(typeOfComparison);
            });

            it('should evaluate 10>9 at true', () => {
                rightOperand = new Operand('9', false);
                condition.setRightOperand(rightOperand);
                chai.expect(condition.evaluate([])).to.be.true;
            });

            it('should evaluate 10>10 at false', () => {
                rightOperand = new Operand('10', false);
                condition.setRightOperand(rightOperand);
                chai.expect(condition.evaluate([])).to.be.false;
            });

            it('should evaluate 10>11 at false', () => {
                rightOperand = new Operand('11', false);
                condition.setRightOperand(rightOperand);
                chai.expect(condition.evaluate([])).to.be.false;
            });
        });

        describe('Evaluate with ==', () => {

            beforeEach(() => {
                typeOfComparison = '==';
                condition.setTypeOfComparison(typeOfComparison);
            });

            it('should evaluate 10==10 at true', () => {
                rightOperand = new Operand('10', false);
                condition.setRightOperand(rightOperand);
                chai.expect(condition.evaluate([])).to.be.true;
            });

            it('should evaluate 10==9 at false', () => {
                rightOperand = new Operand('9', false);
                condition.setRightOperand(rightOperand);
                chai.expect(condition.evaluate([])).to.be.false;
            });

            it('should evaluate 10==11 at false', () => {
                rightOperand = new Operand('11', false);
                condition.setRightOperand(rightOperand);
                chai.expect(condition.evaluate([])).to.be.false;
            });
        });

        describe('Evaluate with !=', () => {

            beforeEach(() => {
                typeOfComparison = '!=';
                condition.setTypeOfComparison(typeOfComparison);
            });

            it('should evaluate 10!=10 at false', () => {
                rightOperand = new Operand('10', false);
                condition.setRightOperand(rightOperand);
                chai.expect(condition.evaluate([])).to.be.false;
            });

            it('should evaluate 10!=9 at true', () => {
                rightOperand = new Operand('9', false);
                condition.setRightOperand(rightOperand);
                chai.expect(condition.evaluate([])).to.be.true;
            });

            it('should evaluate 10!=11 at true', () => {
                rightOperand = new Operand('11', false);
                condition.setRightOperand(rightOperand);
                chai.expect(condition.evaluate([])).to.be.true;
            });
        });

    });

    describe('Evaluate a condition with a left required', () => {
        var condition:GoalExpression;
        var leftOperand:Operand;
        var rightOperand:Operand;
        var typeOfComparison:string;
        var description:string;

        beforeEach(() => {
            leftOperand = new Operand('TMP_CLIM', true);
            rightOperand = new Operand('15', false);
            typeOfComparison = '>';
            description = 'un test';

            condition = new GoalExpression(leftOperand, typeOfComparison, rightOperand, description);
        });

        describe('Evaluate with >', () => {
            it('should evaluate at true with 20', () => {
                chai.expect(condition.evaluate({'TMP_CLIM': {values: [{value: '20'}]}})).to.be.true;
            });
            it('should evaluate at false with 15', () => {
                chai.expect(condition.evaluate({'TMP_CLIM': {values:[{value: '15'}]}})).to.be.false;
            });
            it('should evaluate at false with 10', () => {
                chai.expect(condition.evaluate({'TMP_CLIM': {values:[{value: '10'}]}})).to.be.false;
            });
        });

        describe('Evaluate with <', () => {
            beforeEach(() => {
                typeOfComparison = '<';
                condition.setTypeOfComparison(typeOfComparison);
            });

            it('should evaluate at true with 10', () => {
                chai.expect(condition.evaluate({'TMP_CLIM': {values:[{value: '10'}]}})).to.be.true;
            });
            it('should evaluate at false with 15', () => {
                chai.expect(condition.evaluate({'TMP_CLIM': {values:[{value: '15'}]}})).to.be.false;
            });
            it('should evaluate at false with 20', () => {
                chai.expect(condition.evaluate({'TMP_CLIM': {values:[{value: '20'}]}})).to.be.false;
            });
        });

        describe('Evaluate with ==', () => {
            beforeEach(() => {
                typeOfComparison = '==';
                condition.setTypeOfComparison(typeOfComparison);
            });

            it('should evaluate at true with 15', () => {
                chai.expect(condition.evaluate({'TMP_CLIM': {values:[{value: '15'}]}})).to.be.true;
            });
            it('should evaluate at false with 9', () => {
                chai.expect(condition.evaluate({'TMP_CLIM': {values:[{value: '9'}]}})).to.be.false;
            });
            it('should evaluate at false with 11', () => {
                chai.expect(condition.evaluate({'TMP_CLIM': {values:[{value: '11'}]}})).to.be.false;
            });
        });

        describe('Evaluate with !=', () => {
            beforeEach(() => {
                typeOfComparison = '!=';
                condition.setTypeOfComparison(typeOfComparison);
            });

            it('should evaluate at true with 10', () => {
                chai.expect(condition.evaluate({'TMP_CLIM':{values:[ {value: '10'}]}})).to.be.true;
            });
            it('should evaluate at false with 15', () => {
                chai.expect(condition.evaluate({'TMP_CLIM': {values:[{value: '15'}]}})).to.be.false;
            });
            it('should evaluate at true with 20', () => {
                chai.expect(condition.evaluate({'TMP_CLIM': {values:[{value: '20'}]}})).to.be.true;
            });
        });

        describe('Evaluate with a UNKNOWN field tagged as non required', () => {
            it('should throw an error when evaluate with TMP_CLIM<15', () => {
                leftOperand = new Operand('TMP_CLIM', false);
                condition.setLeftOperand(leftOperand);
                chai.expect(() => condition.evaluate({})).to.throw(Error);
            });
        });
    });

    describe('Evaluate a condition with a right required', () => {
        var condition:GoalExpression;
        var leftOperand:Operand;
        var rightOperand:Operand;
        var typeOfComparison:string;
        var description:string;

        beforeEach(() => {
            leftOperand = new Operand('15', false);
            rightOperand = new Operand('TMP_CLIM', true);
            typeOfComparison = '<';
            description = 'un test';

            condition = new GoalExpression(leftOperand, typeOfComparison, rightOperand, description);
        });

        describe('Evaluate with <', () => {
            it('should evaluate at true with 20', () => {
                chai.expect(condition.evaluate({'TMP_CLIM': {values:[{value: '20'}]}})).to.be.true;
            });
            it('should evaluate at false with 15', () => {
                chai.expect(condition.evaluate({'TMP_CLIM': {values:[{value: '15'}]}})).to.be.false;
            });
            it('should evaluate at false with 10', () => {
                chai.expect(condition.evaluate({'TMP_CLIM':{values:[ {value: '10'}]}})).to.be.false;
            });
        });

        describe('Evaluate with >', () => {
            beforeEach(() => {
                typeOfComparison = '>';
                condition = new GoalExpression(leftOperand, typeOfComparison, rightOperand, description);
            });

            it('should evaluate at true with 10', () => {
                chai.expect(condition.evaluate({'TMP_CLIM': {values:[{value: '10'}]}})).to.be.true;
            });
            it('should evaluate at false with 15', () => {
                chai.expect(condition.evaluate({'TMP_CLIM': {values:[{value: '15'}]}})).to.be.false;
            });
            it('should evaluate at false with 20', () => {
                chai.expect(condition.evaluate({'TMP_CLIM':{values:[ {value: '20'}]}})).to.be.false;
            });
        });

        describe('Evaluate with ==', () => {
            beforeEach(() => {
                typeOfComparison = '==';
                condition = new GoalExpression(leftOperand, typeOfComparison, rightOperand, description);
            });

            it('should evaluate at true with 15', () => {
                chai.expect(condition.evaluate({'TMP_CLIM':{values:[ {value: '15'}]}})).to.be.true;
            });
            it('should evaluate at false with 9', () => {
                chai.expect(condition.evaluate({'TMP_CLIM': {values:[{value: '9'}]}})).to.be.false;
            });
            it('should evaluate at false with 11', () => {
                chai.expect(condition.evaluate({'TMP_CLIM': {values:[{value: '11'}]}})).to.be.false;
            });
        });

        describe('Evaluate with !=', () => {
            beforeEach(() => {
                typeOfComparison = '!=';
                condition = new GoalExpression(leftOperand, typeOfComparison, rightOperand, description);
            });

            it('should evaluate at true with 10', () => {
                chai.expect(condition.evaluate({'TMP_CLIM': {values:[{value: '10'}]}})).to.be.true;
            });
            it('should evaluate at false with 15', () => {
                chai.expect(condition.evaluate({'TMP_CLIM': {values:[{value: '15'}]}})).to.be.false;
            });
            it('should evaluate at true with 20', () => {
                chai.expect(condition.evaluate({'TMP_CLIM': {values:[{value: '20'}]}})).to.be.true;
            });
        });

        describe('Evaluate with a UNKNOWN field tagged as non required', () => {
            it('should throw an error when evaluate with 15<TMP_CLIM', () => {
                rightOperand = new Operand('TMP_CLIM', false);
                condition = new GoalExpression(leftOperand, typeOfComparison, rightOperand, description);
                chai.expect(() => condition.evaluate([])).to.throw(Error);
            });
        });
    });

    describe('Evaluate a condition with both operands required', () => {
        var condition:GoalExpression;
        var leftOperand:Operand;
        var rightOperand:Operand;
        var typeOfComparison:string;
        var description:string;

        beforeEach(() => {
            leftOperand = new Operand('TMP_EXT', true);
            rightOperand = new Operand('TMP_CLIM', true);
            typeOfComparison = '>';
            description = 'un test';

            condition = new GoalExpression(leftOperand, typeOfComparison, rightOperand, description);
        });

        it('should evaluate at true when 20,10 are passed', () => {
            chai.expect(condition.evaluate(
                {
                    'TMP_CLIM'  : {values: [{value: '10'}]},
                    'TMP_EXT'   : {values: [{value: '20'}]}
                }
            )).to.be.true;
        });

        it('should evaluate at false when 10,20 are passed', () => {
            chai.expect(condition.evaluate(
                {
                    'TMP_CLIM'  : {values: [{value: '20'}]},
                    'TMP_EXT'   : {values: [{value: '10'}]}
                }
            )).to.be.false;
        });
    });

    describe('Evaluate a condition with a timebox', () => {
        it('should return false if values in the given timeBox do not match condition', () => {
            var timeBox:TimeBox = new TimeBox(new Date(Date.UTC(2015, 0, 20)), new Date(Date.UTC(2015, 1, 20)));


        });
    });

    describe('Check JSON protocol', () => {

        var condition:GoalExpression;

        var leftOperandRequired:Operand = new Operand('TMP_Cli', true);
        var rightOperandNotRequired:Operand = new Operand('10', false);
        var typeOfComparison:string = '<';
        var description:string = 'un test';

        condition = new GoalExpression(leftOperandRequired, typeOfComparison, rightOperandNotRequired, description);

        it('should return correct protocol if no timebox is specified', () => {
            var expected:any = {};
            expected['TMP_Cli'] = {};

            chai.expect(condition.getRequired()).to.be.eqls(expected);
        });

        it('should return correct protocol if no timebox is specified', () => {
            var timeBoxData:any = {};
            timeBoxData.startDate = new Date(Date.UTC(1995, 1, 2));
            timeBoxData.endDate = new Date(Date.UTC(2005, 1, 2));

            var timeBoxFactory:TimeBoxFactory = new TimeBoxFactory();
            var timeBox:TimeBox = timeBoxFactory.createTimeBox(timeBoxData);


            condition = new GoalExpression(leftOperandRequired, typeOfComparison, rightOperandNotRequired, description);


            var expected:any = {};
            expected['TMP_Cli'] = {
                "startDate": "1995-02-02 00:00:00",
                "endDate": "2005-02-02 00:00:00"
            };

            chai.expect(condition.getRequired()).to.be.eqls(expected);
        });
    });
});