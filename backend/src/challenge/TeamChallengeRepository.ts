
import TeamChallenge = require('./TeamChallenge');
import TeamChallengeFactory = require('./TeamChallengeFactory');
import GoalRepository = require('../goal/GoalRepository');
import UserRepository = require('../user/UserRepository');
import Badge = require('../badge/Badge');


class TeamChallengeRepository {

    private teamChallengesArray:TeamChallenge[] = [];
    private factory:TeamChallengeFactory;

    constructor() {
        this.factory = new TeamChallengeFactory();
    }


    addTeamChallenge(aChallenge:TeamChallenge) {
        this.teamChallengesArray.push(aChallenge);
    }

    getChallengeByID(challengeID:string):TeamChallenge {
        for (var i in this.teamChallengesArray) {
            var currentChallenge = this.teamChallengesArray[i];
            if (currentChallenge.hasUUID(challengeID)) {
                return currentChallenge;
            }
        }

        return null;
    }

    getTeamChallengeFromUserChallengeID(userChallengeID:string):TeamChallenge {
        for (var i in this.teamChallengesArray) {
            var currentChallenge = this.teamChallengesArray[i];
            if (currentChallenge.getChildUserChallengeByID(userChallengeID) != null) {
                return currentChallenge;
            }
        }

        return null;
    }

    getBadgeByChallengeID(challengeID:string):string {
        return this.getChallengeByID(challengeID).getBadge();
    }

    displayShortState() {
        console.log("\n\n+++\t Etat du repository des defis\t+++");

        for (var currentChallengeIndex in this.teamChallengesArray) {
            var currentChallenge = this.teamChallengesArray[currentChallengeIndex];
            console.log("#", currentChallenge.getID(), "\t |\tDefi : '", currentChallenge.getName(), "'")
        }
    }

    getDataInJSON():any {
        var result:any[] = [];

        for (var currentChallengeIndex in this.teamChallengesArray) {
            result.push(this.teamChallengesArray[currentChallengeIndex].getDataInJSON());
        }

        return result;
    }
}

export = TeamChallengeRepository;