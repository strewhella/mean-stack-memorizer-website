/**
 * Created by Simon on 26/12/2014.
 */
(function(){
    'use strict';

    var module = 'app';
    var controller = 'EditController';

    angular.module(module).controller(controller, EditController);

    /* @ngInject */
    function EditController($timeout, repository){
        var vm = this;
        init();

        //////////////////////////

        function init(){
            vm.editQuestion = null;
            vm.clearFilters = clearFilters;
            vm.toggleActive = toggleActive;
            vm.edit = edit;

            clearFilters();
        }

        function clearFilters(){
            vm.filter = {};
        }

        function toggleActive(event, question){
            event.stopPropagation();

            question.toggling = true;
            repository.toggleActive(question).then(function(){
                question.active = !question.active;
                question.toggling = false;
            }, function(){
                question.toggling = false;
            });
        }

        function edit(question){
            var editQuestion = angular.copy(question);
            var answers = [];
            editQuestion.answers.forEach(function(text){
                answers.push({ text: text });
            });
            editQuestion.answers = answers;

            vm.editQuestion = editQuestion;
        }
    }
}());