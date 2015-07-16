import GoalDefinitionRepository = require('./goal/definition/GoalDefinitionRepository');
import GoalInstanceRepository = require('./goal/instance/GoalInstanceRepository');
import GoalInstanceFactory = require('./goal/instance/GoalInstanceFactory');
import UserRepository = require('./user/UserRepository');
import Clock = require('./Clock');

class Ecoknowledge {
    private goalDefinitionRepository:GoalDefinitionRepository;
    private goalInstanceRepository:GoalInstanceRepository;
    private userRepository:UserRepository;

    private goalInstanceFactory:GoalInstanceFactory;

    constructor(goalDefinitionRepository:GoalDefinitionRepository, goalInstanceRepository:GoalInstanceRepository, userRepository:UserRepository) {
        this.goalDefinitionRepository = goalDefinitionRepository;
        this.goalInstanceRepository = goalInstanceRepository;
        this.userRepository = userRepository;

        this.goalInstanceFactory = new GoalInstanceFactory();
    }

    public getGoalDefinitionDescription(goalUUID:string):any {
        return this.goalDefinitionRepository.getGoal(goalUUID).getData();
    }

    public getListOfGoalsDefinition():any[] {
        return this.goalDefinitionRepository.getListOfGoalsInJsonFormat();
    }

    public getListOfGoalInstances():any[] {
        return this.goalInstanceRepository.getListOfGoalInstancesInJsonFormat();
    }

    public getGoalInstancesDescriptionInJsonFormat(data:any=null):any[] {
        return this.goalInstanceRepository.getGoalInstancesDescriptionInJsonFormat(data);
    }

    public addGoalDefinition(data:any):string {
        return this.goalDefinitionRepository.addGoalByDescription(data);
    }

    public addGoalInstance(data:any) {
        var goalInstance = this.goalInstanceFactory.createGoalInstance(data, this.goalDefinitionRepository, this.userRepository,new Date(Clock.getNow()));
        this.goalInstanceRepository.addGoalInstance(goalInstance);
    }

    // debug only
    public evaluateGoal(data:any):boolean {
        return this.goalDefinitionRepository.evaluateGoal(data);
    }


}

export = Ecoknowledge;