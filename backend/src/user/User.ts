/// <reference path="../../typings/node-uuid/node-uuid.d.ts" />

/// <reference path="../../typings/moment/moment.d.ts" />
/// <reference path="../../typings/moment-timezone/moment-timezone.d.ts" />

import uuid = require("node-uuid");
var moment = require('moment');
var moment_timezone = require('moment-timezone');

import BadgeIDsToNumberOfTimesEarnedMap = require('./BadgeIDsToNumberOfTimesEarnedMap');
import BadArgumentException = require('../exceptions/BadArgumentException');

import Goal = require('../goal/Goal');
import Challenge = require('../challenge/UserChallenge');

import ChallengeFactory = require('../challenge/UserChallengeFactory');

class User {

    private id;
    private name:string;
    private mapSymbolicNameToSensor:any = {};
    private currentChallenges:string[] = [];
    private badgesMap:BadgeIDsToNumberOfTimesEarnedMap = {};

    private challengeFactory:ChallengeFactory;

    constructor(name:string, mapSymbolicNameToSensor:any, currentChallenges:string[],
                finishedBadgesMap:BadgeIDsToNumberOfTimesEarnedMap, challengeFactory:ChallengeFactory, id = null) {
        if (name == null) {
            throw new BadArgumentException('Can not build user because given name is null');
        }

        if (mapSymbolicNameToSensor == null) {
            throw new BadArgumentException('Can not build user ' + name + ' because given map of symbolic name to sensor is null');
        }

        this.id = (id) ? id : uuid.v4();

        this.name = name;
        this.mapSymbolicNameToSensor = mapSymbolicNameToSensor;

        this.currentChallenges = (currentChallenges == null) ? [] : currentChallenges;
        this.badgesMap = (finishedBadgesMap == null) ? [] : finishedBadgesMap;

        this.challengeFactory = challengeFactory;
    }


    getUUID() {
        return this.id;
    }

    hasUUID(aUUID:string):boolean {
        return this.id === aUUID;
    }

    setUUID(aUUID:string):void {
        this.id = aUUID;
    }

    getName():string {
        return this.name;
    }

    hasName(name:string):boolean {
        return this.getName() === name;
    }

    getBadges():BadgeIDsToNumberOfTimesEarnedMap {
        return this.badgesMap;
    }

    public addBadge(badgeID:string) {
        if (!badgeID) {
            throw new BadArgumentException('Can not add given badge to user' + this.getName() + '. Badge given is null');
        }

        if (this.badgesMap.hasOwnProperty(badgeID)) {
            this.badgesMap[badgeID]++;
        } else {
            this.badgesMap[badgeID] = 1;
        }
    }

    getCurrentChallenges():string [] {
        return this.currentChallenges;
    }

    addChallenge(goal:Goal, now:moment.Moment):Challenge {
        var newChallenge = this.challengeFactory.createChallenge(goal, this, now);

        //  Check if we try
        if (newChallenge.getEndDate().isAfter(goal.getEndDate())) {
            return null;
        }

        this.currentChallenges.push(newChallenge.getId());
        return newChallenge;
    }

    deleteChallenge(challengeID:string):void {

        var challengeIndex:number = this.getChallengeByID(challengeID);
        if (challengeIndex == -1) {
            throw new BadArgumentException('Can not find given challenge ID');
        }
        else {
            this.currentChallenges.splice(challengeIndex, 1);
        }

        console.log("UserChallenge deleted ! Current challenges:", this.currentChallenges);
    }

    private getChallengeByID(challengeID:string):number {
        var result:number = -1;

        for (var currentChallengeIndex = 0; currentChallengeIndex < this.currentChallenges.length; currentChallengeIndex++) {
            if (this.currentChallenges[currentChallengeIndex] === challengeID) {
                result = currentChallengeIndex;
            }
        }

        return result;
    }

    getMapSymbolicNameToSensor():any {
        return this.mapSymbolicNameToSensor;
    }

    public getDataInJSON():any {
        return {
            id: this.id,
            name: this.name,
            mapSymbolicNameToSensor: this.mapSymbolicNameToSensor,
            currentChallenges: this.currentChallenges,
            finishedBadgesMap: this.badgesMap
        }
    }
}
export = User;