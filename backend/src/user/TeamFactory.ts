import Entity = require('./Entity');
import Team = require('./Team');
import User = require('./User');
import UserRepository = require('./UserRepository');

class TeamFactory {
    public createTeam(data:any, userRepository:UserRepository):Team {
        var teamID:string = data.id;
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

        var team:Team = new Team(teamName, teamID, currentChallenges, finishedBadgesMap, members, leader);
        return team;
    }
}

export = TeamFactory;