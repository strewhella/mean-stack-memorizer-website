(function(){
    'use strict';

    angular.module('app', [
        'ui.bootstrap',
        'ui.router',
        'artificialselection',
        'ngAnimate'
    ]).config(config);

    /* @ngInject */
    function config($urlRouterProvider, $stateProvider, $locationProvider, $provide){
        $urlRouterProvider.otherwise('/');

        var routes = getRoutes();
        routes.forEach(function(route){
            $stateProvider.state(route.state, route.config);
        });

        $locationProvider.html5Mode(true);

        toastr.options.positionClass = 'toast-bottom-right';

        var exceptionToast = function () {
            return function (exception) {
                toastr.error(exception.message);
                console.error(exception.message + exception.stack);
            };
        };

        //$provide.decorator('$exceptionHandler', ['$delegate', exceptionToast]);
    }

    function getRoutes(){
        return [{
            state: 'home',
            config: {
                url: '/',
                templateUrl: '/app/home.html',
            }
        },{
            state: 'instance',
            config: {
                url: '/:instance',
                templateUrl: '/app/instance.html'
            }
        },{
            state: 'instance.questions',
            config: {
                templateUrl: '/app/instance.questions.html'
            }
        },{
            state: 'instance.quizconfig',
            config: {
                templateUrl: '/app/instance.quizconfig.html'
            }
        },{
            state: 'instance.stats',
            config: {
                templateUrl: '/app/instance.stats.html'
            }
        },{
            state: 'instance.quiz',
            config: {
                templateUrl: '/app/instance.quiz.html'
            }
        }];
    }
})();