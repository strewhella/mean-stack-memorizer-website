/**
 * Created by Simon on 16/12/2014.
 */
'use strict';

var ObjectId = require('mongoose').Schema.ObjectId;
var randomstring = require('randomstring');

module.exports.schema = {
    _id: ObjectId,
    address: { type: String },
    title: { type: String, required: true },
    questions: [{ type: ObjectId, ref: 'Question' }]
};

module.exports.autorefs = [
    'questions.instance'
];

module.exports.pre = {
    save: [
        function(next){
            if (this.isNew){
                this.address = randomstring.generate();
                next();
            }
        }
    ]
};