import Entity = require('./Entity');
import User = require('./User');

class UserFactory {
    public createUser(data:any):Entity {
        var userID:string = data.id;
        var userName:string = data.name;
        var currentChallenges:string[] = data.currentChallenges;
        var finishedBadgesMap:any = data.finishedBadgesMap;

        var user:User = new User(userName, userID, currentChallenges, finishedBadgesMap);
        return user;
    }
}

export = UserFactory;