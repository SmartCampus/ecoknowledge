import GoalDefinition = require('./GoalDefinition');
import GoalDefinitionFactory = require('./GoalDefinitionFactory');
import BadgeRepository = require('../../badge/BadgeRepository');
import Badge = require('../../badge/Badge');

class GoalDefinitionRepository {

    private goals:GoalDefinition[] = [];

    private factory:GoalDefinitionFactory;

    constructor() {
        this.factory = new GoalDefinitionFactory();
    }

    public addGoalByDescription(data:any, badgeRepository:BadgeRepository):string {
        var newGoal:GoalDefinition = this.factory.createGoal(data);
        if(data.badge === null){
            throw new Error('badges null when trying to create a new goal');
        }
        var badge:Badge = badgeRepository.getBadge(data.badge.id);
        if(badge === null){
            throw new Error('No badge with this id when trying to create a new goal');
        }
        newGoal.setBadge(badge);
        this.goals.push(newGoal);
        return newGoal.getUUID().toString();
    }

    public addGoal(aGoal:GoalDefinition) {
        this.goals.push(aGoal);
    }

    public getGoal(goalUUID:string):GoalDefinition {
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
            goalDesc.name = currentGoal.getBadge().getName();
            goalDesc.id = currentGoal.getUUID();

            result.push(goalDesc);
        }

        return result;
    }

    public evaluateGoal(data:any):boolean {
        var goalID:string = data.id;
        var goal:GoalDefinition = this.getGoal(goalID);

        var goalValues:any[] = data.values;
        var values = [];
        for(var i = 0 ; i < goalValues.length ; i++) {
            values.push(goalValues[i].value);
        }

        return goal.evaluate(values);
    }
}

export = GoalDefinitionRepository;