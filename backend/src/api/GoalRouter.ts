import RouterItf = require('./RouterItf');

import GoalRepository = require('../goal/GoalRepository');
import GoalFactory = require('../goal/GoalFactory');
import Context = require('../Context');

/**
 * GoalDefinitionRouter class</br>
 * This class handle all the API for
 * goal definition class and related.
 *
 * @class GoalDefinitionRouter
 * @extends RouterItf
 */

class GoalRouter extends RouterItf {

    private goalRepository:GoalRepository;
    private goalFactory:GoalFactory;


    constructor(context:Context) {
        super();
        this.goalRepository = context.getGoalRepository();
        this.goalFactory = context.getGoalFactory();

    }

    buildRouter() {
        var self = this;

        this.router.post('/new', function (req, res) {
            self.addGoalDefinition(req, res);
        });
    }

    addGoalDefinition(req:any, res:any) {
        var data = req.body;
        try {
            var newGoal = this.goalFactory.createGoal(data);
            this.goalRepository.addGoal(newGoal);
            res.send("OK : définition d'objectif créee avec succès");
        }
        catch (e) {
            console.log("err", e);
            res.send(e.toString());
        }
    }
}

export = GoalRouter;