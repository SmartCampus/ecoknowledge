/// <reference path="../../typings/node-uuid/node-uuid.d.ts" />

var merge:any = require('merge');
import uuid = require('node-uuid');

import Condition = require('./Condition');
import GoalExpression = require('./expression/GoalExpression');
import TimeBox = require('../TimeBox');

import Challenge = require('../challenge/Challenge');

class ConditionList {

    private conditions:Condition[] = [];

    public getConditions():Condition[] {
        return this.conditions;
    }

    public addCondition(condition:Condition):void {
        this.conditions.push(condition);
    }

    public setTimeBoxes(newTimeBox:TimeBox) {

        for (var currentExpressionIndex in this.conditions) {
            this.conditions[currentExpressionIndex].setTimeBox(newTimeBox);
        }
    }

    /**
     *
     * @returns {any}
     *  {
     *      <sensor-name:string> :  { start:_, end:_ } <-- timebox for the sensor-name
     *      ...
     *  }
     */
    public getRequired():any {

        var result:any = {};

        //  For each expression
        for (var currentConditionIndex in this.conditions) {

            //  Get its description --> { <sensor-name> : null | {start:_, end:_} }
            var currentCondition:Condition = this.conditions[currentConditionIndex];
            var currentConditionDesc = currentCondition.getRequired();

            //  for each sensors required by the current expression
            for (var currentSensorName in currentConditionDesc) {

                //  check if current sensor has already been added
                if (result[currentSensorName] != null) {
                    //  if so, retrieve previous timeBox and current timeBox
                    var currentTimeBox = currentConditionDesc[currentSensorName];
                    var oldTimeBox = result[currentSensorName];

                    //  merge two timeBoxes
                    var newTimeBox = this.mergeTimeBox(currentTimeBox, oldTimeBox);

                    // add newly merged timeBox into result
                    result[currentSensorName] = newTimeBox;
                }
                else {
                    //  if not, add current expression description
                    result[currentSensorName] = currentConditionDesc[currentSensorName];
                }
            }
        }

        return result;
    }

    // TODO test
    public mergeTimeBox(currentTimeBox:any, oldTimeBox:any):any {
        if (currentTimeBox == null || oldTimeBox == null) {
            return null;
        }

        var currentStart = currentTimeBox.start;
        var currentEnd = currentTimeBox.end;

        var oldStart = oldTimeBox.start;
        var oldEnd = oldTimeBox.end;

        var newStart = (currentStart > oldStart) ? oldStart : currentStart;
        var newEnd = (currentEnd > oldEnd) ? currentEnd : oldEnd;

        /*
        console.log("currentStart", currentStart, "currentEnd", currentEnd, "oldStart", oldStart,
        "oldEnd", oldEnd, "newstart", newStart, "newEnd", newEnd);
        */

        return {
            start: newStart,
            end: newEnd
        }
    }

    /**
     *
     * @param values
     *  {
     *      <sensor-name:string> : { timebox { start:_, end:_ }, values : [ {date:_, value:_}, ... ] }
     *      ...
     *  }
     * @returns {boolean}
     */

    public evaluate(values:any, goalInstance:Challenge):boolean {

        var result:boolean = true;

        for (var i = 0; i < this.conditions.length; i++) {

            result = result && this.conditions[i].evaluate(values);

            var conditionDescription:any = this.conditions[i].getDataInJSON();
            if (goalInstance != null) {
                goalInstance.addProgress(conditionDescription);
            }
        }

        return result;
    }

    public getDataInJSON():any {
        var result:any[] = [];

        for (var i = 0; i < this.conditions.length; i++) {
            result.push(this.conditions[i].getDataInJSON());
        }

        return result;
    }

    getStringRepresentation():string {
        var result:string = '';

        for(var currentConditionIndex in this.conditions) {
            var currentCondition = this.conditions[currentConditionIndex];
            result += '\t|\t\t' + currentCondition.getStringRepresentation();
        }

        return result;
    }

}

export = ConditionList;
