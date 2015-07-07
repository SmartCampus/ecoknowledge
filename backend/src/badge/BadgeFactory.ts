import BadgeInstance = require('./BadgeInstance');
import GoalProvider = require('../goal/GoalProvider');
import UserProvider = require('../user/UserProvider');

class BadgeFactory {

    //TODO can only handle a badge with ONE goal
    public createBadge(data:any, goalProvider:GoalProvider, userProvider:UserProvider):BadgeInstance {
        var badgeName:string = data.name;
        var badgeDescription:string = data.description;
        var badgePoints:number = data.points;
        var badgeSensors:any[] = data.currentGoal.conditions;

        var sensors:string[] = [];
        for(var i = 0 ; i < badgeSensors.length ; i ++) {
            sensors.push(badgeSensors[i].sensor.id);
        }

        var badgeGoalID:string = data.currentGoal.id;
        var goal = goalProvider.getGoal(badgeGoalID);

        var userID:string = data.userID;
        var user = userProvider.getUser(userID);

        var badge:BadgeInstance = new BadgeInstance(badgeName, badgeDescription, badgePoints, [goal],user, sensors);

        user.addBadge(badge);

        return badge;
    }

}

export = BadgeFactory;