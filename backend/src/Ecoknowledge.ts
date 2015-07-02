import GoalProvider = require('./GoalProvider');

class Ecoknowledge {
    private goalProvider:GoalProvider;

    constructor(goalProvider:GoalProvider) {
        this.goalProvider = goalProvider;
    }

    public getGoalDescription(goalUUID:string):any {
        return this.goalProvider.getGoal(goalUUID).getData();
    }

    public addGoal(data:any):string {
        return this.goalProvider.addGoal(data);
    }
}

export = Ecoknowledge;