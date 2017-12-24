/**
 * Created by Simon on 3/01/2015.
 */
(function(){
    'use strict';

    var module = 'app';
    var factory = 'quizSvc';

    angular.module(module).factory(factory, QuizService);

    /* @ngInject */
    function QuizService($q, $state, repository){
        var self = this;

        return {
            answerQuestion: answerQuestion,
            getChoices: getChoices,
            getFalseAnswers: getFalseAnswers,
            getMultipleChoiceAnswers: getMultipleChoiceAnswers,
            getSaving: getSaving,
            getTotal: getTotal,
            getType: getType,
            getQuestionNumber: getQuestionNumber,
            isFinished: isFinished,
            nextQuestion: nextQuestion,
            resetAnswered: resetAnswered,
            showResults: showResults,
            startQuiz: startQuiz
        };

        //////////////////////////

        function answerQuestion(answer){
            var deferred = $q.defer();

            var attempt = {
                question: self.question._id,
                correct: isCorrect(answer),
                text: answer.trim()
            };

            repository.saveAttempt(attempt).then(function(res){
                self.question.attempts.push(res.data);
                self.answered.push({
                    question: self.question,
                    attempt: res.data
                });

                if (self.config.type === 'continuous' || self.questionNumber === self.config.total){
                    self.showResults = true;
                }

                deferred.resolve();

            }, deferred.reject);

            return deferred.promise;
        }

        function getChoices(){
            return self.config.choices;
        }

        function getMultipleChoiceAnswers(){
            if (self.config.type === 'multiplechoice'){
                self.multipleChoiceAnswers = angular.copy(self.falseAnswers);
                self.multipleChoiceAnswers.push(randomElement(self.question.answers));
                self.multipleChoiceAnswers = shuffle(self.multipleChoiceAnswers);
                return self.multipleChoiceAnswers;
            }
        }

        function getSaving(){
            return self.saving;
        }

        function getTotal(){
            return self.config.total;
        }

        function getType(){
            return self.config.type;
        }

        function randomElement(array){
            var index = random(0, array.length - 1);
            return array[index];
        }

        // TODO: Should be able to figure whether an answer should compare cases, maybe other options too
        function isCorrect(answer){
            var found = false;
            self.question.answers.forEach(function(savedAnswer){
                if (answer.toLowerCase().trim() === savedAnswer.toLowerCase().trim()){
                    found = true;
                }
            });
            return found;
        }

        function nextQuestion(){
            if (isFinished()){
                return $state.go('instance.quizconfig');
            }

            self.question = self.config.questions.shift();

            if (self.config.type === 'multiplechoice') {
                loadFalseAnswers(self.question);
            }

            self.questionNumber++;

            return self.question;
        }

        function random(min, max) {
            return Math.round(Math.random() * (max - min) + min);
        }

        function resetAnswered(){
            self.showResults = false;
            var answered = self.answered;
            self.answered = [];
            return answered;
        }

        function showResults(){
            return self.showResults;
        }

        function startQuiz(option, pool){
            self.originalPool = angular.copy(pool);
            self.questionNumber = 0;
            self.answered = [];

            self.config = {};
            self.config.type = option.heading.toLowerCase().replace(' ', '');

            self.config.total = null;
            if (self.config.type === 'fixed'){
                self.config.total = option.fixedQuestions;
            }
            else if (self.config.type === 'multiplechoice'){
                self.config.total = option.choiceQuestions;
                self.config.choices = option.choices;
            }
            else if (self.config.type === 'continuous'){
                self.config.total = pool.length;
            }

            self.config.questions = self.config.type === 'continuous' ? pool : [];
            for (var i = 0; i < self.config.total; ++i){
                var index = random(0, pool.length - 1);
                self.config.questions.push(pool.splice(index, 1)[0]);
            }
        }

        function getFalseAnswers() {
            return self.falseAnswers;
        }

        function loadFalseAnswers(question){
            var number = self.config.choices - 1;

            self.falseAnswers = [];
            var questions = repository.getInstance().questions;

            var ignoreIndexes = [];
            for (var i = 0, length = questions.length; i < length; ++i){
                if (questions[i]._id === question._id){
                    ignoreIndexes.push(i);
                    break;
                }
            }

            var answerIndex;
            while (self.falseAnswers.length < number){
                var index = random(0, questions.length - 1);

                if (ignoreIndexes.indexOf(index) === -1){
                    ignoreIndexes.push(index);

                    answerIndex = random(0, questions[index].answers.length - 1);
                    self.falseAnswers.push(questions[index].answers[answerIndex]);
                }
            }
        }

        function getQuestionNumber(){
            return self.questionNumber;
        }

        function isFinished(){
            return self.config.questions.length === 0;
        }

        function shuffle(array) {
            var counter = array.length, temp, index;

            // While there are elements in the array
            while (counter > 0) {
                // Pick a random index
                index = Math.floor(Math.random() * counter);

                // Decrease counter by 1
                counter--;

                // And swap the last element with it
                temp = array[counter];
                array[counter] = array[index];
                array[index] = temp;
            }

            return array;
        }
    }
}());