/**
 * Created by Simon on 17/12/2014.
 */
(function(){
    'use strict';

    var module = 'app';
    var factory = 'repository';

    angular.module(module).factory(factory, RepositoryService);

    /* @ngInject */
    function RepositoryService($q, request){
        var self = this;

        return {
            saveAttempt: saveAttempt,
            createInstance: createInstance,
            flushInstance: flushInstance,
            getInstance: getInstance,
            loadInstance: loadInstance,
            saveQuestion: saveQuestion,
            toggleActive: toggleActive
        };

        //////////////////////////

        function saveAttempt(attempt){
            var func = attempt._id ? request.put : request.post;

            return func({
                url: 'api/attempt',
                data: attempt
            });
        }

        function saveQuestion(question){
            question.answers = question.answers.map(function(answer){ return answer.text; });

            var func = question._id ? request.put : request.post;

            return func({
                url: 'api/question',
                data: question
            });
        }

        function createInstance(title){
            return request.post({
                url: 'api/instance',
                data: { title: title }
            });
        }

        function flushInstance(){
            self.instance = null;
        }

        function getInstance(){
            return self.instance;
        }

        function loadInstance(address){
            var deferred = $q.defer();
            request.get({ url: 'api/instance/' + address }).then(function(res){
                self.instance = res.data;
                deferred.resolve(self.instance);
            }, function(){
                deferred.reject();
            });
            return deferred.promise;
        }

        function toggleActive(question){
            return request.put({
                url: 'api/question/' + question._id + '/active'
            });
        }
    }
}());