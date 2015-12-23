'use strict';
(function (angular) {
    angular.module('bcsCollectControllers').controller("AdminController",
            function ($scope, XLSXReaderService, adminService, Upload, $timeout) {
                 var main = this;
                $scope.uploadFiles = function (files, errFiles) {
                    $scope.files = files;
                    $scope.errFiles = errFiles;

                    angular.forEach(files, function (file) {
                        file.upload = Upload.upload({
                            url: 'http://localhost:8080/collet-ui/',
                            data: {file: file}
                        });

                        file.upload.then(function (response) {
                            $timeout(function () {
                                file.result = response.data;
                            });
                        }, function (response) {
                            if (response.status > 0)
                                $scope.errorMsg = response.status + ': ' + response.data;
                        }, function (evt) {
                            file.progress = Math.min(100, parseInt(100.0 *
                                    evt.loaded / evt.total));
                        });
                    });
                };

                $scope.showPreview = false;
                $scope.showJSONPreview = true;
                $scope.json_string = "";
                $scope.json_test = "";
                $scope.KPIData = [];
                $scope.kpiName = [];
                $scope.kpiNamemodel = [];
                $scope.isProcessing = false;
                $scope.status = [];
                $scope.errors = [];
                $scope.showStatus = false;
                $scope.Selectedkpi = [];
                $scope.upload = true;
                $scope.success = false;
                $scope.newstatus = [];
                $scope.errorMessag = true;
             
                $scope.uploadtrue = function () {
                    $scope.upload = true;
                    $scope.showPreview = false;
                    $scope.showJSONPreview = true;
                    $scope.json_string = "";
                    $scope.json_test = "";
                    $scope.KPIData = [];
                    $scope.kpiName = [];
                    $scope.kpiNamemodel = [];
                    $scope.isProcessing = false;
                    $scope.status = [];
                    $scope.showStatus = false;
                    $scope.Selectedkpi = [];
                    $scope.upload = true;
                    $scope.success = false;
                    $scope.newstatus = [];
                };
                $scope.fileChanged = function (files) {
                    $scope.sheets = [];
                    $scope.v = 0;
                    $scope.excelFile = files[0];
                    var ftype = files[0].type;
                    console.log(ftype);
                    if (ftype === "application/vnd.ms-excel" || ftype === "application/vnd.ms-excel" || ftype === "application/vnd.ms-excel" || ftype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || ftype === "application/vnd.openxmlformats-officedocument.spreadsheetml.template" || ftype === "application/vnd.ms-excel.sheet.macroEnabled.12" || ftype === "application/vnd.ms-excel.template.macroEnabled.12" || ftype === "application/vnd.ms-excel.addin.macroEnabled.12" || ftype === "application/vnd.ms-excel.sheet.binary.macroEnabled.12") {


                        XLSXReaderService.readFile($scope.excelFile, $scope.showPreview, $scope.showJSONPreview).then(function (xlsxData) {
                            $scope.sheets = xlsxData.sheets;
                            var kpi = $scope.sheets;
                            $scope.kpiName = [];
                            angular.forEach(kpi, function (kpiD, k) {
                                var kpiName = k;
                                var d = {
                                    id: k,
                                    label: k
                                };
                                $scope.kpiName.push(d);
                                angular.forEach(kpiD, function (data) {
                                   // console.log(data);
                                    var kpiObject = {
                                            "kpiName": data.kpiName,
                                            "metricName": data.metricName,
                                            "minVal": parseFloat(data.minVal),
                                            "maxVal": parseFloat(data.maxVal),
                                            "timePeriod": data.timePeriod,
                                            "provincename": data.province
                                        };
                                      $scope.KPIData.push(kpiObject);

                                });
                                               console.log( $scope.KPIData);
                                                      var  obj = {
                                                            "structureDatas":$scope.KPIData
                                                        }
                                                      
                                                      adminService.confirm(angular.toJson(obj)).then(function (data) {
                                                      console.log(data);
                                                      })
                                                    console.log(obj);
                            });
                          
                        });

                    } else {
                        swal('The file you uploaded is not an Excel file');
                    }
                };
                $scope.kpiStatus = {
                    data: 'errors',
                    columnDefs: [
                        {field: 'metricName', width: '50%', displayName: 'Metric Name', enableCellEdit: true, cellTemplate: '<div ng-class="{red: row.entity.reason == \'[MND]\', green: row.getProperty(\'reason\') != [MDN]}"   ><div class="ngCellText" >{{row.getProperty(col.field)}}</div></div>'},
                        {field: 'date', width: '10%', displayName: 'Date'},
                        {field: 'value', width: '10%', displayName: 'Value', enableCellEdit: true, cellTemplate: '<div class="ngCellText"  >{{row.getProperty(col.field)}}</div>'},
                        {field: 'reason', displayName: 'Status', enableCellEdit: false
                        }]
                };

                function reset() {
                    $scope.isProcessing = false;
                }
                ;


                $scope.KPITable = {
                    data: 'KPIData',
                    totalServerItems: 'totalServerItems',
                    pagingOptions: $scope.pagingOptions,
                    filterOptions: $scope.filterOptions
                };

                $scope.checkStatus = function () {
                    var status = $scope.status;
                    var errorCount = 0;
                    angular.forEach(status, function (d) {


                    });
                    if (errorCount > 0) {
                        $scope.showStatus = true;
                    }
                };

                $scope.showPreviewChanged = function () {

                    if ($scope.showPreview) {
                        $scope.showJSONPreview = false;
                        XLSXReaderService.readFile($scope.excelFile, $scope.showPreview, $scope.showJSONPreview).then(function (xlsxData) {
                            $scope.sheets = xlsxData.sheets;

                        });
                    }
                };

                $scope.updatereson = function () {
                    var d = $scope.status;

                    angular.forEach(d, function (k) {
                        var kpiObject = {
                            "kpiName": k.kpiName,
                            "metricName": k.metricName,
                            "minVal": k.maxVal,
                            "maxVal": k.maxVal,
                            "timePeriod": k.timePeriod
                        };

                        if ((kpiObject.kpi !== "") && (kpiObject.metric !== "") && (kpiObject.minVal !== "") && (kpiObject.maxVal !== "")) {
                            $scope.newstatus.push(kpiObject);
                        }
                    });


                    var obj = {
                        "structureDatas": $scope.newstatus
                    };
                    console.log(obj);
                    adminService.confrom(angular.toJson(obj)).then(function (data) {
                        var s = data.response;

                        //    console.log($scope.status);
                        $scope.showStatus = true;
                        $scope.upload = false;
                        if (!$scope.$$phase)
                            $scope.$apply();
                    }), function (error) {
                        console.log(error);
                        swal(error.statusText + ',Try Again Later');

                        $scope.errorMessag = false;

                    };
                    reset();

                };

                $scope.confirm = function (data) {

                    var obj = {
                        "structureDatas": data
                    };
                    console.log(obj);
                    adminService.confirm(angular.toJson(obj)).then(function (data) {
                        var s = data.response;
                        var errorCount = 0;
                        angular.forEach(s, function (d) {
                            console.log(d);
                            $scope.status.push(d);
                            console.log(d);
                            if ((d.reason === 'value is too low - data is updated')
                                    || (d.reason === 'value is too low - data is inserted')
                                    || (d.reason === 'value is too High - data is updated')
                                    || (d.reason === 'value is too High - data is inserted')
                                    || (d.reason === 'Metric is not defined. Pleace check the new excel template')
                                    || (d.reason === 'User is not defined. Pleace log in as collect user')) {
                                errorCount += 1;
                                $scope.errors.push(d);
                                console.log(d.reason);


                            }


                        });
                        if (errorCount > 0) {
                            $scope.showStatus = true;
                            $scope.success = false;
                            

                        } else {
                            $scope.showStatus = false;
                            $scope.success = true;
                        }
                        //    console.log($scope.status);

                        $scope.upload = false;
                        //  console.log($scope.status);
                        reset();
                        if (!$scope.$$phase)
                            $scope.$apply();
                        $scope.KPIData = [];
                    }, function (error) {
                        console.log(error);
                        swal(error.statusText + ',Try Again Later');
                        $scope.errorMessag = false;
                    }
                    );
                    reset();

                };
            });
})(angular);