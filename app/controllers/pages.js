
/**
 * Module dependencies.
 */

/**
 * Load
 */

exports.load = function (req, res, next, id) {
    
};

/**
 *  index
 */

exports.home = function (req, res) {
  res.render('pages/home', {
      title: "IoT Dashboard",
      welcomeMessage: "Welcome to IoT Dasboard"
  });
};
