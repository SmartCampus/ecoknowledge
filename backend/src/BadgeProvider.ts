import BadgeInstance = require('./BadgeInstance');
import BadgeFactory = require('./BadgeFactory');
import GoalProvider = require('./GoalProvider');
import UserProvider = require('./UserProvider');

class BadgeProvider {

    private badges:BadgeInstance[] = [];

    private factory:BadgeFactory;

    constructor() {
        this.factory = new BadgeFactory();
    }

    public addBadge(data:any,goalProvider:GoalProvider, userProvider:UserProvider) {
        var newBadge:BadgeInstance = this.factory.createBadge(data,goalProvider, userProvider);
        console.log("BADGE ID : ", newBadge.getId());
        this.badges.push(newBadge);
    }

    public getBadge(badgeUUID:string):BadgeInstance {
        for(var i in this.badges) {
            var currentBadge = this.badges[i];
            if (currentBadge.hasUUID(badgeUUID)) {
                return currentBadge;
            }
        }

        return null;
    }

    public getListOfBadgesInJsonFormat():any[] {
        var result = [];
        for (var i in this.badges) {
            var currentBadgeDesc:any = {};
            currentBadgeDesc.name = this.badges[i].getName();
            currentBadgeDesc.id = this.badges[i].getId();
            result.push(currentBadgeDesc);
        }

        return result;
    }
}

export = BadgeProvider;