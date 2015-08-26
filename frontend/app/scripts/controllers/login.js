'use strict';

var app = angular.module('ecoknowledgeApp');

app.controller('LoginCtrl', ['ServiceLogin', function (ServiceLogin) {

  var self = this;

  this.username = ''
  this.password = '';
  this.debug = '';

  this.connect = function () {
    self.debug = 'ID:' + self.username + ', passwd:' + self.password;
    ServiceLogin.login(self.username,
      function (data) {
        console.log('Login success: data received', data);
      },
      function (data) {
        console.log('Login fail: data received', data);

      });
  };

}]);
