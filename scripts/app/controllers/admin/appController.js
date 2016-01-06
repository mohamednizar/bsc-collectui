'use strict';
(function (angular) {
    angular.module('bcsCollectControllers').controller('ApplicationController', function ($scope,
                                               USER_ROLES,
                                               AuthService) {
  $scope.currentUser = null;
  $scope.userRoles = USER_ROLES;
  $scope.isAuthorized = AuthService.isAuthorized;
 
 
 console.log($scope.currentUser);
  $scope.setCurrentUser = function (user) {
    $scope.currentUser = user;
  };
});
});