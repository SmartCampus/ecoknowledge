/// <reference path="../../typings/node-uuid/node-uuid.d.ts" />

import TimeBox = require('../TimeBox');

import GoalExpression = require('./expression/GoalExpression');
import UUID = require('node-uuid');

class Condition {
    protected id:string;

    protected expression:GoalExpression;
    protected thresholdRate:number;

    protected startDate:Date;
    protected dateOfCreation:Date;
    protected endDate:Date;

    protected timeBox:TimeBox;

    protected percentageAchieved:number;
    protected percentageOfTimeElapsed:number;

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
                startDate:Date, dateOfCreation:Date, endDate:Date,
                percentageAchieved:number = 0, percentageOfTimeElapsed:number = 0) {

        this.id = (id) ? id : UUID.v4();

        this.expression = expression;
        this.thresholdRate = thresholdRate;

        this.startDate = startDate;
        this.dateOfCreation = dateOfCreation;
        this.endDate = endDate;

        this.timeBox = new TimeBox(this.startDate, this.endDate);

        this.percentageAchieved = percentageAchieved;
        this.percentageOfTimeElapsed = percentageOfTimeElapsed;
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

    getStartDate():Date {
        return this.startDate;
    }

    setStartDate(newStartDate:Date):void {
        this.startDate = newStartDate;
    }

    getEndDate():Date {
        return this.endDate;
    }

    setEndDate(newEndDate:Date):void {
        this.endDate = newEndDate;
    }

    setTimeBox(newTimeBox:TimeBox) {
        this.timeBox = newTimeBox;
        this.startDate = newTimeBox.getStartDate();
        this.endDate = newTimeBox.getEndDate();
   }

    isInTimeBox(date:Date):boolean {
        return this.timeBox.isDateInTimeBox(date);
    }

    setPercentageAchieved(newPercentageAchieved:number) {
        this.percentageAchieved = newPercentageAchieved;
    }

    updatePercentageOfTimeElapsed(currentDate:number) {
        var duration = this.getEndDate().getTime() - this.getStartDate().getTime();

        var durationAchieved = (currentDate - this.getStartDate().getTime()) * 1000;

        if (durationAchieved < 0) {
            throw new Error('Time given is before dateOfCreation !');
        }

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
            condition: this.expression.getDataInJSON(),
            thresholdRate: this.thresholdRate,
            startDate: this.startDate,
            dateOfCreation: this.dateOfCreation,
            endDate: this.endDate,
            percentageAchieved: this.percentageAchieved,
            percentageOfTimeElapsed: this.percentageOfTimeElapsed
        }
    }

    evaluate(data:any):boolean {
        throw new Error('Can not call base class method ! Must be overridden and implemented.');
    }
}

export = Condition;