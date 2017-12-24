/**
 * Created by Simon on 16/12/2014.
 */
'use strict';

var respond = require('../respond');
var db = require('../database').db;

module.exports.register = function(router){
    router.route('/attempt')
        .post(function(req, res){
            db.Attempt.insert(req.body, function(err, attempt){
                respond(res, err, attempt);
            });
        });

    router.route('/attempt/:attemptId')
        .put(function(req, res){
            var update = {
                correct: req.body.correct
            };

            db.Attempt.findByIdAndUpdate(req.body._id, update, function(err, attempt){
                respond(res, err, attempt);
            });
        });
};