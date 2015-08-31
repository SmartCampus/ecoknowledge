import uuid = require('node-uuid');
import BadArgumentException = require('../exceptions/BadArgumentException');

import Entity = require('./Entity');
import BadgeIDsToNumberOfTimesEarnedMap = require('./BadgeIDsToNumberOfTimesEarnedMap');
import User = require('./User');

class Team extends Entity {
    private members:User[] = [];
    private leader:User;

    constructor(id:string, name:string, leader:User, members:User[],
                currentChallenges:string[], badgesMap:BadgeIDsToNumberOfTimesEarnedMap) {

        super(id, name, currentChallenges, badgesMap);

        this.leader = leader;
        this.members = members;
    }

    getLeader():User {
        return this.leader;
    }

    getMembers():User[] {
        return this.members;
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