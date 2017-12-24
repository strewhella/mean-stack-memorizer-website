/**
 * Created by Simon on 16/12/2014.
 */
var ObjectId = require('mongoose').Schema.ObjectId;

module.exports.schema = {
    _id: ObjectId,
    text: { type: String, required: true },
    tags: [{ type: String, required: true }],
    attempts: [{ type: ObjectId, ref: 'Attempt' }],
    answers: [{ type: String, required: true }],
    active: { type: Boolean, default: true },
    instance: { type: ObjectId, ref: 'Instance', require: true }
};

module.exports.autorefs = [
    'instance.questions',
    'attempts.question'
];