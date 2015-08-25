import Entity = require('./Entity');
import BadgeIDsToNumberOfTimesEarnedMap = require('./BadgeIDsToNumberOfTimesEarnedMap');

class User extends Entity {

    constructor(name:string, id = null, currentChallenges:string[] = [], finishedBadgesMap:BadgeIDsToNumberOfTimesEarnedMap = {}) {
        super(name, id, currentChallenges, finishedBadgesMap);
    }
}

export = User;