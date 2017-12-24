/**
 * Created by Simon on 19/12/2014.
 */
(function(){
    'use strict';

    var module = 'app';
    var directive = 'msNavbar';

    angular.module(module).directive(directive, msNavbar);

    /* @ngInject */
    function msNavbar(){
        return {
            restrict: 'E',
            templateUrl: '/app/ms-navbar.html',
            controllerAs: 'vm',
            bindToController: true,
            scope: true,
            controller: function($scope, repository){
                var vm = this;
                init();

                /////////////////////////////

                function init(){
                    $scope.$watch(function(){
                        return repository.getInstance();
                    }, function(newVal, oldVal){
                        if (newVal !== oldVal && newVal){
                            vm.instance = newVal;
                        }
                    });
                }
            }
        };
    }
}());