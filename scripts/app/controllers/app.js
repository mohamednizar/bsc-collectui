(function (angular) {
    var appRoot = angular.module('myApp', ['bcsCollectControllers', 'ngGrid', 'ui.autocomplete', 'ngRoute', 'ui.router',
        'ui.bootstrap.datetimepicker', 'ui.bootstrap', 'ngAnimate','angularjs-dropdown-multiselect','ngFileUpload','remoteValidation']);
    appRoot.config(['$stateProvider',
        function ($stateProvider) {
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
                controller: 'PreviewController'
            },login = {
                name: "login",
                url: '/login',
                templateUrl: './views/common/login_1.html',
                controller: 'authCtrl'
            },admin = {
                name: "admin",
                url: '/admin',
                templateUrl: './views/admin/admin.html',
                controller: 'authCtrl'
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
            
            
        }]).run(function ($rootScope, $location, Data) {
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            $rootScope.authenticated = false;
            Data.get('session').then(function (results) {
                if (results.uid) {
                    $rootScope.authenticated = true;
                    $rootScope.uid = results.uid;
                    $rootScope.name = results.name;
                    $rootScope.email = results.email;
                } else {
                    var nextUrl = next.$$route.originalPath;
                    if (nextUrl == '/signup' || nextUrl == '/login') {

                    } else {
                        $location.path("/login");
                    }
                }
            });
        });
    });


})(angular, jQuery);
