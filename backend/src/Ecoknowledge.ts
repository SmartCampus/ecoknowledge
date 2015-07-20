import GoalDefinitionRepository = require('./goal/definition/GoalDefinitionRepository');
import GoalInstanceRepository = require('./goal/instance/GoalInstanceRepository');
import GoalInstanceFactory = require('./goal/instance/GoalInstanceFactory');
import BadgeRepository = require('./badge/BadgeRepository');
import BadgeFactory = require('./badge/BadgeFactory');
import UserRepository = require('./user/UserRepository');
import Clock = require('./Clock');

class Ecoknowledge {
    private goalDefinitionRepository:GoalDefinitionRepository;
    private goalInstanceRepository:GoalInstanceRepository;
    private userRepository:UserRepository;

    private badgeRepository:BadgeRepository;
    private badgeFactory:BadgeFactory;

    private goalInstanceFactory:GoalInstanceFactory;

    constructor(goalDefinitionRepository:GoalDefinitionRepository, goalInstanceRepository:GoalInstanceRepository, userRepository:UserRepository, badgeRepository:BadgeRepository) {
        this.goalDefinitionRepository = goalDefinitionRepository;
        this.goalInstanceRepository = goalInstanceRepository;
        this.userRepository = userRepository;
        this.badgeRepository = badgeRepository;
        this.badgeFactory = new BadgeFactory();

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
        return this.goalDefinitionRepository.addGoalByDescription(data, this.badgeRepository);
    }

    public addGoalInstance(data:any) {
        var goalInstance = this.goalInstanceFactory.createGoalInstance(data, this.goalDefinitionRepository, this.userRepository,new Date(Clock.getNow()));
        this.goalInstanceRepository.addGoalInstance(goalInstance);
    }

    public addBadge(data:any){
        var badge = this.badgeFactory.createBadge(data);
        this.badgeRepository.addBadge(badge);
    }

    // debug only
    public evaluateGoal(data:any):boolean {
        return this.goalDefinitionRepository.evaluateGoal(data);
    }
}

export = Ecoknowledge;