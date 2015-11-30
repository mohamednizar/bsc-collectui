(function (angular) {
    var appRoot = angular.module('myApp', ['bcsCollectControllers', 'ngGrid', 'ui.autocomplete', 'ngRoute', 'ui.router',
        'ui.bootstrap.datetimepicker', 'ui.bootstrap', 'ngAnimate','angularjs-dropdown-multiselect','ngFileUpload']);
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
                templateUrl: './views/login.html',
                controller: 'loginController'
            },admin = {
                name: "admin",
                url: '/admin',
                templateUrl: './views/admin/admin.html',
                controller: 'AdminController'
            },stucUpld = {
                name: "stucUpld",
                parent:"admin",
                url: '/stucUpld',
                templateUrl: './views/admin/stucUpld.html',
                controller: 'AdminController'
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
            }
                    ;
            

            
            $stateProvider.state(dataList);
            $stateProvider.state(kpiConform);
            $stateProvider.state(upload);
            $stateProvider.state(login);
            $stateProvider.state(admin);
            $stateProvider.state(userReg);
            $stateProvider.state(stucUpld);
            $stateProvider.state(users);
            
        }]).run(['$rootScope', '$state', '$stateParams',
        function ($rootScope, $state, $stateParams, document) {
            $.blockUI.defaults.css.border = '1px solid #CCCCCC';
            $(document).ajaxStart(function () {
                $.blockUI({
                    message: '<h3 style="color:#555555;"><img src="images/ajax-loader.gif" style="margin-right:15px;" />Just a moment.</h3>',
                    overlayCSS: {
                        opacity: 0
                    },
                    fadeIn: 300,
                    baseZ: 9999999,
                    css: {
                        backgroundColor: '#EEEEEE',
                        borderRadius: '4px',
                        width: '15%',
                        minWidth: '300px',
                        left: '40%',
                        padding: '10px 0 15px',
                        boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)'
                    }
                });

                timer = setTimeout(function () {
                    if (timer)
                        clearTimeout(timer);
                    $.unblockUI();
                }, 2000);
            });

            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;



        }]);


})(angular, jQuery);
