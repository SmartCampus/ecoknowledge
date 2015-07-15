/// <reference path="../../../typings/node-uuid/node-uuid.d.ts" />

import GoalInstance = require('../instance/GoalInstance');
import ExpressionHandler = require('../condition/ExpressionHandler');
import Expression = require('../condition/Expression');
import TimeBox = require('../../TimeBox');
import uuid = require('node-uuid');

class GoalDefinition {
    private id;
    private name:string;
    private expressions:ExpressionHandler = new ExpressionHandler();

    private startDate:Date;
    private endDate:Date;

    private durationInDays:number;

    constructor(name:string, startDate:Date, endDate:Date, durationInDays:number) {

        if (!name) {
            throw new Error('Bad argument : name given is null');
        }

        this.name = name;
        this.id = uuid.v4();

        this.startDate = startDate;
        this.endDate = endDate;
        this.durationInDays = durationInDays;
    }

    public setTimeBoxes(newTimeBox:TimeBox) {
        this.expressions.setTimeBoxes(newTimeBox);
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

    public getUUID() {
        return this.id;
    }

    public setUUID(aUUID) {
        this.id = aUUID;
    }

    public hasUUID(aUUID:string):boolean {
        return this.id === aUUID;
    }

    public getName():string {
        return this.name;
    }

    public addCondition(expression:Expression) {
        this.expressions.addExpression(expression);
    }

    public evaluate(values:any, goalInstance:GoalInstance = null):boolean {
        console.log("Evaluate a definition with", JSON.stringify(values));

        if (goalInstance != null) {
            goalInstance.resetProgress();
        }

        return this.expressions.evaluate(values, goalInstance);
    }

    public getRequired():string[][] {
        return this.expressions.getRequired();
    }

    public getData():any {
        return {
            "name": this.name,
            "conditions": this.expressions.getData()
        }
    }
}

export = GoalDefinition;
