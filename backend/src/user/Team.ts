import uuid = require('node-uuid');
import BadArgumentException = require('../exceptions/BadArgumentException');

import Entity = require('./Entity');
import BadgeIDsToNumberOfTimesEarnedMap = require('./BadgeIDsToNumberOfTimesEarnedMap');
import User = require('./User');

class Team {
    private id:string;
    private name:string;

    private members:User[] = [];
    private leader:User;

    private currentChallenges:string[] = [];
    private badgesMap:BadgeIDsToNumberOfTimesEarnedMap = {};

    constructor(name:string, leader:User, members:User[], currentChallenges:string[], badgesMap:BadgeIDsToNumberOfTimesEarnedMap, id = null) {

        if (name == null) {
            throw new BadArgumentException('Can not build team, given name is null');
        }

        if (leader == null) {
            throw new BadArgumentException('Can not build team ' + name + ' given leader is null');
        }

        if (members == null) {
            throw new BadArgumentException('Can not build team ' + name + ' given members is null');
        }

        if (currentChallenges == null) {
            throw new BadArgumentException('Can not build team ' + name + ' given current challenges are null');
        }

        if (badgesMap == null) {
            throw new BadArgumentException('Can not build team ' + name + ' given badges map is null');
        }

        this.id = (id == null) ? uuid.v4() : id;
        this.name = name;

        this.leader = leader;
        this.members = members;

        this.currentChallenges = currentChallenges;
        this.badgesMap = badgesMap;
    }

    getUUID() {
        return this.id;
    }

    getName():string {
        return this.name;
    }

    getLeader():User {
        return this.leader;
    }

    getMembers():User[] {
        return this.members;
    }

    getBadges():BadgeIDsToNumberOfTimesEarnedMap {
        return this.badgesMap;
    }
    hasUUID(aUUID:string):boolean {
        return this.id === aUUID;
    }

    hasName(name:string):boolean {
        return this.getName() === name;
    }

    hasLeader(aUserID:string):boolean {
        return this.leader.hasUUID(aUserID);
    }

    hasMember(aUserID:string):boolean {
        for (var currentMemberIndex in this.members) {
            var currentMember = this.members[currentMemberIndex];
            if (currentMember.hasUUID(aUserID)) {
                return true;
            }
        }

        return false;
    }

    addChallenge(challengeID:string):void {
        this.currentChallenges.push(challengeID);
    }

    deleteChallenge(challengeID:string):void {
        var challengeIndex:number = this.getChallenge(challengeID);
        if (challengeIndex == -1) {
            throw new BadArgumentException('Can not find given challenge ID');
        }
        else {
            this.currentChallenges.splice(challengeIndex, 1);
        }
    }

    getChallenge(challengeID:string):number {
        var result:number = -1;

        for (var currentChallengeIndex = 0; currentChallengeIndex < this.currentChallenges.length; currentChallengeIndex++) {
            if (this.currentChallenges[currentChallengeIndex] === challengeID) {
                result = currentChallengeIndex;
            }
        }

        return result;
    }

    getCurrentChallenges():string[] {
        return this.currentChallenges;
    }

    getStringDescription():string {
        return 'Team:#' + this.getUUID() + '\t|Name : ' + this.getName() + '\t|LEADER : ' + this.leader + '\n';
    }

    getStringDescriptionOfMembers():string {
        var result = '';

        for (var currentMemberIndex in this.members) {
            var currentMember = this.members[currentMemberIndex];
            result += '\t\t- ' + currentMember.getName() + '\n';
        }

        return result;
    }
}

export = Team;