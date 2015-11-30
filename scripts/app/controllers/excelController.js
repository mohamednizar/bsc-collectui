'use strict';
(function (angular) {
    angular.module('bcsCollectControllers').controller("PreviewController",
            function ($scope, XLSXReaderService, kpiService) {
                $scope.showPreview = false;
                $scope.showJSONPreview = true;
                $scope.json_string = "";
                $scope.json_test = "";
                $scope.KPIData = [];
                $scope.KPIDateError = [];
                $scope.kpiName = [];
                $scope.kpiNamemodel = [];
                $scope.isProcessing = false;
                $scope.ShowkpiError = true;
                $scope.status = [];
                $scope.errors = [];
                $scope.showStatus = false;
                $scope.Selectedkpi = [];
                $scope.upload = true;
                $scope.success = true;
                $scope.loginf = true;
                $scope.errorCount = 0;
                $scope.errorMessag = true;
                $scope.progress = true;


                $scope.newstatus = [];


                $scope.uploadtrue = function () {
                    window.location.reload();
                    
                    
                };
                $scope.fileChanged = function (files) {
                    $scope.sheets = [];
                    $scope.v = 0;
                    $scope.excelFile = files[0];
                    var ftype = files[0].type;
                    console.log(ftype);
                    if ((ftype ==="application/vnd.ms-excel"||ftype==="application/vnd.ms-excel"||ftype==="application/vnd.ms-excel"||ftype==="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"||ftype==="application/vnd.openxmlformats-officedocument.spreadsheetml.template"||ftype==="application/vnd.ms-excel.sheet.macroEnabled.12"||ftype==="application/vnd.ms-excel.template.macroEnabled.12"||ftype==="application/vnd.ms-excel.addin.macroEnabled.12"||ftype==="application/vnd.ms-excel.sheet.binary.macroEnabled.12")){
                       
                    
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
                                var min = data.MinVal;
                                angular.forEach(data, function (d, k) {
                                    var Dvalue = k; //asing the date 
                                    var date = "";
                                    var fdate = "";
                                    var sdate = "";
                                    var val = d;
                                    var Kvalue = parseFloat(val); //asing d value
                                    
                                    
                                    if (( Dvalue !== "MetricName")) {
                                       console.log(Dvalue); 
                                        date = Dvalue;
                                        var spdate = String(date).split("/");
                                        var yyyy = spdate[2];
                                        var dd = spdate[1];
                                        var mm = spdate[0];
                                        
                                        fdate = (yyyy + '/' + mm + '/' + dd);
                                       
                                        sdate =new Date (yyyy + '/' + mm + '/' + dd);
                                        //console.log(typeof sdate);
                                    }
                                    
                                    var kpiObject = {
                                        "kpiName": kpiName,
                                        "metricName": metric,
                                        "date": fdate,
                                        "value": Kvalue
                                       
                                        
                                    };
                                     console.log(Kvalue +'--'+ typeof kpiObject.value +'--'+ isNaN(kpiObject.value.valueOf()));
                                        
                                    if (sdate instanceof Date && isNaN(sdate.valueOf())== true){
                                        swal(Dvalue+' Date formate to (mm/dd/yyyy)');
                                        $scope.KPIDateError.push(kpiObject);
                                    }
                                    if((isNaN(kpiObject.value)=== true)&&(kpiObject.date !=="" )){
                                        swal('Not Valid Number for ' +kpiObject.metricName+' In date column  ' +kpiObject.date);
                                        $scope.KPIDateError.push(kpiObject);
                                    }
                                    
                                    if ((sdate instanceof Date && !isNaN(sdate.valueOf())== true)&&(kpiObject.date !=="" )     && (typeof kpiObject.metricName === 'string')) {
                                        $scope.KPIData.push(kpiObject);

                                    }
                                    console.log($scope.KPIDateError);
                                    var kpichek = $scope.KPIData;
                                    angular.forEach(kpichek, function (d) {
                                        var key = (d.date);
                                        
                                        if ((kpichek.indexOf(key) !== -1)) {
                                            if ((typeof kpiObject.date !== "date") && (typeof kpiObject.value === "String") && (typeof kpiObject.metricName === 'string')) {
                                                $scope.KPIDateError.puh(kpiObject);
                                                

                                               //console.log($scope.KPIData) ; 
                                            }else{
                                                swal({ title: "Data Duplication Error",   text: "You will not be able to upload this excel file!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes, Change it!",   closeOnConfirm: true }, function(){ 
                                                    $scope.excelFile = [];
                                                    $scope.upload = true;
                                                    return false;
                                                    
                                                    
                                                    console.log('don');
                                                   
                                                   if (!$scope.$$phase)
                                                        $scope.$apply();
                                                });
                                            }

                                        }
                                    });

                                });

                            });


                        });
                        // console.log($scope.KPIData);
                        $scope.v += 150;

                          //$scope.isProcessing = false;
                        // console.log($scope.KPIData.length);
                        console.log($scope.KPIData);
                       

                        if ($scope.KPIData.length > 0) {
                            $scope.isProcessing = true;
                            $scope.upload = false;
                            $scope.ShowkpiError = true;
                            
                           // console.log($scope.status);
                        }else{
                            swal('Wrng file uploaded');
                            
                            $scope.isProcessing = false;
                            $scope.ShowkpiError = true;
                        }
                        if ($scope.KPIDateError.length >0){
                             $scope.ShowkpiError = false;
                             console.log($scope.KPIDateError);  
                        }else{
                            $scope.upload = false;
                            $scope.ShowkpiError = true;
                        }
                        
                        


                    });
                     
                    }
                    else {
                        swal('The file you uploaded is not an Excel file');
                         $scope.upload = true;
                         $scope.isProcessing = false;
                         $scope.ShowkpiError = false;
                    }
                    
                    
                };
                
                $scope.kpiStatus = {
                    data: 'errors',
                    columnDefs: [
                        {field: 'metricName', width: '50%', displayName: 'Metric Name', enableCellEdit: true, cellTemplate: '<div ng-class="{red: row.entity.reason === \'Metric is not defined. Pleace check the new excel template\' || row.entity.reason === \'User is not defined. Pleace log in as collect user\' }"><div class="ngCellText" >{{row.getProperty(col.field)}}</div></div>'},
                        {field: 'date', width: '10%', displayName: 'Date'},
                        {field: 'value', width: '10%', displayName: 'Value', enableCellEdit: true, cellTemplate: '<div ng-class="{yellow: row.entity.reason === \'value is too low - data is updated\' || row.entity.reason === \'value is too High - data is updated\' ||  row.entity.reason === \'value is too low - data is inserted\' || row.entity.reason === \'value is too High - data is updated\'}"><div class="ngCellText" >{{row.getProperty(col.field)}}</div></div>'},
                        {field: 'reason', displayName: 'Status', enableCellEdit: false
                        }]
                };

                $scope.kpiError = {
                    data: 'KPIDateError',
                    columnDefs: [
                        {field: 'metricName', width: '50%', displayName: 'Metric Name', enableCellEdit: true, cellTemplate: '<div ng-class="{red: row.entity.reason === \'Metric is not defined. Pleace check the new excel template\' || row.entity.reason === \'User is not defined. Pleace log in as collect user\' }"><div class="ngCellText" >{{row.getProperty(col.field)}}</div></div>'},
                        {field: 'date', width: '10%', displayName: 'Date'},
                        {field: 'value', width: '10%', displayName: 'Value', enableCellEdit: true, cellTemplate: '<div ng-class="{yellow: row.entity.reason === \'value is too low - data is updated\' || row.entity.reason === \'value is too High - data is updated\' ||  row.entity.reason === \'value is too low - data is inserted\' || row.entity.reason === \'value is too High - data is updated\'}"><div class="ngCellText" >{{row.getProperty(col.field)}}</div></div>'},
                        {field: 'reason', displayName: 'Status', enableCellEdit: false
                        }],
                };

                function reset() {
                    $scope.isProcessing = false;
                    $scope.loginf = true;
                };
                


                $scope.KPITable = {
                    data: 'KPIData',
                    columnDefs: [
                        {field: 'kpiName', width: '10%', displayName: 'KPI Name'},
                        {field: 'metricName', width: '59%', displayName: 'Metric Name', enableCellEdit: true, cellTemplate: '<div ng-class="{red: row.entity.reason === \'Metric is not defined. Pleace check the new excel template\' || row.entity.reason === \'User is not defined. Pleace log in as collect user\' }"><div class="ngCellText" >{{row.getProperty(col.field)}}</div></div>'},
                        {field: 'date', width: '19%', displayName: 'Date'},
                        {field: 'value', width: '10%', displayName: 'Value', enableCellEdit: true, cellTemplate: '<div ng-class="{red: row.entity.value === \'null\' || row.entity.reason === \'value is too High - data is updated\' ||  row.entity.reason === \'value is too low - data is inserted\' || row.entity.reason === \'value is too High - data is updated\'}"><div class="ngCellText" >{{row.getProperty(col.field)}}</div></div>'}
                    ],
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


                $scope.forcSubmit = function () {
                    var d = $scope.KPIData;
                    $scope.newstatus = [];
                    angular.forEach(d, function (k) {
                        var data = {
                            "kpiName": k.kpiName,
                            "metricName": k.metricName,
                            "date": k.date,
                            "value": k.value
                        };
                        $scope.newstatus.push(data);
                        if (!$scope.$$phase)
                            $scope.$apply();

                    });


                    var obj = {
                        "insertedMetricDatas": $scope.newstatus
                    };
                    
                    var error = {
                        "insertedMetricDatas": $scope.KPIDateError
                    };
                    //  console.log(obj);
                    if (obj!=""){
                       
                    kpiService.confirm(angular.toJson(obj)).then(function (data) {
                        var s = data.response;
                        var errorCount = 0;
                        $scope.errors = [];
                        angular.forEach(s, function (d) {
                            $scope.status.push(d);
                            //  console.log(d);
                            if ((d.reason === 'Metric is not defined. Pleace check the new excel template')
                                    || (d.reason === 'User is not defined. Pleace log in as collect user')) {
                                errorCount += 1;
                                $scope.errors.push(d);
                                if (!$scope.$$phase)
                                    $scope.$apply();
                                // console.log(d.reason);
                            }

                        });

                        if (errorCount > 0) {
                            $scope.showStatus = true;
                            $scope.success = true;
                            console.log()


                        } else {
                            kpiService.confromRemote();
                            $scope.showStatus = false;
                            $scope.loginf = true;
                            $scope.success = false;
                            $scope.status = [];


                        }
                        //    console.log($scope.status);
                        $scope.progress = false;
                        $scope.upload = false;

                        if (!$scope.$$phase)
                            $scope.$apply();
                    }, function (error) {
                        console.log(error);
                    }); 
                    } 
                    if (error !=""){
                        
                    kpiService.confirm(angular.toJson(error)).then(function (data) {
                        var s = data.response;
                        var errorCount = 0;
                        $scope.errors = [];
                        angular.forEach(s, function (d) {
                            $scope.status.push(d);
                            //  console.log(d);
                            if ((d.reason === 'Metric is not defined. Pleace check the new excel template')
                                    || (d.reason === 'User is not defined. Pleace log in as collect user')) {
                                errorCount += 1;
                                $scope.errors.push(d);
                                if (!$scope.$$phase)
                                    $scope.$apply();
                                // console.log(d.reason);
                            }

                        });

                        if (errorCount > 0) {
                            $scope.showStatus = true;
                            $scope.success = true;


                        } else {
                            kpiService.confirmRemote();
                            $scope.showStatus = false;
                            $scope.loginf = true;
                            $scope.success = false;
                            $scope.status = [];


                        }
                        //    console.log($scope.status);
                        $scope.progress = false;
                        $scope.upload = false;

                        if (!$scope.$$phase)
                            $scope.$apply();
                    }, function (error) {
                        console.log(error);
                        swal(error.statusText+',Try Again Later')
                        
                    });
                    }
                    reset();

                };

                $scope.updateerror = function () {
                    var d = $scope.KPIData;
                    $scope.KPIDateError = [];
                    angular.forEach(d, function (k) {
                        var data = {
                            "kpiName": k.kpiName,
                            "metricName": k.metricName,
                            "date": k.date,
                            "value": k.value
                        };
                        $scope.KPIDateError.push(data);
                        if (!$scope.$$phase)
                            $scope.$apply();

                    });


                    var obj = {
                        "insertedMetricDatas": $scope.KPIDateError
                    };
                    // console.log(obj);
                    kpiService.confirm(angular.toJson(obj)).then(function (data) {
                        //  console.log(data);
                        var s = data.response;
                        var errorCount = 0;
                        $scope.errors = [];
                        angular.forEach(s, function (d) {
                            $scope.status.push(d);
                            //   console.log(d);
                            if ((d.reason === 'value is too low - data is updated')
                                    || (d.reason === 'value is too low - data is inserted')
                                    || (d.reason === 'value is too High - data is updated')
                                    || (d.reason === 'value is too High - data is inserted')
                                    || (d.reason === 'value is too High - same data value ignored')
                                    || (d.reason === 'value is too low - same data value ignored')
                                    || (d.reason === 'Metric is not defined. Pleace check the new excel template')
                                    || (d.reason === 'User is not defined. Pleace log in as collect user')) {
                                errorCount += 1;
                                $scope.errors.push(d);
                                if (!$scope.$$phase)
                                    $scope.$apply();
                                //   console.log(d.reason);
                            }


                        });
                        if (errorCount > 0) {
                            $scope.KPIDateError = true;
                            $scope.success = true;

                        } else {
                            kpiService.confromRemote().then(function (data) {
                                //   console.log(data);
                            });
                            $scope.KPIDateError = false;
                            $scope.loginf = true;
                            $scope.success = false;
                            $scope.status = [];



                        }
                        //    console.log($scope.status);

                        $scope.upload = false;

                        if (!$scope.$$phase)
                            $scope.$apply();
                    }, function (error) {
                        console.log(error);
                        swal(error.statusText+',Try Again Later')
                    });
                    reset();

                };
                
                $scope.updatereson = function () {
                    var d = $scope.errors;
                    $scope.newstatus = [];
                    angular.forEach(d, function (k) {
                        var data = {
                            "kpiName": k.kpiName,
                            "metricName": k.metricName,
                            "date": k.date,
                            "value": k.value
                        };
                        $scope.newstatus.push(data);
                        if (!$scope.$$phase)
                            $scope.$apply();

                    });


                    var obj = {
                        "insertedMetricDatas": $scope.newstatus
                    };
                    // console.log(obj);
                    kpiService.confirm(angular.toJson(obj)).then(function (data) {
                        //  console.log(data);
                        var s = data.response;
                        var errorCount = 0;
                        $scope.errors = [];
                        angular.forEach(s, function (d) {
                            $scope.status.push(d);
                            //   console.log(d);
                            if ((d.reason === 'value is too low - data is updated')
                                    || (d.reason === 'value is too low - data is inserted')
                                    || (d.reason === 'value is too High - data is updated')
                                    || (d.reason === 'value is too High - data is inserted')
                                    || (d.reason === 'value is too High - same data value ignored')
                                    || (d.reason === 'value is too low - same data value ignored')
                                    || (d.reason === 'Metric is not defined. Pleace check the new excel template')
                                    || (d.reason === 'User is not defined. Pleace log in as collect user')) {
                                errorCount += 1;
                                $scope.errors.push(d);
                                if (!$scope.$$phase)
                                    $scope.$apply();
                                //   console.log(d.reason);
                            }


                        });
                        if (errorCount > 0) {
                            $scope.showStatus = true;
                            $scope.success = true;

                        } else {
                            kpiService.confromRemote().then(function (data) {
                                //   console.log(data);
                            });
                            $scope.showStatus = false;
                            $scope.loginf = true;
                            $scope.success = false;
                            $scope.status = [];



                        }
                        //    console.log($scope.status);

                        $scope.upload = false;

                        if (!$scope.$$phase)
                            $scope.$apply();
                    }, function (error) {
                        console.log(error);
                        swal(error.statusText+',Try Again Later');
                    });
                    reset();

                };

                $scope.confirm = function () {

                    var obj = {
                        "insertedMetricDatas": $scope.KPIData
                    };
                    // console.log(obj);
                    kpiService.confirm(angular.toJson(obj)).then(function (data) {
                        $scope.progress = false;
                        console.log(data);
                        var s = data.response;
                        var errorCount = 0;
                        $scope.status = [];
                        angular.forEach(s, function (d) {
                            $scope.status.push(d);
                            //     console.log(d);
                            if ((d.reason === 'value is too low - data is updated')
                                    || (d.reason === 'value is too low - data is inserted')
                                    || (d.reason === 'value is too High - data is updated')
                                    || (d.reason === 'value is too High - data is inserted')
                                    || (d.reason === 'Metric is not defined. Pleace check the new excel template')
                                    || (d.reason === 'User is not defined. Pleace log in as collect user')) {
                                errorCount += 1;
                                $scope.errors.push(d);
                                //     console.log(d.reason);
                            }


                        });
                        if (errorCount > 0) {

                            $scope.showStatus = true;
                            $scope.success = true;
                            


                        } else {
                            kpiService.confromRemote().then(function (data) {
                                //    console.log(data);
                            });
                            $scope.showStatus = false;
                            $scope.loginf = true;
                            $scope.success = false;
                            $scope.ShowkpiError = true;


                        }
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
                        swal(error.statusText+',Try Again Later')
                        
                        
                        $scope.errorMessag = false;
                    });
                    reset();

                };
            });
})(angular);