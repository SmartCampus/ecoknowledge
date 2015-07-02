'use strict';

/**
 * @ngdoc function
 * @name ecoknowledgeApp.controller:ViewGoalCtrl
 * @description
 * # ViewGoalCtrl
 * Controller of the ecoknowledgeApp for the view of a goal
 */

angular.module('ecoknowledgeApp')
    .controller('ViewGoalCtrl',['ServiceGoal','$route', function (ServiceGoal, $route) {
        var self = this;
        self.goal = {};
        console.log('route : ',$route.current.params.goalId);
        self.getGoal = function() {
            ServiceGoal.get($route.current.params.goalId,function(data){
                console.log('SUCCESS data in GET goal/idGoal',data);
                self.goal = data;
            },function(data){
                console.log('FAIL data in GET goal/idGoal',data);
            });
        };

        self.getSign = function(signe){
            switch(signe){
                case 'inf':
                    return '<';
                case 'sup':
                    return '>';
                case 'eq':
                    return '=';
                case 'dif':
                    return '≠';
                default:
                    return null;
            }
        };

        self.getGoal();
    }
]);