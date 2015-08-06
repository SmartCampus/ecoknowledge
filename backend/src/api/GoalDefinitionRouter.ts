import RouterItf = require('./RouterItf');

import GoalRepository = require('../goal/GoalRepository');
import GoalFactory = require('../goal/GoalFactory');
import UserRepository = require('../user/UserRepository');
import ChallengeRepository = require('../challenge/ChallengeRepository');

/**
 * GoalDefinitionRouter class</br>
 * This class handle all the API for
 * goal definition class and related.
 *
 * @class GoalDefinitionRouter
 * @extends RouterItf
 */

class GoalDefinitionRouter extends RouterItf {

    private goalDefinitionRepository:GoalRepository;
    private goalDefinitionFactory:GoalFactory;
    private challengeRepository:ChallengeRepository;
    private userRepository:UserRepository;

    constructor(goalDefinitionRepository:GoalRepository, goalDefinitionFactory:GoalFactory, challengeRepository:ChallengeRepository, userRepository:UserRepository) {
        super();
        this.goalDefinitionRepository = goalDefinitionRepository;
        this.goalDefinitionFactory = goalDefinitionFactory;
        this.challengeRepository = challengeRepository;
        this.userRepository = userRepository;
    }

    buildRouter() {
        var self = this;
        this.router.get('/all', function (req, res) {
            self.getAllGoalsDefinition(req, res);
        });
        this.router.get('/:id', function (req, res) {
            self.getGoalDefinition(req, res);
        });
        this.router.post('/new', function (req, res) {
            self.addGoalDefinition(req, res);
        });
    }

    /**
     * This method will return the goal definition
     * of a specific goal, using its uuid and
     * using goalDefinitionRepository#getListOfGoalsInJsonFormat
     * @param req
     * @param res
     */
    getGoalDefinition(req, res) {
        var result = this.goalDefinitionRepository.getGoal(req.params.id).getDataInJSON();
        res.send(result);
    }

    /**
     * This method will return all goals definition
     * using goalDefinitionRepository#getListOfGoalsInJsonFormat
     * @param req
     * @param res
     */
    getAllGoalsDefinition(req:any, res:any) {
        var result = this.goalDefinitionRepository.getListOfUntakedGoalInJSONFormat(this.userRepository.getCurrentUser(), this.challengeRepository);
        res.send(result);
    }

    /**
     * This method will create the goal definition
     * via its internal goal definition factory and
     * will add it into the specified goal definition
     * repository</br>
     * See goalDefinitionFactory#createGoal method to
     * see required request fields
     * @param req
     * @param res
     */
    addGoalDefinition(req:any, res:any) {
        var data = req.body;
        try {
            var newGoal = this.goalDefinitionFactory.createGoal(data);
            this.goalDefinitionRepository.addGoal(newGoal);
            res.send("OK : définition d'objectif créee avec succès");
        }
        catch (e) {
            res.send(e.toString());
        }
    }
}

export = GoalDefinitionRouter;