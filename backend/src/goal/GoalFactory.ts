import Goal = require('./Goal');
import ExpressionFactory = require('./condition/ExpressionFactory');

class GoalFactory {

    private expressionFactory:ExpressionFactory;

    constructor() {
        this.expressionFactory = new ExpressionFactory();
    }

    public createGoal(data:any):Goal {
        var goalName:string = data.name;
        var newGoal:Goal = new Goal(goalName);

        var goalConditions:any[] = data.conditions;

        for (var i = 0; i < goalConditions.length; i++) {
            var currentExpression = this.expressionFactory.createExpression(goalConditions[i]);
            newGoal.addCondition(currentExpression);
        }
        console.log("A new goal has been added", data.name);
        return newGoal;
    }

}

export = GoalFactory;