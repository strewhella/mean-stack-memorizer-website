/**
 * Created by Simon on 10/01/2015.
 */
(function(){
    'use strict';

    var module = 'app';
    var controller = 'StatsController';

    angular.module(module).controller(controller, StatsController);

    /* @ngInject */
    function StatsController($filter, repository){
        var vm = this;

        init();

        //////////////////////////

        function init(){
            vm.setOrderBy = setOrderBy;

            vm.stats = [];

            repository.getInstance().questions.forEach(function(question){
                vm.stats.push({
                    question: question.text,
                    attempts: question.attempts.length,
                    correct: $filter('filter')(question.attempts, {correct: true}).length,
                    incorrect: $filter('filter')(question.attempts, {correct: false}).length
                });
            });

            vm.columns = [
                { header: 'Question', property: 'question' },
                { header: 'Attempts', property: 'attempts' },
                { header: 'Correct', property: 'correct' },
                { header: 'Incorrect', property: 'incorrect' }
            ];

            vm.orderBy = {
                property: 'question',
                reverse: false
            };
        }

        function setOrderBy(property){
            if (property === vm.orderBy.property){
                vm.orderBy.reverse = !vm.orderBy.reverse;
            }
            vm.orderBy.property = property;
        }
    }
}());