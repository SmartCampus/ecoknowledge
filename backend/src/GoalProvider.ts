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

    public getListOfGoalsInJsonFormat():any[] {
        var result = [];

        for(var goalIndex in this.goals) {
            var currentGoal = this.goals[goalIndex];

            var goalDesc:any = {};
            goalDesc.name = currentGoal.getName();
            goalDesc.id = currentGoal.getUUID();

            result.push(goalDesc);
        }

        return result;
    }

    public evaluateGoal(data:any):boolean {
        var goalID:string = data.id;
        console.log("ID", data.id);
        var goal:Goal = this.getGoal(goalID);

        var goalValues:any[] = data.values;
        var values = [];
        for(var i = 0 ; i < goalValues.length ; i++) {
            values.push(goalValues[i].value);
        }

        return goal.evaluate(values);
    }
}

export = GoalProvider;