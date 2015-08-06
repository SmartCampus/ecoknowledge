/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/moment/moment.d.ts" />
/// <reference path="../typings/moment-timezone/moment-timezone.d.ts" />

var moment = require('moment');
var moment_timezone = require('moment-timezone');

import Clock = require('./Clock');

class TimeBox {

    private startDate:moment.Moment;
    private endDate:moment.Moment;

    constructor(starDate:moment.Moment, endDate:moment.Moment) {
        this.startDate = starDate;
        this.endDate = endDate;
    }

    public isDateInMillisInTimeBox(currentDateInMillis:number):boolean{
        var currentInMillis:moment.Moment = moment(currentDateInMillis);
        return currentInMillis.isAfter(this.startDate) && currentInMillis.isBefore(this.endDate);
    }

    public isDateInTimeBox(currentDate:moment.Moment):boolean{
        return this.isDateInMillisInTimeBox(currentDate.valueOf());
    }

    public getStartDate():moment.Moment {
        return this.startDate;
    }

    public getStartDateInMillis():number {
        return this.startDate.valueOf();
    }

    public getEndDate():moment.Moment {
        return this.endDate;
    }

    public getEndDateInMillis():number {
        return this.endDate.valueOf();
    }

    public getStartDateInStringFormat():string {
        return this.convertTimeForMiddlewareAPI(this.startDate.valueOf());
    }

    public getEndDateInStringFormat():string {
        return this.convertTimeForMiddlewareAPI(this.endDate.valueOf());
    }

    /**
     *
     * @returns {{startDate: string, endDate: string}}
     */
    public getRequired():any {
        var startDateStr = this.convertTimeForMiddlewareAPI(this.startDate.valueOf());
        var endDateStr = this.convertTimeForMiddlewareAPI(this.endDate.valueOf());

        return {
            'startDate':startDateStr,
            'endDate':endDateStr
        }
    }

    /**
     * This method is needed because API of SmartCampus middleware wants
     * dates in the following format : YYYY-MM-DD hh:mm:ss</br>
     * We wanted to isolated this behavior in a specific method.
     * @param aDateInMillis
     *      The date in millis to convert
     * @returns {string}
     *      The given date in the following format : YYYY-MM-DD hh:mm:ss</br>
     *      Uses Date#toISOString method.
     */
    public convertTimeForMiddlewareAPI(aDateInMillis):string {
        var m = Clock.getMoment(aDateInMillis);
        var date:string=m.format();

        var dateWithoutTimeZone:string[] = date.split('+');
        var dateWithoutTail:string[] = dateWithoutTimeZone[0].split('.');
        var headOfDate:string = dateWithoutTail[0];

        var arrayOfHeadOfDate:string[] = headOfDate.split('T');
        var properDate:string= arrayOfHeadOfDate[0] + " " + arrayOfHeadOfDate[1];

        return properDate;
    }
}

export = TimeBox;