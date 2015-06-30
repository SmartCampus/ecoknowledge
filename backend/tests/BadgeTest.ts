/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />
/// <reference path="../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;


import Badge = require('../src/Badge');
import Goal = require('../src/Goal');

describe("Badge test", () => {

    var badge:Badge;
    var goal1:Goal, goal2:Goal;
    var goals:Goal[];

    beforeEach(() => {
        goal1  = new Goal("goal1");
        goal1.addCondition("Température", 'inf', 40);
        goal1.addCondition("Température", 'sup', 25);

        goal2  = new Goal("goal2");
        goal2.addCondition("Température", 'inf', 35);

        goals = [goal1, goal2];

        badge = new Badge("aName", "the badge for noobs", 42,goals);
    });

    it("should evaluate the badge as OK", () => {
        var values = [[30,30], [30]];
        chai.expect(badge.evaluate(values)).to.be.true;
    });

    it("should evaluate the badge as KO", () => {
        var values = [[30,30], [37]];
        chai.expect(badge.evaluate(values)).to.be.false;
    });
});