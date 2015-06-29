'use strict';

(function () {
  angular.module('ecoknowledgeApp')
    .controller('GoalCtrl', ['$location', '$http', function ($location,$http) {
      this.goal = {};

      var self = this;

      this.addGoal = function () {
        console.log(self.goal);

        // TODO Do post request
        // ...
        $http.post('http://localhost:3000/addgoal', this.goal).
          success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          self.goal.debugGet = data;
        }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });

        // TODO redirection on success
        // $location.path('/about');
        var tmp = $location;
        tmp = null;
      };
    }]);
})();
