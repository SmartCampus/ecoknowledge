'use strict';

/**
 * @ngdoc function
 * @name ecoknowledgeApp.controller:BadgeCtrlV2
 * @description
 * # BadgeCtrl
 * Controller of the ecoknowledgeApp for the creation of a badge
 */

angular.module('ecoknowledgeApp')
    .controller('BadgeCtrlV2', function(){
        this.badge = {};
        this.badge.name = '';
        this.badge.points = 0;

        this.addBadge = function(){
            //envoie le this.badges
        };

    });