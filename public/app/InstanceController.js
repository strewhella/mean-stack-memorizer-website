/**
 * Created by Simon on 16/12/2014.
 */
(function(){
    'use strict';

    var module = 'app';
    var controller = 'InstanceController';

    angular.module(module).controller(controller, InstanceController);

    /* @ngInject */
    function InstanceController($state, $scope, repository){
        var vm = this;
        init();

        //////////////////////////

        function init(){
            repository.loadInstance($state.params.instance).then(function(instance){
                vm.instance = instance;
            }, function(){
                $state.go('home');
            });

            vm.tabs = [
                { heading: 'Questions', disabled: function(){return false;}, state: 'instance.questions' },
                { heading: 'Quiz', disabled: tabsDisabled, state: 'instance.quizconfig' },
                { heading: 'Stats', disabled: tabsDisabled, state: 'instance.stats' }
            ];

            $state.go('instance.questions');
        }

        function tabsDisabled(){
            if (!vm.instance || !vm.instance.questions) return true;
            return vm.instance.questions.length === 0;
        }
    }
}());