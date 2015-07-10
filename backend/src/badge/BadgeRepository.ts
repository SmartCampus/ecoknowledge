import Badge = require('./Badge');

class BadgeRepository {

    private badges:Badge[] = [];

    public addBadge(badge:Badge) {
        this.badges.push(badge);
    }

    public getBadge(aUUID:string):Badge {
        for(var i in this.badges) {
            var currentBadge = this.badges[i];
            if(currentBadge.hasUUID(aUUID)) {
                return currentBadge;
            }
        }

        return null;
    }
}

export = BadgeRepository;