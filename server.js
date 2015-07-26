/*!
 * iot-dashboard
 * Copyright(c) 2015 Supachai Chaimangua <tortechnocom@gmail.com>
 */
/**
 * Module dependencies
 */

var fs = require('fs');
var join = require('path').join;
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('config');
var mosca = require('mosca');
var http = require("http");

var app = express();
var port = process.env.PORT || 3000;

// Connect to mongodb
var connect = function() {
    var options = {
        server : {
            socketOptions : {
                keepAlive : 1
            }
        }
    };
    mongoose.connect(config.db, options);
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

// Bootstrap models
fs.readdirSync(join(__dirname, 'app/models')).forEach(function(file) {
    if (~file.indexOf('.js'))
        require(join(__dirname, 'app/models', file));
});

// Bootstrap passport config
require('./config/passport')(passport, config);

// Bootstrap application settings
require('./config/express')(app, passport);

// Bootstrap routes
require('./config/routes')(app, passport);

app.listen(port);
console.log('Express app started on port ' + port);

/**
 * Expose
 */

module.exports = app;

/*******************************************************************************
 * Mosca MQTT Broker
 */
var ascoltatore = {
    // using ascoltatore
    type : 'mongo',
    url : 'mongodb://localhost:27017/mqtt',
    pubsubCollection : 'ascoltatori',
    mongo : {}
};

var settings = {
    port : 1883,
    backend : ascoltatore,
    http : {
        port : 8000,
        bundle : true,
        static : './'
    }
};

var server = new mosca.Server(settings);

server.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', function(packet, client) {
    console.log('Published', packet.payload);
});

server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
    server.authenticate = authenticate;
    console.log('Mosca MQTT server is up and running on port 1883 and WebSocket on port 8000');
}
// Accepts the connection if the username and password are valid
var authenticate = function(client, userName, password, callback) {
    var authorized = (userName === 'test' && password.toString() === '1234');
    console.log("userName: " + userName);
    console.log("User authorized: " + authorized);
    if (authorized)
        client.user = userName;
    callback(null, authorized);
}
module.exports.mqtt = server;