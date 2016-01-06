'use strict';
(function (angular) {
    angular.module('bcsCollectControllers').controller('LoginController', ['$scope', '$rootScope', 'AUTH_EVENTS','AuthService','USER_ROLES','$location',
    function ($scope, $rootScope, AUTH_EVENTS, AuthService,USER_ROLES,$location) {
  $scope.credentials = {
    username: '',
    password: ''
  };
  
  $scope.currentUser = null;
  $scope.userRoles = USER_ROLES;
  $scope.isAuthorized = AuthService.isAuthorized;
 
  $scope.setCurrentUser = function (user) {
    $scope.currentUser = user;
  };
  $scope.login = function (credentials) {
    AuthService.login(credentials).then(function (user) {
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      $scope.$apply();
      $scope.setCurrentUser(user);
      $scope.$apply();
      console.log($scope.currentUser);
      $location.path('/admin');
     
    }, function () {
      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
      $scope.$apply();
    });
  };
}])
});