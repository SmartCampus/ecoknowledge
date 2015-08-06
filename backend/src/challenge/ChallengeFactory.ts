/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />
/// <reference path="../../typings/moment-timezone/moment-timezone.d.ts" />

import Challenge = require('./Challenge');
import Goal = require('../goal/Goal');
import GoalRepository = require('../goal/GoalRepository');
import UserRepository = require('../user/UserRepository');
import TimeBoxFactory = require('../TimeBoxFactory');
import TimeBox = require('../TimeBox');
import ChallengeStatus = require('../Status');
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

        //  We restore it from DB
        if (data.startDate != null) {
            return this.restoreChallenge(challengeID, data, goal, challengeDescription, goalRepository, mapGoalsToConditionAndSensors, now);
        }

        //  The user just took a new challenge

        var clone = now.clone();
        //console.log("NOW?", clone.format());

        var startDate = goal.getStartDateOfSession(clone);
        var endDate = goal.getEndDateOfSession(clone.clone());

        /*
        console.log("START DATE OF SESSION", startDate.format());
        console.log("START DATE OF SESSION", startDate.toISOString());

        console.log("END DATE OF SESSION", endDate.format());
        console.log("END DATE OF SESSION", endDate.toISOString());
        */

        /*
         if(!this.checkDates(goalDefinition,startDate)) {
         throw new Error('Can not build goal instance ! it does not have the time to be achieved. We are the '
         + now  + ', the goal start the' + goalDefinition.getStartDate() + ' and end the ' +goalDefinition.getEndDate() + ' with a duration of ' + goalDefinition.getDuration() + ' days');
         }
         */


        var challenge:Challenge = new Challenge(startDate, endDate, challengeDescription, goal, mapGoalsToConditionAndSensors, challengeID);


        if(now.isBefore(startDate)) {
            //console.log("Le challenge est en WAIT");
            challenge.setStatus(ChallengeStatus.WAIT);
        }
        if(now.isAfter(startDate) && now.isBefore(endDate)) {
            ///console.log("Le challenge est en RUN");
            challenge.setStatus(ChallengeStatus.RUN);
        }

        // TODO attach badge to user
        // user.addBadgeByDescription(badge);

        // console.log("L'objectif ", goalDefinition.getName(), "a ete instancie ! Intervalle de vie de l'objectif : du", startDate, "au", endDate);

        return challenge;
    }

    private restoreChallenge(id, data:any, goalDefinition:Goal, goalInstanceDescription:string, goalRepository:GoalRepository, mapGoalsToConditionAndSensors, now:moment.Moment):Challenge{
        //console.log("RESTORE CHALLENGE");

        var startDateDesc = data.startDate;
        var endDateDesc = data.endDate;

        var startDate = Clock.getMoment(startDateDesc);
        var endDate = Clock.getMoment(endDateDesc);

        var challenge:Challenge = new Challenge(startDate, endDate, goalInstanceDescription, goalDefinition, mapGoalsToConditionAndSensors, id);
        return challenge;
    }

    private realignStartAndEndDates(goal:Goal, now:moment.Moment) {

    }

    /**
     * Check if the goal instance is started today, Date.now + goalDefinition#duration <= goalDefinition#endDate
     * @param goalDefinition
     */
    public checkDates(goalDefinition:Goal, startDate:moment.Moment):boolean {
        var durationInDays:number = goalDefinition.getDuration();

        var endDate:moment.Moment = Clock.getMoment(0).year(startDate.year()).month(startDate.month()).date(startDate.date() + durationInDays);
        var endDateOfValidityPeriod:moment.Moment = goalDefinition.getEndDate();

        return endDate.isBefore(endDateOfValidityPeriod);
    }

}

export = GoalInstanceFactory;