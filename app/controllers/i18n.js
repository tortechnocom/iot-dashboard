/**
 * i18n
 */
var express = require('express'),
    i18n = require("i18n"),
    url = require('url');

var lang = 'en';
i18n.configure({
    locales:['en', 'th'],
    defaultLocale: 'en',
    cookie: 'lang',
    directory: __dirname + '/../../config/locales'
});
GLOBAL.setLang = function (req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    if (query.lang != undefined) {
        i18n.setLocale(query.lang);
        console.log("Set Languange to " + query.lang);
        res.cookie('lang', query.lang, { maxAge: 900000, httpOnly: true });
    }
} 
GLOBAL.i18n = i18n;
GLOBAL.express = express;