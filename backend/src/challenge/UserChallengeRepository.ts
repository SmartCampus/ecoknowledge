import UserChallenge = require('./UserChallenge');
import UserChallengeFactory = require('./UserChallengeFactory');
import GoalRepository = require('../goal/GoalRepository');
import UserRepository = require('../user/UserRepository');
import Badge = require('../badge/Badge');


class UserChallengeRepository {

    private userChallengesArray:UserChallenge[] = [];
    private factory:UserChallengeFactory;

    constructor() {
        this.factory = new UserChallengeFactory();
    }


    addUserChallenge(aChallenge:UserChallenge) {
        this.userChallengesArray.push(aChallenge);
    }

    getChallengeByID(challengeID:string):UserChallenge {
        for (var i in this.userChallengesArray) {
            var currentChallenge = this.userChallengesArray[i];
            if (currentChallenge.hasUUID(challengeID)) {
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

        for (var currentChallengeIndex in this.userChallengesArray) {
            var currentChallenge = this.userChallengesArray[currentChallengeIndex];
            console.log("#", currentChallenge.getID(), "\t |\tDefi : '", currentChallenge.getName(), "'")
        }
    }

    getDataInJSON():any {
        var result:any[] = [];

        for (var currentChallengeIndex in this.userChallengesArray) {
            result.push(this.userChallengesArray[currentChallengeIndex].getDataInJSON());
        }

        return result;
    }
}

export = UserChallengeRepository;