(function (angular) {
    angular.module('bcsCollectControllers').controller("adminController", ['$scope','$state', '$location','AuthService',
        function ($scope, $state, $location,AuthService,$rootScope,$q,Session) {
           
            $scope.tabs = [
                {title: 'Stucture Upload', template: "stucUpld", active: false},
                {title: 'User Registration ', template: "newUser", active: false},
                {title: 'All Users', template: "users", active: false}
            ];
            $scope.$watch(AuthService.isAuthenticated,function(isAuthenticated){
                $scope.isAuthenticated = isAuthenticated;
                
            });
            $scope.val = "";
            $scope.clickTab = function (data) {
                $state.transitionTo(data);
            };
            
            //Active Tab when Page Refresh
            function activeTab() {
                var count = 0;
                angular.forEach($scope.tabs, function (tab) {

                    var path1 = $location.path();
                    var path2 = '/admin/' + tab.template;
                    if (path1 === path2) {
                        $scope.tabs[count].active = true;
                    } else {
                        $scope.tabs[count].active = false;
                    }
                    count++;
                });
                if (!$scope.$$phase)
                    $scope.$apply();
            }
            ;

            activeTab();

        }]);
})(angular);

