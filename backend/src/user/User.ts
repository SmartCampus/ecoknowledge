/// <reference path="../../typings/node-uuid/node-uuid.d.ts" />

import GoalDefinition = require('../goal/definition/GoalDefinition');
import GoalInstance = require('../goal/instance/GoalInstance');
import Badge = require('../badge/Badge');

import uuid = require('node-uuid');

import BadArgumentException = require('../exceptions/BadArgumentException');

/**
 * Map of finished badges</br>
 * key : badgeID,
 * associated : number of times that you earned this badge
 */
interface BadgeIDsToNumberOfTimesEarnedMap {
    [idBadge:number]: number;
}


class User {

    private id;
    private name:string;
    private currentChallenges:number[] = [];
    private finishedBadgesMap:BadgeIDsToNumberOfTimesEarnedMap = {};

    constructor(name:string) {
        this.id = uuid.v4();
        this.name = name;
    }

    public getUUID() {
        return this.id;
    }

    public hasUUID(aUUID:string):boolean {
        return this.id === aUUID;
    }

    public setUUID(aUUID:string):void {
        this.id = aUUID;
    }

    public getName():string {
        return this.name;
    }

    public hasName(name:string):boolean {
        return this.getName() === name;
    }

    public setName(name:string):void {
        this.name = name;
    }

    public addChallenge(newGoal:GoalDefinition):void {
        if (!newGoal) {
            throw new Error('Can not add a new goal to user ' + this.getName() + ' given goal is null');
        }

        this.currentChallenges.push(newGoal.getUUID());
    }

    public deleteChallenge(challengeID:number):void {
        var challengeIndex:number = this.getChallenge(challengeID);
        if (!challengeIndex) {
            throw new BadArgumentException('Can not find given challenge ID');
        }
        else {
            this.currentChallenges.splice(challengeIndex, 1);
        }
    }

    /**
     *  This method will return the index of the given
     *  challenge id
     * @param challengeID
     * @returns {number}
     *      Index of given challenge ID
     */
    public getChallenge(challengeID:number):number {
        var result:number = null;

        for (var currentChallengeIndex = 0; currentChallengeIndex < this.currentChallenges.length; currentChallengeIndex++) {
            if (currentChallengeIndex === challengeID) {
                result = currentChallengeIndex;
            }
        }

        return result;
    }

    public getChallenges():number[] {
        return this.currentChallenges;
    }

    public setChallenges(challenges:number[]):void {
        this.currentChallenges = challenges;
    }

    public getFinishedBadges():BadgeIDsToNumberOfTimesEarnedMap {
        return this.finishedBadgesMap;
    }

    public setFinishedBadges(finishedBadges:BadgeIDsToNumberOfTimesEarnedMap) {
        this.finishedBadgesMap = finishedBadges;
    }

    public getFinishedBadgesID():string[] {
        return Object.keys(this.finishedBadgesMap);
    }

    public addFinishedBadge(badgeID:string) {
        if (!badgeID) {
            throw new BadArgumentException('Can not add given badge to user' + this.getName() + '. Badge given is null');
        }

        if (this.finishedBadgesMap.hasOwnProperty(badgeID)) {
            this.finishedBadgesMap[badgeID]++;
        } else {
            this.finishedBadgesMap[badgeID] = 1;
        }
    }
}

export = User;
