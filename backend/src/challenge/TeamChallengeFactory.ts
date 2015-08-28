import Team = require('../user/Team');
import User = require('../user/User');
import Goal = require('../goal/Goal');
import UserChallenge = require('../challenge/UserChallenge');
import TeamChallenge = require('../challenge/TeamChallenge');

class TeamChallengeFactory {
    createTeamChallenge(team:Team, goal:Goal, now) {

        var membersChallenges:UserChallenge[] = [];

        var members:User[] = team.getMembers();

        for(var currentMemberIndex in members) {
            var currentMember:User = members[currentMemberIndex];
            var currentUserChallenge:UserChallenge = currentMember.addChallenge(goal, now);
            membersChallenges.push(currentUserChallenge);
        }

        return new TeamChallenge(team, membersChallenges);
    }

    restoreTeamChallenge() {

    }
}

export = TeamChallengeFactory