(function (angular) {
    var appRoot = angular.module('myApp', ['bcsCollectControllers', 'ngGrid', 'ui.autocomplete', 'ngRoute', 'ui.router',
        'ui.bootstrap.datetimepicker', 'ui.bootstrap', 'ngAnimate','angularjs-dropdown-multiselect','ngFileUpload','remoteValidation']);
    appRoot.service('Session', function () {
  this.create = function (sessionId, userId, userRole) {
    this.id = sessionId;
    this.user_id = userId;
    this.user_type = userRole;
  };
  this.destroy = function () {
    this.id = null;
    this.user_id = null;
    this.user_type = null;
  };
}).factory('AuthService', function ( Session,userService) {
  var authService = {};
 
  authService.login = function (credentials) {
     // console.log(credentials);
    return userService.login(angular.toJson(credentials))
      .then(function (res) {
          var d= (res);
          console.log(res);
          if (d){
            return  userService.getuserbyid((credentials.username)).then(function (user){
             console.log(user);
           Session.create(user.id,user.user_id,
                       user.user_type);
                       return user; 
          });
          }
                return res;       
        
       
      });
  };
  authService.isAuthenticated = function () {
    return !!Session.userId;
  };
 
  authService.isAuthorized = function (authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (authService.isAuthenticated() &&
      authorizedRoles.indexOf(Session.userRole) !== -1);
  };
 
  return authService;
}).config(['$stateProvider','$locationProvider','$routeProvider',
        function ($stateProvider,USER_ROLES) {
           
            var  
            dataList = {
                name: "dataList",
                url: '/dataList',
                templateUrl: './views/dataList.html',
                controller: 'dataListController'
            },kpiConform = {
                name: "kpiConform",
                url: '/kpiConform',
                templateUrl: './views/kpiConform.html',
                controller: 'kpiConformController'
            },upload = {
                name: "upload",
                url: '/upload',
                templateUrl: './views/upload.html',
                controller: 'PreviewController',
                data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
              }
            },login = {
                name: "login",
                url: '/login',
                templateUrl: './views/common/login.html',
                controller: 'LoginController',
                data: {
                authorizedRoles: [USER_ROLES.admin,USER_ROLES.editor]
              }
            },admin = {
                name: "admin",
                url: '/admin',
                templateUrl: './views/admin/admin.html',
                controller: 'adminController',
                data: {
                authorizedRoles: [USER_ROLES.admin]
              }
            },userReg = {
                name: "newUser",
                parent:"admin",
                url: '/newUser',
                templateUrl: './views/admin/userReg.html',
                controller: 'userController'
            },users = {
                name: "users",
                parent:"admin",
                url: '/users',
                templateUrl: './views/admin/users.html',
                controller: 'userController'
                
            },stucUpld = {
                name: "stucUpld",
                parent:"admin",
                url: '/stucUpld',
                templateUrl: './views/admin/stucUpld.html',
                controller: 'AdminController'
            };
            
            
            $stateProvider.state(dataList);
            $stateProvider.state(kpiConform);
            $stateProvider.state(upload);
            $stateProvider.state(login);
            $stateProvider.state(admin);
            $stateProvider.state(userReg);
            $stateProvider.state(stucUpld);
            $stateProvider.state(users);
           
            
        }]).run(function ($rootScope, AUTH_EVENTS, AuthService) {
  $rootScope.$on('$stateChangeStart','AUTH_EVENTS','AuthService',
          function (event, next) {
    var authorizedRoles = next.data.authorizedRoles;
    if (!AuthService.isAuthorized(authorizedRoles)) {
      event.preventDefault();
      if (AuthService.isAuthenticated()) {
        // user is not allowed
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
      } else {
        // user is not logged in
        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
      }
    }
  });
}).controller('LoginController', ['$scope', '$rootScope', 'AUTH_EVENTS','AuthService','USER_ROLES',
    function ($scope, $rootScope, AUTH_EVENTS, AuthService,USER_ROLES) {
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
      $scope.setCurrentUser(user);
     
     
    }, function () {
      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
    });
  };
  
 
}]).config(function ($httpProvider) {
  $httpProvider.interceptors.push([
    '$injector',
    function ($injector) {
      return $injector.get('AuthInterceptor');
    }
  ]);
})

.factory('AuthInterceptor', function ($rootScope, $q,
                                      AUTH_EVENTS) {
  return {
    responseError: function (response) { 
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized,
        419: AUTH_EVENTS.sessionTimeout,
        440: AUTH_EVENTS.sessionTimeout
      }[response.status], response);
      return $q.reject(response);
    }
  };
}).directive('loginDialog', function (AUTH_EVENTS) {
  return {
    restrict: 'A',
    template: '<div ng-if="visible"\
                    ng-include="\'./views/common/login.html\'">',
    link: function (scope) {
      var showDialog = function () {
        scope.visible = true;
      };
  
      scope.visible = false;
      scope.$on(AUTH_EVENTS.notAuthenticated, showDialog);
      scope.$on(AUTH_EVENTS.sessionTimeout, showDialog);
    }
  };
}).directive('formAutofillFix', function ($timeout) {
  return function (scope, element, attrs) {
    element.prop('method', 'post');
    if (attrs.ngSubmit) {
      $timeout(function () {
        element
          .unbind('submit')
          .bind('submit', function (event) {
            event.preventDefault();
            element
              .find('input, textarea, select')
              .trigger('input')
              .trigger('change')
              .trigger('keydown');
            scope.$apply(attrs.ngSubmit);
          });
      });
    }
  };
});;
})(angular, jQuery);
