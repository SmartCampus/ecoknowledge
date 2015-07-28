import Badge = require('./Badge');

class BadgeFactory {

    public createBadge(data:any):Badge {
        if(!data.name){
            throw new Error('No name for the badge');
        }
         if(!data.points){
             throw new Error('No points for the badge');
         }

        return new Badge(data.name, data.points, data.id);
    }
}

export = BadgeFactory;