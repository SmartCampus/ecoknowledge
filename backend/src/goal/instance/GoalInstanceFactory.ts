import GoalInstance = require('./GoalInstance');
import GoalDefinition = require('../definition/GoalDefinition');
import GoalDefinitionRepository = require('../definition/GoalDefinitionRepository');
import UserRepository = require('../../user/UserRepository');
import TimeBoxFactory = require('../../TimeBoxFactory');
import TimeBox = require('../../TimeBox');

class BadgeFactory {

    /**
     *
     * @param data
     *  {
     *      description : <string>,
     *      timeBox
     *      goal :
     *      {
     *          id : <goalDefinitionID:string>,
     *          conditions :
     *          {
     *              <symbolic-name:string> : <sensor-name:string>
     *          }
     *      }
     *  }
     * @param goalRepository
     * @param userProvider
     * @returns {GoalInstance}
     */
    public createGoalInstance(data:any, goalRepository:GoalDefinitionRepository, userProvider:UserRepository, now:Date):GoalInstance {

        var goalInstanceDescription:string = data.description;

        var goalDesc:any = data.goal;

        var goalDefinitionID = goalDesc.id;
        var goalDefinition:GoalDefinition = goalRepository.getGoal(goalDefinitionID);

        var startDate:Date = now;

        if(!this.checkDates(goalDefinition,startDate)) {
            throw new Error('Can not build goal instance ! it does not have the time to be achieved. We are the '
                + Date.now() + ', the goal end the' + goalDefinition.getEndDate() + ' with a duration of ' + goalDefinition.getDuration() + ' days');
        }

        var endDate:Date = new Date(startDate.getFullYear(), startDate.getMonth(),startDate.getDate() + goalDefinition.getDuration());

        var mapGoalsToConditionAndSensors:any = goalDesc.conditions;

        var goalInstance:GoalInstance = new GoalInstance(startDate, endDate, goalInstanceDescription, goalDefinition, mapGoalsToConditionAndSensors);

        // TODO attach badge to user
        // user.addBadgeByDescription(badge);

        return goalInstance;
    }

    /**
     * Check if the goal instance is started today, Date.now + goalDefinition#duration <= goalDefinition#endDate
     * @param goalDefinition
     */
    public checkDates(goalDefinition:GoalDefinition, startDate:Date):boolean {
        var durationInDays:number = goalDefinition.getDuration();

        var endDate:Date = new Date(startDate.getFullYear(), startDate.getMonth(),startDate.getDate() + durationInDays);

        var endDateOfValidityPeriod = goalDefinition.getEndDate();

        return endDate.getTime() <= endDateOfValidityPeriod.getTime();
    }
}

export = BadgeFactory;