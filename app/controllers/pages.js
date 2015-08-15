
/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Thing = mongoose.model('Thing');
var User = mongoose.model('User');
var MqttMessage = mongoose.model('MqttMessage');

/**
 * Load
 */

exports.load = function (req, res, next, id) {
    
};

/**
 *  index
 */
exports.home = function (req, res) {
    Thing.find({"enabled": "Y"}).exec(function (err, thingYs) {
        User.find().exec(function (err, users) {
            MqttMessage.find().exec(function (err, mqttMessages) {
                Thing.find({"enabled": "N"}).exec(function (err, thingNs) {
                    res.render('pages/home', {
                        title: "IoT Dashboard",
                        welcomeMessage: "Welcome to IoT Dasboard",
                        thingYs: thingYs,
                        thingNs: thingNs,
                        users: users,
                        mqttMessages: mqttMessages
                    });
                });
            });
        });
    });
  
};
