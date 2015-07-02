import Goal = require('./Goal');
import GoalFactory = require('./GoalFactory');

class GoalProvider {

    private goal:Goal[] = [];

    private factory:GoalFactory;

    constructor() {
        this.factory = new GoalFactory();
    }

    public addGoal(data:any) {
        var newGoal:Goal = this.factory.createGoal(data);
        this.goal.push(newGoal);
    }

    public getGoal(goalUUID:string):Goal {
        return null;
    }
}

export = GoalProvider;