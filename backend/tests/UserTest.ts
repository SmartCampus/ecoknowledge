/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />
/// <reference path="../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;


import User = require('../src/user/User');

describe('User test', () => {

    var mapSymbolicNameToSensor:any = {
        'TMP_CLI': 'AC_554'
    };

    describe("Build a User", function () {
        var user:User;

        it("should have given name", () => {
            user = new User("aName", mapSymbolicNameToSensor, [], null, null);
            assert.equal(user.getName(), "aName");
        });
    });

    //TODO TESTS

});
