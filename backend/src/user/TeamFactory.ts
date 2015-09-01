import uuid = require('node-uuid');

import Entity = require('./Entity');
import Team = require('./Team');
import User = require('./User');
import UserRepository = require('./UserRepository');

/*

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
 */
class TeamFactory {
    public createTeam(data:any, userRepository:UserRepository):Team {
        var teamID:string = data.id;
        teamID = (teamID == null) ? uuid.v4() : teamID;

        var teamName:string = data.name;

        var currentChallenges:string[] = data.currentChallenges;
        var finishedBadgesMap:any = data.finishedBadgesMap;

        var members:User[] = [];

        var membersIDs:string[] = data.members;
        for (var membersIDsIndex in membersIDs) {
            var currentMemberID = membersIDs[membersIDsIndex];
            var currentMember = userRepository.getUser(currentMemberID);
            members.push(currentMember);
        }

        var leaderID:string = data.leader;
        var leader = userRepository.getUser(leaderID);

        //TODO FIX NULL
        var team:Team = new Team(teamID, teamName, leader, members, currentChallenges, finishedBadgesMap, null);
        return team;
    }
}

export = TeamFactory;