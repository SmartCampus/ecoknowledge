/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />
/// <reference path="../../typings/moment-timezone/moment-timezone.d.ts" />

var moment = require('moment');
var moment_timezone = require('moment-timezone');
import UUID = require('node-uuid');

import Goal = require('./Goal');
import ConditionFactory = require('../condition/factory/ConditionFactory');
import BadArgumentException = require('../exceptions/BadArgumentException');
import RecurringSession = require('./RecurringSession');
import Clock = require('../Clock');

class GoalFactory {

    private conditionFactory:ConditionFactory;

    constructor() {
        this.conditionFactory = new ConditionFactory();
    }

    public restoreGoal(data:any):Goal {
        if (data.id == null) {
            throw new BadArgumentException('Can not create given goal because field "id" is null');
        }
        return this.createGoal(data);
    }

    public createGoal(data:any):Goal {

        this.checkData(data);

        var goalID = (data.id == null) ? UUID.v4() : data.id;
        var goalName:string = data.name;
        var badge:string = data.badgeID;

        var startDateOfValidityPeriod:moment.Moment = Clock.getMomentFromString(data.validityPeriod.start);
        var endDateOfValidityPeriod:moment.Moment = Clock.getMomentFromString(data.validityPeriod.end);

        var recurringType:string = data.recurringPeriod;
        var recurringPeriod = new RecurringSession(recurringType);

        var newGoal:Goal = new Goal(goalID, goalName, badge, startDateOfValidityPeriod, endDateOfValidityPeriod, recurringPeriod);

        var goalConditions:any[] = data.conditions;
        for (var i = 0; i < goalConditions.length; i++) {
            var currentExpression = this.conditionFactory.createCondition(goalConditions[i]);
            newGoal.addCondition(currentExpression);
        }
        //  console.log("Creation de l'objectif", goalName, "valide du", startDateOfValidityPeriod, "au", endDateOfValidityPeriod, "avec le badge", newGoal.getBadgeID());

        return newGoal;
    }

    private checkData(data:any) {
        if (data.name == null) {
            throw new BadArgumentException('Can not create given goal because field "name" is null');
        }

        if (data.badgeID == null) {
            throw new BadArgumentException('Can not create given goal because field "badgeID" is null');
        }

        if (data.conditions == null) {
            throw new BadArgumentException('Can not create given goal because array "conditions" is null');
        }

        if (data.recurringPeriod == null) {
            throw new BadArgumentException('Can not create given goal because field "recurringPeriod" is null');
        }

        if (data.validityPeriod == null) {
            throw new BadArgumentException('Can not create given goal because field "validityPeriod" is missing');
        }

        if (data.validityPeriod.start == null) {
            throw new BadArgumentException('Can not create given goal because field "validityPeriod.start" is null');
        }

        if (data.validityPeriod.end == null) {
            throw new BadArgumentException('Can not create given goal because field "validityPeriod.end" is null');
        }

        var startDateOfValidityPeriod:moment.Moment = Clock.getMomentFromString(data.validityPeriod.start);
        var endDateOfValidityPeriod:moment.Moment = Clock.getMomentFromString(data.validityPeriod.end);

        if (startDateOfValidityPeriod != null && endDateOfValidityPeriod != null && endDateOfValidityPeriod.isBefore(startDateOfValidityPeriod)) {
            throw new BadArgumentException('Can not create given goal because "validityPeriod.end" is before "validityPeriod.start"');
        }
    }
}

export = GoalFactory;