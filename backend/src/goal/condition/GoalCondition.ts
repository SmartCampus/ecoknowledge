/// <reference path="../../../typings/node-uuid/node-uuid.d.ts" />

import Operand = require('./Operand');
import TimeBox = require('../../TimeBox');

import uuid = require('node-uuid');

var GoalConditionSchema:any = require('../../database/models/goalCondition.js').schema;
import ModelItf = require('../../ModelItf');

class GoalCondition extends ModelItf {
    private leftOperand:Operand;
    private rightOperand:Operand;

    private typeOfComparison:string;
    private description:string;

    private timeBox:TimeBox;

    private id:string;

    constructor(leftOperand:Operand, typeOfComparison:string, rightOperand:Operand, description:string, timeBox:TimeBox = null, id = null, createdAt = null, updatedAt = null) {
        super(id, createdAt, updatedAt);
        this.leftOperand = leftOperand;
        this.rightOperand = rightOperand;
        this.typeOfComparison = typeOfComparison;
        this.description = description;
        this.timeBox = timeBox;

        this.id = uuid.v4();
    }


    public toJSONObject():any {
        return {
            description: this.description,
            timeBox: this.timeBox,
            typeOfComparison: this.typeOfComparison,
            leftOperand: this.leftOperand,
            rightOperand: this.rightOperand
        }
    }

    static fromJSONObject(jsonObject:any) {
        return new GoalCondition(jsonObject.leftOperand, jsonObject.typeOfComparison, jsonObject.rightOperand,
            jsonObject.description, jsonObject.timeBox, jsonObject.id, jsonObject.createdAt, jsonObject.updatedAt);
    }

    buildOBJ(successCallback:Function, failCallback:Function, self:GoalCondition) {
        if (!self.hasBeenSaved()) {
            GoalConditionSchema.create(self.toJSONObject())
                .then(function (_conditionSequelize) {
                    self._selfSequelize = _conditionSequelize;

                    var uObject = GoalCondition.fromJSONObject(_conditionSequelize.dataValues);
                    self._id = uObject.getId();
                    successCallback(uObject);
                })
                .error(function (error) {
                    console.log("ERROR ON CREATE GOAL CONDITION");
                    failCallback(error);
                });
        } else {
            failCallback(new ModelException("Condition already exists."));
        }
    }


    /*
     var successCallBackInitFields = function () {
     successCallback(_conditionSequelize);
     };

     var failCallBackInitFields = function () {
     failCallback(_conditionSequelize);
     };

     self.initFieldsInDB(successCallBackInitFields, failCallBackInitFields);
     */


    /**
     * Retrieve model description from database and create model instance.
     *
     * @method read
     * @static
     * @param {number} id - The model instance's id.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.

     */
    static read(id:number, successCallback:Function, failCallback:Function) {
        // search for known ids
        GoalConditionSchema.findById(id, {include: [{all: true}]})
            .then(function (_conditionSequelize) {
                var goalCondition:GoalCondition = GoalCondition.fromJSONObject(_conditionSequelize.dataValues);

                var leftOperand:Operand = Operand.fromJSONObject(_conditionSequelize.leftOperand);
                var rightOperand:Operand = Operand.fromJSONObject(_conditionSequelize.rightOperand);
                goalCondition.setLeftOperand(leftOperand);
                goalCondition.setRightOperand(rightOperand);

                successCallback(goalCondition);
            })
            .error(function (error) {
                failCallback(error);
            });
    }

    create(suc:Function, fail:Function) {
        var self = this;

        self.buildOBJ(
            function(uObject:GoalCondition) {
                self.initFieldsInDB(
                    function() {

                    },
                    function() {

                    },
                    self
                );
            },
            function(error) {

            },
            self
        );
    }

