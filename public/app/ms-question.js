/**
 * Created by Simon on 17/12/2014.
 */
(function(){
    'use strict';

    var module = 'app';
    var directive = 'msQuestion';

    angular.module(module).directive(directive, msQuestion);

    /* @ngInject */
    function msQuestion(){
        return {
            restrict: 'E',
            templateUrl: '/app/ms-question.html',
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                instance: '=msInstance',
                question: '=?msEditQuestion'
            },
            controller: function($timeout, $scope, repository){
                var vm = this;
                init();

                ///////////////////////////

                function init(){
                    reset(vm.question);

                    vm.addAnswer = addAnswer;
                    vm.addPreviousTag = addPreviousTag;
                    vm.addTag = addTag;
                    vm.removeTag = removeTag;
                    vm.resetQuestion = resetQuestion;
                    vm.saveQuestion = saveQuestion;
                    vm.updateAnswers = updateAnswers;

                    $scope.$watch(function(){
                        return vm.question;
                    }, function(newVal, oldVal){
                        if (newVal !== oldVal){
                            loadPreviousTags();
                            updateAnswers();
                        }
                    });
                }

                function addAnswer(){
                    vm.question.answers.push({ text: '' });
                    updateAnswers();
                }

                function addPreviousTag(tag){
                    vm.previousTags.forEach(function(ptag, index){
                        if (ptag === tag){
                            vm.previousTags.splice(index, 1);
                        }
                    });
                    vm.question.tags.push(tag);
                }

                function addTag(){
                    if (vm.tag){
                        if (vm.question.tags.indexOf(vm.tag) === -1) {
                            vm.question.tags.push(vm.tag);
                        }
                        vm.tag = '';
                    }
                }

                function loadPreviousTags(){
                    vm.previousTags = [];

                    vm.instance.questions.forEach(function(question){
                        question.tags.forEach(function(tag){
                            if (vm.previousTags.indexOf(tag) === -1 && vm.question.tags.indexOf(tag) === -1){
                                vm.previousTags.push(tag);
                            }
                        });
                    });
                }

                function removeTag(tag){
                    vm.question.tags.forEach(function(qtag, index){
                        if (qtag === tag){
                            vm.question.tags.splice(index, 1);
                        }
                    });
                    vm.previousTags.push(tag);
                }

                function reset(tags){
                    vm.saving = false;
                    vm.error = null;
                    vm.answersFull = false;
                    vm.oneValidAnswer = false;

                    if (!vm.question || tags) {
                        resetQuestion(tags);
                    }
                    else {
                        loadPreviousTags();
                    }
                }

                function resetQuestion(tags){
                    vm.question = {
                        tags: tags || [],
                        answers: [{text: null}]
                    };
                    loadPreviousTags();
                }

                function saveQuestion(){
                    vm.question.instance = vm.instance._id;
                    vm.saving = true;
                    var question = vm.question;
                    reset(vm.question.tags);

                    repository.saveQuestion(question).then(function(res){
                        vm.saving = false;

                        var index = -1;
                        vm.instance.questions.forEach(function(question, i){
                            if (question._id === res.data._id){
                                index = i;
                            }
                        });
                        if (index !== -1){
                            vm.instance.questions.splice(index, 1);
                        }

                        vm.instance.questions.push(res.data);

                    }, function(){
                        vm.saving = false;
                        vm.error = 'Saving failed. Sorry! Please try again later...';

                        $timeout(function(){
                            vm.error = null;
                        }, 2000);
                    });
                }

                function updateAnswers(){
                    vm.answersFull = true;
                    vm.oneValidAnswer = false;

                    for (var i = 0, length = vm.question.answers.length; i < length; ++i){
                        if (!vm.question.answers[i].text){
                            vm.answersFull = false;
                        }
                        else {
                            vm.oneValidAnswer = true;
                        }
                    }
                }
            }
        };
    }
}());