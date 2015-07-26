/**
 * Dashboard
 */
/**
 * Load
 */
var mongoose = require('mongoose');
var Thing = mongoose.model('Thing');
require("./i18n.js");
exports.load = function (req, res, next, id) {
    
};

/**
 *  index
 */

exports.main = function (req, res) {
  setLang(req, res);
  var things = null;
  Thing.find({user_id: req.user._id}, function(err, docs) {
      res.render('dashboard/main', {
          title: "My Dashboard",
          hello: i18n.__("Hello"),
          things: docs,
          user_id: req.user._id.toString()
      });
  });
};
