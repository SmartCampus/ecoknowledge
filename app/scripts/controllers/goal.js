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
        $http.post('http://localhost:3000/addgoal', self.goal).
          success(function(data) {
            self.goal.debugGet = data;
          }).
          error(function() {
          });

        // TODO redirection on success
        // $location.path('/about');
        var tmp = $location;
        tmp = null;
      };
    }]);
})();
