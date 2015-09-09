'use strict';

/**
 * @ngdoc function
 * @name ecoknowledgeApp.controller:BadgeCtrlV2
 * @description
 * # BadgeCtrl
 * Controller of the ecoknowledgeApp for the creation of a badge
 */

angular.module('ecoknowledgeApp')
    .controller('BadgeCtrl', ['ServiceBadge', function(ServiceBadgeV2){
        this.badge = {};
        this.badge.name = '';
        this.badge.points = 0;

        var self = this;

        this.addBadge = function(){
            console.log('add badge V2');
            ServiceBadgeV2.post(self.badge,function(data){
                console.log('achieve to send a badge',data);
            },function(data){
                console.log('fail to send a badge',data);
            });
        };

    }]);
