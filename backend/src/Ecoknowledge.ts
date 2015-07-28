import GoalDefinitionRepository = require('./goal/definition/GoalDefinitionRepository');
import GoalInstanceRepository = require('./goal/instance/GoalInstanceRepository');
import GoalInstanceFactory = require('./goal/instance/GoalInstanceFactory');
import BadgeRepository = require('./badge/BadgeRepository');
import BadgeFactory = require('./badge/BadgeFactory');
import UserRepository = require('./user/UserRepository');
import Clock = require('./Clock');
import Badge = require('./badge/Badge');
import User = require('./user/User');
import GoalInstance = require('./goal/instance/GoalInstance');
import GoalDefinition = require('./goal/definition/GoalDefinition');

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

    public getUser(userId:string):User{
        return this.userRepository.getUser(userId);
    }

    public getBadgeInJsonFormat(badgeId:string):any{
        var badge:Badge = this.badgeRepository.getBadge(badgeId);
        console.log('badge in getbadgeinjsonformat : ', badge);
        var badgeInJson:any = {};

        badgeInJson.id=badge.getUuid();
        badgeInJson.name=badge.getName();
        badgeInJson.points=badge.getPoints();
        return badgeInJson;
    }

    public getAllBadgesInJsonFormat():any[]{
        var allBadges:Badge[] = this.badgeRepository.getAllBadges();
        var allBadgesInJson:any[] = [];
        for(var i in allBadges){
            var badgeInJson:any = {};
            badgeInJson.id = allBadges[i].getUuid();
            badgeInJson.name = allBadges[i].getName();
            badgeInJson.points = allBadges[i].getPoints();
            allBadgesInJson.push(badgeInJson);
        }
        return allBadgesInJson;
    }

    public getFinishedBadge(userId:string):number[]{
        var user:User = this.getUser(userId);
        //FIXME return user.getFinishedBadgesID();
        return null;
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

    public updateFinishedBadgeUser(userId:string){
        var user:User = this.getUser(userId);
        var goalsFinished:GoalInstance[] = this.goalInstanceRepository.getFinishedGoalInstances();
        console.log('goals finished : ', goalsFinished);
        for(var i in goalsFinished){
            console.log("---one goal : ", goalsFinished[i]);
            //FIXME badge doesnt exists anymore  var badgeAssociated:Badge = goalsFinished[i].getGoalDefinition().getBadge();
            //FIXME badge doesnt exists anymore console.log('associated badge : ', badgeAssociated);
            //FIXME badge doesnt exists anymore  user.addFinishedBadge(badgeAssociated);
        }
    }

    public addFinishedBadge(BadgeId:string,userId:string){
        var user:User = this.userRepository.getUser(userId);
        var goalDefinition:GoalDefinition = this.goalInstanceRepository.getGoalInstance(BadgeId).getGoalDefinition();
        //FIXME badge doesnt exists anymore var badge:Badge = goalDefinition.getBadge();
        //FIXME badge doesnt exists anymore console.log('add now');
        //FIXME badge doesnt exists anymore  user.addFinishedBadge(badge);
    }

    public removeGoalInstance(goalInstanceId:string){
        console.log('Removing a goal instance',goalInstanceId);
        this.goalInstanceRepository.removeGoalInstance(goalInstanceId);
        console.log('finished to remove a goal instance');
    }
}

export = Ecoknowledge;