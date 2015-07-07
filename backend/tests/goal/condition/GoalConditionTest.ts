/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />
/// <reference path="../../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;

import GoalCondition = require('../../../src/goal/condition/GoalCondition');
import Operand = require('../../../src/goal/condition/Operand');

describe('Test GoalCondition', () => {
    describe('Build a condition', () => {

        var condition:GoalCondition;

        var leftOperandRequired:Operand = new Operand('TMP_Cli', true);
        var leftOperandNotRequired:Operand = new Operand('TMP_Cli', false);
        var rightOperandNotRequired:Operand = new Operand('10', false);
        var rightOperandRequired:Operand = new Operand('10', true);
        var typeOfComparison:string = '<';
        var description:string = 'un test';

        it('should not have required', () => {
            condition = new GoalCondition(leftOperandNotRequired, typeOfComparison, rightOperandNotRequired, description);
            var expected:string[] = [];
            chai.expect(condition.getRequired()).to.be.eqls(expected);
        });

        it('should have proper required on left operand', () => {
            condition = new GoalCondition(leftOperandRequired, typeOfComparison, rightOperandNotRequired, description);
            var expected:string[] = ['TMP_Cli'];
            chai.expect(condition.getRequired()).to.be.eqls(expected);
        });

        it('should have proper required on right operand', () => {
            condition = new GoalCondition(leftOperandNotRequired, typeOfComparison, rightOperandRequired, description);
            var expected:string[] = ['10'];
            chai.expect(condition.getRequired()).to.be.eqls(expected);
        });

        it('should have proper required on both operand', () => {
            condition = new GoalCondition(leftOperandRequired, typeOfComparison, rightOperandRequired, description);
            var expected:string[] = ['TMP_Cli', '10'];
            chai.expect(condition.getRequired()).to.be.eqls(expected);
        });


    });

    describe('Evaluate a basic condition without required', () => {
        var condition:GoalCondition;
        var leftOperand:Operand;
        var rightOperand:Operand;
        var typeOfComparison:string;
        var description:string;

        beforeEach(() => {
            leftOperand = new Operand('10', false);
            rightOperand = new Operand('11', false);
            typeOfComparison = '<';
            description = 'un test';

            condition = new GoalCondition(leftOperand, typeOfComparison, rightOperand, description);
        });

        it('should evaluate basic boolean comparison should not throw error', () => {
            chai.expect(() => condition.evaluate([])).not.to.throw(Error);
        });

        it('should get a proper description', () => {
            chai.expect(condition.getDescription()).to.be.eq('10<11');
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
        var condition:GoalCondition;
        var leftOperand:Operand;
        var rightOperand:Operand;
        var typeOfComparison:string;
        var description:string;

        beforeEach(() => {
            leftOperand = new Operand('TMP_CLIM', true);
            rightOperand = new Operand('15', false);
            typeOfComparison = '>';
            description = 'un test';

            condition = new GoalCondition(leftOperand, typeOfComparison, rightOperand, description);
        });

        describe('Evaluate with >', () => {
            it('should evaluate at true with 20', () => {
                chai.expect(condition.evaluate(['20'])).to.be.true;
            });
            it('should evaluate at false with 15', () => {
                chai.expect(condition.evaluate(['15'])).to.be.false;
            });
            it('should evaluate at false with 10', () => {
                chai.expect(condition.evaluate(['10'])).to.be.false;
            });
        });

        describe('Evaluate with <', () => {
            beforeEach(() => {
                typeOfComparison = '<';
                condition.setTypeOfComparison(typeOfComparison);
            });

            it('should evaluate at true with 10', () => {
                chai.expect(condition.evaluate(['10'])).to.be.true;
            });
            it('should evaluate at false with 15', () => {
                chai.expect(condition.evaluate(['15'])).to.be.false;
            });
            it('should evaluate at false with 20', () => {
                chai.expect(condition.evaluate(['20'])).to.be.false;
            });
        });

        describe('Evaluate with ==', () => {
            beforeEach(() => {
                typeOfComparison = '==';
                condition.setTypeOfComparison(typeOfComparison);
            });

            it('should evaluate at true with 15', () => {
                chai.expect(condition.evaluate(['15'])).to.be.true;
            });
            it('should evaluate at false with 9', () => {
                chai.expect(condition.evaluate(['9'])).to.be.false;
            });
            it('should evaluate at false with 11', () => {
                chai.expect(condition.evaluate(['11'])).to.be.false;
            });
        });

        describe('Evaluate with !=', () => {
            beforeEach(() => {
                typeOfComparison = '!=';
                condition.setTypeOfComparison(typeOfComparison);
            });

            it('should evaluate at true with 10', () => {
                chai.expect(condition.evaluate(['10'])).to.be.true;
            });
            it('should evaluate at false with 15', () => {
                chai.expect(condition.evaluate(['15'])).to.be.false;
            });
            it('should evaluate at true with 20', () => {
                chai.expect(condition.evaluate(['20'])).to.be.true;
            });
        });

        describe('Evaluate with a UNKNOWN field tagged as non required', () => {
            it('should throw an error when evaluate with TMP_CLIM<15', () => {
                leftOperand = new Operand('TMP_CLIM', false);
                condition.setLeftOperand(leftOperand);
                chai.expect(() => condition.evaluate([])).to.throw(Error);
            });
        });
    });

    describe('Evaluate a condition with a right required', () => {
        var condition:GoalCondition;
        var leftOperand:Operand;
        var rightOperand:Operand;
        var typeOfComparison:string;
        var description:string;

        beforeEach(() => {
            leftOperand = new Operand('15', false);
            rightOperand = new Operand('TMP_CLIM', true);
            typeOfComparison = '<';
            description = 'un test';

            condition = new GoalCondition(leftOperand, typeOfComparison, rightOperand, description);
        });

        describe('Evaluate with <', () => {
            it('should evaluate at true with 20', () => {
                chai.expect(condition.evaluate(['20'])).to.be.true;
            });
            it('should evaluate at false with 15', () => {
                chai.expect(condition.evaluate(['15'])).to.be.false;
            });
            it('should evaluate at false with 10', () => {
                chai.expect(condition.evaluate(['10'])).to.be.false;
            });
        });

        describe('Evaluate with >', () => {
            beforeEach(() => {
                typeOfComparison = '>';
                condition = new GoalCondition(leftOperand, typeOfComparison, rightOperand, description);
            });

            it('should evaluate at true with 10', () => {
                chai.expect(condition.evaluate(['10'])).to.be.true;
            });
            it('should evaluate at false with 15', () => {
                chai.expect(condition.evaluate(['15'])).to.be.false;
            });
            it('should evaluate at false with 20', () => {
                chai.expect(condition.evaluate(['20'])).to.be.false;
            });
        });

        describe('Evaluate with ==', () => {
            beforeEach(() => {
                typeOfComparison = '==';
                condition = new GoalCondition(leftOperand, typeOfComparison, rightOperand, description);
            });

            it('should evaluate at true with 15', () => {
                chai.expect(condition.evaluate(['15'])).to.be.true;
            });
            it('should evaluate at false with 9', () => {
                chai.expect(condition.evaluate(['9'])).to.be.false;
            });
            it('should evaluate at false with 11', () => {
                chai.expect(condition.evaluate(['11'])).to.be.false;
            });
        });

        describe('Evaluate with !=', () => {
            beforeEach(() => {
                typeOfComparison = '!=';
                condition = new GoalCondition(leftOperand, typeOfComparison, rightOperand, description);
            });

            it('should evaluate at true with 10', () => {
                chai.expect(condition.evaluate(['10'])).to.be.true;
            });
            it('should evaluate at false with 15', () => {
                chai.expect(condition.evaluate(['15'])).to.be.false;
            });
            it('should evaluate at true with 20', () => {
                chai.expect(condition.evaluate(['20'])).to.be.true;
            });
        });

        describe('Evaluate with a UNKNOWN field tagged as non required', () => {
            it('should throw an error when evaluate with 15<TMP_CLIM', () => {
                rightOperand = new Operand('TMP_CLIM', false);
                condition = new GoalCondition(leftOperand, typeOfComparison, rightOperand, description);
                chai.expect(() => condition.evaluate([])).to.throw(Error);
            });
        });
    });

    describe('Evaluate a condition with both operands required', () => {
        var condition:GoalCondition;
        var leftOperand:Operand;
        var rightOperand:Operand;
        var typeOfComparison:string;
        var description:string;

        beforeEach(() => {
            leftOperand = new Operand('TMP_EXT', true);
            rightOperand = new Operand('TMP_CLIM', true);
            typeOfComparison = '>';
            description = 'un test';

            condition = new GoalCondition(leftOperand, typeOfComparison, rightOperand, description);
        });

        it('should evaluate at true when 20,10 are passed', () => {
            chai.expect(condition.evaluate(['20', '10'])).to.be.true;
        });

        it('should evaluate at false when 10,20 are passed', () => {
            chai.expect(condition.evaluate(['10', '20'])).to.be.false;
        });
    });
});