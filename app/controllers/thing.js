/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Thing = mongoose.model('Thing');
var User = mongoose.model('User');
var utils = require('../../lib/utils');

/**
 * Create user
 */

exports.create = function(req, res) {
	req.body.user_id = req.user._id;
	var thing = new Thing(req.body);
	var errJson = {};
	thing.save(function(err) {
		if (err) {
			console.log(err.message);
			errJson = err.errors;
			return res.json(err);
		} else {
			return res.json({});
		}
	});
};

exports.setting = function(req, res) {
	setLang(req, res);
	var things = null;
	Thing.findOne({
		_id : req.query.thing_id
	}, function(err, thing) {
		User.findOne({
			_id : req.query.user_id
		}, function(err, user) {
			res.render('thing/thing-setting', {
				thing : thing,
				user : user
			});
		});
	});
};

exports.update = function(req, res) {
	req.body.enabled = (req.body.enabled != null ? req.body.enabled : "N");
	Thing.findOneAndUpdate({
		_id : req.body.thing_id
	}, {
		$set : req.body
	}, function(err, doc) {
		if (err) {
			console.log(err.message);
			errJson = err.errors;
			return res.json(err);
		} else {
			return res.json({});
		}
	});
};
