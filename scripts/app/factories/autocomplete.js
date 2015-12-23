(function (angular) {
    angular.module('bcsCollectControllers').factory('autocompleteFactory', [
        'userService','commonDataService',
        function ( userService,commonDataService) {
            return {
                ProvincesAutocomplete: function (callback) {
                    return {
                        options: {
                            html: true,
                            focusOpen: true,
                            onlySelect: true,
                            onclick:true,
                            autoFocus: true,
                            minLength: 1,
                            select: function () {
                                var current = arguments[1];
                                if (typeof callback === "function")
                                    callback(current);
                                else
                                    throw new Error("You haven't provided corrent onSelect handler");
                            },
                            source: function (request, response) {
                                userService.getProvinces({
                                    query: request.term,
                                    dataType: 'json'
                                }, function (data) {
                                    response($.map(data,
                                            function (item) {
                                                return {
                                                    label: item.province_name,
                                                    value1: item.province_id
                                                    
                                                };
                                            }));
                                });
                            }
                        }
                    };
                },userTypeAutocomplete: function (callback) {
                    return {
                        options: {
                            html: true,
                            focusOpen: true,
                            onlySelect: true,
                            autoFocus: true,
                            minLength: 1,
                            select: function () {
                                var current = arguments[1];
                                if (typeof callback === "function")
                                    callback(current);
                                else
                                    throw new Error("You haven't provided corrent onSelect handler");
                            },
                            source: function (request, response) {
                                var data = commonDataService.usertype;
                                response($.map(data,
                                        function (item) {
                                            return {
                                                label: item.Name,
                                                value1: item.Id
                                            };
                                        }));

                            }
                        }
                    };
                }
            };

        }]);

})(angular);  