'use strict';

var app = angular.module('ecoknowledgeApp');

app.controller('LoginCtrl', ['ServiceLogin', '$rootScope', '$location', '$cookies', function (ServiceLogin, $rootScope, $location, $cookies) {
  this.username = '';
  this.debug = '';

  var self = this;
  this.connect = function () {
    ServiceLogin.login(self.username,
      function (data) {
        console.log('Login success: data received', data);

        $cookies.put('token', data.data.token);
        $cookies.put('dashboardWanted', 'personal');

        console.log('Token stored : ', $cookies.get('token'));

        var pathToDashboard = '/dashboard/view/' + data.data.token;

        console.log('Redirection vers', pathToDashboard);
        $location.path(pathToDashboard);
      },
      function (data) {
        console.log('Login fail: data received', data);
      });
  };

}]);
