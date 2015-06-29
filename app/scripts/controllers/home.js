'use strict';

/**
 * @ngdoc function
 * @name ecoknowledgeApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the ecoknowledgeApp for the firstpage which display
 * the objectives and the badges we have.
 */
angular.module('ecoknowledgeApp')
    .controller('HomeCtrl', function ($scope) {
        var self = this;
        self.goals = [];
        self.badges = [];

        //TODO remove this goal
        self.goal ={};
        self.goal.name="Goal n°1";

        /*
         * Add a goal the the array goals
         */
        self.addGoal = function(g){
            console.log(g);
            self.goals.push(g);
            console.log(self.goals);
        };

        /*
         * add a badge to the array badges
         */
        self.addBadge = function(bdg){
            console.log(bdg);
            self.badges.add(bdg);
            console.log(self.badges);
        };

        self.addGoal(this.goal);

    });