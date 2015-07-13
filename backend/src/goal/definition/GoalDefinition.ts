/// <reference path="../../../typings/node-uuid/node-uuid.d.ts" />

import ExpressionHandler = require('../condition/ExpressionHandler');
import Expression = require('../condition/Expression');
import uuid = require('node-uuid');

class GoalDefinition {
    private id;
    private name:string;
    private expressions:ExpressionHandler = new ExpressionHandler();

    private startDate:Date;
    private endDate:Date;

    private durationInDays:number;

    constructor(name:string, startDate:Date=null, endDate:Date=null, durationInDays:number=null) {
        if (!name) {
            throw new Error('Bad argument : name given is null');
        }

        this.name = name;
        this.id = uuid.v4();
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

    public evaluate(values:any):boolean {
        return this.expressions.evaluate(values);
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
