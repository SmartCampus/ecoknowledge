import RouterItf = require('./RouterItf');

import GoalInstanceRepository = require('../goal/instance/GoalInstanceRepository');
import GoalInstanceFactory = require('../goal/instance/GoalInstanceFactory');
import GoalDefinitionRepository = require('../goal/definition/GoalDefinitionRepository');
import Clock = require('../Clock');

class GoalInstanceRouter extends RouterItf {
    private goalInstanceRepository:GoalInstanceRepository;
    private goalInstanceFactory:GoalInstanceFactory;
    private goalDefinitionRepository:GoalDefinitionRepository;

    constructor(goalInstanceRepository:GoalInstanceRepository, goalInstanceFactory:GoalInstanceFactory, goalDefinitionRepository:GoalDefinitionRepository) {
        super();
        this.goalInstanceRepository = goalInstanceRepository;
        this.goalInstanceFactory = goalInstanceFactory;
        this.goalDefinitionRepository = goalDefinitionRepository;
    }

    buildRouter() {
        this.router.get('/new', this.newGoalInstance);
    }

    newGoalInstance(req:any, res:any) {
        var goalID = req.body.goalID;

        if (!goalID) {
            res.status(400).send({'error': 'goalID field is missing in request'});
        }

        //  TODO ! stub !
        //  The data object below is a stub to manually
        //  bind a symbolic name to a sensor name.
        //  In the future, this won't be hardcoded but
        //  will be set by final user during the account
        //  creation process

        var data =
        {
            "goal": {
                "id": goalID,
                "conditions": {"TMP_CLI": "TEMP_443V"}
            }
        };

        var goalInstance = this.goalInstanceFactory.createGoalInstance(data, this.goalDefinitionRepository, null, new Date(Clock.getNow()));
        this.goalInstanceRepository.addGoalInstance(goalInstance);
    }
}

export = GoalInstanceRouter;