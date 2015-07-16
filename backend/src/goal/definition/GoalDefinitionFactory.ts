import GoalDefinition = require('./GoalDefinition');
import ConditionFactory = require('../condition/ConditionFactory');

class GoalFactory {

    private conditionFactory:ConditionFactory;

    constructor() {
        this.conditionFactory = new ConditionFactory();
    }

    public createGoal(data:any):GoalDefinition {
        var goalName:string = data.name;

        var startDateOfValidityPeriod:Date = new Date(data.timeBox.startDate);
        var endDateOfValidityPeriod:Date = new Date(data.timeBox.endDate);
        var durationAllowed:number = data.duration;

        var newGoal:GoalDefinition = new GoalDefinition(goalName, startDateOfValidityPeriod, endDateOfValidityPeriod, durationAllowed);

        var goalConditions:any[] = data.conditions;
        for (var i = 0; i < goalConditions.length; i++) {
            var currentExpression = this.conditionFactory.createCondition(goalConditions[i], data.timeBox, durationAllowed);
            newGoal.addCondition(currentExpression);
        }

        console.log("Creation de l'objectif", goalName, "valide du", startDateOfValidityPeriod, "au", endDateOfValidityPeriod);

        return newGoal;
    }
}

export = GoalFactory;