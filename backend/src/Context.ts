import GoalRepository = require('./goal/GoalRepository');
import ChallengeRepository = require('./challenge/UserChallengeRepository');
import UserRepository = require('./user/UserRepository');

interface Context {
    fill(goalDefinitionRepository:GoalRepository, goalInstanceRepository:ChallengeRepository, userRepository:UserRepository);
}

export = Context;