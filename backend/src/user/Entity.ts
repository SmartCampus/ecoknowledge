import uuid = require('node-uuid');

import Goal = require('../goal/Goal');
import Challenge = require('../challenge/UserChallenge');
import Badge = require('../badge/Badge');
import BadgeIDsToNumberOfTimesEarnedMap = require('./BadgeIDsToNumberOfTimesEarnedMap');

import BadArgumentException = require('../exceptions/BadArgumentException');

class Entity {

    private id;
    private name:string;
    protected currentChallenges:string[] = [];
    private badgesMap:BadgeIDsToNumberOfTimesEarnedMap = {};

    constructor(id:string, name:string, currentChallenges:string[],
                finishedBadgesMap:BadgeIDsToNumberOfTimesEarnedMap) {

        this.id = id;

        this.name = name;
        this.currentChallenges = currentChallenges;
        this.badgesMap = finishedBadgesMap;
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

    setName(name:string):void {
        this.name = name;
    }

    getCurrentChallenges():string [] {
        return this.currentChallenges;
    }

    addChallengeFromGoal(goal:Goal):Challenge {
        return null;
    }

    public addChallenge(challengeID:string):void {
        if (!challengeID) {
            throw new Error('Can not add a new goal to user ' + this.getName() + ' given goal is null');
        }

        this.currentChallenges.push(challengeID);
    }

    public deleteChallenge(challengeID:string):void {

        var challengeIndex:number = this.getChallenge(challengeID);
        if (challengeIndex == -1) {
            throw new BadArgumentException('Can not find given challenge ID');
        }
        else {
            this.currentChallenges.splice(challengeIndex, 1);
        }

        console.log("UserChallenge deleted ! Current challenges:", this.currentChallenges);
    }

    public getChallenge(challengeID:string):number {
        var result:number = -1;

        for (var currentChallengeIndex = 0; currentChallengeIndex < this.currentChallenges.length; currentChallengeIndex++) {
            if (this.currentChallenges[currentChallengeIndex] === challengeID) {
                result = currentChallengeIndex;
            }
        }

        return result;
    }

    public setChallenges(challenges:string[]):void {
        this.currentChallenges = challenges;
    }

    public getBadges():BadgeIDsToNumberOfTimesEarnedMap {
        return this.badgesMap;
    }

    public getBadgesID():string[] {
        return Object.keys(this.badgesMap);
    }

    public setBadges(finishedBadges:BadgeIDsToNumberOfTimesEarnedMap) {
        this.badgesMap = finishedBadges;
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

    public getDataInJSON():any {
        return {
            id: this.id,
            name: this.name,
            currentChallenges: this.currentChallenges,
            finishedBadgesMap: this.badgesMap
        }
    }
}

export = Entity;