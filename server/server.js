/**
 * Created by Simon on 16/12/2014.
 */
'use strict';

var http = require('http');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var database = require('./database');
var seed = require('./seed');
var controllers = require('./controllers');
var routes = require('./routes').routes;

var modelsDir = path.join(__dirname, 'models');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var options = {
    connectionString: '',
    modelsDir: modelsDir,
    reseed: false
};

if (env === 'development'){
    options.connectionString = 'mongodb://localhost/memory';
    options.reseed = true;
}

database.init(options, function(err, db) {
    if (err){
        console.error(err);
        return;
    }

    // Initialize express
    var app = express();

    var staticPath = path.join(__dirname, '../public');
    app.use(express.static(staticPath));

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Seed the database with data
    seed.init(db, function(){
        // Register controllers with router, setup routes and authorization
        var router = express.Router();
        var apiUrl = '/api';
        controllers.register(router);
        app.use(apiUrl, router);

        // Serve up the index page for any defined routes
        app.get(routes, function(req, res) {
            res.sendFile(path.join(__dirname, '../public/index.html'));
        });

        // Start the server
        var port = process.env.PORT || 8080;
        var server = http.createServer(app);
        server.listen(port);
        console.log('Listening on port ' + port);
    }, options.reseed);
});


