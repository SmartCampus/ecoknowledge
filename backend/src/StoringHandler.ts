import JSONSerializer = require('./JSONSerializer');
import Backend = require('./Backend');
import Clock = require('./Clock');

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
        result['users'] = this.backend.userRepository.getDataInJSON();
        result['challenges'] = this.backend.goalInstanceRepository.getDataInJSON();

        this.serializer.save(result, successCallBack, failCallBack);
    }

    fillRepositories(data) {
        console.log("___________________________________________________________");

        this.fillGoalDefinitionRepository(data);
        this.backend.goalDefinitionRepository.displayShortState();

        this.fillBadgesRepository(data);
        this.backend.badgeRepository.displayShortState();

        this.fillChallengesRepository(data);
        this.backend.goalInstanceRepository.displayShortState();

        this.fillUsersRepository(data);
        this.backend.userRepository.displayShortState();

        console.log("___________________________________________________________");

        return {success: '+++\tRepositories filled correctly\t+++'};
    }

    fillGoalDefinitionRepository(data) {
        var goalDefinitions = data.definitions;

        for (var currentGoalDefinitionIndex in goalDefinitions) {
            var currentGoalDefinition = goalDefinitions[currentGoalDefinitionIndex];
            console.log("==========LES DEFINITIONS SONT ICI=============== : ",currentGoalDefinition.conditions);
            var currentGoal = this.backend.goalDefinitionFactory.createGoal(currentGoalDefinition);
            this.backend.goalDefinitionRepository.addGoal(currentGoal);
        }
    }

    fillBadgesRepository(data) {
        var badges = data.badges;

        for (var currentBadgeIndex in badges) {
            var currentBadgeDescription = badges[currentBadgeIndex];
            this.backend.badgeRepository.addBadge(this.backend.badgeFactory.createBadge(currentBadgeDescription));
        }
    }

    fillUsersRepository(data) {
        var users = data.users;

        for (var currentUserIndex in users) {
            var currentUserDescription = users[currentUserIndex];
            var currentUser = this.backend.userFactory.createUser(currentUserDescription);
            this.backend.userRepository.addUser(currentUser);
            this.backend.userRepository.setCurrentUser(currentUser);
        }
    }

    fillChallengesRepository(data) {
        var challenges = data.challenges;

        for (var currentChallengeIndex = 0 ; currentChallengeIndex < challenges.length ; currentChallengeIndex++) {
            var currentChallengeDescription = challenges[currentChallengeIndex];

            var currentChallenge = this.backend.goalInstanceFactory.createGoalInstance(currentChallengeDescription,
                this.backend.goalDefinitionRepository,
                this.backend.userRepository,
                Clock.getMoment(Clock.getNow()));

            this.backend.goalInstanceRepository.addGoalInstance(currentChallenge);
        }
    }
}

export = StoringHandler;