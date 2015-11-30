(function (angular) {
    angular.module('bcsCollectControllers').service('loginService', function (ajaxService) {
        var self = this;


        self.login = function (data, callback) {
            return ajaxService.get({
                url: '',
                data: data,
                dataType: 'text'
            }).done(function (result) {
                if (typeof callback === "function")
                    callback(result);
            });
        };


    });
})
        (angular);