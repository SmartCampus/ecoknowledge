import BadgeInstance = require('./BadgeInstance');
import Goal = require('../goal/Goal');
import GoalProvider = require('../goal/GoalProvider');
import UserProvider = require('../user/UserProvider');

class BadgeFactory {

    public createBadge(data:any, goalProvider:GoalProvider, userProvider:UserProvider):BadgeInstance {
        var badgeName:string = data.name;
        var badgeDescription:string = data.description;
        var badgePoints:number = data.points;

        var goalsDesc:any[] = data.goals;

        var mapGoalsToConditionAndSensors:any = {};
        var goals:Goal[] = [];

        for(var currentGoalIndex in goalsDesc) {
            var currentGoalDesc = goalsDesc[currentGoalIndex];

            var currentGoalID = currentGoalDesc.id;
            var currentGoal:Goal = goalProvider.getGoal(currentGoalID);
            goals.push(currentGoal);

            for(var conditionsDescIndex in currentGoalDesc.conditions) {
                var currentConditionDesc = currentGoalDesc[conditionsDescIndex];
                var conditionBoundToSensor:any[] = [];

                if(mapGoalsToConditionAndSensors[currentGoalID]) {
                    conditionBoundToSensor = mapGoalsToConditionAndSensors[currentGoalID];
                }
                conditionBoundToSensor.push(currentConditionDesc);
                mapGoalsToConditionAndSensors[currentGoalID] = conditionBoundToSensor;
            }
        }

        var badge:BadgeInstance = new BadgeInstance(badgeName, badgeDescription,
            badgePoints, goals,null, mapGoalsToConditionAndSensors);

        // TODO attach badge to user
        // user.addBadge(badge);

        return badge;
    }

}

export = BadgeFactory;