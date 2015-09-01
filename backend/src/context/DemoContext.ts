import UUID = require('node-uuid');

import Context = require('../Context');

import GoalRepository = require('../goal/GoalRepository');
import ChallengeRepository = require('../challenge/UserChallengeRepository');
import UserRepository = require('../user/UserRepository');

import Goal = require('../goal/Goal');
import GoalExpression = require('../condition/expression/GoalExpression');
import Operand = require('../condition/expression/Operand');


import Challenge = require('../challenge/UserChallenge');

class DemoContext {

}

export = DemoContext;