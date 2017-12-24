/**
 * Created by Simon on 16/12/2014.
 */
var ObjectId = require('mongoose').Schema.ObjectId;

module.exports.schema = {
    _id: ObjectId,
    time: { type: Date, default: Date.now },
    correct: { type: Boolean, required: true },
    text: { type: String, required: true },
    question: { type: ObjectId, ref: 'Question' }
};

module.exports.autorefs = [
    'question.attempts'
];