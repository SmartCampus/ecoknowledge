/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />
/// <reference path="../../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;

import User = require('../../src/user/User');

describe('Test store user class', () => {

    var aName:string = 'aName';
    var anID:string = 'anID';
    var currentChallenges:string[] = ['c1', 'c2'];
    var finishedBadgesMap:any = {
        'b1':2,
        'b2':4
    };

    var user:User = new User(aName, anID, currentChallenges, finishedBadgesMap);
    var expected:any = {
        id:anID,
        name:aName,
        currentChallenges:currentChallenges,
        finishedBadgesMap:finishedBadgesMap
    };

    it('should return the proper json object', () => {
        chai.expect(user.getDataInJSON()).to.be.eqls(expected);
    });

    describe('build with its own description', () => {
        var userClone:User = new User(expected.name, expected.id, expected.currentChallenges, expected.finishedBadgesMap);

        it('should have the same name', () => {
            chai.expect(userClone.getName()).to.be.eq(aName);
        });

        it('should have the same id', () => {
            chai.expect(userClone.getUUID()).to.be.eq(anID);
        });

        it('should have the same current challenges', () => {
            chai.expect(userClone.getChallenges()).to.be.eq(currentChallenges);
        });

        it('should have the same finished badges map', () => {
            chai.expect(userClone.getFinishedBadges()).to.be.eq(finishedBadgesMap);
        });
    });
});