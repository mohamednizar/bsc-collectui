(function (angular) {
     angular.module('bcsCollectControllers').controller("loginController", ['$scope', 'loginService','$location',
        function ($scope, loginService,$location) {
        $scope.username ="";
        $scope.password ="";
        $scope.User = [];
        $scope.loginf = true;
        
        if($location.path()==""){
           $scope.loginf = false; 
       }
       
            $scope.login = function () {
                
                var user =
                        {
                            "username": $scope.username,
                            "password": $scope.password
                        };
                        
                 $scope.User.push(user);
                 
                 if($scope.username == "user" && $scope.password=="password"){
                     $scope.username="";
                     $scope.password="";
                        $location.path('/upload');
                        $scope.loginf = true;
                    }
                    
                    if($scope.username == "admin" && $scope.password=="admin"){
                        $scope.username="";
                     $scope.password="";
                        $location.path('/admin');
                        $scope.loginf = true;
                    }
                 
                 var obj = $scope.User;
                        
                loginService.login(angular.toJson(obj)).then(function (data) {
                    var d = data;
                    
                    if (!$scope.$$phase)
                        $scope.$apply();
                    
                    
                    
                });

            };
        
        
        
        }]);

    
    
})(angular);
