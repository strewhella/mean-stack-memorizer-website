/**
 * Created by Simon on 16/12/2014.
 */
(function(){
    'use strict';

    var module = 'app';
    var controller = 'HomeController';

    angular.module(module).controller(controller, HomeController);

    /* @ngInject */
    function HomeController($state, repository, request){
        var vm = this;
        init();

        //////////////////////////

        function createInstance(){
            if (vm.title){
                repository.createInstance(vm.title).then(function(response){
                    $state.go('instance', { instance: response.data.address });
                });
            }
        }

        function init(){
            repository.flushInstance();

            request.get({ url: 'api/instance' }).then(function(res){
                vm.instances = res.data;
                vm.instances.forEach(function(instance){
                    instance.url = '/' + instance.address;
                });
            });

            vm.createInstance = createInstance;

        }
    }
}());