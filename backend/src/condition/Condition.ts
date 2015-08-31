/// <reference path="../../typings/node-uuid/node-uuid.d.ts" />
/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />
/// <reference path="../../typings/moment-timezone/moment-timezone.d.ts" />

var moment = require('moment');
var moment_timezone = require('moment-timezone');

import TimeBox = require('../TimeBox');
import Filter = require('../filter/Filter');
import GoalExpression = require('./expression/GoalExpression');
import UUID = require('node-uuid');
import Clock = require('../Clock');

class Condition {
    protected id:string;
    protected description:string;

    protected expression:GoalExpression;
    protected thresholdRate:number;

    protected filter:Filter;

    constructor(id:string, description:string, expression:GoalExpression, thresholdRate:number, filter:Filter = null) {

        this.id = id;

        this.description = description;

        this.expression = expression;
        this.thresholdRate = thresholdRate;

        this.filter = (filter) ? filter : new Filter('all', ['all']);
    }


    getTimeBoxRequired(startDateOfChallenge:moment.Moment, endDateOfChallenge:moment.Moment):any {

        //  Must be overridden by any condition that need more time than
        //  start date and end date of challenge (caller)
        return {start: startDateOfChallenge, end: endDateOfChallenge};
    }

    /**
     *
     * @param data
     *      {
     *          <ASymbolicName> : [  {date : ., value : .},  ...  ]
     *      }
     * @param conditionDescription
     *      {
     *          timeBox: {
     *              start: .,
     *              end: .
     *          }
     *      }
     * @returns {any[]}
     */
    keepUsefulValues(data:any, conditionDescription:any):any {
        var result:any = {};

        var startDate:moment.Moment = conditionDescription.timeBox.start;
        var endDate:moment.Moment = conditionDescription.timeBox.end;

        //  For each symbolic names in data
        for (var currentSymbolicName in data) {
            var currentResult:any[] =[];

            var currentDataArray:any = data[currentSymbolicName];
            for (var currentDataIndex in currentDataArray) {
                var currentData:any = currentDataArray[currentDataIndex];
                var date:moment.Moment = Clock.getMomentFromString(currentData.date);
                if (date.isAfter(startDate) && date.isBefore(endDate)) {
                    currentResult.push(currentData);
                }
            }

            result[currentSymbolicName] = currentResult;
        }

        return result;
    }

    getRequiredByCondition(startDate, endDate) {
        var result:any = {};
        var symbolicNames:string[] = this.expression.getRequired();

        result.symbolicNames = symbolicNames;
        result.timeBox = this.getTimeBoxRequired(startDate, endDate);

        return result;
    }

    getStringRepresentation():string {
        return this.expression.getStringRepresentation() + " - filtre " + JSON.stringify(this.filter.getDataInJSON());
    }

    getID():string {
        return this.id;
    }


    hasLeftOperand(operandName:string):boolean {
        return this.expression.hasLeftOperand(operandName);
    }

    hasRightOperand(operandName:string):boolean {
        return this.expression.hasRightOperand(operandName);
    }

    hasComparisonType(comparisonType:string):boolean {
        return this.expression.getComparisonType() === comparisonType;
    }

    getDataInJSON():any {
        return {
            id: this.id,
            description: this.description,
            expression: this.expression.getDataInJSON(),
            threshold: this.thresholdRate,
            filter: this.filter.getDataInJSON()
        }
    }

    /**
     *
     * @param data
     *      [ { date : ..., value : ...} ]
     * @param conditionDescription
     *      {
     *          symbolic_names: [..],
     *          timeBox: {
     *              start:...,
     *              end:...
     *           }
     *      }
     */
    evaluate(data:any, conditionDescription:any):any {
        throw new Error('Can not call base class method ! Must be overridden and implemented.');
    }

    applyFilters(data:any):any {
        var remainingData = this.filter.apply(data);
        return remainingData;
    }
}

export = Condition;