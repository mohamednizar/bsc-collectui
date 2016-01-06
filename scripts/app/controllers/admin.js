'use strict';
(function (angular) {
    angular.module('bcsCollectControllers').controller("AdminController",
            function ($scope, XLSXReaderService, adminService, Upload, $timeout, $location) {
                var main = this;
                $scope.uploadFiles = function (files, errFiles) {
                    $scope.files = files;
                    $scope.errFiles = errFiles;
                    $location

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
                $scope.successCount = 0;
                $scope.ErrorCount = 0;
                $scope.KPICount = 0;
                $scope.showJSONPreview = true;
                $scope.json_string = "";
                $scope.json_test = "";
                $scope.KPIData = [];
                $scope.KPIErrors = [];
                $scope.kpiName = [];
                $scope.kpiNamemodel = [];
                $scope.isProcessing = false;
                $scope.status = [];
                $scope.errors = [];
                $scope.loading = true;
                $scope.showStatus = false;
                $scope.Selectedkpi = [];
                $scope.upload = true;
                $scope.success = true;
                $scope.newstatus = [];
                $scope.errorMessag = true;
                $scope.kpiStatus = false;

                $scope.backtohome = function () {
                    $scope.upload = $scope.upload === true ? false : true;
                    $scope.success = $scope.success === true ? false : true;
                    $scope.sheets = [];
                    $scope.KPIData = [];
                    $scope.KPIErrors = [];
                    $scope.ErrorCount = 0;
                    $scope.excelFile = 0;
                    if (!$scope.$$phase)
                        $scope.$apply();
                };

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
                    $scope.errors = [];
                };
                $scope.fileChanged = function (files) {
                    $scope.sheets = [];
                    $scope.v = 0;
                    $scope.excelFile = files[0];
                    var ftype = files[0].type;
                    console.log(ftype);
                    if (ftype === "application/vnd.ms-excel" || ftype === "application/vnd.ms-excel" || ftype === "application/vnd.ms-excel" || ftype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || ftype === "application/vnd.openxmlformats-officedocument.spreadsheetml.template" || ftype === 'application/vnd.ms-excel.sheet.macroEnabled.12' || ftype === "application/vnd.ms-excel.template.macroEnabled.12" || ftype === "application/vnd.ms-excel.addin.macroEnabled.12" || ftype === "application/vnd.ms-excel.sheet.binary.macroEnabled.12") {

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
                                if (!$scope.$$phase)
                                    $scope.$apply();
                                angular.forEach(kpiD, function (data) {
                                    var kpiObject = {
                                        "kpiName": data.kpiName,
                                        "metricName": data.metricName,
                                        "minVal": parseFloat(data.minVal),
                                        "maxVal": parseFloat(data.maxVal),
                                        "timePeriod": data.timePeriod,
                                        "provincename": data.province,
                                        "kpiunit": data.kpiUnit,
                                        "metricunit": data.metricUnit,
                                        "metricduedate": data.metricdueDate
                                    };

                                    if (((typeof kpiObject.kpiName !== 'undefined') && (kpiObject.metrciName !== "") && (kpiObject.minVal !== "") && (kpiObject.maxVal !== "") && (kpiObject.timePeriod !== ""))) {
                                        $scope.KPIData.push(kpiObject);
                                        console.log($scope.KPIData);
                                        $scope.KPICount += 1;

                                    } else {
                                        $scope.KPIErrors.push(kpiObject);
                                        // console.log($scope.KPIErrors);
                                        $scope.ErrorCount += 1;
                                    }

                                    if (($scope.ErrorCount) > 0) {
                                        $scope.sheets = [];
                                        $scope.KPIData = [];
                                        $scope.KPIErrors = [];
                                        $scope.ErrorCount = 0;
                                        $scope.excelFile = 0;
                                        swal('we couldn\'t find any data for Upload,Please ues the correct Template!')
                                    }


                                    //kpiObject.metrciName===""  console.log($scope.KPIDateError+'error');




                                });

                            });
                            if (($scope.KPICount) === $scope.KPIData.length) {
                                $scope.excelFile = [];
                                $scope.sheets = [];
                                $scope.loading = false;
                                $scope.upload = false;
                                if (!$scope.$$phase)
                                    $scope.$apply();

                                var obj = {
                                    "structureDatas": $scope.KPIData
                                };

                                adminService.confirm(angular.toJson(obj)).then(function (data) {
                                    angular.forEach(data, function (d, k) {
                                        $scope.successCount += 1;
                                        $scope.status = d;
                                        console.log($scope.status);
                                        //console.log(d);
                                        //  $scope.showStatus = true;
                                        $scope.loading = false;
                                        if (!$scope.$$phase)
                                            $scope.$apply();
                                        console.log($scope.status.length);
                                        console.log($scope.KPIData.length);
                                        var count = ($scope.KPIData.length) * 100;
                                        $scope.progress = parseInt(count);
                                        if (($scope.status.length - 1) === $scope.KPIData.length) {
                                            $scope.loading = true;
                                            $scope.showStatus = false;
                                            $scope.success = false;
                                            $scope.excelFile = [];

                                            if (!$scope.$$phase)
                                                $scope.$apply();
                                        }

                                    });


                                });
                            }

                        });

                    } else {
                        swal('The file you uploaded is not an Excel file');
                    }
                };

                $scope.kpiStatus = {
                    data: 'status'
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



            });
})(angular);