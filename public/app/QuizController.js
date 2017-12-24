/**
 * Created by Simon on 3/01/2015.
 */
(function(){
    'use strict';

    var module = 'app';
    var controller = 'QuizController';

    angular.module(module).controller(controller, QuizController);

    /* @ngInject */
    function QuizController(quizSvc){
        var vm = this;
        init();

        //////////////////////////

        function init(){
            vm.total = quizSvc.getTotal();
            vm.type = quizSvc.getType();
            vm.choices = quizSvc.getChoices();
            vm.answerQuestion = answerQuestion;
            vm.nextQuestion = nextQuestion;
            vm.answered = null;
            vm.saving = false;
            vm.finished = false;
            vm.falseAnswers = quizSvc.getFalseAnswers();
            vm.multipleChoiceAnswers = null;

            nextQuestion();
        }

        function answerQuestion(){
            if (!vm.answer) return;

            vm.saving = true;

            if (vm.answer) {
                quizSvc.answerQuestion(vm.answer).then(function () {
                    vm.saving = false;

                    if (quizSvc.showResults()){
                        vm.answered = quizSvc.resetAnswered();
                    }
                    else {
                        nextQuestion();
                    }
                });
            }
        }

        function nextQuestion(){
            vm.answer = null;
            vm.answered = null;
            vm.question = quizSvc.nextQuestion();
            vm.falseAnswers = quizSvc.getFalseAnswers();
            vm.questionNumber = quizSvc.getQuestionNumber();
            vm.finished = quizSvc.isFinished();
            vm.multipleChoiceAnswers = quizSvc.getMultipleChoiceAnswers();
        }
    }
}());