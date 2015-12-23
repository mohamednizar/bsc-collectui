(function (angular) {
    angular.module('bcsCollectControllers').service('kpiService', function (ajaxService) {
        var self = this;
        
        
     self.confirm = function (data, callback) {
            return ajaxService.post({
                url: 'metricdata/',
                data:data,
                dataType: 'json',
                contentType:'application/json;'
            }).done(function (result) {
                if (typeof callback === "function")
                    callback(result);
                   // alert(result);
            }).error(function (error) {
               if (typeof callback === "function")
                    callback(error);
                   
            });
        };
        
        self.confirmRemote = function (data, callback) {
            return ajaxService.post({
                url: 'bscconnect/',
                data:data,
                dataType: 'json',
                contentType:'application/json;'
            }).done(function (result) {
                if (typeof callback === "function")
                    callback(result,"success");
                   // alert(result);
            }).error(function (error) {
               if (typeof callback === "function")
                    callback(error);
                   
            });
        };
    
    });
        


})(angular);

