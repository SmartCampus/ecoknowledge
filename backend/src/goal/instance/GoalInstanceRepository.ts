import GoalInstance = require('./GoalInstance');
import GoalInstanceFactory = require('./GoalInstanceFactory');
import GoalDefinitionRepository = require('../definition/GoalDefinitionRepository');
import UserProvider = require('../../user/UserRepository');

class BadgeProvider {

    private goalInstancesArray:GoalInstance[] = [];

    private factory:GoalInstanceFactory;

    constructor() {
        this.factory = new GoalInstanceFactory();
    }

    public addGoalInstance(aBadge:GoalInstance) {
        this.goalInstancesArray.push(aBadge);
    }

    public getGoalInstance(goalInstanceUUID:string):GoalInstance {
        for(var i in this.goalInstancesArray) {
            var currentBadge = this.goalInstancesArray[i];
            if (currentBadge.hasUUID(goalInstanceUUID)) {
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

    public getGoalInstancesDescriptionInJsonFormat(datastub:any=null):any[] {
        var result = [];

        for (var i in this.goalInstancesArray) {

            this.goalInstancesArray[i].evaluate(datastub);

            var currentBadgeDesc:any = {};
            currentBadgeDesc.name = this.goalInstancesArray[i].getName();
            currentBadgeDesc.id = this.goalInstancesArray[i].getId();
            currentBadgeDesc.desc = this.goalInstancesArray[i].getDescription();
            currentBadgeDesc.progress = this.goalInstancesArray[i].getProgress();

            var statusDesc:string = '';
            var badgeStatus:number = this.goalInstancesArray[i].getStatus();

            switch(badgeStatus) {
                case 0:statusDesc = 'WAIT';break;
                case 1:statusDesc = 'RUNNING';break;
                case 2:statusDesc = 'SUCCESS';break;
                case 3:statusDesc = 'FAIL';break;
                default: statusDesc = 'UNKNOWN';break;
            }

            currentBadgeDesc.status = statusDesc;
            result.push(currentBadgeDesc);
        }

        return result;
    }
}

export = BadgeProvider;