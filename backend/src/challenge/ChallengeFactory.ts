import Challenge = require('./Challenge');
import Goal = require('../goal/Goal');
import GoalRepository = require('../goal/GoalRepository');
import UserRepository = require('../user/UserRepository');
import TimeBoxFactory = require('../TimeBoxFactory');
import TimeBox = require('../TimeBox');
import ChallengeStatus = require('../Status');


var moment = require('moment');
var moment_timezone = require('moment-timezone');

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
    public createGoalInstance(data:any, goalRepository:GoalRepository, userProvider:UserRepository, now:moment.Moment):Challenge {

        var challengeID = data.id;

        var challengeDescription:string = data.description;

        var goalJSONDesc:any = data.goal;
        var goalID = goalJSONDesc.id;
        var goal:Goal = goalRepository.getGoal(goalID);

        if (goal == null) {
            throw new Error('Can not create goal instance because ID given of goal definition can not be found');
        }

        //  Check if challenge is built from db (startDate and endDate are provided in data parameter)
        //  Or if challengeFactory was called from a 'newChallenge' method

        var mapGoalsToConditionAndSensors:any = goalJSONDesc.conditions;

        //  We restore it from DB
        if (data.startDate != null) {
            return this.restoreChallenge(challengeID, data, goal, challengeDescription, goalRepository, mapGoalsToConditionAndSensors, now);
        }

        //  The user just took a new challenge

        var clone = now.clone();
        var startDate = goal.getStartDateOfSession(clone);
        var endDate = goal.getEndDateOfSession(clone);

        /*
         if(!this.checkDates(goalDefinition,startDate)) {
         throw new Error('Can not build goal instance ! it does not have the time to be achieved. We are the '
         + now  + ', the goal start the' + goalDefinition.getStartDate() + ' and end the ' +goalDefinition.getEndDate() + ' with a duration of ' + goalDefinition.getDuration() + ' days');
         }
         */

        //  TODO delete date construction
        var challenge:Challenge = new Challenge(new Date(startDate.valueOf()), new Date(endDate.valueOf()), challengeDescription, goal, mapGoalsToConditionAndSensors, challengeID);

        if(now.isBefore(startDate)) {
            challenge.setStatus(ChallengeStatus.WAIT);
        }
        if(now.isAfter(startDate) && now.isBefore(endDate)) {
            challenge.setStatus(ChallengeStatus.RUN);
        }

        // TODO attach badge to user
        // user.addBadgeByDescription(badge);

        // console.log("L'objectif ", goalDefinition.getName(), "a ete instancie ! Intervalle de vie de l'objectif : du", startDate, "au", endDate);

        return challenge;
    }

    private restoreChallenge(id, data:any, goalDefinition:Goal, goalInstanceDescription:string, goalRepository:GoalRepository, mapGoalsToConditionAndSensors, now:moment.Moment):Challenge{
        var startDateDesc = data.startDate;
        var endDateDesc = data.endDate;

        var startDate = moment(startDateDesc);
        var endDate = moment(endDateDesc);

        var challenge:Challenge = new Challenge(startDate, endDate, goalInstanceDescription, goalDefinition, mapGoalsToConditionAndSensors, id);
        return challenge;
    }

    private realignStartAndEndDates(goal:Goal, now:moment.Moment) {

    }

    /**
     * Check if the goal instance is started today, Date.now + goalDefinition#duration <= goalDefinition#endDate
     * @param goalDefinition
     */
    public checkDates(goalDefinition:Goal, startDate:Date):boolean {
        var durationInDays:number = goalDefinition.getDuration();

        var endDate:Date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + durationInDays);
        var endDateOfValidityPeriod = goalDefinition.getEndDate();

        return endDate.getTime() <= endDateOfValidityPeriod.getTime();
    }
}

export = GoalInstanceFactory;