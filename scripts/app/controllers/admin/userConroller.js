(function (angular) {
    'use strict';
    
    angular.module('myApp',[]).controller('userController', ['$scope', 'adminService',
        function ($scope,adminService ) {

    $scope.username ="";
    $scope.fullname= "";
    $scope.email ="";
    $scope.usertype= "";
    $scope.provice ="";
    
    $scope.getUser = function(){
        adminService.getUser(angular.toJson()).then(function(data){
           $scope.users = data;
           console.log(data);
        });
    };
    
  
                $scope.userReg = function () {

                    var obj = {
                        "username":$scope.username,
                        "fullname":$scope.fullname,
                        "email":$scope.email,
                        "usertype":$scope.usertype,
                        "province":$scope.provice
                    };
                    console.log(obj);
                    // console.log(obj);
                    adminService.userReg(angular.toJson(obj)).then(function (data) {
                        $scope.progress = false;
                        console.log(data);
                        var s = data.response;
                        $scope.status = [];
                       
                       
                        //    console.log($scope.status);
                        $scope.progress = true;
                        $scope.upload = false;
                        //  console.log($scope.status);
                        reset();
                        if (!$scope.$$phase)
                            $scope.$apply();
                        $scope.KPIData = [];
                    }, function (error) {
                        console.log(error);
                        swal(error.statusText+',Try Again Later');
                        $scope.errorMessag = false;
                    });
                    reset();

                };
    
    

}
    ]);
  
});

