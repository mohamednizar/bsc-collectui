(function (angular) {
    angular.module('bcsCollectControllers').controller("userController",
            function ($scope, $location, userService, utilityFactory, autocompleteFactory) {
                $scope.username = "";
                $scope.password = "";
                $scope.loginf = true;
                $scope.username !== ($scope.ckeckname);
                $scope.Uemail = {text: "me@example.com"};
                $scope.cemail = $scope.Uemail;
                $scope.province = {Id: "", Name: ""};
                $scope.usertype = {Id: "", Name: ""};
                $scope.phone = "";
                $scope.designation = "";
                $scope.users = [];
                $scope.loading = true;
                $scope.userregform = true;
                $scope.userEdit = true;
                $scope.usergrid = false;
                $scope.loggedIn = false;
                $scope.loginType = "";

           
                getusers();
                function getusers() {
                    userService.getUser(angular.toJson()).then(function (data) {
                       $scope.users = data;
                        if (!$scope.$$phase)
                            $scope.$apply();

                    });
                }

                $scope.getUsers = function () {
                    getusers();
                };


                $scope.checkuser = function () {
                    var obj = $scope.username;
                    userService.getuserbyid(obj.toString()).then(function (data, e) {
                        var d = data;
                        $scope.checkname = d.user_id;
                        $scope.$watch('username', function (newVal) {
                            if (newVal === $scope.checkname) {
                                ($scope.newUser.uname.$setValidity('duplicate', false));
                            }
                        });


                        if (!$scope.$$phase)
                            $scope.$apply();

                    }, function (e) {
                        // console.log(e.statusText);
                    });

                };
                $scope.EditUser = function (data) {
                    $scope.userEdit = $scope.userEdit === false ? true : false;
                    $scope.usergrid = $scope.usergrid === true ? false : true;
                    $scope.usertype.Name = data.user_type;
                    $scope.username = data.user_id;
                    $scope.Uemail = data.email;
                    $scope.phone = data.phone_number;
                    $scope.province.Id = data.province_id;
                    $scope.fullname = data.user_name;
                    $scope.designation = data.designation;


                };


                $scope.DeleteUser = function (data) {
                    var obj = data;
                    swal({
                        title: "do you want to delete user " + data.user_id,
                        text: "You will not be able to recover this details!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes, delete it!",
                        cancelButtonText: "No, cancel plx!",
                        closeOnConfirm: false,
                        closeOnCancel: false
                    },
                    function (isConfirm) {
                        if (isConfirm) {

                            userService.deleteUser(angular.toJson(obj)).then(function (data) {
                                var d = data;
                                if (!$scope.$$phase)
                                    $scope.$apply();
                            });
                            
                             userService.getUser(angular.toJson()).then(function (data) {
                       $scope.users = data;
                        if (!$scope.$$phase)
                            $scope.$apply();

                    });
                            
                         swal("Deleted!", "Get in to the view of user", "success");   

                        }
                        else {
                            swal("Cancelled", "Continue the Registration :)", "success");
                        }

                    });

                };
                $scope.userTable = {
                    data: 'users',
                    columnDefs: [
                        {field: 'user_id', displayName: 'User Name', },
                        {field: 'user_name', displayName: 'Name'},
                        {field: 'phone_number', displayName: 'Phone'},
                        {field: 'email', displayName: 'Email'},
                        {field: 'designation', displayName: 'Designation'},
                      //  {field: 'user_type', displayName: 'User Type'},
                        //{field: 'province_id', displayName: 'Province'},
                        {field: '', width: '35px', cellTemplate: '<div class="ngCellText"><button class="btn btn-primary btn-xs"  ng-click="resetpassword(row.entity.user_id)" title="Reset Password">{{row.getProperty(col.field)}}<span class="glyphicon glyphicon-refresh" style="margin-right: 0px;padding-right: 0px; border-right-style:none;"></span></button></div>'},
                        {field: '', width: '35px', cellTemplate: '<div class="ngCellText"><button class="btn btn-danger btn-xs"  ng-click="DeleteUser(row.entity)" title="Delete">{{row.getProperty(col.field)}}<span class="glyphicon glyphicon-trash" style="margin-right: 0px;padding-right: 0px; border-right-style:none;"></span></button></div>'},
                        {field: '', width: '35px', cellTemplate: '<div class="ngCellText"><button class="btn btn-success btn-xs"  ng-click="ConformUser(row.entity.id)" title="Confirm">{{row.getProperty(col.field)}}<span class="glyphicon glyphicon-ok" style="margin-right: 0px;padding-right: 0px; border-right-style:none;"></span></button></div>'},
                        {field: '', width: '35px', cellTemplate: '<div class="ngCellText"><button class="btn btn-primary btn-xs"  ng-click="EditUser(row.entity)" title="Edit">{{row.getProperty(col.field)}}<span class="glyphicon glyphicon-edit" style="margin-right: 0px;padding-right: 0px; border-right-style:none;"></span></button></div>'},
                        {field: '', width: '35px', cellTemplate: '<div class="ngCellText"><button class="btn btn-primary btn-xs"  ng-click="ViewUser(row.entity.id)" title="View">{{row.getProperty(col.field)}}<span class="glyphicon glyphicon-open" style="margin-right: 0px;padding-right: 0px; border-right-style:none;"></span></button></div>'}

                    ]
                };


                $scope.clear = function () {
                    clearUser();
                };
                function clearUser() {
                    if ($scope.username === "" || $scope.fullname === "" || $scope.Uemail === "" || $scope.cemail === "" || $scope.usertype === "" || $scope.province === "") {

                        swal({
                            title: "Are you sure?",
                            text: "You will not be able to recover this details!",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Yes, delete it!",
                            cancelButtonText: "No, cancel plx!",
                            closeOnConfirm: false,
                            closeOnCancel: false
                        },
                        function (isConfirm) {
                            if (isConfirm) {
                                $scope.username = "";
                                $scope.fullname = "";
                                $scope.Uemail = "";
                                $scope.usertype = "";
                                $scope.province = "";
                                $scope.cemail = "";
                                if (!$scope.$$phase)
                                    $scope.$apply();
                                swal("Cleard!", "Start new Registration filing", "success");


                            }
                            else {
                                swal("Cancelled", "Continue the Registration :)", "success");
                            }

                        });
                    }
                }

                //user type 
                $scope.userTypeAutocomplete = autocompleteFactory.userTypeAutocomplete(function (current) {
                    if (utilityFactory.isDirty($scope.usertype, current)) {
                        $scope.usertype = {
                            Id: current.item.value1,
                            Name: current.item.label
                        };
                        if (!$scope.$$phase)
                            $scope.$apply();
                    }
                });
                //
                $scope.ProvincesAutocomplete = autocompleteFactory.ProvincesAutocomplete(function (current) {
                    if (utilityFactory.isDirty($scope.province, current)) {
                        $scope.province = {
                            Id: current.item.value1,
                            Name: current.item.label
                        };
                        $scope.users.province_id = $scope.province.Name
                        if (!$scope.$$phase)
                            $scope.$apply();
                    }
                });
                
              

                $scope.userUpdate = function () {
                    var obj = {
                        "user_id": $scope.username,
                        "user_name": $scope.fullname,
                        "phone_number": $scope.phone.toString(),
                        "email": $scope.Uemail,
                        "designation": $scope.designation,
                        "user_type": $scope.usertype.Id,
                        "province_id": $scope.province.Id

                    };
                    $scope.userEdit = true;
                    $scope.loading = false;
                    if (!$scope.$$phase)
                        $scope.$apply();
                    userService.putUser(angular.toJson(obj)).then(function (data) {

                    }, function (data) {

                        $scope.usergrid = false;
                        $scope.loading = true;
                        if (!$scope.$$phase)
                            $scope.$apply();
                        console.log(data);
                        swal('User ' + data.statusText);
                        $scope.username = "";
                        $scope.fullname = "";
                        $scope.Uemail = "";
                        $scope.usertype = "";
                        $scope.province = "";
                        $scope.cemail = "";
                        $scope.designation = "";
                        $scope.phone = "";
                        if (!$scope.$$phase)
                            $scope.$apply();
                    });

                };
                
                $scope.resetpassword = function(user){
                    var obj = {
                        "username":user
                    }
                    console.log(obj);
                    userService.resetpassword(angular.toJson(obj)).then(function (data){
                        swal('We successfully change your password,check your email.');
                    })
                }

                $scope.userReg = function () {
                    var obj = {
                        "user_id": $scope.username,
                        "user_name": $scope.fullname,
                        "phone_number": $scope.phone.toString(),
                        "email": $scope.Uemail,
                        "designation": $scope.designation,
                        "user_type": $scope.usertype.Id,
                        "province_id": $scope.province.Id

                    };
                    $scope.userregform = false;
                    $scope.loading = false;
                    if (!$scope.$$phase)
                        $scope.$apply();
                    userService.insertReg(angular.toJson(obj)).then(function (data) {


                    }, function (data) {
                        $scope.userregform = true;
                        $scope.loading = true;
                        if (!$scope.$$phase)
                            $scope.$apply();
                        console.log(data);
                        swal('User ' + data.statusText);
                        $scope.username = "";
                        $scope.fullname = "";
                        $scope.Uemail = "";
                        $scope.usertype = "";
                        $scope.province = "";
                        $scope.cemail = "";
                        $scope.designation = "";
                        $scope.phone = "";
                        $location.path('/admin/users');
                        if (!$scope.$$phase)
                            $scope.$apply();

                    });

                };




            });



})(angular);
