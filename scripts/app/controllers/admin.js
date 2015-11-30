'use strict';
(function (angular) {
    angular.module('bcsCollectControllers').controller("AdminController",
            function ($scope, XLSXReaderService, adminService,Upload, $timeout) {
        $scope.uploadFiles = function(files, errFiles) {
        $scope.files = files;
        $scope.errFiles = errFiles;
        angular.forEach(files, function(file) {
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
                    if (ftype==="application/vnd.ms-excel"||ftype==="application/vnd.ms-excel"||ftype==="application/vnd.ms-excel"||ftype==="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"||ftype==="application/vnd.openxmlformats-officedocument.spreadsheetml.template"||ftype==="application/vnd.ms-excel.sheet.macroEnabled.12"||ftype==="application/vnd.ms-excel.template.macroEnabled.12"||ftype==="application/vnd.ms-excel.addin.macroEnabled.12"||ftype==="application/vnd.ms-excel.sheet.binary.macroEnabled.12"){
                        
                    
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
                                var metric = data.MetricName;
                                var kpi = data.KPIName;
                                var minVal = data.MinVal;
                                var maxVal = data.MaxVal;
                                var timePeriod = data.timePeriod;

                                angular.forEach(data, function (d, k) {
                                    
                                   
                                    var kpiObject = {
                                        "kpiName": kpi,
                                        "metricName": metric,
                                        "minVal": minVal,
                                        "maxVal": maxVal,
                                        "timePeriod":timePeriod
                                    };
                                    
                                    if ((typeof  kpiObject.kpiName !== 'undefined') && (kpiObject.metricName !== "") && (kpiObject.minVal !== "")&& (kpiObject.maxVal !== "")&&(kpiObject.timePeriod !=="")) {
                                        $scope.KPIData.push(kpiObject);
                                    }else{
                                        swal('Wrong file upload');
                                        return false;
                                    }
                                });

                            });
                            

                        });
                        console.log($scope.KPIData);
                        
                        //  $scope.isProcessing = false;
                        // console.log($scope.KPIData.length);
                        if ($scope.KPIData.length > 0) {
                            $scope.isProcessing = true;
                            $scope.upload = false;
                        }

                        
                    });
                    
                    }else{
                        swal('The file you uploaded is not an Excel file');
                    } 
                };
                /* $scope.statusdata =[{"kpiName":"Distribution_loss","metricName":"Total Energy Delivered to Colombo City Via GSS during the six months.",
                 "date":"12/31/2014",
                 "value":" 52.00 ",
                 "comment":1
                 },
                 {"kpiName":"Distribution_loss",
                 "metricName":"Total Energy Delivered to Colombo City Via GSS during the six months.",
                 "date":"06/31/2015",
                 "value":" 65.00 ",
                 "comment":"Metric is not defined"
                 },
                 {"kpiName":"Distribution_loss",
                 "metricName":"Total of the Boundary Meter Readings of Colombo City during the six months.",
                 "date":"12/31/2014",
                 "value":" 53.00 ",
                 "comment":"data is updated"
                 },
                 {"kpiName":"Distribution_loss",
                 "metricName":"Total of the Boundary Meter Readings of Colombo City during the six months.",
                 "date":"06/31/2015",
                 "value":" 69.00 ",
                 "comment":"data is inserted"
                 }
                 ];
                 $scope.updateJSONString = function () {
                 $scope.KPIData = [];
                 $scope.json_string = JSON.stringify($scope.sheets[$scope.selectedSheetName]);
                 $scope.kpidata = $scope.sheets[$scope.selectedSheetName];
                 var k = $scope.kpidata;
                 var kpi = $scope.kpidata;
                 angular.forEach(kpi, function (data) {
                 var metric = data.MetricName;
                 
                 angular.forEach(data, function (d, k) {
                 var Dvalue = k; //asing the date 
                 var date = "";
                 var Kvalue = d; //asing dd value
                 if (Dvalue !== "MetricName") {
                 date = Dvalue;
                 }
                 var kpiObject = {
                 "kpiName": $scope.selectedSheetName,
                 "metricName": metric,
                 "date": date,
                 "value": Kvalue
                 };
                 // check all cell values were define, 
                 if ((kpiObject.date !== "") && (kpiObject.value !== "") && (typeof kpiObject.metricName === 'string')) {
                 //$scope.KPIData.push(kpiObject);
                 }
                 });
                 
                 });
                 console.log($scope.KPIData);
                 
                 };
                 
                 */
                //data();

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
                            "minVal":  k.maxVal,
                            "maxVal": k.maxVal,
                            "timePeriod":k.timePeriod
                        };
                        
                        if ((kpiObject.kpi !== "") && (kpiObject.metric !== "") && (kpiObject.minVal !== "")&& (kpiObject.maxVal !== "")) {
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
                    }),function(error){
                         console.log(error);
                        swal(error.statusText+',Try Again Later');
                        
                        $scope.errorMessag = false;
                        
                    };
                    reset();

                };

                $scope.confrom = function () {

                    var obj = {
                        "structureDatas": $scope.KPIData
                    };
                    console.log(obj);
                    adminService.confrom(angular.toJson(obj)).then(function (data) {
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
                    },function(error){
                         console.log(error);
                        swal(error.statusText+',Try Again Later');
                        $scope.errorMessag = false;
                    }    
                    );
                    reset();

                };
            });
})(angular);