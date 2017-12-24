/**
 * Created by Simon on 7/01/2015.
 */
(function(){
    'use strict';

    var module = 'app';
    var directive = 'asFocus';

    angular.module(module).directive(directive, asFocus);

    /* @ngInject */
    function asFocus(){
        return {
            restrict: 'A',
            scope: {
                focus: '=asFocus'
            },
            link: function(scope, element){
                scope.$watch('focus', function(newVal){
                    if (newVal){
                        element[0].focus();
                    }
                });
            }
        };
    }
}());