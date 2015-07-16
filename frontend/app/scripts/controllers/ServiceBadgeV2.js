'use strict';

/**
 * File with all the services associated to Badge (GET, POST)
 */

var path = 'http://localhost:3000/';

var app = angular.module('ecoknowledgeApp');
app.service('ServiceBadgeV2',['$http', function ServiceBadgeV2($http){
    this.post = function(badge, successFunc, failFunc){
        $http.post(path+'badgesV2', badge)
            .success(function(data){
                successFunc(data);
            })
            .error(function(data) {
                failFunc(data);
            });
    };

    this.get = function(id, successFunc, failFunc){
      $http.get(path+'badgesV2/'+id)
          .success(function(data){
              successFunc(data);
          })
          .error(function(data){
              failFunc(data);
          });
    };
}]);
