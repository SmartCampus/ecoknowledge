import GoalProvider = require('./goal/GoalProvider');
import BadgeProvider = require('./badge/BadgeProvider');
import UserProvider = require('./user/UserProvider');

class Ecoknowledge {
    private goalProvider:GoalProvider;
    private badgeProvider:BadgeProvider;
    private userProvider:UserProvider;

    constructor(goalProvider:GoalProvider, badgeProvider:BadgeProvider, userProvider:UserProvider) {
        this.goalProvider = goalProvider;
        this.badgeProvider = badgeProvider;
        this.userProvider = userProvider;
    }

    public getGoalDescription(goalUUID:string):any {
        return this.goalProvider.getGoal(goalUUID).getData();
    }

    public getListOfGoals():any[] {
        return this.goalProvider.getListOfGoalsInJsonFormat();
    }

    public getListOfBadges():any[] {
        return this.badgeProvider.getListOfBadgesInJsonFormat();
    }

    public getBadgesDescriptionInJsonFormat():any[] {
        return this.badgeProvider.getBadgesDescriptionInJsonFormat();
    }

    public addGoal(data:any):string {
        return this.goalProvider.addGoalByDescription(data);
    }

    public addBadge(data:any) {
        this.badgeProvider.addBadgeByDescription(data, this.goalProvider, this.userProvider);
    }

    // debug only
    public evaluateGoal(data:any):boolean {
        return this.goalProvider.evaluateGoal(data);
    }


}

export = Ecoknowledge;