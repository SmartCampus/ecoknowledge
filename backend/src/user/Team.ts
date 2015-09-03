import uuid = require('node-uuid');
import BadArgumentException = require('../exceptions/BadArgumentException');

import Entity = require('./Entity');
import BadgeIDsToNumberOfTimesEarnedMap = require('./BadgeIDsToNumberOfTimesEarnedMap');
import User = require('./User');
import Goal = require('../goal/Goal');
import TeamChallengeFactory = require('../challenge/TeamChallengeFactory');
import TeamChallenge = require('../challenge/TeamChallenge');
import UserChallengeRepository = require('../challenge/UserChallengeRepository');

class Team  {
    private id;
    private name:string;
    private currentChallenges:string[] = [];
    private badgesMap:BadgeIDsToNumberOfTimesEarnedMap = {};

    private members:User[] = [];
    private leader:User;

    private challengeFactory:TeamChallengeFactory;

    constructor(id:string, name:string, leader:User, members:User[],
                currentChallenges:string[], badgesMap:BadgeIDsToNumberOfTimesEarnedMap, teamChallengeFactory:TeamChallengeFactory) {

        this.id = id;
        this.name = name;
        this.badgesMap = badgesMap;
        this.currentChallenges = currentChallenges;

        this.leader = leader;
        this.members = members;

        this.challengeFactory = teamChallengeFactory;
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

    addChallenge(goal:Goal, userChallengeRepository:UserChallengeRepository, now:moment.Moment):TeamChallenge {
        var newChallenge = this.challengeFactory.createTeamChallenge(this, goal,userChallengeRepository, now);

        /*FIXME
        //  Check if we try
        if (newChallenge.getEndDate().isAfter(goal.getEndOfValidityPeriod())) {
            return null;
        }

        this.currentChallenges.push(newChallenge.getID());
        return newChallenge;
        */

        this.currentChallenges.push(newChallenge.getID());
        return newChallenge;
    }

    deleteChallenge(challenge:TeamChallenge):void {

        var challengeIndex:number = this.getChallengeByID(challenge.getID());

        if (challengeIndex == -1) {
            throw new BadArgumentException('Can not find given challenge ID');
        }

        //  Remove team challenge from team
        this.currentChallenges.splice(challengeIndex, 1);

        //  Remove challenges from team's members
        challenge.removeFromMembers();


        console.log("TeamChallenge deleted ! Current challenges:", this.currentChallenges);
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

    getLeader():User {
        return this.leader;
    }

    getMembers():User[] {
        return this.members;
    }

    hasLeader(aUserID:string):boolean {
        return this.leader.hasUUID(aUserID);
    }

    hasMember(aUserID:string):boolean {
        for (var currentMemberIndex in this.members) {
            var currentMember = this.members[currentMemberIndex];
            if (currentMember.hasUUID(aUserID)) {
                return true;
            }
        }

        return false;
    }

    getStringDescription():string {
        return 'Team:#' + this.getUUID() + '\t|Name : ' + this.getName() + '\t|LEADER : ' + this.leader + '\n';
    }

    getStringDescriptionOfMembers():string {
        var result = '';

        for (var currentMemberIndex in this.members) {
            var currentMember = this.members[currentMemberIndex];
            result += '\t\t- ' + currentMember.getName() + '\n';
        }

        return result;
    }

    getBadgesID():string[] {
        return Object.keys(this.badgesMap);
    }

    getBadges():BadgeIDsToNumberOfTimesEarnedMap {
        return this.badgesMap;
    }

    public getDataInJSON():any {
        var membersIDs:any[] =[];
        for(var memberIndex in this.members) {
            var currentMember = this.members[memberIndex];
            var currentMemberID = currentMember.getUUID();
            membersIDs.push(currentMemberID);
        }

        return {
            id: this.id,
            name: this.name,
            leader: this.leader.getUUID(),
            members: membersIDs,
            currentChallenges: this.currentChallenges,
            finishedBadgesMap: this.badgesMap
        }
    }
}

export = Team;