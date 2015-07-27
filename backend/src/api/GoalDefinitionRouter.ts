import RouterItf = require('./RouterItf');

import GoalDefinitionRepository = require('../goal/definition/GoalDefinitionRepository');
import GoalDefinitionFactory = require('../goal/definition/GoalDefinitionFactory');

/**
 * GoalDefinitionRouter class</br>
 * This class handle all the API for
 * goal definition class and related.
 *
 * @class GoalDefinitionRouter
 * @extends RouterItf
 */
class GoalDefinitionRouter extends RouterItf {

    private goalDefinitionRepository:GoalDefinitionRepository;
    private goalDefinitionFactory:GoalDefinitionFactory;

    constructor(goalDefinitionRepository:GoalDefinitionRepository, goalDefinitionFactory:GoalDefinitionFactory) {
        super();
        this.goalDefinitionRepository = goalDefinitionRepository;
        this.goalDefinitionFactory = goalDefinitionFactory;
    }

    buildRouter() {
        this.router.get('/all', this.getAllGoalsDefinition);
        this.router.post('/new', this.addGoalDefinition);
    }

    /**
     * This method will return all goals definition
     * using goalDefinitionRepository#getListOfGoalsInJsonFormat
     * @param req
     * @param res
     */
    getAllGoalsDefinition(req:any, res:any) {
        var result = this.goalDefinitionRepository.getListOfGoalsInJsonFormat();
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
        var newGoal = this.goalDefinitionFactory.createGoal(data);
        this.goalDefinitionRepository.addGoal(newGoal);
        res.send("OK : définition d'objectif créee avec succès");
    }
}

export = GoalDefinitionRouter;