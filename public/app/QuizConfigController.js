/**
 * Created by Simon on 2/01/2015.
 */
(function(){
    'use strict';

    var module = 'app';
    var controller = 'QuizConfigController';

    angular.module(module).controller(controller, QuizConfigController);

    /* @ngInject */
    function QuizConfigController($state, repository, quizSvc){
        var vm = this;

        vm.addTag = addTag;
        vm.tagLength = tagLength;
        vm.removeTag = removeTag;
        vm.startQuiz = startQuiz;

        init();

        //////////////////////////

        function init(){
            vm.instance = repository.getInstance();
            vm.pool = [];
            vm.selectedTags = {};
            vm.potentialTags = {};

            vm.quizOptions = [{
                heading: 'Continuous',
                isOpen: false,
                isDisabled: false,
                requires: 1,
                about: 'A continuous series of questions. Answers are shown after each question.',
            },{
                heading: 'Fixed',
                isOpen: false,
                isDisabled: false,
                about: 'A fixed number of questions you choose. Answers are shown after the whole set has been completed.',
                requires: 10,
                inputs: [{
                    label: 'Number of Questions',
                    model: 'fixedQuestions',
                    type: 'number',
                    default: 5
                }]
            },{
                heading: 'Multiple Choice',
                isOpen: false,
                isDisabled: false,
                about: 'A multiple choice quiz. The number of options and questions chosen by you.',
                requires: 20,
                inputs: [{
                    label: 'Number of Questions',
                    model: 'choiceQuestions',
                    type: 'number',
                    default: 5
                },{
                    label: 'Number of Choices',
                    model: 'choices',
                    type: 'number',
                    default: 3
                }]
            }];

            loadPotentialTags();
        }

        function loadPotentialTags(){
            vm.potentialTags = {};
            vm.instance.questions.forEach(function(question){
                question.tags.forEach(function(tag){
                    if (!vm.selectedTags.hasOwnProperty(tag)) {
                        vm.potentialTags[tag] = null;
                    }
                });
            });
        }

        function refreshPool(){
            vm.pool = [];
            Object.keys(vm.selectedTags).forEach(function(tag){
                vm.instance.questions.forEach(function(question){
                    if (question.tags.indexOf(tag) !== -1 && vm.pool.indexOf(tag) === -1 && vm.pool.indexOf(question) === -1){
                        vm.pool.push(question);
                    }
                });
            });
        }

        function startQuiz(option){
            quizSvc.startQuiz(option, vm.pool);
            $state.go('instance.quiz');
        }

        function addTag(tag){
            moveTag(vm.potentialTags, vm.selectedTags, tag);
        }

        function removeTag(tag){
            moveTag(vm.selectedTags, vm.potentialTags, tag);
        }

        function tagLength(tags){
            return Object.keys(tags).length;
        }

        function moveTag(from, to, tag){
            delete from[tag];
            to[tag] = null;
            refreshPool();
        }
    }
}());