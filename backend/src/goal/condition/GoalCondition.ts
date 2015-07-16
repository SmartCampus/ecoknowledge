/// <reference path="../../../typings/node-uuid/node-uuid.d.ts" />

import Operand = require('./Operand');
import TimeBox = require('../../TimeBox');

import uuid = require('node-uuid');

class GoalCondition {
    private leftOperand:Operand;
    private rightOperand:Operand;

    private typeOfComparison:string;
    private description:string;

    private timeBox:TimeBox;

    private id:string;

    constructor(leftOperand:Operand, typeOfComparison:string, rightOperand:Operand, description:string, timeBox:TimeBox=null) {
        this.leftOperand = leftOperand;
        this.rightOperand = rightOperand;
        this.typeOfComparison = typeOfComparison;
        this.description = description;
        this.timeBox = timeBox;

        this.id = uuid.v4();
    }

    public getStartDateInMillis() {
        return this.timeBox.getStartDateInMillis();
    }

    public getEndDateInMillis() {
        return this.timeBox.getEndDateInMillis();
    }

    public getID():string {
        return this.id;
    }

    public getComparisonType():string {
        return this.typeOfComparison;
    }

    public hasLeftOperand(name:string):boolean {
        return this.leftOperand.getStringDescription() == name;
    }

    public hasRightOperand(name:string):boolean {
        return this.rightOperand.getStringDescription() == name;
    }

    public setLeftOperand(newLeftOperand:Operand) {
        this.leftOperand = newLeftOperand;
    }

    public setRightOperand(newRightOperand:Operand) {
        this.rightOperand = newRightOperand;
    }

    public setTypeOfComparison(newTypeOfComparison:string) {
        this.typeOfComparison = newTypeOfComparison;
    }

    public setTimeBox(timebox:TimeBox) {
        this.timeBox = timebox;
    }

    /**
     *
     * @returns {any}
     * {
     *      <sensor_name> : <timebox_desc>
     * }
     */
    public getRequired():string[] {
        var result:any = {};

        var timeBoxDesc:any = {};
        if(this.timeBox) {
            timeBoxDesc = this.timeBox.getRequired();
        }


        if (this.leftOperand.hasToBeDefined()) {
            result[this.leftOperand.getStringDescription()] = timeBoxDesc;
        }
        if (this.rightOperand.hasToBeDefined()) {
            result[this.rightOperand.getStringDescription()] = timeBoxDesc;
        }
        return result;
    }

    public checkTimeBox(currentDateInMillis:any):boolean {
        if(!this.timeBox) {
            return true;
        }

        return this.timeBox.isInTimeBox(currentDateInMillis);
    }

    public evaluate(values:any):boolean {
        var evalString:string = '';

        if (this.leftOperand.hasToBeDefined() && this.rightOperand.hasToBeDefined()) {
            evalString += this.getFirstValue(values,this.leftOperand.getStringDescription())
                + this.typeOfComparison + this.getFirstValue(values,this.rightOperand.getStringDescription());
        }

        else if (this.leftOperand.hasToBeDefined() && !this.rightOperand.hasToBeDefined()) {
            evalString += this.getFirstValue(values,this.leftOperand.getStringDescription()) + this.typeOfComparison + this.rightOperand.getStringDescription();
        }

        else if (this.rightOperand.hasToBeDefined() && !this.leftOperand.hasToBeDefined()) {
            evalString += this.leftOperand.getStringDescription() + this.typeOfComparison + this.getFirstValue(values,this.rightOperand.getStringDescription());
        }

        else {
            evalString += this.leftOperand.getStringDescription() + this.typeOfComparison + this.rightOperand.getStringDescription();
        }

        return eval(evalString);
    }

    /**
     * <sensor-name> : { values : [ {value:_} ] }
     * @param values
     */
    private getFirstValue(values:any, sensorName:string) {

        return values[sensorName].values[0].value;
    }

    public getDescription():string {
        return this.description;
    }

    public getStringRepresentation():string {
        return this.leftOperand.getStringDescription() + this.typeOfComparison + this.rightOperand.getStringDescription();
    }

    public getData():any {
        return {"leftValue":{"name":this.leftOperand.getStringDescription(),"sensor":this.leftOperand.hasToBeDefined()},
            "rightValue":{"name":this.rightOperand.getStringDescription(),"sensor":this.rightOperand.hasToBeDefined()},
            "comparison":this.typeOfComparison
        };
    }
}

export = GoalCondition;