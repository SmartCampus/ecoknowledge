import Status= require('../Status');
import UserChallenge= require('./UserChallenge');
import Team= require('../user/Team');

class TeamChallenge {

    private id:string;

    private team:Team;

    private status:Status;
    private childCHallenges:UserChallenge;
    private elapsedTime:number;
    private progress:any = {};

    constructor(team:Team, childChallenges:UserChallenge[], id = null) {

    }

    evaluate(data):void {
        for(var currentChild in this.childCHallenges) {
            //currentChild.evaluate(data);
        }
    }
}

export = TeamChallenge;