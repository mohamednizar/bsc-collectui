(function (angular) {
    angular.module('bcsCollectControllers').directive('emailUnique', ['$http', function ($http) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, el, attrs, ctrl) {

                ctrl.$parsers.push(function (viewValue) {
                    if (!viewValue) {
                        ctrl.$setValidity('username', true);
                        return undefined;
                    }
                    $http.get('http://10.130.3.135:8080/BSCCollect/userdataone/' + viewValue).success(function (data) {
                        if (data.data && data.data.unique)
                            ctrl.$setValidity('username', true);
                        else
                            ctrl.$setValidity('username', false);
                    }).error(function () {
                            alert('Sorry, a technical issue prevents to validate your email.\n ' +
                                'Thanks to retry later.');
                        });
                    return viewValue;
                });
            }
        };
    }]);
})(angular);
