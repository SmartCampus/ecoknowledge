/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />
/// <reference path="../../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;

import Operand = require('../../../src/goal/condition/Operand');

describe('Test Operand', () => {
    var operand:Operand;
    var value:string = 'TMP_Clim';
    beforeEach(() => {
        operand = new Operand(value, true)
    });

    it('should have the given name', () => {
        chai.expect(operand.getStringDescription()).to.be.eq(value);
    });
    it('should have the given required status', () => {
        chai.expect(operand.hasToBeDefined()).to.be.true;
    });
});