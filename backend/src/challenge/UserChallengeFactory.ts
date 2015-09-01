/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />
/// <reference path="../../typings/moment-timezone/moment-timezone.d.ts" />

import UserChallenge = require('./UserChallenge');
import User = require('../user/User');
import Goal = require('../goal/Goal');
import GoalRepository = require('../goal/GoalRepository');
import UserRepository = require('../user/UserRepository');
import TimeBoxFactory = require('../TimeBoxFactory');
import TimeBox = require('../TimeBox');
import ChallengeStatus = require('../Status');
import Clock = require('../Clock');

import BadArgumentException = require('../exceptions/BadArgumentException');

var moment = require('moment');
var moment_timezone = require('moment-timezone');
import UUID = require('node-uuid');

class GoalInstanceFactory {

    restoreChallenge(data:any, goalRepository:GoalRepository, userRepository:UserRepository, now:moment.Moment):UserChallenge {

        this.checkDataFromRestore(data, goalRepository, userRepository);

        var challengeID:string = data.id;
        challengeID = (challengeID == null) ? UUID.v4() : challengeID;

        var goalID:string = data.goalID;
        var userID:string = data.userID;

        var goal:Goal = goalRepository.getGoal(goalID);
        var user:User = userRepository.getUser(userID);

        var startDateDesc = data.startDate;
        var endDateDesc = data.endDate;

        var startDate = Clock.getMoment(startDateDesc);
        var endDate = Clock.getMoment(endDateDesc);

        var mapConditionIDToSensorAndTimeBoxRequired:any = data.mapConditionIDToSensorAndTimeBoxRequired;

        var challenge:UserChallenge = this.newChallenge(challengeID, goal, user, mapConditionIDToSensorAndTimeBoxRequired, startDate, endDate, now);

        return challenge;
    }

    createChallenge(goal:Goal, user:User, now:moment.Moment):UserChallenge {
        this.checkDataFromCreate(goal, user, now);

        var challengeID = UUID.v4();

        var clone = now.clone();

        var startDateOfChallenge = goal.getStartDateOfSession(clone);
        var endDateOfChallenge = goal.getEndDateOfSession(clone.clone());

        var mapConditionIDToSensorAndTimeBoxRequired:any = {};

        var goalConditions = goal.getConditions();
        for (var conditionIndex in goalConditions) {
            var currentCondition = goalConditions[conditionIndex];
            var conditionID = currentCondition.getID();
            var symbolicNamesAndTimeBoxRequired = currentCondition.getRequiredByCondition(startDateOfChallenge, endDateOfChallenge);

            mapConditionIDToSensorAndTimeBoxRequired[conditionID]  = symbolicNamesAndTimeBoxRequired;

        }

        var result = this.newChallenge(challengeID, goal, user, mapConditionIDToSensorAndTimeBoxRequired, startDateOfChallenge, endDateOfChallenge, now);

        return result;
    }

    private newChallenge(challengeID, goal, user, mapConditionIDToSymbolicNamesAndTimeBoxesRequired, startDate, endDate, now):UserChallenge {
        var newChallenge:UserChallenge = new UserChallenge(challengeID, goal, user, startDate, endDate, mapConditionIDToSymbolicNamesAndTimeBoxesRequired);

        if (newChallenge.getEndDate().isAfter(goal.getEndOfValidityPeriod())) {
            return null;
        }
        if (now.isBefore(startDate)) {
            newChallenge.setStatus(ChallengeStatus.WAIT);
        }
        if (now.isAfter(startDate) && now.isBefore(endDate)) {
            newChallenge.setStatus(ChallengeStatus.RUN);
        }
        return newChallenge;
    }

    checkDataFromCreate(goal, user, now) {
        if (goal == null) {
            throw new BadArgumentException('Can not create given challenge because given goal is null');
        }

        if (user == null) {
            throw new BadArgumentException('Can not create given challenge because given user is null');
        }

        if (now == null) {
            throw new BadArgumentException('Can not create given challenge because given "now" is null');
        }
    }

    checkDataFromRestore(data:any, goalRepository:GoalRepository, userRepository:UserRepository):void {
        var goalID:string = data.goalID;
        if (goalID == null) {
            throw new BadArgumentException('Can not restore given challenge because goalID is null');
        }

        var userID:string = data.userID;
        if (userID == null) {
            throw new BadArgumentException('Can not restore given challenge because userID is null');
        }

        var goal:Goal = goalRepository.getGoal(goalID);
        if (goal == null) {
            throw new BadArgumentException('Can not restore given challenge because goal with id ' + goalID + ' was not found');
        }

        var user:User = userRepository.getUser(userID);
        if (user == null) {
            throw new BadArgumentException('Can not restore given challenge because user with id ' + userID + ' was not found');
        }

        var mapConditionIDToSensorAndTimeBoxRequired:any = data.mapConditionIDToSensorAndTimeBoxRequired;
        if (mapConditionIDToSensorAndTimeBoxRequired == null) {
            throw new BadArgumentException('Can not restore given challenge because map (conditionID) -> to -> (sensor and timeBoxRequired) is null');
        }
    }
}

export = GoalInstanceFactory;