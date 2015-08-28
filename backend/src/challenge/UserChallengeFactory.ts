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

class GoalInstanceFactory {

    restoreChallenge(data:any, goalRepository:GoalRepository, userRepository:UserRepository, now:moment.Moment):UserChallenge {

        var goalID:string = data.goalID;
        if(goalID == null) {
            throw new BadArgumentException('Can not restore given challenge because goalID is null');
        }

        var userID:string = data.userID;
        if(userID == null) {
            throw new BadArgumentException('Can not restore given challenge because userID is null');
        }

        var goal:Goal = goalRepository.getGoal(goalID);
        if(goal == null) {
            throw new BadArgumentException('Can not restore given challenge because goal with id ' + goalID + ' was not found');
        }

        var user:User = userRepository.getUser(userID);
        if(user == null) {
            throw new BadArgumentException('Can not restore given challenge because user with id ' + userID + ' was not found');
        }

        var startDateDesc = data.startDate;
        var endDateDesc = data.endDate;

        var startDate = Clock.getMoment(startDateDesc);
        var endDate = Clock.getMoment(endDateDesc);

        var challenge:UserChallenge = this.createChallenge(goal, user, now, startDate, endDate);

        return challenge;
    }

    createChallenge(goal:Goal, user:User, now:moment.Moment, startDateSaved = null, endDateSaved = null):UserChallenge {
        var clone = now.clone();

        var startDateOfChallenge = (startDateSaved == null) ? goal.getStartDateOfSession(clone) : startDateSaved;
        var endDateOfChallenge = (endDateSaved == null) ? goal.getEndDateOfSession(clone.clone()) : endDateSaved;

        var newChallenge:UserChallenge = new UserChallenge(goal, user, startDateOfChallenge, endDateOfChallenge);

        if (newChallenge.getEndDate().isAfter(goal.getEndDate())) {
            return null;
        }
        if (now.isBefore(startDateOfChallenge)) {
            newChallenge.setStatus(ChallengeStatus.WAIT);
        }
        if (now.isAfter(startDateOfChallenge) && now.isBefore(endDateOfChallenge)) {
            newChallenge.setStatus(ChallengeStatus.RUN);
        }

        return newChallenge;
    }
}

export = GoalInstanceFactory;