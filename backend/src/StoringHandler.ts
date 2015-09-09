import JSONSerializer = require('./JSONSerializer');
import Context = require('./Context');
import Clock = require('./Clock');

class StoringHandler {
    private serializer:JSONSerializer;

    private context:Context;

    constructor(backend:Context) {
        this.serializer = new JSONSerializer();
        this.context = backend;
    }

    load(pathToFileToLoad:string):any {
        var result:any = this.serializer.load(pathToFileToLoad);

        if (result.error) {
            return result.error;
        }

        console.log(result.success);

        return result.data;
    }

    save(pathToFile:string, successCallBack:Function, failCallBack:Function) {
        var result:any = {};

        result['definitions'] = this.context.getGoalRepository().getDataInJSON();
        result['badges'] = this.context.getBadgeRepository().getDataInJSON();
        result['users'] = this.context.getUserRepository().getDataInJSON();
        result['teams'] = this.context.getTeamRepository().getDataInJSON();
        result['challenges'] = {};
        result['challenges']['userChallenges'] = this.context.getUserChallengeRepository().getDataInJSON();
        result['challenges']['teamChallenges'] = this.context.getTeamChallengeRepository().getDataInJSON();

        this.serializer.save(pathToFile, result, successCallBack, failCallBack);
    }
}

export = StoringHandler;