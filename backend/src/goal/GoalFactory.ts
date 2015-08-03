import Goal = require('./Goal');
import ConditionFactory = require('../condition/factory/ConditionFactory');

class GoalFactory {

    private conditionFactory:ConditionFactory;

    constructor() {
        this.conditionFactory = new ConditionFactory();
    }

    public createGoal(data:any):Goal {
        var goalName:string = data.name;

        var startDateOfValidityPeriod:Date = new Date(data.timeBox.startDate);
        var endDateOfValidityPeriod:Date = new Date(data.timeBox.endDate);
        var durationAllowed:number = data.duration;

        var badge:string = data.badgeID;
        var goalID:string = data.id;

        var newGoal:Goal = new Goal(goalName, startDateOfValidityPeriod, endDateOfValidityPeriod,
            durationAllowed, badge, goalID);

        var goalConditions:any[] = data.conditions;
        for (var i = 0; i < goalConditions.length; i++) {
            var currentExpression = this.conditionFactory.createCondition(goalConditions[i], data.timeBox, durationAllowed);
            newGoal.addCondition(currentExpression);
        }
        //  console.log("Creation de l'objectif", goalName, "valide du", startDateOfValidityPeriod, "au", endDateOfValidityPeriod, "avec le badge", newGoal.getBadgeID());

        return newGoal;
    }
}

export = GoalFactory;