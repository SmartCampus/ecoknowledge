import GoalInstance = require('./GoalInstance');
import GoalInstanceFactory = require('./GoalInstanceFactory');
import GoalDefinitionRepository = require('../definition/GoalDefinitionRepository');
import UserProvider = require('../../user/UserRepository');

class BadgeProvider {

    private badges:GoalInstance[] = [];

    private factory:GoalInstanceFactory;

    constructor() {
        this.factory = new GoalInstanceFactory();
    }

    public addGoalInstance(aBadge:GoalInstance) {
        this.badges.push(aBadge);
    }

    public getGoalInstance(goalInstanceUUID:string):GoalInstance {
        for(var i in this.badges) {
            var currentBadge = this.badges[i];
            if (currentBadge.hasUUID(goalInstanceUUID)) {
                return currentBadge;
            }
        }

        return null;
    }

    public getListOfGoalInstancesInJsonFormat():any[] {
        var result = [];
        for (var i in this.badges) {
            var currentGoalInstanceDesc:any = {};
            currentGoalInstanceDesc.name = this.badges[i].getName();
            currentGoalInstanceDesc.id = this.badges[i].getId();
            result.push(currentGoalInstanceDesc);
        }

        return result;
    }

    public getGoalInstancesDescriptionInJsonFormat():any[] {
        var result = [];
        /*FIXME
        for (var i in this.badges) {

            var currentBadgeDesc:any = {};
            currentBadgeDesc.name = this.badges[i].getName();
            currentBadgeDesc.id = this.badges[i].getId();
            currentBadgeDesc.points = this.badges[i].getPoints();
            currentBadgeDesc.desc = this.badges[i].getDescription();

            var statusDesc:string = '';
            var badgeStatus:number = this.badges[i].getStatus();

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
         */
        return result;
    }
}

export = BadgeProvider;