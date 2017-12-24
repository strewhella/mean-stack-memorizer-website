/**
 * Created by Simon on 4/01/2015.
 */

describe('QuizService', function(){
    var fixedOption, continuousOption, multipleOption, pool, instance;

    beforeEach(module('app'));

    beforeEach(function(){

        continuousOption = {
            heading: 'Continuous'
        };
        fixedOption = {
            heading: 'Fixed',
            fixedQuestions: 5
        };
        multipleOption = {
            heading: 'Multiple Choice',
            choiceQuestions: 5,
            choices: 3
        };

        pool = [{
            _id: '1',
            text: 'jedna',
            tags: ['czech', 'numbers'],
            answers: ['one','1']
        },{
            _id: '2',
            text: 'deset',
            tags: ['czech', 'numbers'],
            answers: ['ten','10']
        },{
            _id: '3',
            text: 'dva',
            tags: ['czech', 'numbers'],
            answers: ['2']
        },{
            _id: '4',
            text: 'tri',
            tags: ['czech', 'numbers'],
            answers: ['3']
        },{
            _id: '5',
            text: 'ctryri',
            tags: ['czech', 'numbers'],
            answers: ['4']
        }];

        instance = {
            questions: angular.copy(pool)
        };
    });

    beforeEach(function(){
        var mockRepository = sinon.stub({ getInstance: function(){} });
        mockRepository.getInstance.returns(instance);
        module(function($provide){
            $provide.value('repository', mockRepository);
        });
    });

    it('should have null total questions for Continuous quiz', inject(function(quizSvc){
        quizSvc.startQuiz(continuousOption, pool);
        expect(quizSvc.getTotal()).toBeNull();
    }));

    it('should have correct total questions for Fixed quiz', inject(function(quizSvc){
        quizSvc.startQuiz(fixedOption, pool);
        expect(quizSvc.getTotal()).toBe(5);
    }));

    it('should have correct total questions for Multiple Choice quiz', inject(function(quizSvc){
        quizSvc.startQuiz(multipleOption, pool);
        expect(quizSvc.getTotal()).toBe(5);
    }));

    it('should have correct type for Continuous quiz', inject(function(quizSvc){
        quizSvc.startQuiz(continuousOption, pool);
        expect(quizSvc.getType()).toBe('continuous');
    }));

    it('should have correct type for Fixed quiz', inject(function(quizSvc){
        quizSvc.startQuiz(fixedOption, pool);
        expect(quizSvc.getType()).toBe('fixed');
    }));

    it('should have correct type for Multiple Choice quiz', inject(function(quizSvc){
        quizSvc.startQuiz(multipleOption, pool);
        expect(quizSvc.getType()).toBe('multiplechoice');
    }));

    it('should return correct first question for Continuous quiz', inject(function(quizSvc){
        quizSvc.startQuiz(continuousOption, pool);
        var q1 = quizSvc.nextQuestion();
        expect(q1.text).toBe('jedna');
    }));

    it('should return a valid question for nextQuestion for Fixed quiz', inject(function(quizSvc){
        quizSvc.startQuiz(fixedOption, pool);
        var q1 = quizSvc.nextQuestion();
        expect(q1.answers).toBeDefined();
    }));

    it('should return a valid question for nextQuestion for Multiple Choice quiz', inject(function(quizSvc){
        quizSvc.startQuiz(multipleOption, pool);
        var q1 = quizSvc.nextQuestion();
        expect(q1.answers).toBeDefined();
    }));

    it('return correct question number for Continuous quiz', inject(function(quizSvc){
        quizSvc.startQuiz(continuousOption, pool);
        quizSvc.nextQuestion();
        var q = quizSvc.getQuestionNumber();
        expect(q).toBe(1);
    }));

    it('return correct question number for Fixed quiz', inject(function(quizSvc){
        quizSvc.startQuiz(fixedOption, pool);
        quizSvc.nextQuestion();
        var q = quizSvc.getQuestionNumber();
        expect(q).toBe(1);
    }));

    it('return correct question number for Multiple Choice quiz', inject(function(quizSvc){
        quizSvc.startQuiz(multipleOption, pool);
        quizSvc.nextQuestion();
        var q = quizSvc.getQuestionNumber();
        expect(q).toBe(1);
    }));

    it('have the right number of false answers for Multiple Choice quiz', inject(function(quizSvc){
        quizSvc.startQuiz(multipleOption, pool);
        quizSvc.nextQuestion();
        var falses = quizSvc.getFalseAnswers();
        expect(falses.length).toBe(2);
    }));

    it('should have different false answers than the right answer for Multiple Choice quiz', inject(function(quizSvc){
        quizSvc.startQuiz(multipleOption, pool);
        var question = quizSvc.nextQuestion();
        var falses = quizSvc.getFalseAnswers();
        question.answers.forEach(function(answer){
            expect(falses.indexOf(answer)).toBe(-1);
        });
    }));
});