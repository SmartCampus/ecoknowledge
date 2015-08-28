import uuid = require('node-uuid');
var merge = require('merge');

import Status= require('../Status');
import UserChallenge= require('./UserChallenge');
import Team= require('../user/Team');
import BadArgumentException = require('../exceptions/BadArgumentException');

class TeamChallenge {

    private id:string;

    private team:Team;
    private childChallenges:UserChallenge[];

    private status:Status;
    private elapsedTime:number;
    private progress:any = {};

    constructor(team:Team, childChallenges:UserChallenge[], id = null) {
        if (childChallenges.length == 0) {
            throw new BadArgumentException('Can not build team challenge because there is no child challenges to attach');
        }

        this.id = (id == null) ? uuid.v4() : id;

        this.team = team;
        this.childChallenges = childChallenges;
        this.status = this.childChallenges[0].getStatus();

    }

    evaluate(data):void {

        var childProgress:number = 0;

        for (var currentChildIndex in this.childChallenges) {
            var currentChild:UserChallenge = this.childChallenges[currentChildIndex];
            currentChild.evaluate(data);
            var currentChildGlobalProgression:number = currentChild.getGlobalProgression();
            childProgress += currentChildGlobalProgression;

            var currentChildProgressionDescription:any = {
                name: currentChild.getName(),
                progression: currentChildGlobalProgression
            };

            this.progress[currentChild.getId()] = currentChildProgressionDescription;

        }
        this.elapsedTime = this.childChallenges[0].getTimeProgress();
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
}

export = TeamChallenge;