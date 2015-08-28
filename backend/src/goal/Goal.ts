/// <reference path="../../typings/node-uuid/node-uuid.d.ts" />

/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />
/// <reference path="../../typings/moment-timezone/moment-timezone.d.ts" />

var moment = require('moment');
var moment_timezone = require('moment-timezone');

import uuid = require('node-uuid');

import ConditionList = require('../condition/ConditionList');
import Condition = require('../condition/Condition');
import Challenge = require('../challenge/UserChallenge');
import TimeBox = require('../TimeBox');
import Clock = require('../Clock');
import RecurringSession = require('./RecurringSession');


class Goal {
    private id;
    private name:string;
    private conditionsList:ConditionList;

    private startDate:moment.Moment;
    private endDate:moment.Moment;

    private durationInDays:number;
    private recurringSession:RecurringSession;

    private badgeID:string;


    constructor(name:string, startDate:moment.Moment, endDate:moment.Moment, durationInDays:number, badgeID:string, id = null, recurringSession:RecurringSession = new RecurringSession('month')) {
        if (!name) {
            throw new Error('Bad argument : name given is null');
        }

        this.conditionsList = new ConditionList();

        this.badgeID = badgeID;
        this.name = name;

        this.id = (id) ? id : uuid.v4();

        if (startDate != null && endDate != null && endDate.isBefore(startDate)) {
            throw new Error('End date is before start date');
        }

        this.startDate = startDate;
        this.endDate = endDate;

        this.recurringSession = recurringSession;

        this.durationInDays = durationInDays;
    }

    getStartDateOfSession(now) {
        return this.recurringSession.getCurrentSessionStart(now);
    }

    getEndDateOfSession(now) {
        return this.recurringSession.getCurrentSessionEnd(now);
    }

    getBadgeID() {
        return this.badgeID;
    }

    public getUUID() {
        return this.id;
    }

    public hasUUID(aUUID:string):boolean {
        return this.id === aUUID;
    }

    public setUUID(aUUID) {
        this.id = aUUID;
    }

    public setTimeBoxes(newTimeBox:TimeBox) {
        this.conditionsList.setTimeBoxes(newTimeBox);
    }

    public getStartDate():moment.Moment {
        return this.startDate;
    }

    public getEndDate():moment.Moment {
        return this.endDate;
    }

    public getDuration():number {
        return this.durationInDays;
    }

    public getName():string {
        return this.name;
    }

    public addCondition(expression:Condition) {
        this.conditionsList.addCondition(expression);
    }

    public evaluate(values:any, challenge:Challenge = null):boolean {

        if (challenge != null) {
            challenge.resetProgress();
        }

        return this.conditionsList.evaluate(values, challenge);
    }

    public getRequired():any {
        return this.conditionsList.getRequired();
    }

    public getConditions():ConditionList {
        return this.conditionsList;
    }

    public getData():any {
        return {
            "name": this.name,
            "conditions": this.conditionsList.getDataInJSON(),
            "timeBox": {
                "startDate": this.startDate,
                "endDate": this.endDate
            },
            "durationInDays": this.durationInDays,
            "badge": this.badgeID
        }
    }

    public getDataInJSON():any {
        return {
            id: this.id,
            name: this.name,
            timeBox: {
                startDate: this.startDate,
                endDate: this.endDate
            },
            duration: this.recurringSession.getDescription(),
            conditions: this.conditionsList.getDataInJSON(),
            badgeID: this.badgeID
        }
    }

    getStringRepresentation():string {
        return '\n#' + this.id + '\t' + this.name + '\n-\t' + this.startDate.toISOString() + ' :: ' + this.endDate.toISOString() + '\n' +
            ' - Récurrent : ' + this.recurringSession.getDescription()  + '\n' + this.conditionsList.getStringRepresentation();
    }
}

export = Goal;
