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
        result['challenges'] = this.backend.challengeRepository.getDataInJSON();

        this.serializer.save(result, successCallBack, failCallBack);
    }

    fillRepositories(data) {
        console.log("___________________________________________________________");

        this.fillGoalDefinitionRepository(data);
        this.backend.goalDefinitionRepository.displayShortState();

        this.fillBadgesRepository(data);
        this.backend.badgeRepository.displayShortState();

        this.fillUsersRepository(data);
        this.backend.userRepository.displayShortState();

        this.fillTeamRepository(data);
        this.backend.teamRepository.displayShortState();

        this.fillChallengesRepository(data);
        this.backend.challengeRepository.displayShortState();

        console.log("___________________________________________________________");

        return {success: '+++\tRepositories filled correctly\t+++'};
    }

    fillGoalDefinitionRepository(data) {
        var goalDefinitions = data.definitions;

        for (var currentGoalDefinitionIndex in goalDefinitions) {
            var currentGoalDefinition = goalDefinitions[currentGoalDefinitionIndex];
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
            var currentUser = this.backend.userFactory.createUser(currentUserDescription, this.backend.challengeFactory);
            this.backend.userRepository.addUser(currentUser);
            this.backend.userRepository.setCurrentUser(currentUser);
        }
    }

    fillTeamRepository(data) {
        var teams = data.teams;

        for (var currentTeamIndex in teams) {
            var currentTeamDescription = teams[currentTeamIndex];
            var currentTeam = this.backend.teamFactory.createTeam(currentTeamDescription, this.backend.userRepository);
            this.backend.teamRepository.addTeam(currentTeam);
        }

    }

    fillChallengesRepository(data) {
        var challenges = data.challenges;

        for (var currentChallengeIndex = 0; currentChallengeIndex < challenges.length; currentChallengeIndex++) {
            var currentChallengeDescription = challenges[currentChallengeIndex];

            var currentChallenge = this.backend.challengeFactory.restoreChallenge(currentChallengeDescription, this.backend.goalDefinitionRepository, this.backend.userRepository, Clock.getMoment(Clock.getNow()));

            this.backend.challengeRepository.addGoalInstance(currentChallenge);
        }
    }
}

export = StoringHandler;