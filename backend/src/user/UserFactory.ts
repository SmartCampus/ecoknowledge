import Entity = require('./Entity');
import User = require('./User');
import ChallengeFactory = require('../challenge/UserChallengeFactory');

class UserFactory {
    public createUser(data:any, challengeFactory:ChallengeFactory):User {
        var userID:string = data.id;
        var userName:string = data.name;
        var mapSymoblicNameToSensor:any = data.mapSymbolicNameToSensor;

        var currentChallenges:string[] = data.currentChallenges;
        var finishedBadgesMap:any = data.finishedBadgesMap;

        var user:User = new User(userName, mapSymoblicNameToSensor, currentChallenges, finishedBadgesMap, challengeFactory, userID);
        return user;
    }
}

export = UserFactory;