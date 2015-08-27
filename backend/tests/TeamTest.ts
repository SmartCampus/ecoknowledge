/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />
/// <reference path="../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
var assert = chai.assert;


import Team = require('../src/user/Team');
import User = require('../src/user/User');

describe("Teast a team", function () {
    var aMember:User;
    var anotherMember:User;

    var members:User[] = [];
    var team:Team;

    beforeEach(() => {
        aMember = new User('Gégé');
        anotherMember = new User('Dédé');
        members = [aMember, anotherMember];
        team = new Team("Croquette", null, [], [], members, aMember);
    });

    describe('Check its composition', () => {

        it('should have proper leader', () => {
            chai.expect(team.hasLeader(aMember.getUUID())).to.be.true;
        });

        it('should have proper members', () => {
            chai.expect(team.hasMember(aMember.getUUID())).to.be.true;
            chai.expect(team.hasMember(anotherMember.getUUID())).to.be.true;
        });
    });
    describe('Check add method', () => {

        it('should have a challenge when it was previously added', () => {
            chai.expect(team.getChallenges()).to.be.eqls([]);

            var aChallengeID = 'aChallengeID';
            team.addChallenge(aChallengeID);

            chai.expect(team.getChallenges()).to.be.eqls([aChallengeID]);
        });

        it('should have added a challenge to its members when it was previously added', () => {
            chai.expect(aMember.getChallenges()).to.be.eqls([]);
            chai.expect(anotherMember.getChallenges()).to.be.eqls([]);

            var aChallengeID = 'aChallengeID';
            team.addChallenge(aChallengeID);

            chai.expect(aMember.getChallenges()).to.be.eqls([aChallengeID]);
            chai.expect(anotherMember.getChallenges()).to.be.eqls([aChallengeID]);
        });
    });
});
