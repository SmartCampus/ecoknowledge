import Badge = require('./Badge');
import BadRequestException = require('../exceptions/BadRequestException');

class BadgeFactory {
    createBadge(data:any):Badge {
        if(!data.name) {
            throw new BadRequestException("Field name is missing");
        }

        if(!data.points) {
            throw new BadRequestException("Field points is missing");
        }

        //TODO persist badge
        var newBadge:Badge = new Badge(data.name, data.points)
        return newBadge;
    }
}

export = BadgeFactory;