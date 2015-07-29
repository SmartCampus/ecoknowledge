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

    public displayShortState() {
        console.log("\n\n+++\t Etat du repository des badges\t+++");

        for(var currentBadgeIndex in this.badges) {
            var currentBadge = this.badges[currentBadgeIndex];
            console.log("#",currentBadge.getUuid(),"\t |\tBadge : '", currentBadge.getName(), "'")
        }
    }
}

export = BadgeRepository;