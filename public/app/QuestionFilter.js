/**
 * Created by Simon on 4/01/2015.
 */
(function(){
    'use strict';

    var module = 'app';
    var filter = 'question';

    angular.module(module).filter(filter, questionFilter);

    /* @ngInject */
    function questionFilter(){
        return function(input){
            return !input || input[input.length - 1] === '?' ? input : input += '?';
        };
    }
}());