(function (angular) {
    angular.module('bcsCollectControllers').service('Data', function (ajaxService) {
        var self = this;
        
        
     self.post = function (data, callback) {
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
        
        self.get = function (data, callback) {
            return ajaxService.get({
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
        
        self.put = function (data, callback) {
            return ajaxService.put({
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
        self.delete = function (data, callback) {
            return ajaxService.delete({
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

