import Challenge = require('./Challenge');
import Goal = require('../goal/Goal');
import GoalRepository = require('../goal/GoalRepository');
import UserRepository = require('../user/UserRepository');
import TimeBoxFactory = require('../TimeBoxFactory');
import TimeBox = require('../TimeBox');

class GoalInstanceFactory {

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
     * @returns {Challenge}
     */
    public createGoalInstance(data:any, goalRepository:GoalRepository, userProvider:UserRepository, now:Date):Challenge {

        var id = data.id;

        var goalInstanceDescription:string = data.description;

        var goalDesc:any = data.goal;

        var goalDefinitionID = goalDesc.id;

        var goalDefinition:Goal = goalRepository.getGoal(goalDefinitionID);

        if(goalDefinition == null)  {
            throw new Error('Can not create goal instance because ID given of goal definition can not be found');
        }

        var startDate:Date = now;

        if(!this.checkDates(goalDefinition,startDate)) {
            throw new Error('Can not build goal instance ! it does not have the time to be achieved. We are the '
                + now  + ', the goal start the' + goalDefinition.getStartDate() + ' and end the ' +goalDefinition.getEndDate() + ' with a duration of ' + goalDefinition.getDuration() + ' days');
        }

        var endDate:Date = new Date(startDate.getFullYear(), startDate.getMonth(),startDate.getDate() + goalDefinition.getDuration(), startDate.getHours(), startDate.getMinutes(), startDate.getSeconds());

        var mapGoalsToConditionAndSensors:any = goalDesc.conditions;

        var goalInstance:Challenge = new Challenge(startDate, endDate, goalInstanceDescription, goalDefinition, mapGoalsToConditionAndSensors, id);

        // TODO attach badge to user
        // user.addBadgeByDescription(badge);

        // console.log("L'objectif ", goalDefinition.getName(), "a ete instancie ! Intervalle de vie de l'objectif : du", startDate, "au", endDate);

        return goalInstance;
    }

    /**
     * Check if the goal instance is started today, Date.now + goalDefinition#duration <= goalDefinition#endDate
     * @param goalDefinition
     */
    public checkDates(goalDefinition:Goal, startDate:Date):boolean {
        var durationInDays:number = goalDefinition.getDuration();

        var endDate:Date = new Date(startDate.getFullYear(), startDate.getMonth(),startDate.getDate() + durationInDays);
        var endDateOfValidityPeriod = goalDefinition.getEndDate();

        return endDate.getTime() <= endDateOfValidityPeriod.getTime();
    }
}

export = GoalInstanceFactory;