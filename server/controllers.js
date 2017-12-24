/**
 * Created by Simon on 27/11/2014.
 */

'use strict';

var path = require('path');

module.exports.register = function(router){
    var controllerPath = path.join(__dirname, 'controllers');
    var files = require('fs').readdirSync(controllerPath);
    files.forEach(function(file){
        var controller = require(path.join(controllerPath, file));
        controller.register(router);
    });
};