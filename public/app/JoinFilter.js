/**
 * Created by Simon on 31/12/2014.
 */
(function(){
    'use strict';

    var module = 'app';
    var filter = 'join';

    angular.module(module).filter(filter, JoinFilter);

    /* @ngInject */
    function JoinFilter(){
        return function(input, separator){
            if (angular.isArray(input)){
                return input.join(separator);
            }
            return input.toString().replace(' ', separator);
        };
    }
}());