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
    private currentChallenges:string[] = [];
    private finishedBadgesMap:BadgeIDsToNumberOfTimesEarnedMap = {};

    constructor(name:string, id = null, currentChallenges:string[] = null, finishedBadgesMap:BadgeIDsToNumberOfTimesEarnedMap = null) {

        this.id = (id) ? id : uuid.v4();

        this.name = name;
        this.currentChallenges = currentChallenges;
        this.finishedBadgesMap = finishedBadgesMap;
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

    public addChallenge(challengeID:string):void {
        if (!challengeID) {
            throw new Error('Can not add a new goal to user ' + this.getName() + ' given goal is null');
        }

        this.currentChallenges.push(challengeID);
    }

    public deleteChallenge(challengeID:string):void {
        console.log("WANnA DElETE IT HU?", this.currentChallenges);

        var challengeIndex:number = this.getChallenge(challengeID);
        if (challengeIndex == -1) {
            console.log("LOL PAS TROUVE MA GUEULE");
            throw new BadArgumentException('Can not find given challenge ID');
        }
        else {
            this.currentChallenges.splice(challengeIndex, 1);
        }

        console.log("Challenge deleted ! Current challenges:", this.currentChallenges);
    }

    /**
     *  This method will return the index of the given
     *  challenge id
     * @param challengeID
     * @returns {number}
     *      Index of given challenge ID
     */
    public getChallenge(challengeID:string):number {
        var result:number = -1;

        for (var currentChallengeIndex = 0; currentChallengeIndex < this.currentChallenges.length; currentChallengeIndex++) {
            if (this.currentChallenges[currentChallengeIndex] === challengeID) {
                console.log("INDEX", currentChallengeIndex);
                result = currentChallengeIndex;
            }
        }

        return result;
    }

    public getChallenges():string[] {
        return this.currentChallenges;
    }

    public setChallenges(challenges:string[]):void {
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

    public getDataInJSON():any {
        return {
            id: this.id,
            name: this.name,
            currentChallenges: this.currentChallenges,
            finishedBadgesMap: this.finishedBadgesMap
        }
    }
}

export = User;
