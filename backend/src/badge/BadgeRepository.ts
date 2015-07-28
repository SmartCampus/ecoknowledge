import Badge = require('./Badge');

class BadgeRepository {

    private badges:Badge[] = [];

    public addBadge(badge:Badge) {
        console.log("AJOUT DU BADGE", badge.getUuid());
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

    public getAllBadges():Badge[]{
        return this.badges;
    }

    getDataInJSON():any {
        var result:any[] = [];

        for(var badgeIndex in this.badges) {
            var currentBadge = this.badges[badgeIndex];
            result.push(currentBadge.getDataInJSON());
        }

        return result;
    }
}

export = BadgeRepository;