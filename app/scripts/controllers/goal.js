'use strict';

(function () {
  angular.module('ecoknowledgeApp')
    .controller('GoalCtrl', ['$location', '$http', function ($location,$http) {
      this.goal = {};

      var self = this;

      this.addGoal = function () {
        console.log(self.goal);

        //  TODO delete next token => get for test purpose
        $http.get('http://localhost:3000/helloworld').
            success(function(data, status, headers, config) {
              // this callback will be called asynchronously
              // when the response is available
              self.goal.debugGet = data;
            }).
            error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
            });

        // TODO Do post request
        // ...

        // TODO redirection on success
        // $location.path('/about');
        var tmp = $location;
        tmp = null;
      };
    }]);
})();
