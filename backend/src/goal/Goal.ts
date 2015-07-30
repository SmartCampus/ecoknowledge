/// <reference path="../../typings/node-uuid/node-uuid.d.ts" />

import uuid = require('node-uuid');

import ConditionList = require('../condition/ConditionList');
import Condition = require('../condition/Condition');
import Challenge = require('../challenge/Challenge');
import TimeBox = require('../TimeBox');

class Goal {
    private id;
    private name:string;
    private conditionsList:ConditionList;

    private startDate:Date;
    private endDate:Date;

    private durationInDays:number;

    private badgeID:string;

    constructor(name:string, startDate:Date, endDate:Date, durationInDays:number, badgeID:string, id = null) {
        if (!name) {
            throw new Error('Bad argument : name given is null');
        }

        this.conditionsList = new ConditionList();

        this.badgeID = badgeID;
        this.name = name;

        this.id = (id) ? id : uuid.v4();

        if (startDate != null && endDate != null && endDate.getTime() < startDate.getTime()) {
            throw new Error('End date is before start date');
        }

        this.startDate = startDate;
        this.endDate = endDate;
        this.durationInDays = durationInDays;
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

    public getStartDate():Date {
        return this.startDate;
    }

    public getEndDate():Date {
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

    public evaluate(values:any, goalInstance:Challenge = null):boolean {

        if (goalInstance != null) {
            goalInstance.resetProgress();
        }

        return this.conditionsList.evaluate(values, goalInstance);
    }

    public getRequired():any {
        return this.conditionsList.getRequired();
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
            duration: this.durationInDays,
            conditions: this.conditionsList.getDataInJSON(),
            badgeID: this.badgeID
        }
    }
}

export = Goal;
