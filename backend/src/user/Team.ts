import Entity = require('./Entity');
import BadgeIDsToNumberOfTimesEarnedMap = require('./BadgeIDsToNumberOfTimesEarnedMap');
import User = require('./User');

class Team extends Entity {
    private members:User[] = [];
    private leader:User;

    constructor(name:string, id = null, currentChallenges:string[] = [], finishedBadgesMap:BadgeIDsToNumberOfTimesEarnedMap = {}, members:User[] = [], leader:User = null) {
        super(name, id, currentChallenges, finishedBadgesMap);

        this.members = members;
        this.leader = leader;
    }

    public hasLeader(aUserID:string):boolean {
        return this.leader.hasUUID(aUserID);
    }

    public getLeader() : User {
        return this.leader;
    }

    public addChallenge(challengeID:string):void {

        super.addChallenge(challengeID);

        for (var currentMemberIndex in this.members) {
            var currentMember = this.members[currentMemberIndex];

            //FIXME
            currentMember.addChallenge(null, null);
        }
    }

    public deleteChallenge(challengeID:string):void {
        super.deleteChallenge(challengeID);

        for (var currentMemberIndex in this.members) {
            var currentMember = this.members[currentMemberIndex];
            currentMember.deleteChallenge(challengeID);
        }
    }

    public hasMember(aUserID:string):boolean {
        for (var currentMemberIndex in this.members) {
            var currentMember = this.members[currentMemberIndex];
            if (currentMember.hasUUID(aUserID)) {
                return true;
            }
        }

        return false;
    }

    public getStringDescription():string {
        return 'Team:#' + this.getUUID() + '\t|Name : ' + this.getName() + '\t|LEADER : ' + this.leader + '\n';
    }

    public getStringDescriptionOfMembers() : string {
        var result = '';

        for (var currentMemberIndex in this.members) {
            var currentMember = this.members[currentMemberIndex];
            result += '\t\t- ' + currentMember.getName() + '\n';
        }

        return result;
    }
}

export = Team;