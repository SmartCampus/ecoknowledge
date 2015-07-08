import GoalProvider = require('./goal/GoalProvider');
import BadgeProvider = require('./badge/BadgeProvider');
import UserProvider = require('./user/UserProvider');

interface Context {
    fill(goalProvider:GoalProvider, badgeProvider:BadgeProvider, userProvider:UserProvider);
}

export = Context;