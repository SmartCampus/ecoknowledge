import UUID = require('node-uuid');

import Context = require('../Context');

import GoalDefinitionRepository = require('../goal/definition/GoalDefinitionRepository');
import GoalInstanceRepository = require('../goal/instance/GoalInstanceRepository');
import UserRepository = require('../user/UserRepository');

import GoalDefinition = require('../goal/definition/GoalDefinition');
import GoalCondition = require('../goal/condition/GoalCondition');
import Operand = require('../goal/condition/Operand');


import GoalInstance = require('../goal/instance/GoalInstance');

class DemoContext implements Context {

    private aGoal:GoalDefinition;
    private aUUID:string;


    fill(goalDefinitionRepository:GoalDefinitionRepository, goalInstanceRepository:GoalInstanceRepository, userRepository:UserRepository) {
        if (goalDefinitionRepository) {
            this.fillGoalProvider(goalDefinitionRepository);
        }

        if(goalInstanceRepository) {
            this.fillBadgeProvider(goalInstanceRepository);
        }
    }

    public fillGoalProvider(goalProvider:GoalDefinitionRepository) {
        /*FIXME
        this.aUUID = UUID.v4();

        this.aGoal = new GoalDefinition('Clim éco !');
        this.aGoal.setUUID(this.aUUID);

        this.aGoal.addCondition(new GoalCondition(new Operand('Temp_cli', true), '>', new Operand('15', false),
            'la température de la clim doit être supérieure à 14°C'));
        this.aGoal.addCondition(new GoalCondition(new Operand('Temp_ext', true), '>', new Operand('40', false),
            'la température extérieure doit être supérieure à 40°C'));

        goalProvider.addGoal(this.aGoal);
        */
    }

    public fillBadgeProvider(badgeProvider:GoalInstanceRepository) {
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