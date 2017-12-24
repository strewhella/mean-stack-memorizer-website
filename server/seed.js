/**
 * Created by Simon on 16/12/2014.
 */

'use strict';

var async = require('async');
var database = require('./database');

var i1, i2, q1, q2, q3, q4;
var db;
module.exports.init = function(initDb, done, reseed){
    db = initDb;

    if (!reseed) return done(db);

    database.drop(db, function(){
        async.series([seedInstances, seedQuestions, seedAttempts], function(err){
            if (err) console.error(err);

            done(db);
        });
    });
};

function seedInstances(done){
    // No password
    db.Instance.insert({ title: 'Czech Vocabulary'}, function(err, instance){
        if (err) console.error(err);
        i1 = instance;

        // Has password
        db.Instance.insert({ title: 'Geography Stuff', password: 'password' }, function(err, instance){
            if (err) console.error(err);
            i2 = instance;

            done();
        });
    });
}

function seedQuestions(done){
    var data = [{
        text: 'jedna',
        tags: ['czech', 'numbers'],
        answers: ['one','1'],
        instance: i1._id
    },{
        text: 'deset',
        tags: ['czech', 'numbers'],
        answers: ['ten','10'],
        instance: i1._id
    },{
        text: 'dva',
        tags: ['czech', 'numbers'],
        answers: ['2'],
        instance: i1._id
    },{
        text: 'tri',
        tags: ['czech', 'numbers'],
        answers: ['3'],
        instance: i1._id
    },{
        text: 'ctryri',
        tags: ['czech', 'numbers'],
        answers: ['4'],
        instance: i1._id
    },{
        text: 'pet',
        tags: ['czech', 'numbers'],
        answers: ['5'],
        instance: i1._id
    },{
        text: 'sest',
        tags: ['czech', 'numbers'],
        answers: ['6'],
        instance: i1._id
    },{
        text: 'sedm',
        tags: ['czech', 'numbers'],
        answers: ['7'],
        instance: i1._id
    },{
        text: 'osm',
        tags: ['czech', 'numbers'],
        answers: ['8'],
        instance: i1._id
    },{
        text: 'devet',
        tags: ['czech', 'numbers'],
        answers: ['9'],
        instance: i1._id
    },{
        text: 'jedenact',
        tags: ['czech', 'numbers'],
        answers: ['11'],
        instance: i1._id
    },{
        text: 'dvanact',
        tags: ['czech', 'numbers'],
        answers: ['12'],
        instance: i1._id
    },{
        text: 'trinact',
        tags: ['czech', 'numbers'],
        answers: ['13'],
        instance: i1._id
    },{
        text: 'ctrnact',
        tags: ['czech', 'numbers'],
        answers: ['14'],
        instance: i1._id
    },{
        text: 'padenact',
        tags: ['czech', 'numbers'],
        answers: ['15'],
        instance: i1._id
    },{
        text: 'sedenact',
        tags: ['czech', 'numbers'],
        answers: ['16'],
        instance: i1._id
    },{
        text: 'sedmnact',
        tags: ['czech', 'numbers'],
        answers: ['17'],
        instance: i1._id
    },{
        text: 'osmnact',
        tags: ['czech', 'numbers'],
        answers: ['18'],
        instance: i1._id
    },{
        text: 'devatenact',
        tags: ['czech', 'numbers'],
        answers: ['19'],
        instance: i1._id
    },{
        text: 'dvacet',
        tags: ['czech', 'numbers'],
        answers: ['20'],
        instance: i1._id
    },{
        text: 'dvacet jedna',
        tags: ['czech', 'numbers'],
        answers: ['21'],
        instance: i1._id
    },{
        text: 'capital of australia?',
        tags: ['geography'],
        answers: ['canberra'],
        instance: i2._id
    }, {
        text: 'number of states in australia?',
        tags: ['geography', 'australia'],
        answers: ['7', 'seven'],
        instance: i2._id
    }];

    async.map(data, db.Question.insert, function(err, questions){
        if (err) console.error(err);

        q1 = questions[0];
        q2 = questions[1];
        q3 = questions[2];
        q4 = questions[3];

        done();
    });
}

function seedAttempts(done){
    var data = [{
        correct: true,
        text: '1',
        question: q1._id
    },{
        correct: false,
        text: 'fifteen',
        question: q2._id
    }];

    async.map(data, db.Attempt.insert, function(){
        done();
    });
}