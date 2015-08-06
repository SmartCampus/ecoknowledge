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

    protected expression:GoalExpression;
    protected thresholdRate:number;

    protected startDate:moment.Moment;
    protected dateOfCreation:moment.Moment;
    protected endDate:moment.Moment;

    protected timeBox:TimeBox;

    protected percentageAchieved:number;
    protected percentageOfTimeElapsed:number;

    protected filter:Filter;

    /**
     * Constructor of base class Condition, it allows you to build a goal condition
     * @param id
     *      The id of the condition. If null, the id will be generated.
     * @param expression
     *      The expression object, for instance 'TMP_Cli > 25'
     * @param thresholdRate
     *      This value represents the threshold rate when the condition must be verified
     * @param startDate
     *      The start of the application of the current condition - for instance start date of the goal instance
     * @param dateOfCreation
     *      The date of creation of the parent goal
     * @param endDate
     *      The end of the application of the current condition - for instance end date of the goal instance
     * @param percentageAchieved
     *      The percentage of progression achieved
     * @param percentageOfTimeElapsed
     *      The percentage of time elapsed between 'now' and startDate
     */
    constructor(id:string, expression:GoalExpression, thresholdRate:number,
                startDate:moment.Moment, dateOfCreation:moment.Moment, endDate:moment.Moment,
                percentageAchieved:number = 0, percentageOfTimeElapsed:number = 0, filter:Filter = null) {

        this.id = (id) ? id : UUID.v4();

        this.expression = expression;
        this.thresholdRate = thresholdRate;

        this.startDate = startDate;
        this.dateOfCreation = dateOfCreation;
        this.endDate = endDate;

        this.timeBox = new TimeBox(this.startDate, this.endDate);

        this.percentageAchieved = percentageAchieved;
        this.percentageOfTimeElapsed = percentageOfTimeElapsed;

        this.filter = (filter) ? filter : new Filter('all', ['all']);
    }

    getStringRepresentation():string {
        return this.expression.getStringRepresentation() + " - " + this.expression.getDescription();
    }

    /**
     * This method will return the id of the current condition
     * @returns {string}
     *      The id of the current condition
     */
    getID():string {
        return this.id;
    }

    /**
     * This method will return the field required by its expression,
     * the symbolic name(s) of the expression.
     * See GoalExpression#getRequired method
     * @returns {string[]}
     *      The array of symbolic names in the expression
     */
    getRequired():any {
        var result:any = {};
        var sensorRequired:string[] = this.expression.getRequired();

        for (var currentSensorRequiredIndex in sensorRequired) {
            var currentSensorRequired:string = sensorRequired[currentSensorRequiredIndex];
            result[currentSensorRequired] = this.timeBox.getRequired();
        }

        return result;
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

    getStartDate():moment.Moment {
        return this.startDate;
    }

    setStartDate(newStartDate:moment.Moment):void {
        this.startDate = newStartDate;
    }

    getEndDate():moment.Moment {
        return this.endDate;
    }

    setEndDate(newEndDate:moment.Moment):void {
        this.endDate = newEndDate;
    }

    setTimeBox(newTimeBox:TimeBox) {

        this.timeBox = newTimeBox;
        this.startDate = newTimeBox.getStartDate();
        this.endDate = newTimeBox.getEndDate();
        console.log("TIMEBOX SET AT", newTimeBox, "So now, condition have", this.startDate.format(), "and", this.endDate.format());
    }

    isInTimeBox(date:moment.Moment):boolean {
        return this.timeBox.isDateInTimeBox(date);
    }

    setPercentageAchieved(newPercentageAchieved:number) {
        this.percentageAchieved = newPercentageAchieved;
    }

    updatePercentageOfTimeElapsed(currentDate:number) {

        var currentMoment:moment.Moment = Clock.getMoment(currentDate);
        if (currentMoment.isBefore(this.getStartDate())) {
            throw new Error('Time given is before dateOfCreation !');
        }

        var duration = this.getEndDate().valueOf() - this.getStartDate().valueOf();

        var durationAchieved = currentMoment.valueOf() - this.getStartDate().valueOf();
        this.percentageOfTimeElapsed = durationAchieved * 100 / duration;
    }

    getPercentageOfTimeElapsed():number {
        return this.percentageOfTimeElapsed;
    }

    setPercentageOfTimeElapsed(newPercentageOfTimeElapsed:number) {
        this.percentageOfTimeElapsed = newPercentageOfTimeElapsed;
    }

    getPercentageAchieved():number {
        return this.percentageAchieved;
    }

    getDataInJSON():any {
        return {
            id: this.id,
            expression: this.expression.getDataInJSON(),
            threshold: this.thresholdRate,
            startDate: this.startDate,
            dateOfCreation: this.dateOfCreation,
            endDate: this.endDate,
            percentageAchieved: this.percentageAchieved,
            percentageOfTimeElapsed: this.percentageOfTimeElapsed,
            filter: this.filter.getDataInJSON()
        }
    }

    evaluate(data:any):boolean {
        throw new Error('Can not call base class method ! Must be overridden and implemented.');
    }

    applyFilters(data:any):any {
        return data;//this.filter.apply(data);
    }
}

export = Condition;