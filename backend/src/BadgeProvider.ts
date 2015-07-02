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
        this.badges.push(newBadge);
    }

    public getBadge(badgeUUID:string, goalProvider:GoalProvider):BadgeInstance {
       return null
    }
}

export = BadgeProvider;