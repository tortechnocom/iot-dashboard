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
var async = require("async");

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
    pubsubCollection : 'mqttpubsub',
    mongo : {}
};
//var SECURE_KEY = __dirname + '/config/secure/server-key.pem';
//var SECURE_CERT = __dirname + '/config/secure/server-cert.pem';
//var SECURE_KEY = __dirname + '/config/secure/tls-key.pem';
//var SECURE_CERT = __dirname + '/config/secure/tls-cert.pem';
var SECURE_KEY = __dirname + '/config/secure/key.pem';
var SECURE_CERT = __dirname + '/config/secure/cert.pem';
var moscaSettings = {
        interfaces: [
            { type: "mqtt", port: 1883 },
            { type: "mqtts", port: 8883, credentials: { keyPath: SECURE_KEY, certPath: SECURE_CERT } },
            { type: "http", port: 8080, bundle: true },
            { type: "https", port: 8443, bundle: true, credentials: { keyPath: SECURE_KEY, certPath: SECURE_CERT } }
        ],
        stats: false,

        logger: { name: 'MoscaServer', level: 'debug' },

        //persistence: { factory: mosca.persistence.Redis, url: 'localhost:6379', ttl: { subscriptions: 1000 * 60 * 10, packets: 1000 * 60 * 10 } },

        backend: ascoltatore
    };

var server = new mosca.Server(moscaSettings);

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
    console.log('Mosca MQTT server is up and running on port 1883 and WebSocket on port 8080');
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