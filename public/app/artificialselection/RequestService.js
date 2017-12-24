(function () {
    'use strict';

    var module = 'artificialselection';
    var service = 'request';

    angular.module(module).factory(service, RequestService);

    /* @ngInject */
    function RequestService($http) {
        return {
            del: del,
            get: get,
            post: post,
            put: put,
            save: save
        };

        /////////////////////////////

        function del(config) {
            return request(config, 'DELETE');
        }

        function get(config) {
            return request(config, 'GET');
        }

        function post(config) {
            return request(config, 'POST');
        }

        function put(config) {
            return request(config, 'PUT');
        }

        function save(config) {
            if (config.data.id) {
                config.url += '/' + config.data.id;
                return put(config);
            }
            else {
                return post(config);
            }
        }

        function request(config, method) {
            var headers = {};
            var transformRequest;

            if (config.token) {
                headers.Authorization = 'Bearer ' + config.token;
            }

            var data = null;
            if (config.file) {
                headers['Content-Type'] = undefined;
                transformRequest = angular.identity;
                data = config.data;
            }
            else {
                data = JSON.stringify(config.data);
            }

            return $http({
                method: method,
                url: config.url,
                data: data,
                headers: headers,
                transformRequest: transformRequest
            });
        }


    }
}());