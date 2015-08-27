
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Thing = mongoose.model('Thing');
var utils = require('../../lib/utils');

/**
 * Create user
 */

exports.publish = function (req, res) {
    topic = req.body.topic;
    var message = req.body.message;
    //console.log("============ thingId: " + topic.split("/")[1]);
    Thing.findOneAndUpdate({_id: topic.split("/")[1]}, {$set: {switch_status: message}}, function (err, doc) {});
    //console.log("============ topic: " + topic);
    //console.log("============ message: " + message);
    res.json({});
};

/**
 *  Show Thing
 */

exports.show = function (req, res) {
  
};
