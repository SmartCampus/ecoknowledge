import JSONSerializer = require('./JSONSerializer');
import Backend = require('./Backend');

class StoringHandler {
    private serializer:JSONSerializer;

    private backend:Backend;

    constructor(backend:Backend) {
        this.serializer = new JSONSerializer();
        this.backend = backend;
    }

    load():any {
        var result:any = this.serializer.load();

        if (result.error) {
            return result.error;
        }

        console.log(result.success);

        return this.fillRepositories(JSON.parse(result.data));
    }

    save(successCallBack:Function, failCallBack:Function) {
        var result:any = {};

        result['definitions'] = this.backend.goalDefinitionRepository.getDataInJSON();
        result['badges'] = this.backend.badgeRepository.getDataInJSON();

        this.serializer.save(result, successCallBack, failCallBack);
    }

    fillRepositories(data) {
        this.fillGoalDefinitionRepository(data);
        this.fillBadgesRepository(data);
        return {success: '+++\tRepositories filled correctly\t+++'};
    }

    fillGoalDefinitionRepository(data) {
        var goalDefinitions = data.definitions;

        for (var currentGoalDefinitionIndex in goalDefinitions) {
            var currentGoalDefinition = goalDefinitions[currentGoalDefinitionIndex];
            this.backend.goalDefinitionRepository.addGoal(this.backend.goalDefinitionFactory.createGoal(currentGoalDefinition));
        }
    }

    fillBadgesRepository(data) {
        var badges = data.badges;

        for (var currentBadgeIndex in badges) {
            var currentBadgeDescription = badges[currentBadgeIndex];
            this.backend.badgeRepository.addBadge(this.backend.badgeFactory.createBadge(currentBadgeDescription));
        }
    }
}

export = StoringHandler;