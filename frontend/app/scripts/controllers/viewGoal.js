'use strict';

/**
 * @ngdoc function
 * @name ecoknowledgeApp.controller:ViewGoalCtrl
 * @description
 * # ViewGoalCtrl
 * Controller of the ecoknowledgeApp for the view of a goal
 */

angular.module('ecoknowledgeApp')
    .controller('ViewGoalCtrl',['ServiceGoal','$routeParams', function (ServiceGoal, $routeParams) {
        var self = this;
        self.goalName = $routeParams.goalId;
    }
]);