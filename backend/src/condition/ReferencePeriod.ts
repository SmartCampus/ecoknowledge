/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />
/// <reference path="../../typings/moment-timezone/moment-timezone.d.ts" />

var moment = require('moment');
var moment_timezone = require('moment-timezone');

class ReferencePeriod {

    private numberOfUnitToSubtract:number;
    private unitToSubtract:string;

    constructor(numberOfUnitToSubtract:number, unitToSubtract:string) {
        this.numberOfUnitToSubtract = numberOfUnitToSubtract;
        this.unitToSubtract = unitToSubtract;
    }

    getTimeBoxRequired(startDate:moment.Moment) {
        var dateOfCreation:moment.Moment = startDate.clone();
        dateOfCreation = dateOfCreation.subtract(this.numberOfUnitToSubtract, this.unitToSubtract);
        return dateOfCreation;
    }

    getDataInJSON():any {
        return {
            numberOfUnitToSubtract: this.numberOfUnitToSubtract,
            unitToSubtract:this.unitToSubtract
        }
    }
}

export = ReferencePeriod;