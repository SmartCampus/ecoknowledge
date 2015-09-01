import Challenge = require('./UserChallenge');
import ChallengeFactory = require('./UserChallengeFactory');
import GoalRepository = require('../goal/GoalRepository');
import UserProvider = require('../user/UserRepository');
import Badge = require('../badge/Badge');


class BadgeProvider {

    private goalInstancesArray:Challenge[] = [];

    private factory:ChallengeFactory;

    constructor() {
        this.factory = new ChallengeFactory();
    }

    public displayShortState() {
        console.log("\n\n+++\t Etat du repository des defis\t+++");

        for(var currentChallengeIndex in this.goalInstancesArray) {
            var currentChallenge = this.goalInstancesArray[currentChallengeIndex];
            console.log("#",currentChallenge.getId(),"\t |\tDefi : '", currentChallenge.getName(), "'")
        }
    }

    public getBadgeByChallengeID(challengeID:string):string {
        return this.getChallengeByID(challengeID).getBadge();
    }

    public addGoalInstance(aChallenge:Challenge) {
        this.goalInstancesArray.push(aChallenge);
    }

    public getChallengeByID(challengeID:string):Challenge {
        for (var i in this.goalInstancesArray) {
            var currentBadge = this.goalInstancesArray[i];
            if (currentBadge.hasUUID(challengeID)) {
                return currentBadge;
            }
        }

        return null;
    }

    public getListOfGoalInstancesInJsonFormat():any[] {
        var result = [];
        for (var i in this.goalInstancesArray) {
            var currentGoalInstanceDesc:any = {};
            currentGoalInstanceDesc.name = this.goalInstancesArray[i].getName();
            currentGoalInstanceDesc.id = this.goalInstancesArray[i].getId();
            result.push(currentGoalInstanceDesc);
        }

        return result;
    }

    public getGoalInstancesDescriptionInJsonFormat(datastub:any = null):any[] {
        var result = [];

        for (var i in this.goalInstancesArray) {

            this.goalInstancesArray[i].evaluate(datastub);

            var currentBadgeDesc:any = {};
            currentBadgeDesc.name = this.goalInstancesArray[i].getName();
            currentBadgeDesc.id = this.goalInstancesArray[i].getId();
            currentBadgeDesc.desc = this.goalInstancesArray[i].getGoal().getName();
            currentBadgeDesc.progress = this.goalInstancesArray[i].getGlobalProgression();

            currentBadgeDesc.startDate = this.goalInstancesArray[i].getStartDate();
            currentBadgeDesc.endDate = this.goalInstancesArray[i].getEndDate();

            currentBadgeDesc.timeProgress = this.goalInstancesArray[i].getTimeProgress();


            var statusDesc:string = '';
            var badgeStatus:number = this.goalInstancesArray[i].getStatus();

            statusDesc = this.getBadgeStatus(badgeStatus);

            currentBadgeDesc.status = statusDesc;
            if (currentBadgeDesc.status != 'SUCCESS') {
                result.push(currentBadgeDesc);
            }
        }

        return result;
    }

    public getFinishedGoalInstances():Challenge[] {
        console.log('get finished goal');
        var goalFinished:Challenge[] = [];
        for (var i in this.goalInstancesArray) {
            var statusDesc = this.getBadgeStatus(this.goalInstancesArray[i].getStatus());
            if (statusDesc === 'SUCCESS') {
                console.log('---Find one', this.goalInstancesArray[i]);
                goalFinished.push(this.goalInstancesArray[i]);
                this.goalInstancesArray.splice(i, 1);
            }
        }

        return goalFinished;
    }

    public removeUselessGoalInstances() {
        for (var i in this.goalInstancesArray) {
            var statusDesc = this.getBadgeStatus(this.goalInstancesArray[i].getStatus());
            if (statusDesc === 'SUCCESS') {
                this.goalInstancesArray.splice(i, 1);
            }
        }
    }

    public removeGoalInstance(goalInstanceUuid:string) {
        for (var i in this.goalInstancesArray) {
            console.log('searching for the correct goal instance');
            var currentBadge = this.goalInstancesArray[i];
            if (currentBadge.hasUUID(goalInstanceUuid)) {
                console.log('goal instance found');
                this.goalInstancesArray.splice(i, 1);
                console.log('removed : ', this.goalInstancesArray);
                break;
            }
        }
    }

    private getBadgeStatus(badgeStatus:number):string {
        switch (badgeStatus) {
            case 0:
                return 'WAIT';
            case 1:
                return 'RUNNING';
                break;
            case 2:
                return 'SUCCESS';
                break;
            case 3:
                return 'FAIL';
                break;
            default:
                return 'UNKNOWN';
                break;
        }
        return 'UNKNOWN'
    }

    public getDataInJSON():any {
        var result:any[] = [];

        for(var currentChallengeIndex in this.goalInstancesArray) {
            result.push(this.goalInstancesArray[currentChallengeIndex].getDataInJSON());
        }

        return result;
    }
}

export = BadgeProvider;