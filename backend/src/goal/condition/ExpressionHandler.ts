/// <reference path="../../../typings/node-uuid/node-uuid.d.ts" />

var merge:any = require('merge');
import uuid = require('node-uuid');

import Expression = require('./Expression');
import GoalCondition = require('./GoalCondition');
import TimeBox = require('../../TimeBox');

import GoalInstance = require('../instance/GoalInstance');

class ExpressionHandler {

    private expressions:Expression[] = [];

    public getExpressions():Expression[] {
        return this.expressions;
    }

    public addExpression(expression:Expression):void {
        this.expressions.push(expression);
    }

    public setTimeBoxes(newTimeBox:TimeBox) {
        for(var currentExpressionIndex in this.expressions) {
            this.expressions[currentExpressionIndex].setTimeBox(newTimeBox);
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
    public getRequired():string[][] {

        var result:any = {};

        //  For each expression
        for (var currentExpressionIndex in this.expressions) {

            //  Get its description --> { <sensor-name> : null | {start:_, end:_} }
            var currentExpression:Expression = this.expressions[currentExpressionIndex];
            var currentExpressionDesc = currentExpression.getRequired();

            //  for each sensors required by the current expression
            for (var currentSensorName in currentExpressionDesc) {

                //  check if current sensor has already been added
                if (result[currentSensorName] != null) {

                    //  if so, retrieve previous timeBox and current timeBox
                    var currentTimeBox = currentExpressionDesc[currentSensorName];
                    var oldTimeBox = result[currentSensorName];

                    //  merge two timeBoxes
                    var newTimeBox = this.mergeTimeBox(currentTimeBox, oldTimeBox);

                    // add newly merged timeBox into result
                    result[currentSensorName] = newTimeBox;
                }
                else {
                    //  if not, add current expression description
                    result[currentSensorName] = currentExpressionDesc[currentSensorName];
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

    public evaluate(values:any, goalInstance:GoalInstance):boolean {

        var result:boolean = true;

        for (var i = 0; i < this.expressions.length; i++) {
            result = result && this.expressions[i].evaluate(values);
            var conditionDescription:any = this.expressions[i].getData();
            goalInstance.addProgress(conditionDescription);
        }

        return result;
    }

    public getData():any {
        var result:any[] = [];

        for (var i = 0; i < this.expressions.length; i++) {
            result.push(this.expressions[i].getData());
        }

        return result;
    }
}

export = ExpressionHandler;