    public initFieldsInDB(successCallBack:Function, failCallBack:Function, self:GoalCondition) {
        var numberOfFieldsToInit = 3;
        var numberOfFieldsInit = 0;

        var globalSuccessCallBack = function () {
            console.log("NB OF FIELD INIT", numberOfFieldsInit);
            numberOfFieldsInit += 1;
            if (numberOfFieldsInit == numberOfFieldsToInit) {
                console.log("CALLBACK NOW");
                successCallBack();
            }
        };

        var globalFailCallBack = function (error) {
            console.log("SET TIMEBOX FAIL", error);
            numberOfFieldsInit++;
            if (numberOfFieldsInit = numberOfFieldsToInit) {
                failCallBack();
            }
        };

        var callBackSuccessCreateTimeBox = function (_timeBoxSequelize) {
            console.log("SUCCESS CREATE TIMEBOX");
            self._selfSequelize.setTimeBox(_timeBoxSequelize).then(
                globalSuccessCallBack).error(globalFailCallBack);
        };

        var callBackFailCreateTimeBox = function (_timeBoxSequelize) {
            console.log("FAIL CREATE TIMEBOX");
            failCallBack(_timeBoxSequelize);
        };

        self.timeBox.create(callBackSuccessCreateTimeBox, callBackFailCreateTimeBox);


        var callBackSuccessCreateLeftOperand = function (_operandSequelize) {
            console.log("SUCCESS CREATE LEFT OPERAND");
            self._selfSequelize.setLeftOperand(_operandSequelize).then(globalSuccessCallBack).error(globalFailCallBack);
        };

        var callBackSuccessCreateRightOperand = function (_operandSequelize) {
            console.log("SUCCESS CREATE RIGHT OPERAND");
            self._selfSequelize.setRightOperand(_operandSequelize).then(globalSuccessCallBack).error(globalFailCallBack);
        };

        var callBackFailCreateOperand = function (_operandSequelize) {
            console.log("FAIL CREATE OPERAND");
            failCallBack(_operandSequelize);
        };

        self.leftOperand.create(callBackSuccessCreateLeftOperand, callBackFailCreateOperand);
        self.rightOperand.create(callBackSuccessCreateRightOperand, callBackFailCreateOperand);
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

    public getLeftOperand():Operand {
        console.log("DAT SHIT THO");
        return this.leftOperand;
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
        if (this.timeBox) {
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
        if (!this.timeBox) {
            return true;
        }

        return this.timeBox.isInTimeBox(currentDateInMillis);
    }

    public evaluate(values:any):boolean {
        var evalString:string = '';

        if (this.leftOperand.hasToBeDefined() && this.rightOperand.hasToBeDefined()) {
            evalString += this.getFirstValue(values, this.leftOperand.getStringDescription())
                + this.typeOfComparison + this.getFirstValue(values, this.rightOperand.getStringDescription());
        }

        else if (this.leftOperand.hasToBeDefined() && !this.rightOperand.hasToBeDefined()) {
            evalString += this.getFirstValue(values, this.leftOperand.getStringDescription()) + this.typeOfComparison + this.rightOperand.getStringDescription();
        }

        else if (this.rightOperand.hasToBeDefined() && !this.leftOperand.hasToBeDefined()) {
            evalString += this.leftOperand.getStringDescription() + this.typeOfComparison + this.getFirstValue(values, this.rightOperand.getStringDescription());
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

    private getDate(values:any, sensorName:string) {
        return values[sensorName].values[0].date;
    }

    public getDescription():string {
        return this.description;
    }

    public getStringRepresentation():string {
        return this.leftOperand.getStringDescription() + this.typeOfComparison + this.rightOperand.getStringDescription();
    }

    public getData():any {
        return {
            "leftValue": {"name": this.leftOperand.getStringDescription(), "sensor": this.leftOperand.hasToBeDefined()},
            "rightValue": {
                "name": this.rightOperand.getStringDescription(),
                "sensor": this.rightOperand.hasToBeDefined()
            },
            "comparison": this.typeOfComparison
        };
    }
}

export = GoalCondition;