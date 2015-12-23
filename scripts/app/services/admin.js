(function (angular) {
    angular.module('bcsCollectControllers').service('adminService', function (ajaxService) {
        var self = this;
        
     self.confirm = function (data, callback) {
            return ajaxService.post({
                url: 'structure/',
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

