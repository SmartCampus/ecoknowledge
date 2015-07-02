import Goal = require('./Goal');
import GoalFactory = require('./GoalFactory');

class GoalProvider {

    private goals:Goal[] = [];

    private factory:GoalFactory;

    constructor() {
        this.factory = new GoalFactory();
    }

    public addGoal(data:any):string {
        var newGoal:Goal = this.factory.createGoal(data);
        this.goals.push(newGoal);
        return newGoal.getUUID().toString();
    }

    public getGoal(goalUUID:string):Goal {
        for(var i in this.goals) {
            var currentGoal = this.goals[i];
            if(currentGoal.hasUUID(goalUUID)) {
                return currentGoal;
            }
        }

        return null;
    }
}

export = GoalProvider;