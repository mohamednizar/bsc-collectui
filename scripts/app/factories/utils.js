(function(angular) {
    angular.module('bcsCollectControllers').factory('utilityFactory', function () {
        return {
            isDirty: function(initialData, currentdata) {
                return !angular.equals(initialData, currentdata);
            }
        };
    });
})(angular);