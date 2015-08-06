/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />
/// <reference path="../../typings/moment-timezone/moment-timezone.d.ts" />

import Challenge = require('./Challenge');
import Goal = require('../goal/Goal');
import GoalRepository = require('../goal/GoalRepository');
import UserRepository = require('../user/UserRepository');
import TimeBoxFactory = require('../TimeBoxFactory');
import TimeBox = require('../TimeBox');
import Clock = require('../Clock');

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
        var nowDate:moment.Moment = now;
        var mapGoalsToConditionAndSensors:any = goalJSONDesc.conditions;

        if (data.startDate != null) {
            return this.restoreChallenge(challengeID, data, goal, challengeDescription, goalRepository, mapGoalsToConditionAndSensors, nowDate);
        }

        /*  TODO check the badge status
            if(now.isAfter(startDate) && now.isBefore(endDate)) status = BadgeStatus.Run;
            etc
            This can be done only when goal will be recurrent (lol)
        */


        /*
         if(!this.checkDates(goalDefinition,startDate)) {
         throw new Error('Can not build goal instance ! it does not have the time to be achieved. We are the '
         + now  + ', the goal start the' + goalDefinition.getStartDate() + ' and end the ' +goalDefinition.getEndDate() + ' with a duration of ' + goalDefinition.getDuration() + ' days');
         }
         */

        var endDate:moment.Moment = moment(new Date(nowDate.year(), nowDate.month(), nowDate.date() + goal.getDuration(), nowDate.hour(), nowDate.minutes(), nowDate.seconds()));


        var challenge:Challenge = new Challenge(nowDate, endDate, challengeDescription, goal, mapGoalsToConditionAndSensors, challengeID);

        // TODO attach badge to user
        // user.addBadgeByDescription(badge);

        // console.log("L'objectif ", goalDefinition.getName(), "a ete instancie ! Intervalle de vie de l'objectif : du", startDate, "au", endDate);

        return challenge;
    }

    private restoreChallenge(id, data:any, goalDefinition:Goal, goalInstanceDescription:string, goalRepository:GoalRepository, mapGoalsToConditionAndSensors, now:moment.Moment):Challenge{
        var startDateDesc = data.startDate;
        var endDateDesc = data.endDate;

        var startDate = Clock.getMoment(startDateDesc);
        var endDate = Clock.getMoment(endDateDesc);

        var challenge:Challenge = new Challenge(startDate, endDate, goalInstanceDescription, goalDefinition, mapGoalsToConditionAndSensors, id);
        return challenge;
    }

    /**
     * Check if the goal instance is started today, Date.now + goalDefinition#duration <= goalDefinition#endDate
     * @param goalDefinition
     */
    public checkDates(goalDefinition:Goal, startDate:moment.Moment):boolean {
        var durationInDays:number = goalDefinition.getDuration();

        var endDate:moment.Moment = Clock.getMoment(new Date(startDate.year(), startDate.month(), startDate.day() + durationInDays).getTime());
        var endDateOfValidityPeriod:moment.Moment = goalDefinition.getEndDate();

        return endDate.isBefore(endDateOfValidityPeriod);
    }
}

export = GoalInstanceFactory;