/// <reference path="../../typings/node-uuid/node-uuid.d.ts" />

import uuid = require('node-uuid');

var BadgeSchema :any = require('../database/models/badge.js').schema;

import ModelItf = require('../ModelItf');

class Badge extends ModelItf {

    private name:string;
    private points:number;

    private id;

    constructor(name:string,points:number, id=null, createdAt=null, updatedAt=null) {
        super(id, createdAt, updatedAt);
        this.name = name;
        this.points = points;
        this.id = uuid.v4();
    }

    public getName():string {
        return this.name;
    }

    public getPoints():number {
        return this.points;
    }

    public hasUUID(aUUID:string):boolean {
        return this.id === aUUID;
    }

    public toJSONObject():any {
        return {
            'name' : this.name,
            'points': this.points
        }
    }


    static fromJSONObject(jsonObject:any) {
        return new Badge(jsonObject.name,jsonObject.points);
    }

    /**
     * Create model in database.
     *
     * @method create
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.

     */
    create(successCallback : Function, failCallback : Function) {
        var self = this;

        if(!this.hasBeenSaved()) {
            BadgeSchema.create(this.toJSONObject())
                .then(function (badge) {
                    self._selfSequelize = badge;

                    var uObject = Badge.fromJSONObject(badge.dataValues);
                    self._id = uObject.getId();

                    successCallback(uObject);
                })
                .error(function (error) {
                    failCallback(error);
                });
        } else {
            failCallback(new ModelException("User already exists."));
        }
    }

    /**
     * Retrieve model description from database and create model instance.
     *
     * @method read
     * @static
     * @param {number} id - The model instance's id.
     * @param {Function} successCallback - The callback function when success.
     * @param {Function} failCallback - The callback function when fail.

     */

    static read(id : number, successCallback : Function, failCallback : Function) {
        // search for known ids
        BadgeSchema.findById(id)
            .then(function(badge) {
                var uObject = Badge.fromJSONObject(badge.dataValues);
                successCallback(uObject);
            })
            .error(function(error) {
                failCallback(error);
            });
    }

}

export = Badge;