/*!
 * Module dependencies.
 */

// Note: We can require users, articles and other cotrollers because we have
// set the NODE_PATH to be ./app/controllers (package.json # scripts # start)
var users = require('users');
var pages = require('pages');
var dashboard = require('dashboard');
var thing = require('thing');
var mqtt = require('mqtt');
var auth = require('./middlewares/authorization');

/**
 * Route middlewares
 */

/**
 * Expose routes
 */

module.exports = function(app, passport) {
    // user routes
    app.get('/login', users.login);
    app.get('/signup', users.signup);
    app.get('/logout', users.logout);
    app.post('/users', users.create);
    app.post('/users/session', passport.authenticate('local', {
        failureRedirect : '/login',
        failureFlash : 'Invalid email or password.'
    }), users.session);
    app.get('/users/:userId', users.show);
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope : [ 'email', 'user_about_me' ],
        failureRedirect : '/login'
    }), users.signin);
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect : '/login'
    }), users.authCallback);
    app.get('/auth/github', passport.authenticate('github', {
        failureRedirect : '/login'
    }), users.signin);
    app.get('/auth/github/callback', passport.authenticate('github', {
        failureRedirect : '/login'
    }), users.authCallback);
    app.get('/auth/twitter', passport.authenticate('twitter', {
        failureRedirect : '/login'
    }), users.signin);
    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        failureRedirect : '/login'
    }), users.authCallback);
    app.get('/auth/google', passport.authenticate('google', {
        failureRedirect : '/login',
        scope : [ 'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email' ]
    }), users.signin);
    app.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect : '/login'
    }), users.authCallback);
    app.get('/auth/linkedin', passport.authenticate('linkedin', {
        failureRedirect : '/login',
        scope : [ 'r_emailaddress' ]
    }), users.signin);
    app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
        failureRedirect : '/login'
    }), users.authCallback);

    app.param('userId', users.load);

    // pages route
    app.get('/', pages.home);

    // dashboard route
    app.get('/my-dashboard', dashboard.main);
    app.post('/thing/create', thing.create);
    app.get('/thing/setting', thing.setting);
    app.post('/thing/update', thing.update);

    // MQTT Routes
    //app.get("/mqtt", mqtt.publish);
    /**
     * Error handling
     */
    app.use(function(err, req, res, next) {
        // treat as 404
        if (err.message
                && (~err.message.indexOf('not found') || (~err.message
                        .indexOf('Cast to ObjectId failed')))) {
            return next();
        }
        console.error(err.stack);
        // error page
        res.status(500).render('500', {
            error : err.stack
        });
    });

    // assume 404 since no middleware responded
    app.use(function(req, res, next) {
        res.status(404).render('404', {
            url : req.originalUrl,
            error : 'Not found'
        });
    });
    // handle CSRF token errors
    app.use(function (err, req, res, next) {
        if (err.code !== 'EBADCSRFTOKEN') return next(err)

        // handle CSRF token errors here
        res.status(403)
        res.send('form tampered with')
      })
}
