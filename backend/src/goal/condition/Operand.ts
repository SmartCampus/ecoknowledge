/// <reference path="../../../typings/node-uuid/node-uuid.d.ts" />

var OperandSchema:any = require('../../database/models/operand.js').schema;

import ModelItf = require('../../ModelItf');

class Operand extends ModelItf {

    private value:string;
    private _hasToBeDefined:boolean;

    constructor(value:string, hasToBeDefined:boolean) {
        super(null, null, null);
        this.value = value;
        this._hasToBeDefined = hasToBeDefined;
    }

    public getStringDescription() {
        return this.value;
    }

    public hasToBeDefined():boolean {
        return this._hasToBeDefined;
    }

    public toJSONObject():any {
        return {
            value: this.value,
            _hasToBeDefined: this._hasToBeDefined
        }
    }

    static fromJSONObject(jsonObject:any) {
        return new Operand(jsonObject.value, jsonObject._hasToBeDefined);
    }

    /**
     * Create model in database.
     *
     * @method create
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.

     */
    create(successCallback:Function, failCallback:Function) {
        var self = this;

        if (!this.hasBeenSaved()) {
            OperandSchema.create(this.toJSONObject())
                .then(function (operand) {
                    self._selfSequelize = operand;

                    var uObject = Operand.fromJSONObject(operand.dataValues);
                    self._id = uObject.getId();

                    successCallback(operand);
                })
                .error(function (error) {
                    failCallback(error);
                });
        } else {
            failCallback(new ModelException("User already exists."));
        }

    }

    static read(id : number, successCallback : Function, failCallback : Function) {
        // search for known ids
        OperandSchema.findById(id)
            .then(function(user) {
                var uObject = Operand.fromJSONObject(user.dataValues);
                successCallback(uObject);
            })
            .error(function(error) {
                failCallback(error);
            });
    }
}

export = Operand;