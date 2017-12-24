'use strict';

var respond = require('../respond');
var db = require('../database').db;
var populate = require('mongoose-populator');

module.exports.register = function(router){
    router.route('/instance')
        .get(function(req, res){
            db.Instance.find('title address').lean().exec(function(err, instances){
                respond(res, err, instances);
            });
        })

        .post(function(req, res){
            db.Instance.insert(req.body, function(err, instance){
                respond(res, err, instance);
            });
        });

    router.route('/instance/:address')
        .get(function(req, res){
            db.Instance.findOne({ address: req.params.address }, function(err, instance){
                if (err || !instance) return respond(res, err, instance);

                populate(instance, 'questions.attempts', function(err, instance) {
                    respond(res, err, instance);
                }, true);
            });
        });

};