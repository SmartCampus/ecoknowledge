'use strict';

/**
 * @ngdoc function
 * @name ecoknowledgeApp.controller:ViewGoalCtrl
 * @description
 * # ViewGoalCtrl
 * Controller of the ecoknowledgeApp for the view of a goal
 */

angular.module('ecoknowledgeApp')
    .controller('ViewGoalCtrl',['ServiceGoal','ServiceBadgeV2', '$route', function (ServiceGoal, ServiceBadgeV2, $route) {
        var self = this;
        self.goal = {};
        self.badge = {};
        console.log('route : ',$route.current.params.goalId);
        self.getGoal = function() {
            ServiceGoal.get($route.current.params.goalId,function(data){
                console.log('SUCCESS data in GET goal/idGoal',data);
                self.goal = data;
                ServiceBadgeV2.get(self.goal.badgeID, function(dataBadge){
                    console.log('SUCCESS badge data in GET badge/idBadge : ', dataBadge);
                    self.badge = dataBadge;
                },function(dataBadge){
                    console.log('FAIL badge data in GET badge/idBadge : ', dataBadge);
                });
            },function(data){
                console.log('FAIL data in GET goal/idGoal',data);
            });
        };

        self.getGoal();
    }
]);