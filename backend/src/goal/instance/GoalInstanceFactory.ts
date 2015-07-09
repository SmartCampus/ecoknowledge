import GoalInstance = require('./GoalInstance');
import GoalDefinition = require('../definition/GoalDefinition');
import GoalDefinitionRepository = require('../definition/GoalDefinitionRepository');
import UserRepository = require('../../user/UserRepository');
import TimeBoxFactory = require('../../TimeBoxFactory');
import TimeBox = require('../../TimeBox');

class BadgeFactory {

    public createBadge(data:any, goalProvider:GoalDefinitionRepository, userProvider:UserRepository):GoalInstance {
        /*
        FIXME
        var badgeName:string = data.name;
        var badgeDescription:string = data.description;
        var badgePoints:number = data.points;

        var goalsDesc:any[] = data.goals;

        var mapGoalsToConditionAndSensors:any = {};
        var goals:GoalDefinition[] = [];

        for(var currentGoalIndex in goalsDesc) {
            var currentGoalDesc = goalsDesc[currentGoalIndex];

            var currentGoalID = currentGoalDesc.id;
            var currentGoal:GoalDefinition = goalRepository.getGoal(currentGoalID);
            goals.push(currentGoal);

            for(var conditionsDescIndex in currentGoalDesc.conditions) {
                var currentConditionDesc = currentGoalDesc[conditionsDescIndex];
                console.log(currentConditionDesc);

                var conditionBoundToSensor:any[] = [];

                if(mapGoalsToConditionAndSensors[currentGoalID]) {
                    conditionBoundToSensor = mapGoalsToConditionAndSensors[currentGoalID];
                }
                conditionBoundToSensor.push(currentConditionDesc);
                mapGoalsToConditionAndSensors[currentGoalID] = conditionBoundToSensor;
            }
        }
        console.log("MAPGTCS", mapGoalsToConditionAndSensors);

        var timeBoxDesc:any = data.timebox;
        if(timeBoxDesc) {
            var timeBoxFactory:TimeBoxFactory = new TimeBoxFactory();
            var timeBox:TimeBox = timeBoxFactory.createTimeBox(timeBoxDesc);
        }

        var badge:GoalInstance = new GoalInstance(badgeName, badgeDescription,
            badgePoints, goals,null, mapGoalsToConditionAndSensors, timeBox);

        // TODO attach badge to user
        // user.addBadgeByDescription(badge);

        return badge;
        */
        return null;
    }

}

export = BadgeFactory;