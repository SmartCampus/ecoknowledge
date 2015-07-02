import GoalProvider = require('./GoalProvider');
import BadgeProvider = require('./BadgeProvider');

class Ecoknowledge {
    private goalProvider:GoalProvider;
    private badgeProvider:BadgeProvider;

    constructor(goalProvider:GoalProvider, badgeProvider:BadgeProvider) {
        this.goalProvider = goalProvider;
        this.badgeProvider = badgeProvider;
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
        this.badgeProvider.addBadge(data, this.goalProvider);
    }

    // debug only
    public evaluateGoal(data:any):boolean {
        return this.goalProvider.evaluateGoal(data);
    }

}

export = Ecoknowledge;