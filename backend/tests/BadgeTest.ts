/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />
/// <reference path="../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;


import Badge = require('../src/badge/Badge');

describe("Build a Badge", function () {
    var badge:Badge;

    it("should have given name", () => {
        badge = new Badge("a simple name",823);
        assert.equal(badge.getName(), "a simple name");
    });

    it("should have given number of points", () => {
       badge =  new Badge("a simple name",823);
        assert.equal(badge.getPoints(), 823);

    });
});