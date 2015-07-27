/// <reference path="../../typings/node-uuid/node-uuid.d.ts" />

import GoalDefinition = require('../goal/definition/GoalDefinition');
import GoalInstance = require('../goal/instance/GoalInstance');
import Badge = require('../badge/Badge');

import uuid = require('node-uuid');

class User {

    private name:string;
    private goals:GoalDefinition[] = [];
    private goalInstances:GoalInstance[] = [];
    private finishedBadge:number[];
    private id;

    constructor(name:string) {
        this.name = name;
        this.id = uuid.v4();
        this.finishedBadge = [];
    }

    public getUUID() {
        return this.id;
    }

    public hasUUID(aUUID:string):boolean {
        return this.id === aUUID;
    }

    public getName():string {
        return this.name;
    }

    public getGoals():GoalDefinition[] {
        return this.goals;
    }

    public getBadges():GoalInstance[] {
        return this.goalInstances;
    }

    public getFinishedBadges():number[] {
        return this.finishedBadge;
    }

    public addGoal(newGoal:GoalDefinition):boolean {
        if (!newGoal) {
            throw new Error('Can not add a new goal to user ' + this.name + ' given goal is null');
        }

        this.goals.push(newGoal);
        return true;
    }

    public addBadge(newBadge:GoalInstance):boolean {
        if (!newBadge) {
            throw new Error('Can not add a new newBadge to user ' + this.name + ' given newBadge is null');
        }

        this.goalInstances.push(newBadge);
        return true;
    }

    public evaluateGoal(goalName:string, goalValue:(number|boolean)[]):boolean {

        var goal = this.retrieveGoal(goalName);
        if (!goal) {
            console.warn("Can not find goal", goalName);
            return false;
        }

        var res = null;
        // FIXME var res =  goal.evaluate(goalValue);
        return res;
    }

    public retrieveGoal(goalName:string):GoalDefinition {
        for (var i in this.goals) {
            var currentGoal = this.goals[i];
            if (currentGoal.getName() === goalName) {
                return currentGoal;
            }
        }
        return null;
    }


    public evaluateBadge(badgeName:string, goalValue:number):boolean {

        var badge = this.retrieveBadge(badgeName);
        if (!badge) {
            console.log("Badge", badgeName, " non trouvé");
            return false;
        }

        var tmp = [];
        tmp.push(goalValue);

        var res = badge.evaluate(tmp);
        return res;
    }

    public retrieveBadge(badgeName:string):GoalInstance {
        for (var i in this.goalInstances) {
            var currentBadge = this.goalInstances[i];
            if (currentBadge.getName() === badgeName) {
                return currentBadge;
            }
        }
        return null;
    }

    public addFinishedBadge(badge:Badge) {
        console.log('add in user');
        console.log('badge has own property : ', this.finishedBadge.hasOwnProperty(badge.getUuid()));
        if (this.finishedBadge.hasOwnProperty(badge.getUuid())) {
            console.log('old badge');
            this.finishedBadge[badge.getUuid()]++;
        } else {
            console.log('new badge');
            this.finishedBadge[badge.getUuid()] = 1;
        }
        console.log('added : ', this.finishedBadge);
    }

}

export = User;