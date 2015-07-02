import Goal = require('./Goal');
import ExpressionFactory = require('./ExpressionFactory');

class GoalFactory {

    private expressionFactory:ExpressionFactory;

    constructor() {
        this.expressionFactory = new ExpressionFactory();
    }

    public createGoal(data:any):Goal {
        var goalName:string = data.name;
        var newGoal:Goal = new Goal(goalName);
        console.log("Construction de l'objectif", goalName);

        var goalConditions:any[] = data.conditions;

        console.log("\tConstruction des conditions ...");
        for (var i = 0; i < goalConditions.length; i++) {
            var currentExpression = this.expressionFactory.createExpression(goalConditions[i]);
            newGoal.addCondition(currentExpression);
        }
        return newGoal;
    }

}

export = GoalFactory;