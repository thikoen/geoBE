var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");
var session = require("express-session");
var cors = require('cors');
var fileUpload = require('express-fileupload')
var proxy = require('express-http-proxy');
var fs = require('fs');
var nodemailer = require('nodemailer');

//define middleware
var app = express();

app.use(express.static(path.join(__dirname, 'public')));
// Leitet alle Requests die nicht mit /api/ anfangen an den Frontend Server weiter 
app.get(/^(?!\/api\/)/, proxy('localhost:8080', {
  proxyErrorHandler: function(err, res, next) {
       return res.status(404).send('proxy offline')
}}))


app.use(logger({ format: ':date :response-time :method :url :status :req[content-type]',
  stream: fs.createWriteStream('server/public/app.log', {'flags': 'w'}) }));
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
app.use(fileUpload());
app.use(express.json());
app.use(cookieParser());
app.use(session({ resave: true, saveUninitialized: false, secret: 'keyboard cat', cookie: {sameSite: 'strict' ,maxAge: 90000000 } }))

// db setup 
const db = require("./models");
db.sequelize.sync();


//define routes
require('./routes/facilities.routes')(app);
require('./routes/users.routes')(app);
require('./routes/images.routes')(app);
require('./routes/templates.routes')(app);
require('./routes/reports.routes')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.sendStatus(err.status)
});

module.exports = app;
