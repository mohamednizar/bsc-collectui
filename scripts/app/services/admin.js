(function (angular) {
    angular.module('bcsCollectControllers').service('adminService', function (ajaxService) {
        var self = this;
        
     self.confrom = function (data, callback) {
            return ajaxService.post({
                url: 'http://localhost:8080/BSCCollect/structure/',
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
        
     self.userReg = function (data, callback) {
            return ajaxService.post({
                url: 'http://localhost:8080/BSCCollect/userdata/',
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
        
        self.getUser = function (data, callback) {
            return ajaxService.get({
                url: 'http://localhost:8080/BSCCollect/userdata/',
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
    
    });
        


})(angular);

