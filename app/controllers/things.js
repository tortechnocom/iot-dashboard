
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Thing = mongoose.model('Thing');
var utils = require('../../lib/utils');

/**
 * Create user
 */

exports.create = function (req, res) {
    req.body.user_id = req.user._id;
    var thing = new Thing(req.body);
    var errJson = {};
    thing.save(function (err) {
        if (err) {
            console.log(err.message);
            errJson = err.errors;
            return res.json(err);
        } else {
            return res.json({});
        }
    });
};

/**
 *  Show Thing
 */

exports.show = function (req, res) {
  
};
