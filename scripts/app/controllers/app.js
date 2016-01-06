(function (angular) {
    var appRoot = angular.module('myApp', ['bcsCollectControllers', 'ngGrid', 'ui.autocomplete', 'ngRoute', 'ui.router',
        'ui.bootstrap.datetimepicker', 'ui.bootstrap', 'ngAnimate','angularjs-dropdown-multiselect','ngFileUpload','remoteValidation']);
    appRoot.service('Session', function () {
  this.create = function (sessionId, userId, userRole) {
    this.id = sessionId;
    this.userId = userId;
    this.userRole = userRole;
  };
  this.destroy = function () {
    this.id = null;
    this.userId = null;
    this.userRole = null;
  };
}).constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
}).constant('USER_ROLES', {
  all: '*',
  admin: 'adm',
  editor: 'com'
}).factory('AuthService',['Session','userService', '$rootScope','$q','$window',
    function ( Session,userService,$scope,$rootScope,$q, $window,AuthResolver) {
  var authService = this;
  currentUser = null;
  authService.login = function (credentials) {
    return userService.login(angular.toJson(credentials))
      .then(function (res) {
          console.log(res.isvalid);
          if (res.isvalid=='valid login'){
            return  userService.getuserbyid((credentials.username)).then(function (user){
            Session.create(user.id,user.user_id,
                       user.user_type);
                       return user; 
             
          }
                                                                        );
          }else {
              swal(res.isvalid);
          }
                return res; 
      });
  };
  authService.isAuthenticated = function () {
    return !!Session.userId;
  };
  
  authService.logout = function(){
    Session.destroy();
  }    

  
  authService.isAuthorized = function (authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (authService.isAuthenticated() &&
      authorizedRoles.indexOf(Session.userRole) !== -1);
  };
 
  return authService;
}]).config(['$stateProvider','$locationProvider','$routeProvider','USER_ROLES',
        function ($stateProvider,USER_ROLES,$routeProvider) {
            
            var  
            dataList = {
                name: "dataList",
                url: '/dataList',
                templateUrl: './views/dataList.html',
                controller: 'dataListController',
                
            },kpiConform = {
                name: "kpiConform",
                url: '/kpiConform',
                templateUrl: './views/kpiConform.html',
                controller: 'kpiConformController',
                
            },upload = {
                name: "upload",
                url: '/upload',
                templateUrl: './views/upload.html',
                controller: 'PreviewController',
                 data: {
                authorizedRoles: [USER_ROLES.editor]
              },resolve: {
                auth: function resolveAuthentication(AuthResolver) { 
                  return AuthResolver.resolve();
                }
              }
                
            },login = {
                name: "login",
                url: '/login',
                templateUrl: './views/common/login.html',
                controller: 'LoginController'
                
            },login2 = {
                name: "login2",
                url: '',
                templateUrl: './views/common/login.html',
                controller: 'LoginController'
                
            },logout = {
                name: "logout",
                url: '/logout',
                templateUrl: './views/common/login.html',
                controller: 'LoginController'
                
            },admin = {
                name: "admin",
                url: '/admin',
                templateUrl: './views/admin/admin.html',
                controller: 'adminController',
                 data: {
                authorizedRoles: [USER_ROLES.admin]
              },resolve: {
                auth: function resolveAuthentication(AuthResolver) { 
                  return AuthResolver.resolve();
                }
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
            $stateProvider.state(login2);
            $stateProvider.state(logout);
            $stateProvider.state(admin);
            $stateProvider.state(userReg);
            $stateProvider.state(stucUpld);
            $stateProvider.state(users);
            
        }]).run(function ($rootScope, AUTH_EVENTS, AuthService) {
          $rootScope.$on('$stateChangeStart','AUTH_EVENTS','AuthService',
          function (event, next) {
            console.log(next);
    var authorizedRoles = next.data.authorizedRoles;
    if (!AuthService.isAuthorized(authorizedRoles)) {
      event.preventDefault();
      if (AuthService.isAuthenticated()) {
        // user is not allowed
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
      } else {
          console.log('okk');
        // user is not logged in
        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
      }
    }
  });
}).factory('AuthResolver',['$q','$rootScope' ,'$state',function ($q, $rootScope, $state) {
  return {
    resolve: function () {
      var deferred = $q.defer();
      var unwatch = $rootScope.$watch('currentUser', function (currentUser) {
        if (angular.isDefined(currentUser)) {
          if (currentUser) {
              console.log(currentUser);
            deferred.resolve(currentUser);
          } else {
            deferred.reject();
            $state.go('login');
          }
          unwatch();
        }
      });
      return deferred.promise;
    }
    
  };
}]).config(function ($httpProvider) {
  $httpProvider.interceptors.push([
    '$injector',
    function ($injector) {
      return $injector.get('AuthInterceptor');
    }
  ]);
})

.factory('AuthInterceptor',['$rootScope','$q', 'AUTH_EVENTS',
function ($rootScope, $q,AUTH_EVENTS) {
  return {
    responseError: function (response,scope) { 
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized,
        419: AUTH_EVENTS.sessionTimeout,
        440: AUTH_EVENTS.sessionTimeout
      }[response.status], response);
      scope.$apply();
      
      return $q.reject(response);
    }
  };
}]).directive('loginDialog',['AUTH_EVENTS', function (AUTH_EVENTS) {
  return {
    restrict: 'A',
    template: '<div ng-if="visible"\
                    ng-include="\'./views/common/login.html\'">',
    link: function ($scope) {
      var showDialog = function () {
        $scope.visible = true;
      };
      $scope.visible = false;
      $scope.$on(AUTH_EVENTS.notAuthenticated, showDialog);
      $scope.$on(AUTH_EVENTS.sessionTimeout, showDialog);
    }
  };
}]).directive('formAutofillFix', function ($timeout) {
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
}).controller('LoginController',   
function ($scope, $rootScope, AUTH_EVENTS, AuthService,USER_ROLES,$location,Session,AuthResolver) {
  $scope.credentials = {
    username: '',
    password: ''
  };
  
  
  $rootScope.currentUser = null;
  $rootScope.userRoles = USER_ROLES;
  $rootScope.isAuthorized = AuthService.isAuthorized;
 
 
    $scope.setCurrentUser = function (currentUser) {
    $rootScope.currentUser = currentUser;
    $rootScope.$apply();
    
  };
  
  $scope.logout = function () {
    AuthService.logout();
  };
  
  
 
 
  $scope.login = function (credentials) {
    AuthService.login(credentials).then(function (user) {
    //  $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
      $scope.setCurrentUser(user);
      if (user.user_type==='adm'){
        
          $location.path('/admin/stucUpld');
      }
      if (user.user_type==='com'){
        
          $location.path('/upload');
        $scope.main = $scope.main === false ? true : false;
      }
      $rootScope.$apply();
      return user;
    }, function () {
      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
      $rootScope.$apply();
      
    });
  };
});
})(angular, jQuery);
