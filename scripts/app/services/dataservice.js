(function (angular) {
    angular.module('bcsCollectControllers').service('commonDataService', function (ajaxService) {
        var self = this;
         self.usertype =[
            {
                Id:"adm",
                Name:"Administrator User"
            },{
                Id:"com",
                Name:"communication User"
            }
        ];
                 
    });
})(angular);

