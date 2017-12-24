/**
 * Created by Simon on 7/01/2015.
 */
(function(){
    'use strict';

    var module = 'app';
    var filter = 'bool';

    angular.module(module).filter(filter, boolFilter);

    /* @ngInject */
    function boolFilter(){
        return function(input, params){
            return input ? params.true : params.false;
        };
    }
}());