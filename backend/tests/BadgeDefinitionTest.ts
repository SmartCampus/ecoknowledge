/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />
/// <reference path="../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;


import BadgeDefinition = require('../src/BadgeDefinition');
import Goal = require('../src/Goal');

describe("BadgeDefinition test", () => {

    var badgeDef:BadgeDefinition;
    var goal1:Goal, goal2:Goal;
    var goals:Goal[];

    beforeEach(() => {
        goal1  = new Goal("goal1");
        goal1.addConditionByDescription('Temperature', 'inf', 40);
        goal1.addConditionByDescription('Temperature', 'sup', 25);
        goal2 = new Goal("goal2");
        goal2.addConditionByDescription('Temperature', 'inf', 50);
        goal2.addConditionByDescription('Temperature', 'sup', 40);
        goals = [goal1];

        badgeDef = new BadgeDefinition("aName", "the badge for noobs", 42,goals);
    });

     it("should evaluate the badge as OK", () => {
         var sensors = ['SENSOR_1','SENSOR_2'];
         var values = [ { SENSOR_1: '30', SENSOR_2: '32' }];

         chai.expect(badgeDef.evaluate(values,sensors)).to.be.true;
     });

     it("should evaluate the badge as KO", () => {
         var sensors = ['SENSOR_1','SENSOR_2'];
         var values = [ { SENSOR_1: '30', SENSOR_2: '-42' }];
         chai.expect(badgeDef.evaluate(values, sensors)).to.be.false;

         values = [ { SENSOR_1: '50', SENSOR_2: '-42' }];
         chai.expect(badgeDef.evaluate(values, sensors)).to.be.false;
     });

});