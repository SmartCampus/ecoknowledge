/// <reference path="../typings/node-uuid/node-uuid.d.ts" />

var TimeBoxSchema:any = require('./database/models/timebox.js').schema;

import ModelItf = require('./ModelItf');

class TimeBox extends ModelItf {

    private startDateInMillis:number;
    private endDateInMillis:number;

    constructor(startDateInMillis:number, endDateInMillis:number, id = null, createdAt = null, updatedAt = null) {
        super(id, createdAt, updatedAt);
        this.startDateInMillis = startDateInMillis;
        this.endDateInMillis = endDateInMillis;
    }

    public isInTimeBox(currentDateInMillis):boolean {
        console.log("COMPARING", currentDateInMillis, " > ", this.startDateInMillis, "<", this.endDateInMillis);

        return currentDateInMillis >= this.startDateInMillis && currentDateInMillis <= this.endDateInMillis;
    }

    public getStartDateInMillis():number {
        return this.startDateInMillis;
    }

    public getEndDateInMillis():number {
        return this.endDateInMillis;
    }

    public getStartDate():string {
        return this.convertTime(this.startDateInMillis);
    }

    public getEndDate():string {
        return this.convertTime(this.endDateInMillis);
    }

    /**
     *
     * @returns {{startDate: string, endDate: string}}
     */
    public getRequired():any {
        var startDateStr = this.convertTime(this.startDateInMillis);
        var endDateStr = this.convertTime(this.endDateInMillis);

        return {
            'startDate': startDateStr,
            'endDate': endDateStr
        }
    }

    private convertTime(aDateInMillis):string {
        var date:string = new Date(aDateInMillis).toISOString();

        var dateWithoutTail:string[] = date.split('.');
        var headOfDate:string = dateWithoutTail[0];

        var arrayOfHeadOfDate:string[] = headOfDate.split('T');
        var properDate:string = arrayOfHeadOfDate[0] + " " + arrayOfHeadOfDate[1];

        return properDate;
    }

    public toJSONObject():any {
        return {
            startDate: this.startDateInMillis,
            endDate: this.endDateInMillis
        }
    }

    static fromJSONObject(jsonObject:any) {
        if(!jsonObject.startDate || !jsonObject.endDate) {
            throw new Error("Can not build time box, field startDate or endDate is missing");
        }

        return new TimeBox(jsonObject.startDate, jsonObject.endDate);
    }

    create(successCallback:Function, failCallback:Function) {
        var self = this;

        if (!this.hasBeenSaved()) {
            TimeBoxSchema.create(this.toJSONObject())
                .then(function (timeBox) {
                    self._selfSequelize = timeBox;

                    var uObject = TimeBox.fromJSONObject(timeBox.dataValues);
                    self._id = uObject.getId();

                    successCallback(timeBox);
                })
                .error(function (error) {
                    console.log("ERROR ON CREATE TIMEBOX", error)
                    failCallback(error);
                });
        } else {
            console.log("TIMEBOX ALREADY EXISTS");
            failCallback(new ModelException("Timebox already exists."));
        }

    }
}

export = TimeBox;