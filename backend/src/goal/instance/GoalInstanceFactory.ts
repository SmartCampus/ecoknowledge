import GoalInstance = require('./GoalInstance');
import GoalDefinition = require('../definition/GoalDefinition');
import GoalDefinitionRepository = require('../definition/GoalDefinitionRepository');
import UserRepository = require('../../user/UserRepository');
import TimeBoxFactory = require('../../TimeBoxFactory');
import TimeBox = require('../../TimeBox');

class BadgeFactory {

    public createBadge(data:any, goalRepository:GoalDefinitionRepository, userProvider:UserRepository):GoalInstance {

        var goalInstanceDescription:string = data.description;

        var goalDesc:any = data.goal;

        var currentGoalID = goalDesc.id;
        var currentGoal:GoalDefinition = goalRepository.getGoal(currentGoalID);

        var mapGoalsToConditionAndSensors:any = goalDesc.conditions;

        var timeBoxDesc:any = data.timebox;
        var timeBox:TimeBox = null;
        if (timeBoxDesc) {
            var timeBoxFactory:TimeBoxFactory = new TimeBoxFactory();
            timeBox = timeBoxFactory.createTimeBox(timeBoxDesc);
        }

        var goalInstance:GoalInstance = new GoalInstance(goalInstanceDescription, currentGoal, mapGoalsToConditionAndSensors, timeBox);

        // TODO attach badge to user
        // user.addBadgeByDescription(badge);

        return goalInstance;
    }
}

export = BadgeFactory;