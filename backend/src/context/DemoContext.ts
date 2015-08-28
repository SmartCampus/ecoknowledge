import UUID = require('node-uuid');

import Context = require('../Context');

import GoalRepository = require('../goal/GoalRepository');
import ChallengeRepository = require('../challenge/UserChallengeRepository');
import UserRepository = require('../user/UserRepository');

import Goal = require('../goal/Goal');
import GoalExpression = require('../condition/expression/GoalExpression');
import Operand = require('../condition/expression/Operand');


import Challenge = require('../challenge/UserChallenge');

class DemoContext implements Context {

    private aGoal:Goal;
    private aUUID:string;


    fill(goalDefinitionRepository:GoalRepository, goalInstanceRepository:ChallengeRepository, userRepository:UserRepository) {
        if (goalDefinitionRepository) {
            this.fillGoalProvider(goalDefinitionRepository);
        }

        if(goalInstanceRepository) {
            this.fillBadgeProvider(goalInstanceRepository);
        }
    }

    public fillGoalProvider(goalProvider:GoalRepository) {
        /*FIXME
        this.aUUID = UUID.v4();

        this.aGoal = new GoalDefinition('Clim éco !');
        this.aGoal.setUUID(this.aUUID);

        this.aGoal.addCondition(new GoalCondition(new Operand('Temp_cli', true), '>', new Operand('15', false),
            'la température de la clim doit être supérieure à 14°C'));
        this.aGoal.addCondition(new GoalCondition(new Operand('Temp_ext', true), '>', new Operand('40', false),
            'la température extérieure doit être supérieure à 40°C'));

        goalProvider.addChallenge(this.aGoal);
        */
    }

    public fillBadgeProvider(badgeProvider:ChallengeRepository) {
        /*
        var mapGoalToConditionAndSensor:any  = {};


        var condition1Desc:any = {};
        condition1Desc.name = 'Temp_cli';
        condition1Desc.sensor = 'AC_443';

        var condition2Desc:any = {};
        condition2Desc.name = 'Temp_ext';
        condition2Desc.sensor = 'TEMP_444';

        var arrayOfConditions:any[] = [condition1Desc, condition2Desc];


        mapGoalToConditionAndSensor[this.aUUID.toString()] = arrayOfConditions;
       var aBadge = new GoalInstance("Vous n'êtes pas un esquimau !",
            this.aGoal,mapGoalToConditionAndSensor);

        badgeProvider.addGoalInstance(aBadge);
       FIXME
        */
    }
}

export = DemoContext;