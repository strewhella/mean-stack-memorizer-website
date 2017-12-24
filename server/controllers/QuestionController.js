/**
 * Created by Simon on 16/12/2014.
 */
'use strict';

var respond = require('../respond');
var db = require('../database').db;

module.exports.register = function(router){
    router.route('/question')
        .post(function(req, res){
            db.Question.insert(req.body, function(err, question){
                respond(res, err, question);
            });
        })

        .put(function(req, res){
            var update = {
                answers: req.body.answers,
                tags: req.body.tags,
                text: req.body.text,
                active: req.body.active
            };

            db.Question.findByIdAndUpdate(req.body._id, update, function(err, question){
                respond(res, err, question);
            });
        });

    router.route('/question/:questionId/active')
        .put(function(req, res){
            db.Question.findById(req.params.questionId, function(err, question){
                if (err) return respond(res, true);

                db.Question.findByIdAndUpdate(question._id, { active: !question.active }, function(err, question){
                    respond(res, err, question);
                });
            });
        });
};

