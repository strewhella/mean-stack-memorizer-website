/**
 * Created by Simon on 19/11/2014.
 */

'use strict';

var mapper = require('model-mapper');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var db = require('./database').db;
var populate = require('mongoose-populator');

var Repository = function (model) {
    this.model = model;
};

function createRepo(name){
    return new Repository(db[name]);
}

function processQuery(err, docs, vm, done){
    var metadata = mapper.getMetadata(vm);
    if (err) return done(err);
    if (!docs) return done(null, null);

    if (metadata && metadata.populate && docs){
        populate(docs, metadata.populate, function(err, populatedDocs){
            if (err) return done(err);

            mapper.map(vm, populatedDocs, done);
        }, true);
    }
    else {
        mapper.map(vm, toObject(docs), done);
    }
}

function toObject(input){
    if (input && input.hasOwnProperty('_doc')){
        input = input.toObject();
    }

    if (Array.isArray(input)){
        input = input.map(function(item){ return toObject(item); });
    }

    return input;
}

Repository.prototype.getAll = function (vm, done) {
    var model = this.model;
    model.find().exec(function (err, docs) {
        processQuery(err, docs, vm, done);
    });

};

Repository.prototype.getBy = function(vm, conditions, done){
    var model = this.model;
    model.find(conditions).exec(function(err, docs){
        processQuery(err, docs, vm, done);
    });
};

Repository.prototype.getOneBy = function(vm, conditions, done){
    var model = this.model;
    model.findOne(conditions).exec(function(err, doc){
        processQuery(err, doc, vm, done);
    });
};

Repository.prototype.get = function (vm, id, done) {
    var model = this.model;
    model.findById(id, function(err, doc){
        processQuery(err, doc, vm, done);
    });
};

Repository.prototype.bindSave = function (bm, vm, data, done){
    var repo = this;

    mapper.map(bm, data, function(err, mappedData){
        if (err) return done(err);

        repo.save(vm, mappedData, done);
    });
};

Repository.prototype.save = function(vm, data, done){
    var model = this.model;

    model.findById(data._id, function(err, doc){
        if (err) return done(err);

        if (!doc){
            doc = new model(data);
            doc._id = ObjectId();
        }
        else {
            Object.keys(doc._doc).forEach(function(key){
                if (data[key]) {
                    doc[key] = data[key];
                }
            });
        }

        doc.save(function(err, savedDoc){
            processQuery(err, savedDoc, vm, done);
        });
    });
};

Repository.prototype.saveRef = function(refId, docId, field, done){
    var model = this.model;
    model.findById(docId, function(err, doc){
        if (err) return done(err);
        if (!doc) return done(new Error(model.modelName + ' document with id ' + docId + ' not found'));

        // Check that the target schema has the ref field
        var schema = db[model.modelName].schema;
        if (!schema.tree.hasOwnProperty(field)) return done(new Error(model.modelName + ' does not have ref field ' + field));

        // Check that the referenced model actually exists
        var refModel = schema.tree[field];
        if (Array.isArray(refModel)){
            refModel = refModel[0];
        }
        var refModelName = refModel.ref;

        db[refModelName].findById(refId, function(err, refDoc){
            if (err) return done(err);
            if (!refDoc) return done(new Error('Referenced model ' + refModelName + ' with id ' + refId + ' does not exist'));

            if (Array.isArray(doc._doc[field])){
                if (doc[field].indexOf(refId) !== -1) return done(null, doc);

                doc[field].push(refId);
            }
            else {
                doc[field] = refId;
            }

            doc.save(function(err, savedDoc){
                if (err) return done(err);
                done(null, savedDoc);
            });
        });
    });
};


module.exports.Repository = Repository;
module.exports.createRepo = createRepo;