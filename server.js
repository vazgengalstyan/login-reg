// server.js

// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mysql = require('mysql');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);

// configuration ===========================================

// config files
var db = require('./config/db');

// set our port
var port = process.env.PORT || 8080;

// connect to our mysql database

var con = mysql.createConnection(db);
exports.con = con;

// use session
app.use(session({
    secret: '5555-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true }
}));

// usecookie parser
app.use(cookieParser());

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

// routes ==================================================
require('./app/main')(app); // configure our routes
// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);

// shoutout to the user
console.log(port);

// expose app
module.exports = app;