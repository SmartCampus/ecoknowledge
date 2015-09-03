import Team = require('../user/Team');
import User = require('../user/User');
import Goal = require('../goal/Goal');
import UserChallenge = require('../challenge/UserChallenge');
import TeamChallenge = require('../challenge/TeamChallenge');
import UserChallengeRepository = require('../challenge/UserChallengeRepository');
import uuid = require('node-uuid');

class TeamChallengeFactory {
    createTeamChallenge(team:Team, goal:Goal, userChallengeRepository:UserChallengeRepository, now) {

        var membersChallenges:UserChallenge[] = [];

        var members:User[] = team.getMembers();

        console.log("Team's members", team.getStringDescriptionOfMembers());

        for(var currentMemberIndex in members) {
            var currentMember:User = members[currentMemberIndex];
            var currentUserChallenge:UserChallenge = currentMember.addChallenge(goal, now);
            userChallengeRepository.addUserChallenge(currentUserChallenge);
            membersChallenges.push(currentUserChallenge);
            console.log("Le user", currentMember.getName(), "has this challenge added", currentUserChallenge.getID());
        }
        var id = uuid.v4();

        return new TeamChallenge(id, team, membersChallenges, userChallengeRepository);
    }

    restoreTeamChallenge() {

    }
}

export = TeamChallengeFactory