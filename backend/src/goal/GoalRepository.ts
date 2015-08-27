import Goal = require('./Goal');
import GoalFactory = require('./GoalFactory');
import BadgeRepository = require('../badge/BadgeRepository');
import ChallengeRepository = require('../challenge/ChallengeRepository');
import Challenge = require('../challenge/Challenge');
import Badge = require('../badge/Badge');
import User = require('../user/User');

class GoalDefinitionRepository {

    private badgeRepository:BadgeRepository;

    private goals:Goal[] = [];

    private factory:GoalFactory;

    constructor(badgeRepository:BadgeRepository) {
        this.factory = new GoalFactory();
        this.badgeRepository = badgeRepository;
    }

    public displayShortState() {
        console.log("\n\n+++\t Etat du repository des objectifs\t+++");

        for (var currentGoalIndex in this.goals) {
            var currentGoal = this.goals[currentGoalIndex];
            console.log(currentGoal.getStringRepresentation());
        }
    }

    public addGoalByDescription(data:any, badgeRepository:BadgeRepository):string {
        var badgeID = data.badgeID;

        if (!badgeID) {
            throw new Error('badges null when trying to create a new goal');
        }
        var badge:Badge = badgeRepository.getBadge(data.badgeID);
        if (!badge) {
            throw new Error('No badge with this id when trying to create a new goal');
        }

        var newGoal:Goal = this.factory.createGoal(data);
        this.goals.push(newGoal);
        return newGoal.getUUID().toString();
    }

    public addGoal(aGoal:Goal) {
        this.goals.push(aGoal);
    }

    public getGoal(goalUUID:string):Goal {
        for (var i in this.goals) {
            var currentGoal = this.goals[i];
            if (currentGoal.hasUUID(goalUUID)) {
                return currentGoal;
            }
        }

        return null;
    }

    getListOfNotTakenGoalInJSONFormat(user:User, challengeRepository:ChallengeRepository) {
        var result = [];

        var currentChallengesID:string[] = user.getCurrentChallenges();

        var takenGoals:Goal[] = [];
        for (var currentChallengeIDIndex in currentChallengesID) {
            var currentChallengeID:string = currentChallengesID[currentChallengeIDIndex];
            var currentChallenge:Challenge = challengeRepository.getGoalInstance(currentChallengeID);
            takenGoals.push(currentChallenge.getGoalDefinition());
        }

        var goals:Goal[] = this.diffBetweenTakenGoalsAndAvailableGoals(takenGoals, this.goals);

        for (var goalIndex in goals) {
            var currentGoal = goals[goalIndex];

            var goalDesc:any = {};
            goalDesc.name = this.badgeRepository.getBadge(currentGoal.getBadgeID()).getName();
            goalDesc.id = currentGoal.getUUID();

            result.push(goalDesc);
        }

        return result;
    }

    private diffBetweenTakenGoalsAndAvailableGoals(takenGoals:Goal[], availableGoals:Goal[]):Goal[] {
        var result:Goal[] = [];

        for (var currentAvailableGoalIndex in availableGoals) {
            var currentAvailableGoal = availableGoals[currentAvailableGoalIndex];
            if(!this.goalExistsIn(currentAvailableGoal.getUUID(), takenGoals)) {
                result.push(currentAvailableGoal);
            }
        }

        return result;
    }

    private goalExistsIn(goalID:string, goals:Goal[]):boolean {
        for (var currentGoalIndex in goals) {
            var currentGoal = goals[currentGoalIndex];
            if (currentGoal.hasUUID(goalID)) {
                return true;
            }
        }
        return false;
    }

    public getListOfGoalsInJsonFormat():any[] {
        var result = [];

        for (var goalIndex in this.goals) {
            var currentGoal = this.goals[goalIndex];

            var goalDesc:any = {};
            goalDesc.name = this.badgeRepository.getBadge(currentGoal.getBadgeID()).getName();
            goalDesc.id = currentGoal.getUUID();

            result.push(goalDesc);
        }

        return result;
    }

    public evaluateGoal(data:any):boolean {
        var goalID:string = data.id;
        var goal:Goal = this.getGoal(goalID);

        var goalValues:any[] = data.values;
        var values = [];
        for (var i = 0; i < goalValues.length; i++) {
            values.push(goalValues[i].value);
        }

        return goal.evaluate(values);
    }

    public getDataInJSON():any {
        var result:any[] = [];

        for (var goalDefinitionIndex in this.goals) {
            result.push(this.goals[goalDefinitionIndex].getDataInJSON());
        }

        return result;
    }
}

export = GoalDefinitionRepository;