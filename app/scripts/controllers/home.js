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

        //TODO remove this badge
        self.badge = { name: "Mon Nom", description: "Ma description fortement jolie", point: "53", objective: "goal n°1" };
        self.badges.push(self.badge);
        //TODO remove this goal
        self.goal ={};
        self.goal.name="Goal n°1";

        /*
         * Add a goal the the array goals
         */
        self.addGoal = function(g){
            self.goals.push(g);
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