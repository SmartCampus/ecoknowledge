'use strict';

/**
 * @ngdoc function
 * @name ecoknowledgeApp.controller:BadgeCtrl
 * @description
 * # BadgeCtrl
 * Controller of the ecoknowledgeApp for the creation of a badge
 */

angular.module('ecoknowledgeApp')
    .controller('BadgeCtrl', function () {
        var self = this;
        self.badge = {};
        self.goals = [];

        self.addBadge = function(){
            console.log(self.badge);
        };

        //TODO link au serveur
        self.getGoals = function(){
            self.goals = [];

            this.goal = {};
            this.goal.name = "goal n°1";
            this.goal.comparaison = "inf";
            this.goal.value = 23;
            self.goals.push(this.goal);

            this.goal = {};
            this.goal.name = "goal n°2";
            this.goal.comparaison = "sup";
            this.goal.value = 38;
            self.goals.push(this.goal);
        };

        self.getGoals();
    });