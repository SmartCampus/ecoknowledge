import GoalProvider = require('./GoalProvider');
import BadgeProvider = require('./BadgeProvider');
import UserProvider = require('./UserProvider');

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

    public addGoal(data:any):string {
        return this.goalProvider.addGoal(data);
    }

    public addBadge(data:any) {
        this.badgeProvider.addBadge(data, this.goalProvider, this.userProvider);
    }

    // debug only
    public evaluateGoal(data:any):boolean {
        return this.goalProvider.evaluateGoal(data);
    }


}

export = Ecoknowledge;