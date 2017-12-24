/**
 * Created by Simon on 16/12/2014.
 */
'use strict';

var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var _ = require('lodash');
var autoref = require('mongoose-autorefs');

var ObjectId = mongoose.Types.ObjectId;

var db = {};

module.exports.init = function(options, callback){
    fs.readdir(options.modelsDir, function(err, files){
        if (err) { callback(err); }

        db.connection = mongoose.connect(options.connectionString);
        //mongoose.set('debug', true);

        files.forEach(function(file){
            var modelName = path.basename(file, '.js');
            var modulePath = path.join(options.modelsDir, modelName);
            var def = require(modulePath);
            def.module = modelName;

            if (def.schema){
                var schema = mongoose.Schema(def.schema, { _id: true });

                schema.methods = _.extend(schema.methods, def.methods);
                schema.statics = _.extend(schema.statics, def.statics);
                schema.virtual = _.extend(schema.virtual, def.virtual);

                if (def.autorefs) {
                    schema.plugin(autoref, def.autorefs);
                }

                db[modelName] = mongoose.model(modelName, schema);
                db[modelName].moduleDef = def;
                schema = initMiddleware(schema, def);

                db[modelName].insert = function (config, callback){
                    var model = new db[modelName](config);
                    model._id = ObjectId();
                    model.save(function (err, savedModel) {
                        if (err) return console.error(modelName + ' error inserting: ' + err);

                        callback(err, savedModel);
                    });
                };
            }
            else {
                callback('No schema defined in ' + file);
            }
        });

        if (Object.keys(db).length !== 0){
            callback(null, db);
        }
        else {
            callback('No schemas found');
        }
    });
};

module.exports.db = db;

module.exports.drop = function(db, droppedCb){
    var async = require('async');

    async.each(Object.keys(db), function(key, callback){
            if (db[key].collection) {
                db[key].collection.drop(function (err) {
                    if (err) {
                        console.error(err);
                    }
                    callback();
                });
            }
            else {
                callback();
            }
        },
        function(){
            droppedCb();
        });
};

function initMiddleware(schema, def){
    ['pre','post'].forEach(function(middleware){
        if (def[middleware]){
            var mw = def[middleware];
            Object.keys(mw).forEach(function(methodName){
                if (Array.isArray(mw[methodName])){
                    mw[methodName].forEach(function(func){
                        if (_.isFunction(func)) {
                            schema[middleware](methodName, func);
                        }
                        else {
                            throw new Error('Non-function found in middleware ' + middleware + ' method ' + methodName + ' in ' + def.module);
                        }
                    });
                }
                else if (_.isFunction(mw[methodName])){
                    schema[middleware](methodName, mw[methodName]);
                }
                else {
                    throw new Error('Non-function found in middleware ' + middleware + ' method ' + methodName + ' in ' + def.module);
                }
            });
        }
    });
    return schema;
}