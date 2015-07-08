import UUID = require('node-uuid');

import Context = require('../Context');

import GoalProvider = require('../goal/GoalProvider');
import BadgeProvider = require('../badge/BadgeProvider');
import UserProvider = require('../user/UserProvider');

import Goal = require('../goal/Goal');
import GoalCondition = require('../goal/condition/GoalCondition');
import Operand = require('../goal/condition/Operand');


import Badge = require('../badge/BadgeInstance');

class DemoContext implements Context {

    private aGoal:Goal;
    private aUUID:string;


    fill(goalProvider:GoalProvider, badgeProvider:BadgeProvider, userProvider:UserProvider) {
        if (goalProvider) {
            this.fillGoalProvider(goalProvider);
        }

        if(badgeProvider) {
            this.fillBadgeProvider(badgeProvider);
        }
    }

    public fillGoalProvider(goalProvider:GoalProvider) {
        this.aUUID = UUID.v4();

        this.aGoal = new Goal('Clim éco !');
        this.aGoal.setUUID(this.aUUID);

        this.aGoal.addCondition(new GoalCondition(new Operand('Temp_cli', true), '>', new Operand('15', false),
            'la température de la clim doit être supérieure à 14°C'));
        this.aGoal.addCondition(new GoalCondition(new Operand('Temp_ext', true), '>', new Operand('40', false),
            'la température extérieure doit être supérieure à 40°C'));

        goalProvider.addGoal(this.aGoal);
    }

    public fillBadgeProvider(badgeProvider:BadgeProvider) {
        var mapGoalToConditionAndSensor:any  = {};

        var condition1Desc:any = {};
        condition1Desc.name = 'Temp_cli';
        condition1Desc.sensor = 'AC_443';

        var condition2Desc:any = {};
        condition2Desc.name = 'Temp_ext';
        condition2Desc.sensor = 'TEMP_444';

        var arrayOfConditions:any[] = [condition1Desc, condition2Desc];


        mapGoalToConditionAndSensor[this.aUUID.toString()] = arrayOfConditions;
        var aBadge = new Badge('Apprenti climatisation',"Vous n'êtes pas un esquimau !",10,
            [this.aGoal],null,mapGoalToConditionAndSensor);

        badgeProvider.addBadge(aBadge);
    }
}

export = DemoContext;