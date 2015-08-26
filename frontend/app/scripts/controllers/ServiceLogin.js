'use strict';

var app = angular.module('ecoknowledgeApp');

var loginBasePath = 'http://localhost:3000/login/';

app.service('ServiceLogin', ['$http', function ServiceLogin($http) {

  this.login = function (name, successFunc, failFunc) {
    var path = loginBasePath + '';
    console.log('ServiceLogin : login', path);

    $http.post(path, name)
      .success(function (data) {
        successFunc(data);
      })
      .error(function (data) {
        failFunc(data);
      });
  };
}]);
