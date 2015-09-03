/// <reference path="../../typings/moment/moment.d.ts" />
/// <reference path="../../typings/moment-timezone/moment-timezone.d.ts" />

import uuid = require('node-uuid');
var merge = require('merge');

var moment = require('moment');
var moment_timezone = require('moment-timezone');

import Status= require('../Status');
import UserChallenge= require('./UserChallenge');
import Team= require('../user/Team');
import BadArgumentException = require('../exceptions/BadArgumentException');

class TeamChallenge {

    private id:string;

    private team:Team;
    private childChallenges:UserChallenge[];

    private status:Status;

    private startDate:moment.Moment;
    private endDate:moment.Moment;

    private durationAchieved:number;
    private progress:any = {};

    constructor(team:Team, childChallenges:UserChallenge[], id = null) {
        if (childChallenges.length == 0) {
            throw new BadArgumentException('Can not build team challenge because there is no child challenges to attach');
        }

        this.id = (id == null) ? uuid.v4() : id;

        this.team = team;
        this.childChallenges = childChallenges;
        this.status = this.getStatus();
        this.checkChildrenTimeBoxes();
    }

    getID():string {
        return this.id;
    }

    hasUUID(uuid:string) {
        return this.id == uuid;
    }

    getName():string {
        return this.childChallenges[0].getName();
    }

    getBadge() {
        return this.childChallenges[0].getBadge();
    }

    setStatus(status) {
        this.status = status;
    }

    getGoal() {
        return this.childChallenges[0].getGoal();
    }

    getStartDate() {
        return this.childChallenges[0].getStartDate();
    }

    getEndDate() {
        return this.childChallenges[0].getEndDate();
    }

    haveToStart(now):boolean {
        return this.childChallenges[0].haveToStart(now);
    }

    getStatus():Status {
        var succeed:boolean = false;
        var stillRunning:boolean = false;

        for (var currentChildIndex in this.childChallenges) {
            var currentChild = this.childChallenges[currentChildIndex];
            var currentChildStatus = currentChild.getStatus();

            console.log("Current child status", currentChildStatus);

            stillRunning = stillRunning && (currentChildStatus == Status.RUN);
            if (stillRunning) {
                return Status.RUN;
            }

            succeed = succeed && (currentChildStatus == Status.SUCCESS);
            if (!succeed) {
                return Status.FAIL;
            }
        }

        return Status.SUCCESS;
    }

    checkChildrenTimeBoxes() {
        var startDate:moment.Moment = this.childChallenges[0].getStartDate();
        var endDate:moment.Moment = this.childChallenges[0].getEndDate();

        for (var currentChildIndex in this.childChallenges) {
            var currentChild = this.childChallenges[currentChildIndex];

            var startDateOfCurrentChild = currentChild.getStartDate();
            if (startDate.toISOString() != startDateOfCurrentChild.toISOString()) {
                throw new BadArgumentException('Can not build team challenge ! Some child challenge does not have the same start date as the other');
            }

            var endDateOfCurrentChild = currentChild.getEndDate();
            if (endDate.toISOString() != endDateOfCurrentChild.toISOString()) {
                throw new BadArgumentException('Can not build team challenge ! Some child challenge does not have the same end date as the other');
            }
        }

        this.startDate = startDate;
        this.endDate = endDate;
    }

    evaluate(data):void {

        var childProgress:number = 0;
        var achieved:boolean = false;
        var finished:boolean = false;

        var childProgressDescription:any[] = [];

        for (var currentChildIndex in this.childChallenges) {
            var currentChild:UserChallenge = this.childChallenges[currentChildIndex];

            var childResult = currentChild.evaluate(data);

            achieved = achieved && currentChild.getStatus() == Status.SUCCESS;

            var currentChildGlobalProgression:number = childResult.percentageAchieved;
            childProgress += currentChildGlobalProgression;

            var currentChildProgressionDescription:any = {
                description: currentChild.getUser().getName(),
                percentageAchieved: currentChildGlobalProgression,
                achieved: childResult.achieved
            };

            childProgressDescription.push(currentChildProgressionDescription);

        }
        this.durationAchieved = this.childChallenges[0].getTimeProgress();
        this.progress['percentageAchieved'] = childProgress / this.childChallenges.length;
        this.progress['durationAchieved'] = this.durationAchieved;
        this.progress['finished'] = this.durationAchieved == 100;
        this.progress['achieved'] = achieved;
        this.progress['conditions'] = childProgressDescription;

        return this.progress;
    }

    getSensors() {
        /*
         Precisions :
         We can not assume that a specific sensor is bound to a specific user
         since two users can share an office.
         But we can assume that for a given challenge, sensor of each user
         have the same timeBox and will be identical.
         Because of this, we can simply merge required sensors and not
         try to merge different timeBoxes or whatever.
         */

        var result:any = {};

        for (var currentChildIndex in this.childChallenges) {
            var currentChild:UserChallenge = this.childChallenges[currentChildIndex];
            result = merge(result, currentChild.getSensors());
        }

        return result;
    }

    getDataInJSON():any {
        var childrenIDs:string[] = [];
        for (var currentChildrenIndex in this.childChallenges) {
            var currentChild:UserChallenge = this.childChallenges[currentChildrenIndex];

            var currentChildID:string = currentChild.getID();
            childrenIDs.push(currentChildID);
        }

        return {
            id: this.id,
            team: this.team.getUUID(),
            children: childrenIDs
        }

    }


    getDataForClient():any {
        return {
            id: this.id,
            type: 'team',
            startDate: this.startDate,
            endDate: this.endDate,
            goal: this.childChallenges[0].getGoal().getName(),
            user: this.getName(),
            progress: this.progress,
            status: this.status
        }
    }
}

export = TeamChallenge;